/** Quantos dias se passaram desde a data do treino (0 = hoje, 1 = ontem, negativo = data futura). */
export function diasDesde(dataTreino: string): number {
  const hojeStr = new Date().toISOString().slice(0, 10);
  const hoje = new Date(`${hojeStr}T00:00:00`);
  const data = new Date(`${dataTreino}T00:00:00`);
  return Math.round((hoje.getTime() - data.getTime()) / 86_400_000);
}

/** Regra do prazo: só pode registrar/editar/excluir até o dia seguinte (D+1). */
export function dentroDoPrazo(dataTreino: string): boolean {
  const dias = diasDesde(dataTreino);
  return dias >= 0 && dias <= 1;
}
