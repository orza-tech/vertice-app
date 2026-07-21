"use client";

import { useState } from "react";
import { createField } from "@/lib/crm/config-actions";
import { FIELD_TIPOS, type FieldTipo } from "@/lib/crm/schema";
import { Button } from "@/components/ui/Button";
import { TextInput, SelectInput } from "@/components/ui/Field";

const TIPO_LABELS: Record<FieldTipo, string> = {
  texto: "Texto",
  numero: "Número",
  selecao: "Lista de opções",
  data: "Data",
};

export function AddFieldForm({ pipelineId }: { pipelineId: string }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<FieldTipo>("texto");
  const [opcoesText, setOpcoesText] = useState("");
  const [obrigatorio, setObrigatorio] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setIsPending(true);
    const opcoes =
      tipo === "selecao"
        ? opcoesText
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : null;
    await createField(pipelineId, { nome: nome.trim(), tipo, opcoes, obrigatorio });
    setNome("");
    setTipo("texto");
    setOpcoesText("");
    setObrigatorio(false);
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <TextInput
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do campo"
        className="w-40"
      />
      <SelectInput
        value={tipo}
        onChange={(e) => setTipo(e.target.value as FieldTipo)}
        className="w-40"
      >
        {FIELD_TIPOS.map((t) => (
          <option key={t} value={t}>
            {TIPO_LABELS[t]}
          </option>
        ))}
      </SelectInput>
      {tipo === "selecao" && (
        <TextInput
          value={opcoesText}
          onChange={(e) => setOpcoesText(e.target.value)}
          placeholder="Opções separadas por vírgula"
          className="w-56"
        />
      )}
      <label className="flex items-center gap-1.5 pb-2.5 text-xs text-vertice-ink/68">
        <input
          type="checkbox"
          checked={obrigatorio}
          onChange={(e) => setObrigatorio(e.target.checked)}
        />
        Obrigatório
      </label>
      <Button type="submit" variant="secondary" disabled={isPending}>
        + Campo
      </Button>
    </form>
  );
}
