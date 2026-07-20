const SIZES = {
  sm: { mark: 32, word: "text-lg", caption: "text-[8px]", gap: "gap-1.5" },
  md: { mark: 44, word: "text-2xl", caption: "text-[10px]", gap: "gap-2" },
  lg: { mark: 56, word: "text-3xl", caption: "text-[11px]", gap: "gap-2.5" },
} as const;

export function VerticeLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const { mark, word, caption, gap } = SIZES[size];

  return (
    <div className={`flex flex-col items-center ${gap} ${className ?? ""}`}>
      <svg
        width={mark}
        height={mark * 0.82}
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M22 2L4 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 2L13 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 2L22 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 2L31 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 2L40 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className={`font-serif tracking-[0.3em] ${word}`}>VÉRTICE</span>
      <span className={`${caption} tracking-[0.25em] uppercase text-vertice-ink/55`}>
        Mentoria Estratégica
      </span>
    </div>
  );
}
