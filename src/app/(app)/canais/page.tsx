import { getCanais, createCanal, deleteCanal } from "@/lib/canais/actions";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";

export const metadata = {
  title: "Canais | Vértice",
};

export default async function CanaisPage() {
  const canais = await getCanais();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-6 rounded-2xl border border-vertice-border bg-vertice-surface p-6">
        <div>
          <h1 className="text-lg font-semibold">Canais de origem</h1>
          <p className="mt-1 text-sm text-vertice-ink/68">
            Canais usados para indicar de onde veio cada oportunidade
            cadastrada manualmente. Cadastros feitos pelo link público
            entram automaticamente como &quot;Evento&quot;.
          </p>
        </div>

        <form action={createCanal} className="flex gap-3">
          <TextInput
            name="nome"
            required
            placeholder="Nome do canal (ex: Indicação, Instagram)"
            className="flex-1"
          />
          <Button type="submit" variant="accent" className="whitespace-nowrap">
            Adicionar
          </Button>
        </form>

        <ul className="flex flex-col divide-y divide-vertice-border">
          {canais.map((canal) => (
            <li key={canal.id} className="flex items-center justify-between py-3">
              <span className="text-sm">{canal.nome}</span>
              <form action={deleteCanal.bind(null, canal.id)}>
                <Button type="submit" variant="ghost-danger">
                  Remover
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
