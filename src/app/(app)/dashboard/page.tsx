import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals, getStageEvents } from "@/lib/crm/deals-actions";
import { Dashboard } from "@/components/crm/Dashboard";

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
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-vertice-ink/68">
          Visão geral dos funis comerciais: valor em aberto, conversão e histórico.
        </p>
      </div>

      <Dashboard pipelines={pipelines} deals={deals} stageEvents={stageEvents} />
    </main>
  );
}
