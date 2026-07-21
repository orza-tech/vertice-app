"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { VerticeLogo } from "@/components/VerticeLogo";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/auth/actions";
import { NAV_SECTIONS } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  active,
  onNavigate,
  comingSoon,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate: () => void;
  comingSoon?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
        active
          ? "bg-vertice-ink font-medium text-vertice-bg"
          : "text-vertice-ink/70 hover:bg-vertice-ink/5 hover:text-vertice-ink"
      }`}
    >
      <span>{children}</span>
      {comingSoon && (
        <span className="rounded-full bg-vertice-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-vertice-ink/60">
          Em breve
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto px-5 py-8">
      <VerticeLogo size="sm" className="items-start text-left" />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_SECTIONS.map((section) => {
          if (section.items) {
            return (
              <div key={section.label} className="flex flex-col gap-0.5 pb-3">
                <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-vertice-ink/50">
                  {section.label}
                </span>
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    active={isActive(pathname, item.href)}
                    onNavigate={onNavigate}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            );
          }

          return (
            <NavLink
              key={section.label}
              href={section.href ?? "#"}
              active={section.href ? isActive(pathname, section.href) : false}
              onNavigate={onNavigate}
              comingSoon={section.comingSoon}
            >
              {section.label}
            </NavLink>
          );
        })}
      </nav>

      <form action={signOut}>
        <Button variant="secondary" className="w-full">
          Sair
        </Button>
      </form>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-vertice-border bg-vertice-bg px-4 py-3 md:hidden">
        <VerticeLogo size="sm" className="items-start text-left" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-vertice-ink transition-colors duration-150 hover:bg-vertice-ink/5"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-vertice-border bg-vertice-surface md:block">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 md:hidden"
        >
          <div
            className="animate-reveal absolute inset-0 bg-vertice-ink/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="animate-reveal absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-vertice-surface shadow-xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
