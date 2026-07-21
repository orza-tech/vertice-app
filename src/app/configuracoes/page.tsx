import Link from "next/link";
import { getPipelinesWithDetails, getHandoffs, createPipeline } from "@/lib/crm/config-actions";
import { VerticeLogo } from "@/components/VerticeLogo";
import { PipelineConfigCard } from "@/components/crm/PipelineConfigCard";
import { HandoffsConfig } from "@/components/crm/HandoffsConfig";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { TextInput } from "@/components/ui/Field";

export const metadata = {
  title: "Configurações do CRM | Vértice",
};

export default async function ConfiguracoesPage() {
  const [pipelines, handoffs] = await Promise.all([
    getPipelinesWithDetails(),
    getHandoffs(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <VerticeLogo size="sm" className="items-start text-left" />
        <Link href="/leads" className={buttonClasses("secondary")}>
          Voltar para negócios
        </Link>
      </header>

      <div>
        <h1 className="text-lg font-semibold">Pipelines</h1>
        <p className="mt-1 text-sm text-vertice-ink/60">
          Configure os pipelines, estágios e campos personalizados do seu CRM.
        </p>
      </div>

      <form action={createPipeline} className="flex gap-3">
        <TextInput name="nome" required placeholder="Nome do novo pipeline" className="flex-1" />
        <Button type="submit" variant="accent" className="whitespace-nowrap">
          + Pipeline
        </Button>
      </form>

      {pipelines.map((pipeline) => (
        <PipelineConfigCard key={pipeline.id} pipeline={pipeline} />
      ))}

      <HandoffsConfig pipelines={pipelines} handoffs={handoffs} />
    </main>
  );
}
