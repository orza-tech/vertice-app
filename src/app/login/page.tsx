"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { VerticeLogo } from "@/components/VerticeLogo";

const inputClasses =
  "w-full rounded-lg border border-vertice-ink/15 bg-white px-4 py-2.5 text-sm text-vertice-ink placeholder:text-vertice-ink/40 focus:outline-none focus:ring-2 focus:ring-vertice-teal";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, undefined);

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-vertice-ink px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-vertice-bg p-8 shadow-xl">
        <VerticeLogo className="mb-8" />
        <h1 className="mb-6 text-center text-lg font-semibold">
          Acesso da equipe
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
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-vertice-ink px-4 py-3 text-sm font-semibold uppercase tracking-wide text-vertice-bg transition hover:bg-vertice-teal-deep disabled:opacity-60"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
