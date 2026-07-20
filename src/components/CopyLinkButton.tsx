"use client";

import { useState } from "react";

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export function CopyLinkButton({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState(fallbackCopy(url) ? "copied" : "failed");
    }
    setTimeout(() => setState("idle"), 2500);
  }

  const label =
    state === "copied"
      ? "Link copiado!"
      : state === "failed"
        ? url
        : "Copiar link do formulário";

  return (
    <button
      onClick={handleCopy}
      title={state === "failed" ? "Copie manualmente" : undefined}
      className="rounded-lg border border-vertice-ink/20 px-4 py-2.5 text-sm text-vertice-ink/70 transition hover:border-vertice-ink/40"
    >
      {label}
    </button>
  );
}
