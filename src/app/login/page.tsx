"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { VerticeLogo } from "@/components/VerticeLogo";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field, TextInput } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, undefined);

  return (
    <AuthShell>
      <VerticeLogo className="mb-8" />
      <h1 className="mb-6 text-center text-lg font-semibold">Acesso da equipe</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="E-mail" htmlFor="email">
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            placeholder="voce@vertice.com"
          />
        </Field>
        <Field label="Senha" htmlFor="password">
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </Field>
        {state?.error && <Alert variant="error">{state.error}</Alert>}
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-vertice-ink/68">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="text-vertice-teal-deep underline">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}
