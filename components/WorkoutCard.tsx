'use client';

import { useState, useTransition } from 'react';
import Avatar from '@/components/Avatar';
import CommentForm from '@/components/CommentForm';
import { editarTreino, excluirTreino } from '@/app/dashboard/actions';

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

export default function WorkoutCard({
  treino,
  podeEditar,
}: {
  treino: any;
  podeEditar: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleEditar(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const res = await editarTreino(treino.id, formData);
      if (res?.erro) setErro(res.erro);
      else setEditando(false);
    });
  }

  function handleExcluir() {
    if (!confirm('Excluir esse treino? Não dá pra desfazer.')) return;
    setErro(null);
    startTransition(async () => {
      const res = await excluirTreino(treino.id);
      if (res?.erro) setErro(res.erro);
    });
  }

  return (
    <article className="bg-arena-card border border-arena-line rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <Avatar value={treino.profiles?.avatar_url ?? ''} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{treino.profiles?.apelido ?? 'Atleta'}</p>
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

      {!editando ? (
        <p className="text-sm mt-3">
          {ROTULO_TIPO[treino.tipo] ?? treino.tipo} · {treino.duracao_minutos} min
        </p>
      ) : (
        <form action={handleEditar} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="date"
            name="data_treino"
            defaultValue={treino.data_treino}
            className="rounded-lg bg-arena-bg border border-arena-line px-2 py-1.5 text-sm [color-scheme:dark]"
          />
          <select
            name="tipo"
            defaultValue={treino.tipo}
            className="rounded-lg bg-arena-bg border border-arena-line px-2 py-1.5 text-sm"
          >
            <option value="musculacao">Musculação</option>
            <option value="cardio">Cardio</option>
          </select>
          <input
            type="number"
            name="duracao_minutos"
            min={1}
            defaultValue={treino.duracao_minutos}
            className="w-20 rounded-lg bg-arena-bg border border-arena-line px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="text-sm text-arena-lime font-medium disabled:opacity-50"
          >
            {pending ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="text-sm text-arena-mute"
          >
            Cancelar
          </button>
        </form>
      )}

      {erro && <p className="text-xs text-arena-coral mt-2">{erro}</p>}

      {podeEditar && !editando && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setEditando(true)}
            className="text-xs text-arena-lime hover:underline"
          >
            Editar
          </button>
          <button
            onClick={handleExcluir}
            disabled={pending}
            className="text-xs text-arena-coral hover:underline disabled:opacity-50"
          >
            {pending ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}

      {treino.comentarios?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-arena-line space-y-2">
          {treino.comentarios.map((c: any) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar value={c.profiles?.avatar_url ?? ''} size={22} />
              <p className="text-sm leading-snug">
                <span className="font-medium">{c.profiles?.apelido}</span> {c.texto}
              </p>
            </div>
          ))}
        </div>
      )}

      <CommentForm workoutId={treino.id} />
    </article>
  );
}
