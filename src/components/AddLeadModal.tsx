"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { createLeadManual } from "@/lib/leads/actions";
import type { Canal } from "@/lib/canais/actions";
import { Button } from "@/components/ui/Button";

export function AddLeadModal({ canais }: { canais: Canal[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        + Adicionar lead
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-lead-title"
          className="animate-reveal fixed inset-0 z-50 flex items-center justify-center bg-vertice-ink/60 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-vertice-bg p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="add-lead-title" className="text-lg font-semibold">
                Novo lead
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="rounded-md p-1 text-vertice-ink/50 transition-colors duration-150 hover:text-vertice-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal"
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
