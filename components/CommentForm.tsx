'use client';

import { useRef, useState, useTransition } from 'react';
import { adicionarComentario } from '@/app/feed/actions';

export default function CommentForm({ workoutId }: { workoutId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const texto = String(formData.get('texto') ?? '');
      const res = await adicionarComentario(workoutId, texto);
      if (res?.erro) {
        setErro(res.erro);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="mt-3 pt-3 border-t border-arena-line">
      <form ref={formRef} action={handleSubmit} className="flex items-center gap-2">
        <input
          name="texto"
          type="text"
          maxLength={280}
          required
          placeholder="Manda um comentário..."
          className="flex-1 min-w-0 rounded-lg bg-arena-bg border border-arena-line px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
        />
        <button
          type="submit"
          disabled={pending}
          className="text-sm text-arena-lime font-medium shrink-0 disabled:opacity-50"
        >
          {pending ? '...' : 'Enviar'}
        </button>
      </form>
      {erro && <p className="text-xs text-arena-coral mt-1">{erro}</p>}
    </div>
  );
}
