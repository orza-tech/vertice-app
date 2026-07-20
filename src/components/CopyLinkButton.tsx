"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

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
    <Button
      variant="secondary"
      onClick={handleCopy}
      title={state === "failed" ? "Copie manualmente" : undefined}
    >
      {label}
    </Button>
  );
}
