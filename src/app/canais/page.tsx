import Link from "next/link";
import { getCanais, createCanal, deleteCanal } from "@/lib/canais/actions";
import { VerticeLogo } from "@/components/VerticeLogo";

export const metadata = {
  title: "Canais | Vértice",
};

export default async function CanaisPage() {
  const canais = await getCanais();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <VerticeLogo className="items-start text-left" />
        <Link
          href="/leads"
          className="rounded-lg border border-vertice-ink/20 px-4 py-2.5 text-sm text-vertice-ink/70 transition hover:border-vertice-ink/40"
        >
          Voltar para leads
        </Link>
      </header>

      <section className="flex flex-col gap-6 rounded-2xl border border-vertice-ink/10 bg-white p-6">
        <div>
          <h1 className="text-lg font-semibold">Canais de origem</h1>
          <p className="mt-1 text-sm text-vertice-ink/60">
            Canais usados para indicar de onde veio cada oportunidade
            cadastrada manualmente. Cadastros feitos pelo link público
            entram automaticamente como &quot;Evento&quot;.
          </p>
        </div>

        <form action={createCanal} className="flex gap-3">
          <input
            name="nome"
            required
            placeholder="Nome do canal (ex: Indicação, Instagram)"
            className="flex-1 rounded-lg border border-vertice-ink/15 bg-white px-4 py-2.5 text-sm text-vertice-ink placeholder:text-vertice-ink/40 focus:outline-none focus:ring-2 focus:ring-vertice-teal"
          />
          <button
            type="submit"
            className="rounded-lg bg-vertice-ink px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-vertice-bg transition hover:bg-vertice-teal-deep"
          >
            Adicionar
          </button>
        </form>

        <ul className="flex flex-col divide-y divide-vertice-ink/10">
          {canais.map((canal) => (
            <li key={canal.id} className="flex items-center justify-between py-3">
              <span className="text-sm">{canal.nome}</span>
              <form action={deleteCanal.bind(null, canal.id)}>
                <button
                  type="submit"
                  className="text-xs text-vertice-ink/40 transition hover:text-red-600"
                >
                  Remover
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
