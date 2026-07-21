import { getPipelinesWithDetails } from "@/lib/crm/config-actions";
import { getDeals, getStageEvents } from "@/lib/crm/deals-actions";
import { Dashboard } from "@/components/crm/Dashboard";
import { AppHeader } from "@/components/AppHeader";

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
      <AppHeader active="/dashboard" />

      <Dashboard pipelines={pipelines} deals={deals} stageEvents={stageEvents} />
    </main>
  );
}
