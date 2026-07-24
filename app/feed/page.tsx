import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import NavTabs from '@/components/NavTabs';
import WorkoutCard from '@/components/WorkoutCard';
import { dentroDoPrazo } from '@/lib/prazo';

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { filtro?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hoje = new Date().toISOString().slice(0, 10);
  const filtroHoje = searchParams.filtro === 'hoje';

  let query = supabase
    .from('workouts')
    .select(
      `
      id, user_id, data_treino, tipo, duracao_minutos, pontos, created_at,
      profiles ( apelido, avatar_url ),
      comentarios ( id, texto, created_at, profiles ( apelido, avatar_url ) )
    `
    )
    .order('data_treino', { ascending: false })
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comentarios', ascending: true });

  if (filtroHoje) {
    query = query.eq('data_treino', hoje);
  }

  const { data: treinos } = await query;

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <p className="text-center text-xs tracking-[0.3em] uppercase text-arena-lime mb-4">
        CACHARATS
      </p>
      <NavTabs current="feed" />

      <h1 className="font-display text-3xl tracking-wide mb-6">FEED DE TREINOS</h1>

      <div className="flex gap-2 mb-6">
        <Link
          href="/feed"
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            !filtroHoje
              ? 'bg-arena-lime text-arena-bg border-arena-lime font-medium'
              : 'border-arena-line text-arena-mute'
          }`}
        >
          Todos os treinos
        </Link>
        <Link
          href="/feed?filtro=hoje"
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            filtroHoje
              ? 'bg-arena-lime text-arena-bg border-arena-lime font-medium'
              : 'border-arena-line text-arena-mute'
          }`}
        >
          Hoje
        </Link>
      </div>

      <div className="space-y-4">
        {(treinos ?? []).length === 0 && (
          <p className="text-center text-arena-mute text-sm py-10">
            Nenhum treino registrado {filtroHoje ? 'hoje' : 'ainda'}.
          </p>
        )}

        {(treinos ?? []).map((treino: any) => (
          <WorkoutCard
            key={treino.id}
            treino={treino}
            podeEditar={treino.user_id === user?.id && dentroDoPrazo(treino.data_treino)}
          />
        ))}
      </div>
    </main>
  );
}
