"use client";

import { useState } from "react";
import {
  renamePipeline,
  deletePipeline,
  deleteStage,
  deleteField,
} from "@/lib/crm/config-actions";
import { stageColorClasses, type FieldTipo } from "@/lib/crm/schema";
import type { PipelineWithDetails } from "@/lib/crm/config-actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddStageForm } from "@/components/crm/AddStageForm";
import { AddFieldForm } from "@/components/crm/AddFieldForm";

const FIELD_TIPO_LABELS: Record<FieldTipo, string> = {
  texto: "Texto",
  numero: "Número",
  selecao: "Lista de opções",
  data: "Data",
};

export function PipelineConfigCard({ pipeline }: { pipeline: PipelineWithDetails }) {
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteStage(id: string) {
    const result = await deleteStage(id);
    if (result && !result.ok) setError(result.error);
  }

  async function handleDeletePipeline() {
    const result = await deletePipeline(pipeline.id);
    if (result && !result.ok) setError(result.error);
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-vertice-border bg-vertice-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <form action={renamePipeline.bind(null, pipeline.id)} className="flex flex-1 gap-2">
          <input
            name="nome"
            defaultValue={pipeline.nome}
            className="w-full max-w-xs rounded-lg border border-vertice-border-strong bg-vertice-surface px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-vertice-teal"
          />
          <Button type="submit" variant="secondary">
            Salvar nome
          </Button>
        </form>
        <Button variant="ghost-danger" onClick={handleDeletePipeline}>
          Excluir pipeline
        </Button>
      </div>

      {error && <p className="text-xs text-vertice-danger">{error}</p>}

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-vertice-ink/68">
          Estágios
        </h3>
        <ul className="mb-3 flex flex-wrap gap-2">
          {pipeline.stages.map((stage) => (
            <li
              key={stage.id}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${stageColorClasses(stage.cor)}`}
            >
              {stage.nome}
              {stage.tipo !== "aberto" && (
                <span className="opacity-70">
                  ({stage.tipo === "ganho" ? "ganho" : "perdido"})
                </span>
              )}
              <button
                onClick={() => handleDeleteStage(stage.id)}
                aria-label={`Remover estágio ${stage.nome}`}
                className="opacity-50 hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <AddStageForm pipelineId={pipeline.id} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-vertice-ink/68">
          Campos personalizados
        </h3>
        <ul className="mb-3 flex flex-col divide-y divide-vertice-border">
          {pipeline.fields.length === 0 && (
            <li className="py-2 text-sm text-vertice-ink/68">Nenhum campo ainda.</li>
          )}
          {pipeline.fields.map((field) => (
            <li key={field.id} className="flex items-center justify-between gap-2 py-2">
              <span className="text-sm">
                {field.nome}{" "}
                <Badge>{FIELD_TIPO_LABELS[field.tipo]}</Badge>{" "}
                {field.obrigatorio && (
                  <span className="text-xs text-vertice-ink/68">obrigatório</span>
                )}
              </span>
              <button
                onClick={() => deleteField(field.id)}
                className="text-xs text-vertice-ink/68 transition-colors duration-150 hover:text-vertice-danger"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
        <AddFieldForm pipelineId={pipeline.id} />
      </div>
    </section>
  );
}
