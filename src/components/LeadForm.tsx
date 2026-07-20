"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leadSchema,
  type LeadFormValues,
  FATURAMENTO_OPTIONS,
  FUNCIONARIOS_OPTIONS,
  TEMPO_EMPRESA_OPTIONS,
} from "@/lib/leads/schema";
import type { CreateLeadResult } from "@/lib/leads/actions";
import type { Canal } from "@/lib/canais/actions";
import { Field, SelectInput, TextInput } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function LeadForm({
  onSubmitLead,
  submitLabel = "Cadastrar lead",
  onSuccess,
  canais,
}: {
  onSubmitLead: (values: LeadFormValues) => Promise<CreateLeadResult>;
  submitLabel?: string;
  onSuccess?: () => void;
  canais?: Canal[];
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const showCanalField = Boolean(canais);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: showCanalField ? undefined : { canal: "Evento" },
  });

  async function onSubmit(values: LeadFormValues) {
    setServerError(null);
    setSuccess(false);
    const result = await onSubmitLead(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
    reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Nome completo" htmlFor="nome_contato" error={errors.nome_contato?.message}>
        <TextInput
          id="nome_contato"
          placeholder="Como podemos te chamar?"
          error={Boolean(errors.nome_contato)}
          {...register("nome_contato")}
        />
      </Field>

      <Field label="Nome da empresa" htmlFor="nome_empresa" error={errors.nome_empresa?.message}>
        <TextInput
          id="nome_empresa"
          placeholder="Razão social ou nome fantasia"
          error={Boolean(errors.nome_empresa)}
          {...register("nome_empresa")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <TextInput
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            error={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
          <TextInput
            id="whatsapp"
            type="tel"
            placeholder="(11) 99999-9999"
            error={Boolean(errors.whatsapp)}
            {...register("whatsapp")}
          />
        </Field>
      </div>

      {showCanalField ? (
        <Field label="Canal" htmlFor="canal" error={errors.canal?.message}>
          <SelectInput
            id="canal"
            defaultValue=""
            error={Boolean(errors.canal)}
            {...register("canal")}
          >
            <option value="" disabled>
              Selecione um canal
            </option>
            {canais!.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </SelectInput>
        </Field>
      ) : (
        <input type="hidden" {...register("canal")} />
      )}

      <Field
        label="Faturamento mensal"
        htmlFor="faturamento_range"
        error={errors.faturamento_range && "Selecione uma faixa de faturamento"}
      >
        <SelectInput
          id="faturamento_range"
          defaultValue=""
          error={Boolean(errors.faturamento_range)}
          {...register("faturamento_range")}
        >
          <option value="" disabled>
            Selecione uma faixa
          </option>
          {FATURAMENTO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field
        label="Quantidade de funcionários"
        htmlFor="funcionarios_range"
        error={errors.funcionarios_range && "Selecione uma faixa de funcionários"}
      >
        <SelectInput
          id="funcionarios_range"
          defaultValue=""
          error={Boolean(errors.funcionarios_range)}
          {...register("funcionarios_range")}
        >
          <option value="" disabled>
            Selecione uma faixa
          </option>
          {FUNCIONARIOS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field
        label="Tempo de empresa"
        htmlFor="tempo_empresa_range"
        error={errors.tempo_empresa_range && "Selecione o tempo de empresa"}
      >
        <SelectInput
          id="tempo_empresa_range"
          defaultValue=""
          error={Boolean(errors.tempo_empresa_range)}
          {...register("tempo_empresa_range")}
        >
          <option value="" disabled>
            Selecione uma faixa
          </option>
          {TEMPO_EMPRESA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectInput>
      </Field>

      {serverError && <Alert variant="error">{serverError}</Alert>}
      {success && <Alert variant="success">Cadastro realizado com sucesso!</Alert>}

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
}
