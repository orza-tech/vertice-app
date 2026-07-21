"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { VerticeLogo } from "@/components/VerticeLogo";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field, TextInput } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, undefined);

  return (
    <AuthShell>
      <VerticeLogo className="mb-8" />
      <h1 className="mb-6 text-center text-lg font-semibold">Criar conta da equipe</h1>
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
            minLength={6}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirmar senha" htmlFor="confirmPassword">
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
          />
        </Field>
        {state?.error && <Alert variant="error">{state.error}</Alert>}
        {state?.success && <Alert variant="success">{state.success}</Alert>}
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Criando..." : "Criar conta"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-vertice-ink/68">
        Já tem conta?{" "}
        <Link href="/login" className="text-vertice-teal-deep underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
