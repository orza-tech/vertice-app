"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { leadSchema, leadStatusSchema } from "@/lib/leads/schema";

export type CreateLeadResult = { ok: true } | { ok: false; error: string };

async function createLead(
  values: unknown,
  origem: "manual" | "publico"
): Promise<CreateLeadResult> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .insert({ ...parsed.data, origem });

  if (error) {
    return { ok: false, error: "Não foi possível salvar o cadastro. Tente novamente." };
  }

  if (origem === "manual") {
    revalidatePath("/leads");
  }

  return { ok: true };
}

export async function createLeadManual(values: unknown) {
  return createLead(values, "manual");
}

export async function createLeadPublico(values: unknown) {
  const withCanal =
    typeof values === "object" && values !== null
      ? { ...values, canal: "Evento" }
      : values;
  return createLead(withCanal, "publico");
}

export async function updateLeadStatus(values: unknown): Promise<CreateLeadResult> {
  const parsed = leadStatusSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Status inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return { ok: false, error: "Não foi possível atualizar o status." };
  }

  revalidatePath("/leads");
  return { ok: true };
}
