"use client";

import { useMemo, useState } from "react";
import { stageColorClasses, type Deal, type Stage, type StageEvent } from "@/lib/crm/schema";
import type { PipelineWithDetails } from "@/lib/crm/config-actions";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function periodKey(date: Date, granularity: "semana" | "mes") {
  if (granularity === "mes") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }
  const monday = new Date(date);
  const day = (monday.getDay() + 6) % 7; // 0 = segunda
  monday.setDate(monday.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

export function Dashboard({
  pipelines,
  deals,
  stageEvents,
}: {
  pipelines: PipelineWithDetails[];
  deals: Deal[];
  stageEvents: StageEvent[];
}) {
  const [granularity, setGranularity] = useState<"semana" | "mes">("mes");

  const periodStats = useMemo(() => {
    const stagesById = new Map<string, Stage>();
    for (const p of pipelines) for (const s of p.stages) stagesById.set(s.id, s);

    const buckets = new Map<string, { ganhoValor: number; ganhoQtd: number; perdidoValor: number; perdidoQtd: number }>();
    for (const event of stageEvents) {
      const stage = stagesById.get(event.stage_id);
      if (!stage || stage.tipo === "aberto") continue;
      const key = periodKey(new Date(event.created_at), granularity);
      const bucket = buckets.get(key) ?? { ganhoValor: 0, ganhoQtd: 0, perdidoValor: 0, perdidoQtd: 0 };
      if (stage.tipo === "ganho") {
        bucket.ganhoValor += event.valor;
        bucket.ganhoQtd += 1;
      } else {
        bucket.perdidoValor += event.valor;
        bucket.perdidoQtd += 1;
      }
      buckets.set(key, bucket);
    }
    return [...buckets.entries()].sort(([a], [b]) => (a > b ? -1 : 1));
  }, [pipelines, stageEvents, granularity]);

  return (
    <div className="flex flex-col gap-8">
      {pipelines.map((pipeline) => {
        const pipelineDeals = deals.filter((d) => d.pipeline_id === pipeline.id);
        const dealsEverByStage = new Map<string, Set<string>>();
        for (const event of stageEvents) {
          if (event.pipeline_id !== pipeline.id) continue;
          const set = dealsEverByStage.get(event.stage_id) ?? new Set<string>();
          set.add(event.deal_id);
          dealsEverByStage.set(event.stage_id, set);
        }

        return (
          <section key={pipeline.id} className="rounded-2xl border border-vertice-border bg-vertice-surface p-6">
            <h2 className="mb-4 text-lg font-semibold">{pipeline.nome}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pipeline.stages.map((stage, index) => {
                const stageDeals = pipelineDeals.filter((d) => d.stage_id === stage.id);
                const valorTotal = stageDeals.reduce((sum, d) => sum + d.valor, 0);
                const everHere = dealsEverByStage.get(stage.id)?.size ?? 0;
                const prevStage = pipeline.stages[index - 1];
                const everPrev = prevStage ? dealsEverByStage.get(prevStage.id)?.size ?? 0 : undefined;
                const conversao =
                  everPrev !== undefined && everPrev > 0
                    ? Math.round((everHere / everPrev) * 100)
                    : undefined;

                return (
                  <div key={stage.id} className="rounded-xl border border-vertice-border p-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${stageColorClasses(stage.cor)}`}>
                      {stage.nome}
                    </span>
                    <p className="mt-3 text-xl font-semibold">{formatCurrency(valorTotal)}</p>
                    <p className="text-xs text-vertice-ink/68">{stageDeals.length} negócio(s)</p>
                    {conversao !== undefined && (
                      <p className="mt-1 text-xs text-vertice-ink/68">
                        {conversao}% chegaram aqui vindos do estágio anterior
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="rounded-2xl border border-vertice-border bg-vertice-surface p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Ganhos e perdidos por período</h2>
          <div className="flex gap-1 rounded-lg bg-vertice-ink/[0.03] p-1">
            <button
              onClick={() => setGranularity("semana")}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${
                granularity === "semana" ? "bg-vertice-ink/10 text-vertice-ink" : "text-vertice-ink/68 hover:text-vertice-ink"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setGranularity("mes")}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${
                granularity === "mes" ? "bg-vertice-ink/10 text-vertice-ink" : "text-vertice-ink/68 hover:text-vertice-ink"
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        {periodStats.length === 0 ? (
          <p className="text-sm text-vertice-ink/68">Nenhum negócio ganho ou perdido ainda.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-vertice-border text-xs uppercase tracking-wide text-vertice-ink/68">
              <tr>
                <th className="py-2 pr-4 font-medium">Período</th>
                <th className="py-2 pr-4 font-medium">Ganho</th>
                <th className="py-2 pr-4 font-medium">Perdido</th>
              </tr>
            </thead>
            <tbody>
              {periodStats.map(([key, stats]) => (
                <tr key={key} className="border-b border-vertice-border/60 last:border-0">
                  <td className="py-2 pr-4">{key}</td>
                  <td className="py-2 pr-4 text-green-700">
                    {formatCurrency(stats.ganhoValor)} ({stats.ganhoQtd})
                  </td>
                  <td className="py-2 pr-4 text-red-700">
                    {formatCurrency(stats.perdidoValor)} ({stats.perdidoQtd})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
