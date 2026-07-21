"use client";

import { useState } from "react";
import { DealForm } from "@/components/crm/DealForm";
import { VerticeLogo } from "@/components/VerticeLogo";
import { createDealPublico } from "@/lib/crm/deals-actions";
import type { FieldDefinition } from "@/lib/crm/schema";

export function CadastroPublico({ fields }: { fields: FieldDefinition[] }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="animate-reveal flex flex-col items-center gap-4 text-center">
        <VerticeLogo className="mb-4" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vertice-teal-subtle text-2xl text-vertice-teal-pressed">
          ✓
        </div>
        <h1 className="text-xl font-semibold">Cadastro recebido!</h1>
        <p className="text-sm text-vertice-ink/68">
          Obrigado pelo interesse no Vértice. Nossa equipe vai entrar em
          contato em breve pelo WhatsApp ou e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <div>
      <VerticeLogo className="mb-8" />
      <h1 className="mb-1 text-center text-lg font-semibold">
        Quero conhecer o Vértice
      </h1>
      <p className="mb-6 text-center text-sm text-vertice-ink/68">
        Preencha seus dados e nossa equipe entra em contato.
      </p>
      <DealForm
        onSubmitDeal={createDealPublico}
        fields={fields}
        submitLabel="Enviar cadastro"
        onSuccess={() => setSubmitted(true)}
      />
    </div>
  );
}
