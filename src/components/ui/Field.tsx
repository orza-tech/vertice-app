import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-lg border bg-vertice-surface px-4 py-2.5 text-sm text-vertice-ink placeholder:text-vertice-ink/40 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-vertice-teal disabled:opacity-50";

function borderFor(hasError?: boolean) {
  return hasError
    ? "border-vertice-danger focus:ring-vertice-danger"
    : "border-vertice-border-strong";
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="text-sm font-medium text-vertice-ink/80" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-vertice-danger">{children}</p>;
}

export function TextInput({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input className={`${fieldBase} ${borderFor(error)} ${className ?? ""}`} {...props} />
  );
}

export function SelectInput({
  error,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select className={`${fieldBase} ${borderFor(error)} ${className ?? ""}`} {...props} />
  );
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}
