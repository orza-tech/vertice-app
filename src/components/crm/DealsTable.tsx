import { Badge } from "@/components/ui/Badge";
import { ScrollFade } from "@/components/ui/ScrollFade";
import { stageColorClasses, type Deal, type FieldDefinition, type Stage } from "@/lib/crm/schema";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DealsTable({
  deals,
  stages,
  fields,
  onMoveDeal,
}: {
  deals: Deal[];
  stages: Stage[];
  fields: FieldDefinition[];
  onMoveDeal: (dealId: string, stageId: string) => void;
}) {
  return (
    <ScrollFade className="rounded-2xl border border-vertice-border bg-vertice-surface">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-vertice-border text-xs uppercase tracking-wide text-vertice-ink/68">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Contato</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 font-medium">Canal</th>
            {fields.map((field) => (
              <th key={field.id} className="px-4 py-3 font-medium">
                {field.nome}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Estágio</th>
          </tr>
        </thead>
        <tbody>
          {deals.length > 0 ? (
            deals.map((deal) => (
              <tr
                key={deal.id}
                className="border-b border-vertice-border/60 transition-colors duration-150 last:border-0 hover:bg-vertice-ink/[0.02]"
              >
                <td className="px-4 py-3 font-medium">{deal.nome_contato}</td>
                <td className="px-4 py-3">{deal.nome_empresa}</td>
                <td className="px-4 py-3">
                  <div>{deal.email}</div>
                  <div className="text-vertice-ink/68">{deal.whatsapp}</div>
                </td>
                <td className="px-4 py-3">{formatCurrency(deal.valor)}</td>
                <td className="px-4 py-3">
                  <Badge tone="accent">{deal.canal}</Badge>
                </td>
                {fields.map((field) => (
                  <td key={field.id} className="px-4 py-3">
                    {deal.campos_personalizados?.[field.id] ?? "—"}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <select
                    value={deal.stage_id}
                    onChange={(e) => onMoveDeal(deal.id, e.target.value)}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-vertice-teal ${stageColorClasses(
                      stages.find((s) => s.id === deal.stage_id)?.cor ?? "cinza"
                    )}`}
                  >
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.nome}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6 + fields.length} className="px-4 py-14 text-center">
                <p className="text-sm text-vertice-ink/68">Nenhum negócio neste pipeline ainda.</p>
                <p className="mt-1 text-xs text-vertice-ink/68">
                  Adicione um manualmente ou compartilhe o link de cadastro.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </ScrollFade>
  );
}
