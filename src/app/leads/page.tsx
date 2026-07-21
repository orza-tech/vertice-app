import { headers } from "next/headers";
import { getCanais } from "@/lib/canais/actions";
import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals } from "@/lib/crm/deals-actions";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DealsBoard } from "@/components/crm/DealsBoard";
import { AppHeader } from "@/components/AppHeader";

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
      <AppHeader active="/leads" extra={<CopyLinkButton url={publicUrl} />} />

      <DealsBoard pipelines={pipelines} initialDeals={deals} canais={canais} />
    </main>
  );
}
