'use client';

import { useRef, useState, useTransition } from 'react';
import { registrarTreino } from '@/app/dashboard/actions';
import { DESAFIO_FIM, DESAFIO_INICIO } from '@/types/database';

export default function WorkoutForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErro(null);
    setSucesso(false);
    startTransition(async () => {
      const res = await registrarTreino(formData);
      if (res?.erro) {
        setErro(res.erro);
      } else {
        setSucesso(true);
        formRef.current?.reset();
        setTimeout(() => setSucesso(false), 3000);
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-arena-card border border-arena-line rounded-2xl p-5 space-y-4"
    >
      <h2 className="font-display text-2xl tracking-wide text-arena-lime">
        REGISTRAR TREINO
      </h2>

      {erro && (
        <p className="text-sm text-arena-coral bg-arena-coral/10 border border-arena-coral/30 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-sm text-arena-lime bg-arena-lime/10 border border-arena-lime/30 rounded-lg px-3 py-2">
          Treino registrado! 💪
        </p>
      )}

      <div>
        <label className="text-sm text-arena-mute">Data</label>
        <input
          name="data_treino"
          type="date"
          required
          min={DESAFIO_INICIO}
          max={DESAFIO_FIM}
          className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime [color-scheme:dark]"
        />
        <p className="text-xs text-arena-mute mt-1">Domingo não conta — o banco recusa automaticamente.</p>
      </div>

      <div>
        <label className="text-sm text-arena-mute">Tipo</label>
        <select
          name="tipo"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="musculacao">Musculação</option>
          <option value="cardio">Cardio</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-arena-mute">Duração (minutos)</label>
        <input
          name="duracao_minutos"
          type="number"
          required
          min={1}
          step={1}
          placeholder="ex: 45"
          className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
        />
        <p className="text-xs text-arena-mute mt-1">
          Musculação ≥30min = 1pt · Cardio 30–59min = 1pt · Cardio ≥60min = 2pts · máx. 2pts/dia
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-arena-lime text-arena-bg font-semibold py-2.5 hover:bg-arena-lime2 transition disabled:opacity-50"
      >
        {pending ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}
