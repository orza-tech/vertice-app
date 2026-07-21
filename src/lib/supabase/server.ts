import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createMockClient } from "@/lib/supabase/mock/client";

export async function createClient() {
  if (process.env.USE_MOCK_DATA === "true") {
    // O cliente mock imita só o subconjunto da API do Supabase que
    // usamos. O cast evita que o TypeScript tente unificar o tipo
    // genérico recursivo do mock com o tipo (também genérico e
    // profundo) do supabase-js real, o que trava o checker.
    return createMockClient() as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll foi chamado de um Server Component; ignorável
            // porque o middleware já cuida do refresh de sessão.
          }
        },
      },
    }
  );
}
