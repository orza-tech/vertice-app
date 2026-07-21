import Link from "next/link";
import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals, getStageEvents } from "@/lib/crm/deals-actions";
import { VerticeLogo } from "@/components/VerticeLogo";
import { Dashboard } from "@/components/crm/Dashboard";
import { buttonClasses } from "@/components/ui/buttonStyles";

export const metadata = {
  title: "Dashboard | Vértice",
};

export default async function DashboardPage() {
  const [pipelines, deals, stageEvents] = await Promise.all([
    getPipelinesWithDetails(),
    getDeals(),
    getStageEvents(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <VerticeLogo size="sm" className="items-start text-left" />
        <Link href="/leads" className={buttonClasses("secondary")}>
          Voltar para negócios
        </Link>
      </header>

      <Dashboard pipelines={pipelines} deals={deals} stageEvents={stageEvents} />
    </main>
  );
}
