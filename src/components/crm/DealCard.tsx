import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/Badge";
import type { Deal, FieldDefinition } from "@/lib/crm/schema";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DealCard({ deal, fields }: { deal: Deal; fields: FieldDefinition[] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-none select-none rounded-xl border border-vertice-border bg-vertice-surface p-3 text-sm shadow-sm transition-shadow duration-150 hover:shadow-md active:cursor-grabbing ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{deal.nome_contato}</p>
          <p className="text-vertice-ink/68">{deal.nome_empresa}</p>
        </div>
        {deal.valor > 0 && (
          <span className="whitespace-nowrap text-xs font-semibold text-vertice-teal-pressed">
            {formatCurrency(deal.valor)}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {fields.map((field) => {
          const value = deal.campos_personalizados?.[field.id];
          if (!value) return null;
          return <Badge key={field.id}>{value}</Badge>;
        })}
        <Badge tone="accent">{deal.canal}</Badge>
      </div>
      <div className="mt-2 text-xs text-vertice-ink/68">
        <div>{deal.email}</div>
        <div>{deal.whatsapp}</div>
      </div>
    </div>
  );
}
