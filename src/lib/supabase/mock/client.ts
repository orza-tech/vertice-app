import { cookies } from "next/headers";
import { readTable, writeTable } from "@/lib/supabase/mock/store";
import { MOCK_SESSION_COOKIE, MOCK_TEAM_USERS } from "@/lib/supabase/mock/constants";

type Row = Record<string, unknown> & { id: string; created_at: string };

export async function createMockClient() {
  const cookieStore = await cookies();

  return {
    from(table: string) {
      return {
        select(_columns?: string) {
          void _columns;
          return {
            async order(column: string, opts?: { ascending?: boolean }) {
              const rows = readTable<Row>(table).sort((a, b) => {
                const av = String(a[column]);
                const bv = String(b[column]);
                if (av === bv) return 0;
                const dir = opts?.ascending === false ? -1 : 1;
                return av > bv ? dir : -dir;
              });
              return { data: rows, error: null as null };
            },
          };
        },
        async insert(row: Record<string, unknown>) {
          const rows = readTable<Row>(table);
          rows.push({
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...row,
          } as Row);
          writeTable(table, rows);
          return { error: null as null };
        },
        update(patch: Record<string, unknown>) {
          return {
            async eq(column: string, value: unknown) {
              const rows = readTable<Row>(table);
              const idx = rows.findIndex((r) => r[column] === value);
              if (idx === -1) {
                return { error: { message: "Registro não encontrado" } };
              }
              rows[idx] = { ...rows[idx], ...patch };
              writeTable(table, rows);
              return { error: null as null };
            },
          };
        },
        delete() {
          return {
            async eq(column: string, value: unknown) {
              const rows = readTable<Row>(table);
              writeTable(
                table,
                rows.filter((r) => r[column] !== value)
              );
              return { error: null as null };
            },
          };
        },
      };
    },
    auth: {
      async getUser() {
        const session = cookieStore.get(MOCK_SESSION_COOKIE)?.value;
        return { data: { user: session ? { id: session, email: session } : null } };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const match = MOCK_TEAM_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (!match) {
          return { error: { message: "Credenciais inválidas" } };
        }
        cookieStore.set(MOCK_SESSION_COOKIE, email, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        });
        return { error: null as null };
      },
      async signOut() {
        cookieStore.delete(MOCK_SESSION_COOKIE);
        return { error: null as null };
      },
    },
  };
}
