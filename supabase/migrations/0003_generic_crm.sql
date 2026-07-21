-- Vértice: CRM genérico (pipelines/estágios/campos configuráveis)
--
-- Esta migração NÃO apaga a tabela "leads" original — ela é renomeada
-- para "leads_legacy_backup" ao final, como rede de segurança. Depois
-- de conferir que os dados migraram corretamente, você pode apagá-la
-- manualmente quando quiser (não é feito aqui de propósito).

-- === 1. Novas tabelas de configuração ===================================

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  nome text not null,
  ordem int not null default 0,
  cor text not null default 'cinza',
  tipo text not null default 'aberto' check (tipo in ('aberto', 'ganho', 'perdido'))
);

create table if not exists public.pipeline_handoffs (
  id uuid primary key default gen_random_uuid(),
  from_stage_id uuid not null references public.stages(id) on delete cascade,
  to_stage_id uuid not null references public.stages(id) on delete cascade
);

create table if not exists public.field_definitions (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('texto', 'numero', 'selecao', 'data')),
  opcoes jsonb,
  obrigatorio boolean not null default false,
  ordem int not null default 0
);

-- === 2. Tabela de negócios (substitui "leads") ===========================

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id),
  stage_id uuid not null references public.stages(id),
  nome_contato text not null,
  nome_empresa text not null,
  email text not null,
  whatsapp text not null,
  valor numeric not null default 0,
  canal text not null default 'Evento',
  campos_personalizados jsonb not null default '{}'::jsonb,
  origem text not null default 'manual' check (origem in ('manual', 'publico')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id),
  nome_contato text not null,
  nome_empresa text not null,
  email text not null,
  whatsapp text not null,
  valor_fechado numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.stage_events (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id),
  stage_id uuid not null references public.stages(id),
  valor numeric not null default 0,
  created_at timestamptz not null default now()
);

-- === 3. RLS ===============================================================

alter table public.pipelines enable row level security;
alter table public.stages enable row level security;
alter table public.pipeline_handoffs enable row level security;
alter table public.field_definitions enable row level security;
alter table public.deals enable row level security;
alter table public.customers enable row level security;
alter table public.stage_events enable row level security;

create policy "Usuários autenticados gerenciam pipelines"
  on public.pipelines for all to authenticated using (true) with check (true);
create policy "Usuários autenticados gerenciam estágios"
  on public.stages for all to authenticated using (true) with check (true);
create policy "Usuários autenticados gerenciam handoffs"
  on public.pipeline_handoffs for all to authenticated using (true) with check (true);
create policy "Usuários autenticados gerenciam campos"
  on public.field_definitions for all to authenticated using (true) with check (true);

create policy "Qualquer um pode cadastrar negócio"
  on public.deals for insert to anon, authenticated with check (true);
create policy "Usuários autenticados veem negócios"
  on public.deals for select to authenticated using (true);
create policy "Usuários autenticados atualizam negócios"
  on public.deals for update to authenticated using (true) with check (true);

create policy "Usuários autenticados gerenciam clientes"
  on public.customers for all to authenticated using (true) with check (true);

create policy "Sistema registra eventos de estágio"
  on public.stage_events for insert to anon, authenticated with check (true);
create policy "Usuários autenticados veem eventos de estágio"
  on public.stage_events for select to authenticated using (true);

-- === 4. Seed dos dois pipelines migrados dos funis atuais ================

insert into public.pipelines (id, nome, ordem) values
  ('8a134763-de82-457a-988a-b042206ba9eb', 'Funil de Oportunidade (SDR)', 0),
  ('89b161a8-7ea0-4c6c-9f77-607e91640a2e', 'Funil de Lead (Closer)', 1);

insert into public.stages (id, pipeline_id, nome, ordem, cor, tipo) values
  ('5f476125-bd3d-4d6f-bf02-fffb2c0d5698', '8a134763-de82-457a-988a-b042206ba9eb', 'Novo', 0, 'cinza', 'aberto'),
  ('fcc75cd3-d380-4851-8734-b9f258bd39b5', '8a134763-de82-457a-988a-b042206ba9eb', 'Contatado', 1, 'azul', 'aberto'),
  ('acd4d739-60ca-4b93-862e-01a15249c8f0', '8a134763-de82-457a-988a-b042206ba9eb', 'Qualificado', 2, 'teal', 'aberto'),
  ('f59a825d-327c-4fea-8f55-027597e31a3a', '8a134763-de82-457a-988a-b042206ba9eb', 'Não qualificado', 3, 'cinza', 'perdido'),
  ('83b6c88c-910b-42c1-b0cc-9d2cdb68798b', '89b161a8-7ea0-4c6c-9f77-607e91640a2e', 'Reunião agendada', 0, 'ambar', 'aberto'),
  ('40726cef-f7bb-43d5-9472-5183fb0a51aa', '89b161a8-7ea0-4c6c-9f77-607e91640a2e', 'Negociação', 1, 'roxo', 'aberto'),
  ('1592854a-b1c0-48ff-90be-52ae1fb27869', '89b161a8-7ea0-4c6c-9f77-607e91640a2e', 'Fechado', 2, 'verde', 'ganho'),
  ('76223641-fc30-448f-87af-5c3ded136adb', '89b161a8-7ea0-4c6c-9f77-607e91640a2e', 'Perdido', 3, 'vermelho', 'perdido');

insert into public.pipeline_handoffs (from_stage_id, to_stage_id) values
  ('acd4d739-60ca-4b93-862e-01a15249c8f0', '83b6c88c-910b-42c1-b0cc-9d2cdb68798b');

insert into public.field_definitions (id, pipeline_id, nome, tipo, opcoes, obrigatorio, ordem) values
  ('eadfd573-5e31-4b01-8299-72e541cdfa85', '8a134763-de82-457a-988a-b042206ba9eb', 'Faturamento mensal', 'selecao',
    '["Até R$ 50 mil", "R$ 50 mil a R$ 100 mil", "R$ 100 mil a R$ 300 mil", "R$ 300 mil a R$ 500 mil", "R$ 500 mil a R$ 1 milhão", "Acima de R$ 1 milhão"]'::jsonb,
    false, 0),
  ('debb2001-3790-49cb-a980-008b0b2909ca', '8a134763-de82-457a-988a-b042206ba9eb', 'Quantidade de funcionários', 'selecao',
    '["1 a 5", "6 a 10", "11 a 25", "26 a 50", "51 a 100", "Mais de 100"]'::jsonb,
    false, 1),
  ('939fb1fe-c19b-45ae-b96f-27c455274157', '8a134763-de82-457a-988a-b042206ba9eb', 'Tempo de empresa', 'selecao',
    '["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"]'::jsonb,
    false, 2);

-- === 5. Migração dos dados existentes de "leads" para "deals" ===========
-- Só roda se a tabela "leads" ainda existir com esse nome (idempotente:
-- se você já rodou esta migração antes, o bloco é ignorado).

do $$
declare
  status_to_stage jsonb := '{
    "novo": "5f476125-bd3d-4d6f-bf02-fffb2c0d5698",
    "contatado": "fcc75cd3-d380-4851-8734-b9f258bd39b5",
    "qualificado": "acd4d739-60ca-4b93-862e-01a15249c8f0",
    "nao_qualificado": "f59a825d-327c-4fea-8f55-027597e31a3a",
    "reuniao_agendada": "83b6c88c-910b-42c1-b0cc-9d2cdb68798b",
    "negociacao": "40726cef-f7bb-43d5-9472-5183fb0a51aa",
    "fechado": "1592854a-b1c0-48ff-90be-52ae1fb27869",
    "perdido": "76223641-fc30-448f-87af-5c3ded136adb"
  }'::jsonb;
  status_to_pipeline jsonb := '{
    "novo": "8a134763-de82-457a-988a-b042206ba9eb",
    "contatado": "8a134763-de82-457a-988a-b042206ba9eb",
    "qualificado": "8a134763-de82-457a-988a-b042206ba9eb",
    "nao_qualificado": "8a134763-de82-457a-988a-b042206ba9eb",
    "reuniao_agendada": "89b161a8-7ea0-4c6c-9f77-607e91640a2e",
    "negociacao": "89b161a8-7ea0-4c6c-9f77-607e91640a2e",
    "fechado": "89b161a8-7ea0-4c6c-9f77-607e91640a2e",
    "perdido": "89b161a8-7ea0-4c6c-9f77-607e91640a2e"
  }'::jsonb;
  faturamento_labels jsonb := '{
    "ate_50k": "Até R$ 50 mil", "50k_100k": "R$ 50 mil a R$ 100 mil",
    "100k_300k": "R$ 100 mil a R$ 300 mil", "300k_500k": "R$ 300 mil a R$ 500 mil",
    "500k_1m": "R$ 500 mil a R$ 1 milhão", "acima_1m": "Acima de R$ 1 milhão"
  }'::jsonb;
  funcionarios_labels jsonb := '{
    "1_5": "1 a 5", "6_10": "6 a 10", "11_25": "11 a 25",
    "26_50": "26 a 50", "51_100": "51 a 100", "mais_100": "Mais de 100"
  }'::jsonb;
  tempo_labels jsonb := '{
    "menos_1_ano": "Menos de 1 ano", "1_3_anos": "1 a 3 anos", "3_5_anos": "3 a 5 anos",
    "5_10_anos": "5 a 10 anos", "mais_10_anos": "Mais de 10 anos"
  }'::jsonb;
  lead record;
  new_deal_id uuid;
begin
  if to_regclass('public.leads') is null then
    return;
  end if;

  for lead in select * from public.leads loop
    new_deal_id := gen_random_uuid();

    insert into public.deals (
      id, pipeline_id, stage_id, nome_contato, nome_empresa, email, whatsapp,
      valor, canal, campos_personalizados, origem, created_at, updated_at
    ) values (
      new_deal_id,
      (status_to_pipeline ->> lead.status)::uuid,
      (status_to_stage ->> lead.status)::uuid,
      lead.nome_contato, lead.nome_empresa, lead.email, lead.whatsapp,
      0,
      coalesce(lead.canal, 'Evento'),
      jsonb_build_object(
        'eadfd573-5e31-4b01-8299-72e541cdfa85', faturamento_labels ->> lead.faturamento_range,
        'debb2001-3790-49cb-a980-008b0b2909ca', funcionarios_labels ->> lead.funcionarios_range,
        '939fb1fe-c19b-45ae-b96f-27c455274157', tempo_labels ->> lead.tempo_empresa_range
      ),
      lead.origem,
      lead.created_at,
      lead.created_at
    );

    insert into public.stage_events (deal_id, pipeline_id, stage_id, valor, created_at)
    values (
      new_deal_id,
      (status_to_pipeline ->> lead.status)::uuid,
      (status_to_stage ->> lead.status)::uuid,
      0,
      lead.created_at
    );

    if lead.status = 'fechado' then
      insert into public.customers (deal_id, nome_contato, nome_empresa, email, whatsapp, valor_fechado)
      values (new_deal_id, lead.nome_contato, lead.nome_empresa, lead.email, lead.whatsapp, 0);
    end if;
  end loop;

  alter table public.leads rename to leads_legacy_backup;
end $$;
