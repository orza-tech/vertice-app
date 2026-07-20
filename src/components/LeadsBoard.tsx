"use client";

import { useState } from "react";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadsKanban } from "@/components/LeadsKanban";
import { updateLeadStatus } from "@/lib/leads/actions";
import { FUNIS, type FunilKey, type Lead } from "@/lib/leads/schema";

export function LeadsBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [prevInitialLeads, setPrevInitialLeads] = useState(initialLeads);
  const [leads, setLeads] = useState(initialLeads);
  if (initialLeads !== prevInitialLeads) {
    setPrevInitialLeads(initialLeads);
    setLeads(initialLeads);
  }
  const [funilKey, setFunilKey] = useState<FunilKey>(FUNIS[0].key);
  const [view, setView] = useState<"lista" | "kanban">("lista");

  const funil = FUNIS.find((f) => f.key === funilKey)!;
  const funilStatuses: readonly string[] = funil.statuses;
  const visibleLeads = leads.filter((l) => funilStatuses.includes(l.status ?? "novo"));

  function handleStatusChange(leadId: string, nextStatus: string) {
    const previous = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );
    updateLeadStatus({ id: leadId, status: nextStatus }).then((result) => {
      if (!result.ok) setLeads(previous);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist" aria-label="Funil">
          {FUNIS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={funilKey === f.key}
              onClick={() => setFunilKey(f.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal focus-visible:ring-offset-2 focus-visible:ring-offset-vertice-bg ${
                funilKey === f.key
                  ? "bg-vertice-ink text-vertice-bg"
                  : "bg-vertice-surface text-vertice-ink/60 hover:text-vertice-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg bg-vertice-surface p-1" role="tablist" aria-label="Visualização">
          <button
            role="tab"
            aria-selected={view === "lista"}
            onClick={() => setView("lista")}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal ${
              view === "lista"
                ? "bg-vertice-ink/10 text-vertice-ink"
                : "text-vertice-ink/50 hover:text-vertice-ink"
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
                : "text-vertice-ink/50 hover:text-vertice-ink"
            }`}
          >
            Kanban
          </button>
        </div>
      </div>

      {view === "lista" ? (
        <LeadsTable leads={visibleLeads} onStatusChange={handleStatusChange} />
      ) : (
        <LeadsKanban
          leads={visibleLeads}
          statuses={funilStatuses}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
