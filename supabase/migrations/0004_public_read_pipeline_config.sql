-- O formulário público de cadastro (/cadastro) roda sem usuário autenticado
-- (role "anon"), mas precisa ler pipelines/stages/field_definitions para
-- saber qual pipeline recebe os cadastros e quais campos dinâmicos exibir.
-- As policies existentes cobrem só "authenticated", então essas leituras
-- voltavam vazias por causa do RLS — isso escondia os campos dinâmicos
-- (Faturamento, Funcionários, Tempo de empresa) no formulário público.

create policy "Qualquer um lê pipelines"
  on public.pipelines for select to anon using (true);

create policy "Qualquer um lê estágios"
  on public.stages for select to anon using (true);

create policy "Qualquer um lê campos"
  on public.field_definitions for select to anon using (true);
