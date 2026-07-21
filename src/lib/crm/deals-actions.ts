"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  dealBaseSchema,
  buildCamposPersonalizadosSchema,
  type Deal,
  type FieldDefinition,
  type Stage,
  type PipelineHandoff,
  type StageEvent,
} from "@/lib/crm/schema";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type MoveDealResult =
  | {
      ok: true;
      pipelineId: string;
      stageId: string;
      handoffPipelineName?: string;
      customerCreated?: boolean;
    }
  | { ok: false; error: string };

async function logStageEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  params: { dealId: string; pipelineId: string; stageId: string; valor: number }
) {
  await supabase.from("stage_events").insert({
    deal_id: params.dealId,
    pipeline_id: params.pipelineId,
    stage_id: params.stageId,
    valor: params.valor,
  });
}

export async function getDeals(): Promise<Deal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Deal[];
}

export async function getStageEvents(): Promise<StageEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stage_events")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []) as StageEvent[];
}

async function firstPipelineAndStage(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data: pipelines } = await supabase
    .from("pipelines")
    .select("*")
    .order("ordem", { ascending: true });
  const pipeline = (pipelines ?? [])[0];
  if (!pipeline) return null;

  const { data: stages } = await supabase
    .from("stages")
    .select("*")
    .order("ordem", { ascending: true });
  const stage = ((stages ?? []) as Stage[]).find((s) => s.pipeline_id === pipeline.id);
  if (!stage) return null;

  return { pipeline, stage };
}

export async function createDealPublico(values: unknown): Promise<ActionResult> {
  const supabase = await createClient();
  const target = await firstPipelineAndStage(supabase);
  if (!target) {
    return { ok: false, error: "Nenhum pipeline configurado ainda." };
  }

  const withCanal =
    typeof values === "object" && values !== null
      ? { ...values, canal: "Evento" }
      : values;
  const parsed = dealBaseSchema.safeParse(withCanal);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const dealId = crypto.randomUUID();
  const { error } = await supabase.from("deals").insert({
    id: dealId,
    ...parsed.data,
    pipeline_id: target.pipeline.id,
    stage_id: target.stage.id,
    campos_personalizados: {},
    origem: "publico",
  });

  if (error) {
    return { ok: false, error: "Não foi possível salvar o cadastro. Tente novamente." };
  }

  await logStageEvent(supabase, {
    dealId,
    pipelineId: target.pipeline.id,
    stageId: target.stage.id,
    valor: parsed.data.valor,
  });

  return { ok: true };
}

export async function createDeal(
  pipelineId: string,
  rawValues: unknown
): Promise<ActionResult> {
  const supabase = await createClient();

  const parsedBase = dealBaseSchema.safeParse(rawValues);
  if (!parsedBase.success) {
    return { ok: false, error: "Confira os campos obrigatórios." };
  }

  const { data: fieldRows } = await supabase
    .from("field_definitions")
    .select("*")
    .eq("pipeline_id", pipelineId);
  const camposSchema = buildCamposPersonalizadosSchema(
    (fieldRows ?? []) as FieldDefinition[]
  );
  const rawCampos =
    typeof rawValues === "object" && rawValues !== null
      ? ((rawValues as { campos?: unknown }).campos ?? {})
      : {};
  const parsedCampos = camposSchema.safeParse(rawCampos);
  if (!parsedCampos.success) {
    return { ok: false, error: "Confira os campos personalizados." };
  }

  const { data: stageRows } = await supabase
    .from("stages")
    .select("*")
    .eq("pipeline_id", pipelineId)
    .order("ordem", { ascending: true });
  const firstStage = (stageRows ?? [])[0];
  if (!firstStage) {
    return { ok: false, error: "Este pipeline ainda não tem estágios configurados." };
  }

  const dealId = crypto.randomUUID();
  const { error } = await supabase.from("deals").insert({
    id: dealId,
    ...parsedBase.data,
    pipeline_id: pipelineId,
    stage_id: firstStage.id,
    campos_personalizados: parsedCampos.data,
    origem: "manual",
  });

  if (error) {
    return { ok: false, error: "Não foi possível salvar o negócio." };
  }

  await logStageEvent(supabase, {
    dealId,
    pipelineId,
    stageId: firstStage.id,
    valor: parsedBase.data.valor,
  });

  revalidatePath("/leads");
  return { ok: true };
}

async function createCustomerIfMissing(
  supabase: Awaited<ReturnType<typeof createClient>>,
  deal: Deal
): Promise<boolean> {
  const { data: existing } = await supabase.from("customers").select("*");
  const already = (existing ?? []).some(
    (c: { deal_id: string }) => c.deal_id === deal.id
  );
  if (already) return false;

  await supabase.from("customers").insert({
    deal_id: deal.id,
    nome_contato: deal.nome_contato,
    nome_empresa: deal.nome_empresa,
    email: deal.email,
    whatsapp: deal.whatsapp,
    valor_fechado: deal.valor,
  });
  return true;
}

export async function moveDeal(
  dealId: string,
  targetStageId: string
): Promise<MoveDealResult> {
  const supabase = await createClient();

  const [{ data: handoffs }, { data: stageRows }, { data: pipelineRows }] =
    await Promise.all([
      supabase.from("pipeline_handoffs").select("*"),
      supabase.from("stages").select("*"),
      supabase.from("pipelines").select("*"),
    ]);

  const handoff = ((handoffs ?? []) as PipelineHandoff[]).find(
    (h) => h.from_stage_id === targetStageId
  );
  const finalStageId = handoff ? handoff.to_stage_id : targetStageId;
  const finalStage = ((stageRows ?? []) as Stage[]).find(
    (s) => s.id === finalStageId
  );
  if (!finalStage) {
    return { ok: false, error: "Estágio inválido." };
  }

  const { error } = await supabase
    .from("deals")
    .update({ stage_id: finalStage.id, pipeline_id: finalStage.pipeline_id })
    .eq("id", dealId);
  if (error) {
    return { ok: false, error: "Não foi possível mover o negócio." };
  }

  const { data: dealRows } = await supabase.from("deals").select("*").eq("id", dealId);
  const deal = ((dealRows ?? []) as Deal[])[0];
  const valor = deal?.valor ?? 0;

  // Se houve handoff, o negócio de fato passou pelo estágio de saída
  // antes de ser entregue — registra os dois eventos para o histórico
  // (conversão/dashboard) refletir a passagem por ele.
  if (handoff) {
    const exitStage = ((stageRows ?? []) as Stage[]).find(
      (s) => s.id === targetStageId
    );
    if (exitStage) {
      await logStageEvent(supabase, {
        dealId,
        pipelineId: exitStage.pipeline_id,
        stageId: exitStage.id,
        valor,
      });
    }
  }

  await logStageEvent(supabase, {
    dealId,
    pipelineId: finalStage.pipeline_id,
    stageId: finalStage.id,
    valor,
  });

  let customerCreated = false;
  if (finalStage.tipo === "ganho" && deal) {
    customerCreated = await createCustomerIfMissing(supabase, deal);
  }

  const handoffPipelineName = handoff
    ? (pipelineRows ?? []).find((p: { id: string }) => p.id === finalStage.pipeline_id)
        ?.nome
    : undefined;

  revalidatePath("/leads");
  return {
    ok: true,
    pipelineId: finalStage.pipeline_id,
    stageId: finalStage.id,
    handoffPipelineName,
    customerCreated,
  };
}
