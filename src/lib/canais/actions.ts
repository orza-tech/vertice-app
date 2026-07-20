"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type Canal = { id: string; nome: string; created_at: string };

export async function getCanais(): Promise<Canal[]> {
  const supabase = await createClient();
  let { data } = await supabase
    .from("canais")
    .select("*")
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) {
    await supabase.from("canais").insert({ nome: "Evento" });
    ({ data } = await supabase
      .from("canais")
      .select("*")
      .order("created_at", { ascending: true }));
  }

  return (data ?? []) as Canal[];
}

export async function createCanal(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  const supabase = await createClient();
  await supabase.from("canais").insert({ nome });

  revalidatePath("/canais");
  revalidatePath("/leads");
}

export async function deleteCanal(id: string) {
  const supabase = await createClient();
  await supabase.from("canais").delete().eq("id", id);

  revalidatePath("/canais");
  revalidatePath("/leads");
}
