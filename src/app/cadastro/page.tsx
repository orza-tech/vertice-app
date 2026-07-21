import { CadastroPublico } from "@/components/CadastroPublico";
import { AuthShell } from "@/components/ui/AuthShell";
import { getPublicTargetPipeline } from "@/lib/crm/config-actions";

export const metadata = {
  title: "Cadastro | Vértice",
};

export default async function CadastroPublicoPage() {
  const pipeline = await getPublicTargetPipeline();

  return (
    <AuthShell maxWidth="max-w-md">
      <CadastroPublico fields={pipeline?.fields ?? []} />
    </AuthShell>
  );
}
