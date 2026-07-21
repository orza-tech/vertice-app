import { z } from "zod";

export const STAGE_TIPOS = ["aberto", "ganho", "perdido"] as const;
export type StageTipo = (typeof STAGE_TIPOS)[number];

export const FIELD_TIPOS = ["texto", "numero", "selecao", "data"] as const;
export type FieldTipo = (typeof FIELD_TIPOS)[number];

export const STAGE_COLOR_OPTIONS = [
  { value: "cinza", label: "Cinza", classes: "bg-vertice-ink/10 text-vertice-ink/70" },
  { value: "azul", label: "Azul", classes: "bg-blue-100 text-blue-700" },
  { value: "teal", label: "Teal", classes: "bg-vertice-teal-subtle text-vertice-teal-pressed" },
  { value: "ambar", label: "Âmbar", classes: "bg-amber-100 text-amber-700" },
  { value: "roxo", label: "Roxo", classes: "bg-purple-100 text-purple-700" },
  { value: "verde", label: "Verde", classes: "bg-green-100 text-green-700" },
  { value: "vermelho", label: "Vermelho", classes: "bg-red-100 text-red-700" },
] as const;

export function stageColorClasses(cor: string) {
  return (
    STAGE_COLOR_OPTIONS.find((c) => c.value === cor)?.classes ??
    "bg-vertice-ink/10 text-vertice-ink/70"
  );
}

export type Pipeline = {
  id: string;
  nome: string;
  ordem: number;
  created_at: string;
};

export type Stage = {
  id: string;
  pipeline_id: string;
  nome: string;
  ordem: number;
  cor: string;
  tipo: StageTipo;
};

export type PipelineHandoff = {
  id: string;
  from_stage_id: string;
  to_stage_id: string;
};

export type FieldDefinition = {
  id: string;
  pipeline_id: string;
  nome: string;
  tipo: FieldTipo;
  opcoes: string[] | null;
  obrigatorio: boolean;
  ordem: number;
};

export type StageEvent = {
  id: string;
  deal_id: string;
  pipeline_id: string;
  stage_id: string;
  valor: number;
  created_at: string;
};

export type Deal = {
  id: string;
  pipeline_id: string;
  stage_id: string;
  nome_contato: string;
  nome_empresa: string;
  email: string;
  whatsapp: string;
  valor: number;
  canal: string;
  campos_personalizados: Record<string, string>;
  origem: "manual" | "publico";
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  deal_id: string;
  nome_contato: string;
  nome_empresa: string;
  email: string;
  whatsapp: string;
  valor_fechado: number;
  created_at: string;
};

export const dealBaseSchema = z.object({
  nome_contato: z.string().trim().min(2, "Informe o nome completo"),
  nome_empresa: z.string().trim().min(2, "Informe o nome da empresa"),
  email: z.string().trim().email("E-mail inválido"),
  whatsapp: z.string().trim().min(10, "Informe um WhatsApp válido com DDD"),
  valor: z.coerce.number().min(0, "Informe um valor válido"),
  canal: z.string().trim().min(1, "Selecione um canal"),
});

export type DealBaseValues = z.infer<typeof dealBaseSchema>;

/** Monta um schema zod para os campos personalizados de um pipeline,
 * a partir das definições de campo cadastradas para ele. */
export function buildCamposPersonalizadosSchema(fields: FieldDefinition[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let validator: z.ZodTypeAny;
    switch (field.tipo) {
      case "numero":
        validator = z.coerce.number({ message: "Informe um número" });
        break;
      case "data":
        validator = z.string().trim().min(1, "Informe uma data");
        break;
      case "selecao":
        validator = z.enum(
          (field.opcoes ?? []) as [string, ...string[]]
        );
        break;
      default:
        validator = z.string().trim();
    }
    shape[field.id] = field.obrigatorio
      ? validator
      : validator.optional().or(z.literal(""));
  }
  return z.object(shape);
}

export function labelForOption(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value;
}
