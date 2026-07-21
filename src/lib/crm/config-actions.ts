"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Pipeline,
  Stage,
  PipelineHandoff,
  FieldDefinition,
  StageTipo,
  FieldTipo,
} from "@/lib/crm/schema";

export type ConfigActionResult = { ok: true } | { ok: false; error: string };

export type PipelineWithDetails = Pipeline & {
  stages: Stage[];
  fields: FieldDefinition[];
};

async function nextOrdem(table: string, filterColumn: string, filterValue: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("*")
    .order("ordem", { ascending: false });
  const rows = (data ?? []).filter(
    (r: Record<string, unknown>) => r[filterColumn] === filterValue
  );
  return rows.length > 0 ? Number(rows[0].ordem) + 1 : 0;
}

export async function getPipelinesWithDetails(): Promise<PipelineWithDetails[]> {
  const supabase = await createClient();
  const [{ data: pipelines }, { data: stages }, { data: fields }] = await Promise.all([
    supabase.from("pipelines").select("*").order("ordem", { ascending: true }),
    supabase.from("stages").select("*").order("ordem", { ascending: true }),
    supabase.from("field_definitions").select("*").order("ordem", { ascending: true }),
  ]);

  return ((pipelines ?? []) as Pipeline[]).map((pipeline) => ({
    ...pipeline,
    stages: ((stages ?? []) as Stage[]).filter((s) => s.pipeline_id === pipeline.id),
    fields: ((fields ?? []) as FieldDefinition[]).filter(
      (f) => f.pipeline_id === pipeline.id
    ),
  }));
}

/** Pipeline que recebe os cadastros feitos pelo link público (o de
 * menor ordem — normalmente o funil de entrada, ex. Oportunidade/SDR). */
export async function getPublicTargetPipeline(): Promise<PipelineWithDetails | null> {
  const pipelines = await getPipelinesWithDetails();
  return pipelines[0] ?? null;
}

export async function getHandoffs(): Promise<PipelineHandoff[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("pipeline_handoffs").select("*");
  return (data ?? []) as PipelineHandoff[];
}

// --- Pipelines ---

export async function createPipeline(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;
  const supabase = await createClient();
  const { data } = await supabase.from("pipelines").select("*");
  await supabase.from("pipelines").insert({ nome, ordem: (data ?? []).length });
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function renamePipeline(id: string, formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;
  const supabase = await createClient();
  await supabase.from("pipelines").update({ nome }).eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function deletePipeline(id: string): Promise<ConfigActionResult> {
  const supabase = await createClient();
  const { data: deals } = await supabase.from("deals").select("*");
  const hasDeals = ((deals ?? []) as { pipeline_id: string }[]).some(
    (d) => d.pipeline_id === id
  );
  if (hasDeals) {
    return { ok: false, error: "Mova ou remova os negócios deste pipeline antes de excluí-lo." };
  }
  await supabase.from("stages").delete().eq("pipeline_id", id);
  await supabase.from("field_definitions").delete().eq("pipeline_id", id);
  await supabase.from("pipelines").delete().eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
  return { ok: true };
}

// --- Stages ---

export async function createStage(
  pipelineId: string,
  values: { nome: string; cor: string; tipo: StageTipo }
) {
  const supabase = await createClient();
  const ordem = await nextOrdem("stages", "pipeline_id", pipelineId);
  await supabase.from("stages").insert({ pipeline_id: pipelineId, ordem, ...values });
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function updateStage(
  id: string,
  values: Partial<{ nome: string; cor: string; tipo: StageTipo; ordem: number }>
) {
  const supabase = await createClient();
  await supabase.from("stages").update(values).eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function deleteStage(id: string): Promise<ConfigActionResult> {
  const supabase = await createClient();
  const { data: deals } = await supabase.from("deals").select("*");
  const hasDeals = ((deals ?? []) as { stage_id: string }[]).some(
    (d) => d.stage_id === id
  );
  if (hasDeals) {
    return { ok: false, error: "Mova os negócios deste estágio antes de excluí-lo." };
  }
  await supabase.from("pipeline_handoffs").delete().eq("from_stage_id", id);
  await supabase.from("pipeline_handoffs").delete().eq("to_stage_id", id);
  await supabase.from("stages").delete().eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
  return { ok: true };
}

// --- Field definitions ---

export async function createField(
  pipelineId: string,
  values: { nome: string; tipo: FieldTipo; opcoes: string[] | null; obrigatorio: boolean }
) {
  const supabase = await createClient();
  const ordem = await nextOrdem("field_definitions", "pipeline_id", pipelineId);
  await supabase
    .from("field_definitions")
    .insert({ pipeline_id: pipelineId, ordem, ...values });
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function deleteField(id: string) {
  const supabase = await createClient();
  await supabase.from("field_definitions").delete().eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

// --- Handoffs ---

export async function createHandoff(fromStageId: string, toStageId: string) {
  const supabase = await createClient();
  await supabase
    .from("pipeline_handoffs")
    .delete()
    .eq("from_stage_id", fromStageId);
  await supabase
    .from("pipeline_handoffs")
    .insert({ from_stage_id: fromStageId, to_stage_id: toStageId });
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}

export async function deleteHandoff(id: string) {
  const supabase = await createClient();
  await supabase.from("pipeline_handoffs").delete().eq("id", id);
  revalidatePath("/configuracoes");
  revalidatePath("/leads");
}
