"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dealBaseSchema,
  buildCamposPersonalizadosSchema,
  type FieldDefinition,
} from "@/lib/crm/schema";
import type { ActionResult } from "@/lib/crm/deals-actions";
import type { Canal } from "@/lib/canais/actions";
import { Field, SelectInput, TextInput } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { z } from "zod";

export function DealForm({
  onSubmitDeal,
  fields,
  canais,
  submitLabel = "Cadastrar negócio",
  onSuccess,
}: {
  onSubmitDeal: (values: unknown) => Promise<ActionResult>;
  fields: FieldDefinition[];
  canais?: Canal[];
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const showCanalField = Boolean(canais);

  const schema = dealBaseSchema.extend({
    campos: buildCamposPersonalizadosSchema(fields),
  });
  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      valor: 0,
      ...(showCanalField ? {} : { canal: "Evento" }),
    } as Partial<FormInput>,
  });

  async function onSubmit(values: FormOutput) {
    setServerError(null);
    setSuccess(false);
    const result = await onSubmitDeal(values);
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
        <>
          <Field label="Valor do negócio (R$)" htmlFor="valor" error={errors.valor?.message}>
            <TextInput
              id="valor"
              type="number"
              step="0.01"
              placeholder="0,00"
              error={Boolean(errors.valor)}
              {...register("valor")}
            />
          </Field>
          <Field label="Canal" htmlFor="canal" error={errors.canal?.message}>
            <SelectInput id="canal" defaultValue="" error={Boolean(errors.canal)} {...register("canal")}>
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
        </>
      ) : (
        <>
          <input type="hidden" {...register("canal")} />
          <input type="hidden" {...register("valor")} />
        </>
      )}

      {fields.map((field) => (
        <Field
          key={field.id}
          label={field.nome}
          htmlFor={`campos.${field.id}`}
          error={errors.campos?.[field.id]?.message as string | undefined}
        >
          {field.tipo === "selecao" ? (
            <SelectInput
              id={`campos.${field.id}`}
              defaultValue=""
              error={Boolean(errors.campos?.[field.id])}
              {...register(`campos.${field.id}`)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {(field.opcoes ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </SelectInput>
          ) : (
            <TextInput
              id={`campos.${field.id}`}
              type={field.tipo === "numero" ? "number" : field.tipo === "data" ? "date" : "text"}
              error={Boolean(errors.campos?.[field.id])}
              {...register(`campos.${field.id}`)}
            />
          )}
        </Field>
      ))}

      {serverError && <Alert variant="error">{serverError}</Alert>}
      {success && <Alert variant="success">Salvo com sucesso!</Alert>}

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
}
