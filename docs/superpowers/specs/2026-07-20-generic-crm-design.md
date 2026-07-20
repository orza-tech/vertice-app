# CRM genérico e configurável — Design

## Contexto e motivação

O módulo de leads/CRM construído até agora tem dois funis fixos ("Funil de
Oportunidade (SDR)" e "Funil de Lead (Closer)") com estágios e campos
codificados diretamente (`FUNIS`, `STATUS_OPTIONS`, `FATURAMENTO_OPTIONS`
etc. em `src/lib/leads/schema.ts`). Luis pediu para generalizar isso: um
motor de CRM onde pipelines, estágios e campos são configuráveis pela
própria equipe, sem depender de mudanças de código a cada ajuste.

## Decisões já tomadas (não reabrir sem motivo forte)

- **Single-tenant.** Sem necessidade de isolar múltiplas empresas — é só
  para a operação da Vértice. Nenhuma preparação de schema para
  multi-tenant é necessária.
- **WhatsApp fora de escopo.** A integração com WhatsApp Business (API
  oficial, via Meta ou um BSP como Twilio/Zenvia/360dialog) fica para um
  projeto futuro, quando o provedor for escolhido. Este design não
  assume nem bloqueia essa integração.
- **Migração automática**: os dois funis atuais viram os dois primeiros
  pipelines já configurados no novo modelo, no dia da troca. Faturamento,
  Funcionários e Tempo de empresa (hoje campos fixos) migram como campos
  personalizados do pipeline "Oportunidade (SDR)".
- **Handoff real entre pipelines**: passar de "Qualificado" (SDR) para
  "Reunião agendada" (Closer) move o negócio de um pipeline para o outro
  de verdade — não são apenas duas abas sobre a mesma lista de estágios,
  como é hoje.
- **Saída do pipeline gera cliente**: ao entrar em um estágio do tipo
  "ganho", o sistema cria automaticamente um registro simples de cliente,
  que servirá de ponto de partida para o futuro módulo de Sucesso do
  Cliente (fora de escopo aqui).

## Modelo de dados

### `pipelines`
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| nome | text | ex: "Funil de Oportunidade (SDR)" |
| ordem | int | ordem de exibição das abas |
| created_at | timestamptz | |

### `stages` (estágios de um pipeline)
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| pipeline_id | uuid | fk → pipelines |
| nome | text | ex: "Qualificado" |
| ordem | int | |
| cor | text | reaproveita a paleta de cores já usada nos badges de status |
| tipo | text | `aberto` \| `ganho` \| `perdido` |

`tipo` decide o comportamento automático: `ganho` dispara a criação de
cliente; `perdido` só marca o negócio como encerrado sem sucesso.

### `pipeline_handoffs` (entregas entre pipelines)
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| from_stage_id | uuid | fk → stages (estágio de saída) |
| to_stage_id | uuid | fk → stages (estágio de entrada no pipeline seguinte) |

Ao mover um negócio para um `from_stage_id` que tem handoff configurado,
o negócio é automaticamente re-atribuído ao pipeline e estágio de
destino. Um estágio pode não ter handoff (fim de linha normal, ex.
"Fechado" ou "Perdido").

### `field_definitions` (campos personalizados por pipeline)
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| pipeline_id | uuid | fk → pipelines |
| nome | text | ex: "Faturamento mensal" |
| tipo | text | `texto` \| `numero` \| `selecao` \| `data` |
| opcoes | jsonb | lista de opções, só para `tipo = selecao` |
| obrigatorio | boolean | default `false` |
| ordem | int | |

### `deals` (substitui a tabela `leads`)
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| pipeline_id | uuid | fk → pipelines (pipeline atual) |
| stage_id | uuid | fk → stages (estágio atual) |
| nome_contato | text | campo universal |
| nome_empresa | text | campo universal |
| email | text | campo universal |
| whatsapp | text | campo universal |
| valor | numeric | **novo campo**, obrigatório (default 0) — valor do negócio em R$, alimenta o dashboard |
| canal | text | campo universal (reaproveita a tabela `canais` já existente) |
| campos_personalizados | jsonb | valores dos `field_definitions` do pipeline atual |
| origem | text | `manual` \| `publico` (mantém o que já existe) |
| created_at / updated_at | timestamptz | |

`campos_personalizados` guarda os valores de todos os pipelines por onde
o negócio já passou (nada é apagado num handoff). Ao entrar num novo
pipeline via handoff, os campos do pipeline de destino começam vazios
para aquele negócio; os valores preenchidos no pipeline de origem
continuam salvos e podem ser consultados no histórico, mas não aparecem
no formulário do novo pipeline (que só mostra os campos definidos para
ele).

### `customers` (gerado automaticamente)
| campo | tipo | notas |
|---|---|---|
| id | uuid | pk |
| deal_id | uuid | fk → deals (origem) |
| nome_contato | text | |
| nome_empresa | text | |
| email | text | |
| whatsapp | text | |
| valor_fechado | numeric | |
| created_at | timestamptz | |

Criado uma única vez por negócio (não duplica se o negócio sair e voltar
a passar por um estágio "ganho").

## Telas

### Configurações do CRM (nova área)
- Gerenciar pipelines: criar, renomear, reordenar.
- Gerenciar estágios de um pipeline: criar, renomear, reordenar, definir
  cor e tipo (aberto/ganho/perdido).
- Gerenciar campos personalizados de um pipeline: criar, tipo, opções
  (se seleção), obrigatório ou não, reordenar.
- Gerenciar handoffs: escolher estágio de saída → pipeline + estágio de
  entrada de destino.
- Reaproveita o padrão visual (Button/Field/Badge) já usado na tela de
  Canais.

### Painel de negócios (substitui o painel de leads)
- Uma aba por pipeline, gerada dinamicamente a partir do banco (não mais
  fixo em "SDR"/"Closer").
- Lista e kanban dentro de cada pipeline, como já existe hoje; colunas e
  campos exibidos se ajustam aos estágios/campos daquele pipeline.
- Mover um negócio para um estágio com handoff configurado: some do
  pipeline atual, aparece no pipeline seguinte, com uma notificação
  ("Negócio movido para o Closer").
- Mover para um estágio "ganho": notificação de que um cliente foi
  criado a partir do negócio.

### Dashboard (nova tela)
- Por pipeline: valor total por estágio, quantidade de negócios por
  estágio, taxa de conversão entre estágios consecutivos.
- Visão geral: ganho/perdido (R$ e quantidade) por período (semana/mês),
  com seletor de período.

## Casos de borda e regras

- **Apagar estágio/pipeline com negócios dentro**: bloqueado até os
  negócios serem movidos para outro lugar.
- **Mudar o tipo de um campo com dados existentes**: permitido; valores
  antigos incompatíveis com o novo tipo ficam salvos como estão e
  aparecem em branco no formulário até corrigidos manualmente — nada é
  apagado automaticamente.
- **Negócio passa por "ganho" mais de uma vez**: cliente é criado apenas
  na primeira vez; não duplica.
- **Canal removido da lista de canais**: comportamento já existente é
  mantido — o texto do canal fica gravado no negócio mesmo que a opção
  seja removida depois.
- **Campos personalizados são opcionais por padrão**, com opção de
  marcar como obrigatório campo a campo.

## Fora de escopo (explicitamente)

- Integração com WhatsApp Business.
- Qualquer preparação de schema para multi-tenant.
- O módulo completo de Sucesso do Cliente (o registro em `customers`
  criado aqui é só o ponto de partida).

## Testes

Sem suíte automatizada formal — dado o tamanho da operação (2 pessoas),
isso seria esforço desproporcional. Verificação manual no navegador
cobrindo: criar pipeline/estágio/campo, mover negócio entre estágios,
mover negócio via handoff entre pipelines, negócio chegando a "ganho" e
conferindo a criação do cliente, e os números do dashboard batendo com o
que está no kanban.
