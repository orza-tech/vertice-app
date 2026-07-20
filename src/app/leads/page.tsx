import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCanais } from "@/lib/canais/actions";
import { AddLeadModal } from "@/components/AddLeadModal";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { LeadsBoard } from "@/components/LeadsBoard";
import { VerticeLogo } from "@/components/VerticeLogo";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import type { Lead } from "@/lib/leads/schema";

export const metadata = {
  title: "Leads | Vértice",
};

async function getPublicCadastroUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}/cadastro`;
}

export default async function LeadsPage() {
  const supabase = await createClient();
  const [{ data: leads }, publicUrl, canais] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false }),
    getPublicCadastroUrl(),
    getCanais(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <VerticeLogo size="sm" className="items-start text-left" />
        <div className="flex items-center gap-3">
          <AddLeadModal canais={canais} />
          <CopyLinkButton url={publicUrl} />
          <Link href="/canais" className={buttonClasses("secondary")}>
            Canais
          </Link>
          <form action={signOut}>
            <Button variant="secondary">Sair</Button>
          </form>
        </div>
      </header>

      <LeadsBoard initialLeads={(leads ?? []) as Lead[]} />
    </main>
  );
}
