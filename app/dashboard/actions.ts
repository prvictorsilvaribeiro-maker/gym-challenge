'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function registrarTreino(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: 'Sessão expirada. Faça login novamente.' };
  }

  const data_treino = String(formData.get('data_treino') ?? '');
  const tipo = String(formData.get('tipo') ?? '');
  const duracao_minutos = Number(formData.get('duracao_minutos') ?? 0);

  if (!data_treino || !tipo || !duracao_minutos) {
    return { erro: 'Preencha data, tipo e duração.' };
  }

  // Regra 3: sem treino aos domingos — bloqueia antes de ir ao banco
  const diaDaSemana = new Date(`${data_treino}T00:00:00`).getDay();
  if (diaDaSemana === 0) {
    return { erro: 'Opaaa, hoje não, hoje é dia do Senhor, vai pra igreja descansa! 🙏' };
  }

  const { error } = await supabase.from('workouts').insert({
    user_id: user.id,
    data_treino,
    tipo,
    duracao_minutos,
  });

  if (error) {
    // Se por algum motivo passar da validação acima e cair na constraint do banco
    if (error.message.includes('sem_domingo')) {
      return { erro: 'Opaaa, hoje não, hoje é dia do Senhor, vai pra igreja descansa! 🙏' };
    }
    return { erro: error.message };
  }

  revalidatePath('/dashboard');
  return { erro: null };
}

export async function excluirTreino(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) return { erro: error.message };
  revalidatePath('/dashboard');
  return { erro: null };
}
