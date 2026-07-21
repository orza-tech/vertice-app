"use client";

import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { DealCard } from "@/components/crm/DealCard";
import { stageColorClasses, type Deal, type FieldDefinition, type Stage } from "@/lib/crm/schema";

function KanbanColumn({
  stage,
  deals,
  fields,
}: {
  stage: Stage;
  deals: Deal[];
  fields: FieldDefinition[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

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
        <h3 className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${stageColorClasses(stage.cor)}`}>
          {stage.nome}
        </h3>
        <span className="text-xs text-vertice-ink/40">{deals.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} fields={fields} />
        ))}
        {deals.length === 0 && (
          <p className="rounded-lg border border-dashed border-vertice-border px-3 py-4 text-center text-xs text-vertice-ink/35">
            Arraste um card pra cá
          </p>
        )}
      </div>
    </div>
  );
}

export function DealsKanban({
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
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStageId = String(over.id);
    const dealId = String(active.id);
    const deal = deals.find((d) => d.id === dealId);
    if (deal && deal.stage_id !== newStageId) {
      onMoveDeal(dealId, newStageId);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            fields={fields}
            deals={deals.filter((d) => d.stage_id === stage.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
