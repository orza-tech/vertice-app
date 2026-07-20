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

const inputClasses =
  "w-full rounded-lg border border-vertice-ink/15 bg-white px-4 py-2.5 text-sm text-vertice-ink placeholder:text-vertice-ink/40 focus:outline-none focus:ring-2 focus:ring-vertice-teal";

const labelClasses = "text-sm font-medium text-vertice-ink/80";

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
      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="nome_contato">
          Nome completo
        </label>
        <input
          id="nome_contato"
          className={inputClasses}
          placeholder="Como podemos te chamar?"
          {...register("nome_contato")}
        />
        {errors.nome_contato && (
          <p className="text-xs text-red-600">{errors.nome_contato.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="nome_empresa">
          Nome da empresa
        </label>
        <input
          id="nome_empresa"
          className={inputClasses}
          placeholder="Razão social ou nome fantasia"
          {...register("nome_empresa")}
        />
        {errors.nome_empresa && (
          <p className="text-xs text-red-600">{errors.nome_empresa.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses} htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className={inputClasses}
            placeholder="voce@empresa.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClasses} htmlFor="whatsapp">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            className={inputClasses}
            placeholder="(11) 99999-9999"
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p className="text-xs text-red-600">{errors.whatsapp.message}</p>
          )}
        </div>
      </div>

      {showCanalField ? (
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses} htmlFor="canal">
            Canal
          </label>
          <select
            id="canal"
            className={inputClasses}
            defaultValue=""
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
          </select>
          {errors.canal && (
            <p className="text-xs text-red-600">{errors.canal.message}</p>
          )}
        </div>
      ) : (
        <input type="hidden" {...register("canal")} />
      )}

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="faturamento_range">
          Faturamento mensal
        </label>
        <select
          id="faturamento_range"
          className={inputClasses}
          defaultValue=""
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
        </select>
        {errors.faturamento_range && (
          <p className="text-xs text-red-600">Selecione uma faixa de faturamento</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="funcionarios_range">
          Quantidade de funcionários
        </label>
        <select
          id="funcionarios_range"
          className={inputClasses}
          defaultValue=""
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
        </select>
        {errors.funcionarios_range && (
          <p className="text-xs text-red-600">Selecione uma faixa de funcionários</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="tempo_empresa_range">
          Tempo de empresa
        </label>
        <select
          id="tempo_empresa_range"
          className={inputClasses}
          defaultValue=""
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
        </select>
        {errors.tempo_empresa_range && (
          <p className="text-xs text-red-600">Selecione o tempo de empresa</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {serverError}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-vertice-teal/10 px-4 py-2 text-sm text-vertice-teal-deep">
          Cadastro realizado com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-vertice-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-vertice-bg transition hover:bg-vertice-teal-deep disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
    </form>
  );
}
