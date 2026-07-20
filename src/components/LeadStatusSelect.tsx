"use client";

import { STATUS_OPTIONS, STATUS_COLORS } from "@/lib/leads/schema";

export function LeadStatusSelect({
  status,
  onChange,
}: {
  status: string;
  onChange: (next: string) => void;
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-vertice-teal ${
        STATUS_COLORS[status] ?? "bg-vertice-ink/10 text-vertice-ink/70"
      }`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
