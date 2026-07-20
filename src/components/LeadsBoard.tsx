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
        <div className="flex gap-2">
          {FUNIS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFunilKey(f.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                funilKey === f.key
                  ? "bg-vertice-ink text-vertice-bg"
                  : "bg-white text-vertice-ink/60 hover:text-vertice-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg bg-white p-1">
          <button
            onClick={() => setView("lista")}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              view === "lista"
                ? "bg-vertice-ink/10 text-vertice-ink"
                : "text-vertice-ink/50 hover:text-vertice-ink"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
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
