export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-9 w-28 animate-pulse rounded-md bg-vertice-ink/10" />
        <div className="h-9 w-72 animate-pulse rounded-md bg-vertice-ink/10" />
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-vertice-ink/5" />
      <div className="h-48 animate-pulse rounded-2xl bg-vertice-ink/5" />
    </main>
  );
}
