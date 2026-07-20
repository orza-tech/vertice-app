import type { ReactNode } from "react";

const tones = {
  neutral: "bg-vertice-ink/5 text-vertice-ink/60",
  accent: "bg-vertice-teal-subtle text-vertice-teal-pressed",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  );
}
