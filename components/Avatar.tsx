const CORES_FUNDO = [
  '#2E4034', '#3A2E40', '#40382E', '#2E3A40', '#402E2E', '#2E4038',
];

function corDoFundo(valor: string) {
  let hash = 0;
  for (let i = 0; i < valor.length; i++) hash = valor.charCodeAt(i) + ((hash << 5) - hash);
  return CORES_FUNDO[Math.abs(hash) % CORES_FUNDO.length];
}

export default function Avatar({
  value,
  size = 36,
  className = '',
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const ehImagem = value?.startsWith('http');

  if (ehImagem) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={value}
        alt=""
        style={{ width: size, height: size }}
        className={`rounded-full border border-arena-line shrink-0 object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: corDoFundo(value ?? '?'), fontSize: size * 0.55 }}
      className={`rounded-full border border-arena-line shrink-0 flex items-center justify-center leading-none ${className}`}
    >
      <span>{value || '❓'}</span>
    </div>
  );
}
