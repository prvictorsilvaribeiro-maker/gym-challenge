'use client';

import { useMemo, useState } from 'react';

const ESTILOS = [
  'adventurer',
  'bottts',
  'thumbs',
  'fun-emoji',
  'pixel-art',
  'lorelei',
  'notionists',
  'personas',
] as const;

function avatarUrl(estilo: string, seed: string) {
  return `https://api.dicebear.com/9.x/${estilo}/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
}

export default function AvatarPicker({
  initialSeed = '',
}: {
  initialSeed?: string;
}) {
  const [seed, setSeed] = useState(initialSeed || 'treino');
  const [selected, setSelected] = useState<string>(avatarUrl(ESTILOS[0], initialSeed || 'treino'));

  const opcoes = useMemo(
    () => ESTILOS.map((estilo) => ({ estilo, url: avatarUrl(estilo, seed || 'treino') })),
    [seed]
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name="avatar_url" value={selected} />

      <div>
        <label className="text-sm text-arena-mute">
          Digite uma palavra pra gerar variações (ex: seu nome ou apelido)
        </label>
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="ex: victor"
          className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {opcoes.map(({ estilo, url }) => (
          <button
            type="button"
            key={estilo}
            onClick={() => setSelected(url)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
              selected === url
                ? 'border-arena-lime shadow-glow'
                : 'border-arena-line hover:border-arena-mute'
            }`}
            aria-pressed={selected === url}
            aria-label={`Escolher avatar estilo ${estilo}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full bg-arena-card" />
          </button>
        ))}
      </div>
    </div>
  );
}
