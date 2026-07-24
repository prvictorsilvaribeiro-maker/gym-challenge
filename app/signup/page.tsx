import Link from 'next/link';
import { signup } from '@/app/auth/actions';
import AvatarPicker from '@/components/AvatarPicker';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-arena-lime text-sm tracking-[0.3em] uppercase mb-1">
            Bora começar
          </p>
          <h1 className="font-display text-5xl tracking-wide">CRIAR CONTA</h1>
        </div>

        <form
          action={signup}
          className="bg-arena-card border border-arena-line rounded-2xl p-6 space-y-4"
        >
          {searchParams.erro && (
            <p className="text-sm text-arena-coral bg-arena-coral/10 border border-arena-coral/30 rounded-lg px-3 py-2">
              {searchParams.erro}
            </p>
          )}

          <div>
            <label className="text-sm text-arena-mute">Apelido</label>
            <input
              name="apelido"
              type="text"
              required
              maxLength={24}
              placeholder="como vão te ver no placar"
              className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
            />
          </div>
          <div>
            <label className="text-sm text-arena-mute">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
            />
          </div>
          <div>
            <label className="text-sm text-arena-mute">Senha</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
            />
          </div>

          <div>
            <p className="text-sm text-arena-mute mb-2">Escolha seu avatar</p>
            <AvatarPicker />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-arena-lime text-arena-bg font-semibold py-2.5 hover:bg-arena-lime2 transition"
          >
            Criar conta
          </button>

          <p className="text-center text-sm text-arena-mute">
            Já tem conta?{' '}
            <Link href="/login" className="text-arena-lime hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
