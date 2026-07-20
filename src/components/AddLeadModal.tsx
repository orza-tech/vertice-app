"use client";

import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { createLeadManual } from "@/lib/leads/actions";
import type { Canal } from "@/lib/canais/actions";

export function AddLeadModal({ canais }: { canais: Canal[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-vertice-teal-deep px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-vertice-ink"
      >
        + Adicionar lead
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-vertice-ink/60 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-vertice-bg p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Novo lead</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-vertice-ink/50 hover:text-vertice-ink"
              >
                ✕
              </button>
            </div>
            <LeadForm
              onSubmitLead={createLeadManual}
              submitLabel="Salvar lead"
              onSuccess={() => setOpen(false)}
              canais={canais}
            />
          </div>
        </div>
      )}
    </>
  );
}
