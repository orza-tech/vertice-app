export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <span className="rounded-full bg-vertice-ink/10 px-3 py-1 text-xs uppercase tracking-wide text-vertice-ink/60">
        Em breve
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-vertice-ink/68">{description}</p>
    </main>
  );
}
