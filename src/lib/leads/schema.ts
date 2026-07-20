import { z } from "zod";

export const FATURAMENTO_OPTIONS = [
  { value: "ate_50k", label: "Até R$ 50 mil / mês" },
  { value: "50k_100k", label: "R$ 50 mil a R$ 100 mil / mês" },
  { value: "100k_300k", label: "R$ 100 mil a R$ 300 mil / mês" },
  { value: "300k_500k", label: "R$ 300 mil a R$ 500 mil / mês" },
  { value: "500k_1m", label: "R$ 500 mil a R$ 1 milhão / mês" },
  { value: "acima_1m", label: "Acima de R$ 1 milhão / mês" },
] as const;

export const FUNCIONARIOS_OPTIONS = [
  { value: "1_5", label: "1 a 5 funcionários" },
  { value: "6_10", label: "6 a 10 funcionários" },
  { value: "11_25", label: "11 a 25 funcionários" },
  { value: "26_50", label: "26 a 50 funcionários" },
  { value: "51_100", label: "51 a 100 funcionários" },
  { value: "mais_100", label: "Mais de 100 funcionários" },
] as const;

export const TEMPO_EMPRESA_OPTIONS = [
  { value: "menos_1_ano", label: "Menos de 1 ano" },
  { value: "1_3_anos", label: "1 a 3 anos" },
  { value: "3_5_anos", label: "3 a 5 anos" },
  { value: "5_10_anos", label: "5 a 10 anos" },
  { value: "mais_10_anos", label: "Mais de 10 anos" },
] as const;

export const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "nao_qualificado", label: "Não qualificado" },
  { value: "reuniao_agendada", label: "Reunião agendada" },
  { value: "negociacao", label: "Negociação" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  novo: "bg-vertice-ink/10 text-vertice-ink/70",
  contatado: "bg-blue-100 text-blue-700",
  qualificado: "bg-vertice-teal/15 text-vertice-teal-deep",
  nao_qualificado: "bg-zinc-200 text-zinc-600",
  reuniao_agendada: "bg-amber-100 text-amber-700",
  negociacao: "bg-purple-100 text-purple-700",
  fechado: "bg-green-100 text-green-700",
  perdido: "bg-red-100 text-red-700",
};

export const FUNIS = [
  {
    key: "oportunidade",
    label: "Funil de Oportunidade (SDR)",
    statuses: ["novo", "contatado", "qualificado", "nao_qualificado"] as const,
  },
  {
    key: "lead",
    label: "Funil de Lead (Closer)",
    statuses: ["reuniao_agendada", "negociacao", "fechado", "perdido"] as const,
  },
] as const;

export type FunilKey = (typeof FUNIS)[number]["key"];

const rangeValues = (
  options: readonly { value: string }[]
): [string, ...string[]] =>
  options.map((o) => o.value) as [string, ...string[]];

export const leadSchema = z.object({
  nome_contato: z.string().trim().min(2, "Informe o nome completo"),
  nome_empresa: z.string().trim().min(2, "Informe o nome da empresa"),
  email: z.string().trim().email("E-mail inválido"),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD"),
  faturamento_range: z.enum(rangeValues(FATURAMENTO_OPTIONS)),
  funcionarios_range: z.enum(rangeValues(FUNCIONARIOS_OPTIONS)),
  tempo_empresa_range: z.enum(rangeValues(TEMPO_EMPRESA_OPTIONS)),
  canal: z.string().trim().min(1, "Selecione um canal"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export type Lead = LeadFormValues & {
  id: string;
  created_at: string;
  origem: "manual" | "publico";
  status: string;
};

export const leadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(rangeValues(STATUS_OPTIONS)),
});

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value;
}
