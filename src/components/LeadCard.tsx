import { useDraggable } from "@dnd-kit/core";
import {
  FATURAMENTO_OPTIONS,
  FUNCIONARIOS_OPTIONS,
  labelFor,
  type Lead,
} from "@/lib/leads/schema";

export function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-none select-none rounded-xl border border-vertice-ink/10 bg-white p-3 text-sm shadow-sm active:cursor-grabbing ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <p className="font-medium">{lead.nome_contato}</p>
      <p className="text-vertice-ink/60">{lead.nome_empresa}</p>
      <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-vertice-ink/50">
        <span className="rounded-full bg-vertice-ink/5 px-2 py-0.5">
          {labelFor(FATURAMENTO_OPTIONS, lead.faturamento_range)}
        </span>
        <span className="rounded-full bg-vertice-ink/5 px-2 py-0.5">
          {labelFor(FUNCIONARIOS_OPTIONS, lead.funcionarios_range)}
        </span>
        <span className="rounded-full bg-vertice-teal/10 px-2 py-0.5 text-vertice-teal-deep">
          {lead.canal}
        </span>
      </div>
      <div className="mt-2 text-xs text-vertice-ink/50">
        <div>{lead.email}</div>
        <div>{lead.whatsapp}</div>
      </div>
    </div>
  );
}
