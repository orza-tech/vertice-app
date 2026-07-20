"use client";

import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { LeadCard } from "@/components/LeadCard";
import { STATUS_OPTIONS, labelFor, type Lead } from "@/lib/leads/schema";

function KanbanColumn({
  column,
  leads,
}: {
  column: string;
  leads: Lead[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] flex-col gap-3 rounded-2xl border p-3 transition-colors duration-150 ${
        isOver
          ? "border-vertice-teal bg-vertice-teal-subtle"
          : "border-vertice-border bg-vertice-ink/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-vertice-ink/60">
          {labelFor(STATUS_OPTIONS, column)}
        </h3>
        <span className="text-xs text-vertice-ink/40">{leads.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <p className="rounded-lg border border-dashed border-vertice-border px-3 py-4 text-center text-xs text-vertice-ink/35">
            Arraste um card pra cá
          </p>
        )}
      </div>
    </div>
  );
}

export function LeadsKanban({
  leads,
  statuses,
  onStatusChange,
}: {
  leads: Lead[];
  statuses: readonly string[];
  onStatusChange: (leadId: string, status: string) => void;
}) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = String(over.id);
    const leadId = String(active.id);
    const lead = leads.find((l) => l.id === leadId);
    if (lead && (lead.status ?? "novo") !== newStatus) {
      onStatusChange(leadId, newStatus);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map((column) => (
          <KanbanColumn
            key={column}
            column={column}
            leads={leads.filter((l) => (l.status ?? "novo") === column)}
          />
        ))}
      </div>
    </DndContext>
  );
}
