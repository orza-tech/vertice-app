"use client";

import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { VerticeLogo } from "@/components/VerticeLogo";
import { createLeadPublico } from "@/lib/leads/actions";

export function CadastroPublico() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-vertice-bg p-10 text-center shadow-xl">
        <VerticeLogo className="mb-4" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vertice-teal/15 text-2xl text-vertice-teal-deep">
          ✓
        </div>
        <h1 className="text-xl font-semibold">Cadastro recebido!</h1>
        <p className="text-sm text-vertice-ink/60">
          Obrigado pelo interesse no Vértice. Nossa equipe vai entrar em
          contato em breve pelo WhatsApp ou e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-vertice-bg p-8 shadow-xl">
      <VerticeLogo className="mb-8" />
      <h1 className="mb-1 text-center text-lg font-semibold">
        Quero conhecer o Vértice
      </h1>
      <p className="mb-6 text-center text-sm text-vertice-ink/60">
        Preencha seus dados e nossa equipe entra em contato.
      </p>
      <LeadForm
        onSubmitLead={createLeadPublico}
        submitLabel="Enviar cadastro"
        onSuccess={() => setSubmitted(true)}
      />
    </div>
  );
}
