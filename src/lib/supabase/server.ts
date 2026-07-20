import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createMockClient } from "@/lib/supabase/mock/client";

export async function createClient() {
  if (process.env.USE_MOCK_DATA === "true") {
    return createMockClient();
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
