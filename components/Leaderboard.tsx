import type { LeaderboardRow } from '@/types/database';
import Avatar from '@/components/Avatar';

const MEDALHA = ['🥇', '🥈', '🥉', '🎗️'];

export default function Leaderboard({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.total_pontos));

  return (
    <div className="bg-arena-card border border-arena-line rounded-2xl p-5">
      <h2 className="font-display text-2xl tracking-wide text-arena-lime mb-4">
        PLACAR DE LÍDERES
      </h2>

      <ol className="space-y-3">
        {rows.map((row, i) => {
          const isMe = row.id === currentUserId;
          const pct = Math.round((row.total_pontos / max) * 100);
          return (
            <li
              key={row.id}
              className={`rounded-xl p-3 border transition ${
                isMe
                  ? 'border-arena-lime/50 bg-arena-lime/5'
                  : 'border-arena-line bg-arena-bg/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl w-6 text-center shrink-0">
                  {MEDALHA[i] ?? i + 1}
                </span>
                <Avatar value={row.avatar_url} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="truncate font-medium">
                      {row.apelido}
                      {isMe && <span className="text-arena-lime text-xs ml-1">(você)</span>}
                    </span>
                    <span className="font-display text-xl text-arena-lime tabular shrink-0">
                      {row.total_pontos}
                      <span className="text-xs text-arena-mute ml-1">pts</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-arena-line overflow-hidden">
                    <div
                      className="h-full bg-arena-lime rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-arena-mute mt-1">
                    {row.dias_treinados} {row.dias_treinados === 1 ? 'dia treinado' : 'dias treinados'}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
