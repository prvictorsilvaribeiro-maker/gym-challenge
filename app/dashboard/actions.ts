'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { diasDesde } from '@/lib/prazo';

const MENSAGEM_DOMINGO =
  'Opaaa, hoje não, hoje é dia do Senhor, vai pra igreja descansa! 🙏';

function validarCamposBasicos(data_treino: string, tipo: string, duracao_minutos: number) {
  if (!data_treino || !tipo || !duracao_minutos) {
    return 'Preencha data, tipo e duração.';
  }

  const diaDaSemana = new Date(`${data_treino}T00:00:00`).getDay();
  if (diaDaSemana === 0) {
    return MENSAGEM_DOMINGO;
  }

  const dias = diasDesde(data_treino);
  if (dias < 0) {
    return 'Não dá pra registrar um treino de um dia que ainda não aconteceu.';
  }
  if (dias > 1) {
    return 'O prazo pra registrar esse treino era até o dia seguinte (D+1). Já passou.';
  }

  return null;
}

function traduzirErroDoBanco(mensagem: string) {
  if (mensagem.includes('sem_domingo')) return MENSAGEM_DOMINGO;
  if (mensagem.includes('prazo') || mensagem.includes('futura')) {
    return 'O prazo pra mexer nesse treino era até o dia seguinte (D+1). Já passou.';
  }
  return mensagem;
}

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

  const erroValidacao = validarCamposBasicos(data_treino, tipo, duracao_minutos);
  if (erroValidacao) return { erro: erroValidacao };

  const { error } = await supabase.from('workouts').insert({
    user_id: user.id,
    data_treino,
    tipo,
    duracao_minutos,
  });

  if (error) return { erro: traduzirErroDoBanco(error.message) };

  revalidatePath('/dashboard');
  revalidatePath('/feed');
  return { erro: null };
}

export async function editarTreino(id: string, formData: FormData) {
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

  const erroValidacao = validarCamposBasicos(data_treino, tipo, duracao_minutos);
  if (erroValidacao) return { erro: erroValidacao };

  const { error } = await supabase
    .from('workouts')
    .update({ data_treino, tipo, duracao_minutos })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { erro: traduzirErroDoBanco(error.message) };

  revalidatePath('/dashboard');
  revalidatePath('/feed');
  return { erro: null };
}

export async function excluirTreino(id: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: 'Sessão expirada. Faça login novamente.' };
  }

  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { erro: traduzirErroDoBanco(error.message) };

  revalidatePath('/dashboard');
  revalidatePath('/feed');
  return { erro: null };
}
