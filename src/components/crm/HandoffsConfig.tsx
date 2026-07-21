"use client";

import { useState } from "react";
import { createHandoff, deleteHandoff } from "@/lib/crm/config-actions";
import type { PipelineWithDetails } from "@/lib/crm/config-actions";
import type { PipelineHandoff } from "@/lib/crm/schema";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/Field";

export function HandoffsConfig({
  pipelines,
  handoffs,
}: {
  pipelines: PipelineWithDetails[];
  handoffs: PipelineHandoff[];
}) {
  const allStages = pipelines.flatMap((p) =>
    p.stages.map((s) => ({ ...s, pipelineNome: p.nome }))
  );
  const [fromStageId, setFromStageId] = useState("");
  const [toStageId, setToStageId] = useState("");

  function stageLabel(id: string) {
    const stage = allStages.find((s) => s.id === id);
    return stage ? `${stage.pipelineNome} → ${stage.nome}` : "—";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!fromStageId || !toStageId) return;
    await createHandoff(fromStageId, toStageId);
    setFromStageId("");
    setToStageId("");
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-vertice-border bg-vertice-surface p-6">
      <div>
        <h2 className="text-lg font-semibold">Entregas entre pipelines</h2>
        <p className="mt-1 text-sm text-vertice-ink/60">
          Quando um negócio entra no estágio de saída, ele é movido
          automaticamente para o pipeline e estágio de entrada configurados.
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-vertice-border">
        {handoffs.length === 0 && (
          <li className="py-2 text-sm text-vertice-ink/40">Nenhuma entrega configurada.</li>
        )}
        {handoffs.map((h) => (
          <li key={h.id} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span>
              {stageLabel(h.from_stage_id)} <strong>⟶</strong> {stageLabel(h.to_stage_id)}
            </span>
            <button
              onClick={() => deleteHandoff(h.id)}
              className="text-xs text-vertice-ink/40 transition-colors duration-150 hover:text-vertice-danger"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <SelectInput
          value={fromStageId}
          onChange={(e) => setFromStageId(e.target.value)}
          className="w-56"
        >
          <option value="">Estágio de saída</option>
          {allStages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.pipelineNome} → {s.nome}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          value={toStageId}
          onChange={(e) => setToStageId(e.target.value)}
          className="w-56"
        >
          <option value="">Estágio de entrada</option>
          {allStages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.pipelineNome} → {s.nome}
            </option>
          ))}
        </SelectInput>
        <Button type="submit" variant="secondary">
          + Entrega
        </Button>
      </form>
    </section>
  );
}
