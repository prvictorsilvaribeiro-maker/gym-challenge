'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function adicionarComentario(workoutId: string, texto: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: 'Sessão expirada. Faça login novamente.' };
  }

  const textoLimpo = texto.trim();
  if (!textoLimpo) {
    return { erro: 'Escreva algo antes de enviar.' };
  }

  const { error } = await supabase.from('comentarios').insert({
    workout_id: workoutId,
    user_id: user.id,
    texto: textoLimpo,
  });

  if (error) {
    return { erro: error.message };
  }

  revalidatePath('/feed');
  return { erro: null };
}
