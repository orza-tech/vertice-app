-- Vértice: tabela de leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome_contato text not null,
  nome_empresa text not null,
  email text not null,
  whatsapp text not null,
  faturamento_range text not null check (faturamento_range in (
    'ate_50k', '50k_100k', '100k_300k', '300k_500k', '500k_1m', 'acima_1m'
  )),
  funcionarios_range text not null check (funcionarios_range in (
    '1_5', '6_10', '11_25', '26_50', '51_100', 'mais_100'
  )),
  tempo_empresa_range text not null check (tempo_empresa_range in (
    'menos_1_ano', '1_3_anos', '3_5_anos', '5_10_anos', 'mais_10_anos'
  )),
  origem text not null default 'manual' check (origem in ('manual', 'publico')),
  status text not null default 'novo' check (status in (
    'novo', 'contatado', 'qualificado', 'nao_qualificado',
    'reuniao_agendada', 'negociacao', 'fechado', 'perdido'
  ))
);

alter table public.leads enable row level security;

-- Qualquer pessoa (autenticada ou não) pode inserir um lead —
-- necessário para o formulário público via QR code em eventos.
create policy "Qualquer um pode cadastrar lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Apenas usuários autenticados (equipe Vértice) podem ler/listar leads.
create policy "Usuários autenticados podem ver leads"
  on public.leads for select
  to authenticated
  using (true);

-- Apenas usuários autenticados (equipe Vértice) podem atualizar o status do lead.
create policy "Usuários autenticados podem atualizar leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);
