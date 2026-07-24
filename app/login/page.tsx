import Link from 'next/link';
import { login } from '@/app/auth/actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { erro?: string; criado?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-arena-lime text-sm tracking-[0.3em] uppercase mb-1">
            27/07 — 03/12/2026
          </p>
          <h1 className="font-display text-5xl sm:text-6xl tracking-wide">CACHARATS</h1>
        </div>

        <form
          action={login}
          className="bg-arena-card border border-arena-line rounded-2xl p-6 space-y-4"
        >
          {searchParams.criado && (
            <p className="text-sm text-arena-lime bg-arena-lime/10 border border-arena-lime/30 rounded-lg px-3 py-2">
              Conta criada! Confirme seu e-mail (se necessário) e entre abaixo.
            </p>
          )}
          {searchParams.erro && (
            <p className="text-sm text-arena-coral bg-arena-coral/10 border border-arena-coral/30 rounded-lg px-3 py-2">
              {searchParams.erro}
            </p>
          )}

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
              className="mt-1 w-full rounded-lg bg-arena-bg border border-arena-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arena-lime"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-arena-lime text-arena-bg font-semibold py-2.5 hover:bg-arena-lime2 transition"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-arena-mute">
            Ainda não tem conta?{' '}
            <Link href="/signup" className="text-arena-lime hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
