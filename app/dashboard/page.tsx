import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/auth/actions';
import WorkoutForm from '@/components/WorkoutForm';
import Leaderboard from '@/components/Leaderboard';
import type { LeaderboardRow, Profile } from '@/types/database';
import { DESAFIO_FIM, DESAFIO_INICIO } from '@/types/database';

function diasRestantes() {
  const fim = new Date(`${DESAFIO_FIM}T23:59:59`);
  const hoje = new Date();
  const diff = Math.ceil((fim.getTime() - hoje.getTime()) / 86_400_000);
  return diff;
}

function progressoPct() {
  const inicio = new Date(DESAFIO_INICIO).getTime();
  const fim = new Date(DESAFIO_FIM).getTime();
  const hoje = Date.now();
  const pct = ((hoje - inicio) / (fim - inicio)) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // middleware já redireciona

  const [{ data: profile }, { data: leaderboard }, { data: hojeTreinos }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('leaderboard').select('*'),
    supabase
      .from('workouts')
      .select('pontos')
      .eq('user_id', user.id)
      .eq('data_treino', new Date().toISOString().slice(0, 10)),
  ]);

  const meuProfile = profile as Profile | null;
  const rows = (leaderboard ?? []) as LeaderboardRow[];
  const pontosHoje = Math.min(
    2,
    (hojeTreinos ?? []).reduce((acc, w) => acc + (w.pontos ?? 0), 0)
  );

  const restantes = diasRestantes();
  const progresso = progressoPct();

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {meuProfile?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meuProfile.avatar_url}
              alt=""
              className="w-11 h-11 rounded-full border border-arena-line"
            />
          )}
          <div>
            <p className="text-xs text-arena-mute uppercase tracking-wide">Bem-vindo</p>
            <p className="font-display text-2xl tracking-wide leading-none">
              {meuProfile?.apelido ?? 'Atleta'}
            </p>
          </div>
        </div>
        <form action={logout}>
          <button className="text-sm text-arena-mute hover:text-arena-ice transition">
            Sair
          </button>
        </form>
      </header>

      <section className="bg-arena-card border border-arena-line rounded-2xl p-5 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-arena-mute">Desafio em andamento</span>
          <span className="text-arena-lime font-medium">
            {restantes > 0 ? `${restantes} dias restantes` : 'Desafio encerrado'}
          </span>
        </div>
        <div className="h-2 rounded-full bg-arena-line overflow-hidden">
          <div
            className="h-full bg-arena-lime rounded-full transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-arena-mute mt-2">
          <span>27/07/2026</span>
          <span>03/12/2026</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-arena-mute">Pontos de hoje:</span>
          <span className="font-display text-xl text-arena-lime">{pontosHoje}/2</span>
          {pontosHoje >= 2 && (
            <span className="text-xs text-arena-gold">teto do dia atingido 🔥</span>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <WorkoutForm />
        <Leaderboard rows={rows} currentUserId={user.id} />
      </div>
    </main>
  );
}
