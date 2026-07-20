-- Vértice: canais de origem das oportunidades (Evento, Indicação, etc.)
create table if not exists public.canais (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

insert into public.canais (nome) values ('Evento')
  on conflict (nome) do nothing;

alter table public.canais enable row level security;

create policy "Usuários autenticados podem gerenciar canais"
  on public.canais for all
  to authenticated
  using (true)
  with check (true);

alter table public.leads add column if not exists canal text not null default 'Evento';
