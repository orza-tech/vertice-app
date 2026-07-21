import Link from "next/link";
import type { ReactNode } from "react";
import { VerticeLogo } from "@/components/VerticeLogo";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { signOut } from "@/lib/auth/actions";

const NAV_ITEMS = [
  { href: "/leads", label: "Negócios" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/configuracoes", label: "Configurações" },
  { href: "/canais", label: "Canais" },
] as const;

export function AppHeader({
  active,
  extra,
}: {
  active: (typeof NAV_ITEMS)[number]["href"];
  extra?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <VerticeLogo size="sm" className="items-start text-left" />
      <nav className="flex flex-wrap items-center gap-3">
        {extra}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active === item.href ? "page" : undefined}
            className={buttonClasses(active === item.href ? "primary" : "secondary")}
          >
            {item.label}
          </Link>
        ))}
        <form action={signOut}>
          <Button variant="secondary">Sair</Button>
        </form>
      </nav>
    </header>
  );
}
