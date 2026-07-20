"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { VerticeLogo } from "@/components/VerticeLogo";

const inputClasses =
  "w-full rounded-lg border border-vertice-ink/15 bg-white px-4 py-2.5 text-sm text-vertice-ink placeholder:text-vertice-ink/40 focus:outline-none focus:ring-2 focus:ring-vertice-teal";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, undefined);

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-vertice-ink px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-vertice-bg p-8 shadow-xl">
        <VerticeLogo className="mb-8" />
        <h1 className="mb-6 text-center text-lg font-semibold">
          Criar conta da equipe
        </h1>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-vertice-ink/80" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClasses}
              placeholder="voce@vertice.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-vertice-ink/80" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-vertice-ink/80"
              htmlFor="confirmPassword"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="rounded-lg bg-vertice-teal/10 px-4 py-2 text-sm text-vertice-teal-deep">
              {state.success}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-vertice-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-vertice-bg transition hover:bg-vertice-teal-deep disabled:opacity-60"
          >
            {isPending ? "Criando..." : "Criar conta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-vertice-ink/60">
          Já tem conta?{" "}
          <Link href="/login" className="text-vertice-teal-deep underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
