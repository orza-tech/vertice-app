"use client";

import { useEffect } from "react";
import { VerticeLogo } from "@/components/VerticeLogo";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
      <VerticeLogo className="mb-4" />
      <h1 className="text-lg font-semibold">Algo deu errado</h1>
      <p className="text-sm text-vertice-ink/68">
        Não foi possível carregar esta página. Tente novamente em alguns
        instantes.
      </p>
      <Button variant="secondary" onClick={() => unstable_retry()}>
        Tentar novamente
      </Button>
    </main>
  );
}
