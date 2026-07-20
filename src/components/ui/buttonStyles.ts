export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost-danger";

const base =
  "inline-flex items-center justify-center rounded-lg text-sm transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vertice-teal focus-visible:ring-offset-2 focus-visible:ring-offset-vertice-bg disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "px-4 py-3 font-semibold uppercase tracking-wide bg-vertice-ink text-vertice-bg hover:bg-vertice-teal-deep active:bg-vertice-teal-pressed",
  accent:
    "px-4 py-2.5 font-semibold uppercase tracking-wide bg-vertice-teal-deep text-white hover:bg-vertice-ink active:bg-vertice-ink",
  secondary:
    "px-4 py-2.5 border border-vertice-border-strong text-vertice-ink/70 hover:border-vertice-ink/40 hover:text-vertice-ink active:bg-vertice-ink/5",
  "ghost-danger":
    "px-2 py-1 text-xs text-vertice-ink/40 hover:text-vertice-danger active:text-vertice-danger",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}
