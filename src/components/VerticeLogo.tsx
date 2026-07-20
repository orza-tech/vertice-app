export function VerticeLogo({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M22 2L4 34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 2L40 34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 2L13 34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 2L31 34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif tracking-[0.3em] text-2xl">VÉRTICE</span>
      <span className="text-[10px] tracking-[0.25em] uppercase text-vertice-ink/60">
        Mentoria Estratégica
      </span>
    </div>
  );
}
