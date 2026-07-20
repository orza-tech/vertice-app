import type { ReactNode } from "react";

const variants = {
  error: "bg-vertice-danger-subtle text-vertice-danger",
  success: "bg-vertice-teal-subtle text-vertice-teal-pressed",
} as const;

export function Alert({
  variant,
  children,
}: {
  variant: keyof typeof variants;
  children: ReactNode;
}) {
  return (
    <p role="status" className={`rounded-lg px-4 py-2 text-sm ${variants[variant]}`}>
      {children}
    </p>
  );
}
