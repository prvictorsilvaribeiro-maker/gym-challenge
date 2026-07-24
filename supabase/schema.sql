-- =========================================================
-- GYM CHALLENGE — schema completo do Supabase
-- Rode este arquivo inteiro em: Supabase Dashboard > SQL Editor > New query
-- =========================================================

-- ---------------------------------------------------------
-- 1) PROFILES (apelido + avatar de cada usuário)
-- Estende auth.users (criado automaticamente pelo Supabase Auth)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  apelido     text not null unique,
  avatar_url  text not null,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Qualquer usuário logado pode ver o apelido/avatar de todo mundo (precisa pro placar)
create policy "profiles_select_all_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Cada usuário só cria/edita o próprio perfil
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- ---------------------------------------------------------
-- 2) WORKOUTS (registros de treino)
-- ---------------------------------------------------------
create table if not exists public.workouts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  data_treino       date not null,
  tipo              text not null check (tipo in ('musculacao', 'cardio')),
  duracao_minutos   int  not null check (duracao_minutos > 0),
  pontos            int  not null default 0,
  created_at        timestamptz not null default now(),

  -- Regra 3: não pode ser domingo (dow = 0)
  constraint sem_domingo check (extract(dow from data_treino) <> 0),

  -- Datas do desafio: 27/07/2026 a 03/12/2026
  constraint dentro_do_desafio check (
    data_treino >= date '2026-07-27' and data_treino <= date '2026-12-03'
  )
);

alter table public.workouts enable row level security;

-- Todo mundo autenticado pode ler os treinos (placar é público entre os 4)
create policy "workouts_select_all_authenticated"
  on public.workouts for select
  to authenticated
  using (true);

-- Cada usuário só insere treino para si mesmo
create policy "workouts_insert_own"
  on public.workouts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Cada usuário pode apagar o próprio treino (corrigir erro de digitação, por ex.)
create policy "workouts_delete_own"
  on public.workouts for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 3) Regra 2: cálculo automático de pontos (não confiar no client)
--    - musculação >= 30min          -> 1 ponto
--    - cardio 30min até < 60min     -> 1 ponto
--    - cardio >= 60min              -> 2 pontos
--    - qualquer coisa abaixo disso  -> erro (não vale ponto)
-- ---------------------------------------------------------
create or replace function public.calcular_pontos_treino()
returns trigger as $$
begin
  if new.tipo = 'musculacao' then
    if new.duracao_minutos >= 30 then
      new.pontos := 1;
    else
      raise exception 'Musculação precisa de pelo menos 30 minutos para valer ponto.';
    end if;
  elsif new.tipo = 'cardio' then
    if new.duracao_minutos >= 60 then
      new.pontos := 2;
    elsif new.duracao_minutos >= 30 then
      new.pontos := 1;
    else
      raise exception 'Cardio precisa de pelo menos 30 minutos para valer ponto.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_calcular_pontos on public.workouts;
create trigger trg_calcular_pontos
  before insert on public.workouts
  for each row execute function public.calcular_pontos_treino();

-- ---------------------------------------------------------
-- 4) Regra 1: cap de 2 pontos por dia
--    Guardamos os pontos "crus" de cada treino, e aplicamos o teto de 2
--    por dia/usuário na hora de somar (assim não precisa alterar
--    registros antigos quando um novo treino é lançado no mesmo dia).
-- ---------------------------------------------------------
create or replace view public.pontos_por_dia as
select
  user_id,
  data_treino,
  least(sum(pontos), 2) as pontos_do_dia
from public.workouts
group by user_id, data_treino;

-- ---------------------------------------------------------
-- 5) Placar de líderes
-- ---------------------------------------------------------
create or replace view public.leaderboard as
select
  p.id,
  p.apelido,
  p.avatar_url,
  coalesce(sum(d.pontos_do_dia), 0) as total_pontos,
  count(distinct d.data_treino) as dias_treinados
from public.profiles p
left join public.pontos_por_dia d on d.user_id = p.id
group by p.id, p.apelido, p.avatar_url
order by total_pontos desc, dias_treinados desc;

-- Views herdam RLS das tabelas base (profiles/workouts já liberam SELECT
-- para authenticated), então o placar funciona pra qualquer um dos 4 logado.

-- ---------------------------------------------------------
-- 6) Pronto! Depois de rodar este script:
--   - Vá em Authentication > Providers > Email e desative
--     "Confirm email" (assim os 4 usuários já entram direto após o cadastro,
--     sem precisar clicar em link de confirmação por e-mail).
-- ---------------------------------------------------------
