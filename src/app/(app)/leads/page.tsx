import { headers } from "next/headers";
import { getCanais } from "@/lib/canais/actions";
import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals } from "@/lib/crm/deals-actions";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DealsBoard } from "@/components/crm/DealsBoard";

export const metadata = {
  title: "Negócios | Vértice",
};

async function getPublicCadastroUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}/cadastro`;
}

export default async function LeadsPage() {
  const [pipelines, deals, publicUrl, canais] = await Promise.all([
    getPipelinesWithDetails(),
    getDeals(),
    getPublicCadastroUrl(),
    getCanais(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Negócios</h1>
          <p className="mt-1 text-sm text-vertice-ink/68">
            Acompanhe os negócios em cada pipeline comercial.
          </p>
        </div>
        <CopyLinkButton url={publicUrl} />
      </header>

      <DealsBoard pipelines={pipelines} initialDeals={deals} canais={canais} />
    </main>
  );
}
