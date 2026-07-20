import { LeadStatusSelect } from "@/components/LeadStatusSelect";
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
    <section className="overflow-x-auto rounded-2xl border border-vertice-ink/10 bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-vertice-ink/10 text-xs uppercase tracking-wide text-vertice-ink/50">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Empresa</th>
            <th className="px-4 py-3">Contato</th>
            <th className="px-4 py-3">Faturamento</th>
            <th className="px-4 py-3">Funcionários</th>
            <th className="px-4 py-3">Tempo de empresa</th>
            <th className="px-4 py-3">Origem</th>
            <th className="px-4 py-3">Canal</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id} className="border-b border-vertice-ink/5 last:border-0">
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
                <td className="px-4 py-3 capitalize">{lead.origem}</td>
                <td className="px-4 py-3">{lead.canal}</td>
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
              <td colSpan={9} className="px-4 py-10 text-center text-vertice-ink/50">
                Nenhum lead neste funil ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
