import { CadastroPublico } from "@/components/CadastroPublico";

export const metadata = {
  title: "Cadastro | Vértice",
};

export default function CadastroPublicoPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-vertice-ink px-4 py-12">
      <CadastroPublico />
    </main>
  );
}
