import type { ReactNode } from "react";

export function AuthShell({
  children,
  maxWidth = "max-w-sm",
}: {
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-vertice-ink px-4 py-12">
      <svg
        className="pointer-events-none absolute -bottom-24 left-1/2 h-[70vh] w-auto -translate-x-1/2 text-vertice-teal/[0.07]"
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M22 2L4 34" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M22 2L13 34" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M22 2L22 34" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M22 2L31 34" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M22 2L40 34" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
      </svg>
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-vertice-bg p-8 shadow-xl shadow-black/30`}
      >
        {children}
      </div>
    </main>
  );
}
