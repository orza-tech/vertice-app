import Link from "next/link";
import { headers } from "next/headers";
import { getCanais } from "@/lib/canais/actions";
import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals } from "@/lib/crm/deals-actions";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DealsBoard } from "@/components/crm/DealsBoard";
import { VerticeLogo } from "@/components/VerticeLogo";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";

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
        <VerticeLogo size="sm" className="items-start text-left" />
        <div className="flex items-center gap-3">
          <CopyLinkButton url={publicUrl} />
          <Link href="/dashboard" className={buttonClasses("secondary")}>
            Dashboard
          </Link>
          <Link href="/configuracoes" className={buttonClasses("secondary")}>
            Configurações
          </Link>
          <Link href="/canais" className={buttonClasses("secondary")}>
            Canais
          </Link>
          <form action={signOut}>
            <Button variant="secondary">Sair</Button>
          </form>
        </div>
      </header>

      <DealsBoard pipelines={pipelines} initialDeals={deals} canais={canais} />
    </main>
  );
}
