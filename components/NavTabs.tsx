import Link from 'next/link';

export default function NavTabs({ current }: { current: 'painel' | 'feed' }) {
  const abas = [
    { href: '/dashboard', label: 'Painel', key: 'painel' as const },
    { href: '/feed', label: 'Feed', key: 'feed' as const },
  ];

  return (
    <nav className="flex gap-6 justify-center border-b border-arena-line mb-6">
      {abas.map((aba) => (
        <Link
          key={aba.key}
          href={aba.href}
          className={`pb-2 -mb-px text-sm font-medium border-b-2 transition ${
            current === aba.key
              ? 'text-arena-lime border-arena-lime'
              : 'text-arena-mute border-transparent hover:text-arena-ice'
          }`}
        >
          {aba.label}
        </Link>
      ))}
    </nav>
  );
}
