"use client";

import { useState } from "react";
import { DealsTable } from "@/components/crm/DealsTable";
import { DealsKanban } from "@/components/crm/DealsKanban";
import { AddDealModal } from "@/components/crm/AddDealModal";
import { moveDeal } from "@/lib/crm/deals-actions";
import type { Deal } from "@/lib/crm/schema";
import type { PipelineWithDetails } from "@/lib/crm/config-actions";
import type { Canal } from "@/lib/canais/actions";

export function DealsBoard({
  pipelines,
  initialDeals,
  canais,
}: {
  pipelines: PipelineWithDetails[];
  initialDeals: Deal[];
  canais: Canal[];
}) {
  const [prevInitialDeals, setPrevInitialDeals] = useState(initialDeals);
  const [deals, setDeals] = useState(initialDeals);
  if (initialDeals !== prevInitialDeals) {
    setPrevInitialDeals(initialDeals);
    setDeals(initialDeals);
  }

  const [activePipelineId, setActivePipelineId] = useState(pipelines[0]?.id ?? "");
  const [view, setView] = useState<"lista" | "kanban">("lista");
  const [notice, setNotice] = useState<string | null>(null);

  const activePipeline = pipelines.find((p) => p.id === activePipelineId);
  const visibleDeals = deals.filter((d) => d.pipeline_id === activePipelineId);

  function showNotice(message: string) {
    setNotice(message);
    setTimeout(() => setNotice((current) => (current === message ? null : current)), 4000);
  }

  function handleMoveDeal(dealId: string, targetStageId: string) {
    const previous = deals;
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage_id: targetStageId } : d
      )
    );
    moveDeal(dealId, targetStageId).then((result) => {
      if (!result.ok) {
        setDeals(previous);
        return;
      }
      setDeals((prev) =>
        prev.map((d) =>
          d.id === dealId
            ? { ...d, pipeline_id: result.pipelineId, stage_id: result.stageId }
            : d
        )
      );
      if (result.handoffPipelineName) {
        showNotice(`Negócio movido para o pipeline "${result.handoffPipelineName}".`);
      } else if (result.customerCreated) {
        showNotice("Negócio ganho — cliente criado a partir dele.");
      }
    });
  }

  if (pipelines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-vertice-border p-10 text-center text-sm text-vertice-ink/68">
        Nenhum pipeline configurado ainda.{" "}
        <a href="/configuracoes" className="text-vertice-teal-deep underline">
          Configure o primeiro pipeline
        </a>
        .
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notice && (
        <div className="rounded-lg bg-vertice-teal-subtle px-4 py-2 text-sm text-vertice-teal-pressed">
          {notice}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pipeline">
          {pipelines.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={activePipelineId === p.id}
              onClick={() => setActivePipelineId(p.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal focus-visible:ring-offset-2 focus-visible:ring-offset-vertice-bg ${
                activePipelineId === p.id
                  ? "bg-vertice-ink text-vertice-bg"
                  : "bg-vertice-surface text-vertice-ink/68 hover:text-vertice-ink"
              }`}
            >
              {p.nome}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {activePipeline && (
            <AddDealModal
              pipelineId={activePipeline.id}
              fields={activePipeline.fields}
              canais={canais}
            />
          )}
          <div className="flex gap-1 rounded-lg bg-vertice-surface p-1" role="tablist" aria-label="Visualização">
            <button
              role="tab"
              aria-selected={view === "lista"}
              onClick={() => setView("lista")}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal ${
                view === "lista"
                  ? "bg-vertice-ink/10 text-vertice-ink"
                  : "text-vertice-ink/68 hover:text-vertice-ink"
              }`}
            >
              Lista
            </button>
            <button
              role="tab"
              aria-selected={view === "kanban"}
              onClick={() => setView("kanban")}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal ${
                view === "kanban"
                  ? "bg-vertice-ink/10 text-vertice-ink"
                  : "text-vertice-ink/68 hover:text-vertice-ink"
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {activePipeline &&
        (view === "lista" ? (
          <DealsTable
            deals={visibleDeals}
            stages={activePipeline.stages}
            fields={activePipeline.fields}
            onMoveDeal={handleMoveDeal}
          />
        ) : (
          <DealsKanban
            deals={visibleDeals}
            stages={activePipeline.stages}
            fields={activePipeline.fields}
            onMoveDeal={handleMoveDeal}
          />
        ))}
    </div>
  );
}
