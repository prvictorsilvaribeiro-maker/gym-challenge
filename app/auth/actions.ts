'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?erro=${encodeURIComponent('E-mail ou senha inválidos.')}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const apelido = String(formData.get('apelido') ?? '').trim();
  const avatarUrl = String(formData.get('avatar_url') ?? '');

  if (!apelido) {
    redirect(`/signup?erro=${encodeURIComponent('Escolha um apelido.')}`);
  }
  if (!avatarUrl) {
    redirect(`/signup?erro=${encodeURIComponent('Escolha um avatar.')}`);
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect(
      `/signup?erro=${encodeURIComponent(error?.message ?? 'Não foi possível criar a conta.')}`
    );
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user!.id,
    apelido,
    avatar_url: avatarUrl,
  });

  if (profileError) {
    redirect(
      `/signup?erro=${encodeURIComponent(
        profileError.message.includes('duplicate')
          ? 'Esse apelido já está em uso.'
          : profileError.message
      )}`
    );
  }

  // Se a confirmação de e-mail estiver desativada no projeto Supabase,
  // o usuário já sai logado daqui.
  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }

  redirect('/login?criado=1');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
