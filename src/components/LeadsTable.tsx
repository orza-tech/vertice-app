import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { Badge } from "@/components/ui/Badge";
import {
  FATURAMENTO_OPTIONS,
  FUNCIONARIOS_OPTIONS,
  TEMPO_EMPRESA_OPTIONS,
  labelFor,
  type Lead,
} from "@/lib/leads/schema";

export function LeadsTable({
  leads,
  onStatusChange,
}: {
  leads: Lead[];
  onStatusChange: (leadId: string, status: string) => void;
}) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-vertice-border bg-vertice-surface">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-vertice-border text-xs uppercase tracking-wide text-vertice-ink/50">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Contato</th>
            <th className="px-4 py-3 font-medium">Faturamento</th>
            <th className="px-4 py-3 font-medium">Funcionários</th>
            <th className="px-4 py-3 font-medium">Tempo de empresa</th>
            <th className="px-4 py-3 font-medium">Origem</th>
            <th className="px-4 py-3 font-medium">Canal</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-vertice-border/60 transition-colors duration-150 last:border-0 hover:bg-vertice-ink/[0.02]"
              >
                <td className="px-4 py-3 font-medium">{lead.nome_contato}</td>
                <td className="px-4 py-3">{lead.nome_empresa}</td>
                <td className="px-4 py-3">
                  <div>{lead.email}</div>
                  <div className="text-vertice-ink/50">{lead.whatsapp}</div>
                </td>
                <td className="px-4 py-3">
                  {labelFor(FATURAMENTO_OPTIONS, lead.faturamento_range)}
                </td>
                <td className="px-4 py-3">
                  {labelFor(FUNCIONARIOS_OPTIONS, lead.funcionarios_range)}
                </td>
                <td className="px-4 py-3">
                  {labelFor(TEMPO_EMPRESA_OPTIONS, lead.tempo_empresa_range)}
                </td>
                <td className="px-4 py-3">
                  <Badge>{lead.origem === "publico" ? "Público" : "Manual"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone="accent">{lead.canal}</Badge>
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect
                    status={lead.status ?? "novo"}
                    onChange={(next) => onStatusChange(lead.id, next)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-14 text-center">
                <p className="text-sm text-vertice-ink/60">Nenhuma oportunidade neste funil ainda.</p>
                <p className="mt-1 text-xs text-vertice-ink/40">
                  Adicione uma manualmente ou compartilhe o link de cadastro.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
