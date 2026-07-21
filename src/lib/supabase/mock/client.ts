import { cookies } from "next/headers";
import { readTable, writeTable } from "@/lib/supabase/mock/store";
import { MOCK_SESSION_COOKIE, MOCK_TEAM_USERS } from "@/lib/supabase/mock/constants";

type Row = Record<string, unknown> & { id: string; created_at: string };
type MockUser = { email: string; password: string };

export async function createMockClient() {
  const cookieStore = await cookies();

  return {
    from(table: string) {
      return {
        select(_columns?: string) {
          void _columns;
          let rows = readTable<Row>(table);

          type SelectResult = { data: Row[]; error: null };
          type Builder = {
            eq(column: string, value: unknown): Builder;
            order(column: string, opts?: { ascending?: boolean }): Builder;
            then<T1, T2 = never>(
              onFulfilled: (value: SelectResult) => T1 | PromiseLike<T1>,
              onRejected?: (reason: unknown) => T2 | PromiseLike<T2>
            ): Promise<T1 | T2>;
          };

          const builder: Builder = {
            eq(column, value) {
              rows = rows.filter((r) => r[column] === value);
              return builder;
            },
            order(column, opts) {
              rows = [...rows].sort((a, b) => {
                const av = String(a[column]);
                const bv = String(b[column]);
                if (av === bv) return 0;
                const dir = opts?.ascending === false ? -1 : 1;
                return av > bv ? dir : -dir;
              });
              return builder;
            },
            then(onFulfilled, onRejected) {
              return Promise.resolve({ data: rows, error: null }).then(
                onFulfilled,
                onRejected
              );
            },
          };
          return builder;
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
        const signedUpUsers = readTable<MockUser>("mock_team_users");
        const match = [...MOCK_TEAM_USERS, ...signedUpUsers].find(
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
      async signUp({ email, password }: { email: string; password: string }) {
        const signedUpUsers = readTable<MockUser>("mock_team_users");
        if (
          [...MOCK_TEAM_USERS, ...signedUpUsers].some((u) => u.email === email)
        ) {
          return {
            data: { session: null },
            error: { message: "E-mail já cadastrado" },
          };
        }
        signedUpUsers.push({ email, password });
        writeTable("mock_team_users", signedUpUsers);
        cookieStore.set(MOCK_SESSION_COOKIE, email, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        });
        return { data: { session: { user: { email } } }, error: null as null };
      },
      async signOut() {
        cookieStore.delete(MOCK_SESSION_COOKIE);
        return { error: null as null };
      },
    },
  };
}
