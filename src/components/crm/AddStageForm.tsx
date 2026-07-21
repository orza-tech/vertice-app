"use client";

import { useState } from "react";
import { createStage } from "@/lib/crm/config-actions";
import { STAGE_TIPOS, STAGE_COLOR_OPTIONS, type StageTipo } from "@/lib/crm/schema";
import { Button } from "@/components/ui/Button";
import { TextInput, SelectInput } from "@/components/ui/Field";

const TIPO_LABELS: Record<StageTipo, string> = {
  aberto: "Aberto",
  ganho: "Ganho (gera cliente)",
  perdido: "Perdido",
};

export function AddStageForm({ pipelineId }: { pipelineId: string }) {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState<string>(STAGE_COLOR_OPTIONS[0].value);
  const [tipo, setTipo] = useState<StageTipo>("aberto");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setIsPending(true);
    await createStage(pipelineId, { nome: nome.trim(), cor, tipo });
    setNome("");
    setCor(STAGE_COLOR_OPTIONS[0].value);
    setTipo("aberto");
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <TextInput
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do estágio"
        className="w-40"
      />
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Cor do estágio">
        {STAGE_COLOR_OPTIONS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={cor === c.value}
            aria-label={c.label}
            title={c.label}
            onClick={() => setCor(c.value)}
            className={`h-6 w-6 rounded-full ${c.dot} transition-transform duration-150 ease-out ${
              cor === c.value
                ? "ring-2 ring-vertice-ink ring-offset-2 ring-offset-vertice-surface"
                : "hover:scale-110"
            }`}
          />
        ))}
      </div>
      <SelectInput
        value={tipo}
        onChange={(e) => setTipo(e.target.value as StageTipo)}
        className="w-44"
      >
        {STAGE_TIPOS.map((t) => (
          <option key={t} value={t}>
            {TIPO_LABELS[t]}
          </option>
        ))}
      </SelectInput>
      <Button type="submit" variant="secondary" disabled={isPending}>
        + Estágio
      </Button>
    </form>
  );
}
