import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Avatar from '@/components/Avatar';
import CommentForm from '@/components/CommentForm';
import NavTabs from '@/components/NavTabs';

const ROTULO_TIPO: Record<string, string> = {
  musculacao: 'Musculação',
  cardio: 'Cardio',
};

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { filtro?: string };
}) {
  const supabase = createClient();
  const hoje = new Date().toISOString().slice(0, 10);
  const filtroHoje = searchParams.filtro === 'hoje';

  let query = supabase
    .from('workouts')
    .select(
      `
      id, data_treino, tipo, duracao_minutos, pontos, created_at,
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
          <article
            key={treino.id}
            className="bg-arena-card border border-arena-line rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar value={treino.profiles?.avatar_url ?? ''} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {treino.profiles?.apelido ?? 'Atleta'}
                </p>
                <p className="text-xs text-arena-mute">
                  {formatarData(treino.data_treino)} às {formatarHora(treino.created_at)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl text-arena-lime leading-none">
                  +{treino.pontos}
                </p>
                <p className="text-xs text-arena-mute">
                  {treino.pontos === 1 ? 'ponto' : 'pontos'}
                </p>
              </div>
            </div>

            <p className="text-sm mt-3">
              {ROTULO_TIPO[treino.tipo] ?? treino.tipo} · {treino.duracao_minutos} min
            </p>

            {treino.comentarios?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-arena-line space-y-2">
                {treino.comentarios.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-2">
                    <Avatar value={c.profiles?.avatar_url ?? ''} size={22} />
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{c.profiles?.apelido}</span>{' '}
                      {c.texto}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <CommentForm workoutId={treino.id} />
          </article>
        ))}
      </div>
    </main>
  );
}
