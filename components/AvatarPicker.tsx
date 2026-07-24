'use client';

import { useState } from 'react';

const ANIMAIS = [
  '🐶', '🐱', '🦊', '🐻', '🐼', '🐨',
  '🐯', '🦁', '🐮', '🐷', '🐵', '🐔',
  '🐧', '🦆', '🦉', '🐺', '🐗', '🐴',
  '🦄', '🐝', '🐢', '🐙', '🦖', '🐬',
];

export default function AvatarPicker({
  initial,
}: {
  initial?: string;
}) {
  const [selected, setSelected] = useState<string>(initial || ANIMAIS[0]);

  return (
    <div className="space-y-2">
      <input type="hidden" name="avatar_url" value={selected} />

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {ANIMAIS.map((animal) => (
          <button
            type="button"
            key={animal}
            onClick={() => setSelected(animal)}
            className={`aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-2xl border-2 transition active:scale-95 ${
              selected === animal
                ? 'border-arena-lime bg-arena-lime/10 shadow-glow'
                : 'border-arena-line bg-arena-bg hover:border-arena-mute'
            }`}
            aria-pressed={selected === animal}
            aria-label={`Escolher avatar ${animal}`}
          >
            {animal}
          </button>
        ))}
      </div>
    </div>
  );
}
