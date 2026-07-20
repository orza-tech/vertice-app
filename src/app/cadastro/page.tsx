import { CadastroPublico } from "@/components/CadastroPublico";
import { AuthShell } from "@/components/ui/AuthShell";

export const metadata = {
  title: "Cadastro | Vértice",
};

export default function CadastroPublicoPage() {
  return (
    <AuthShell maxWidth="max-w-md">
      <CadastroPublico />
    </AuthShell>
  );
}
