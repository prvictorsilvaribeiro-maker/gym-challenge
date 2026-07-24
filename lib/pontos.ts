interface TreinoParaCalculo {
  id: string;
  user_id: string;
  data_treino: string;
  created_at: string;
  pontos: number;
}

/**
 * O teto de 2 pontos/dia é por usuário+dia, não por treino. Quando alguém
 * registra 2 treinos no mesmo dia, o segundo pode "não caber" inteiro no
 * teto. Essa função calcula quanto cada treino individual realmente conta,
 * processando os treinos do dia em ordem de criação.
 *
 * Retorna um Map de workout.id -> pontos efetivamente contados.
 */
export function calcularContribuicoes(
  treinos: TreinoParaCalculo[]
): Map<string, number> {
  const porGrupo = new Map<string, TreinoParaCalculo[]>();

  for (const t of treinos) {
    const chave = `${t.user_id}_${t.data_treino}`;
    if (!porGrupo.has(chave)) porGrupo.set(chave, []);
    porGrupo.get(chave)!.push(t);
  }

  const contribuicoes = new Map<string, number>();

  for (const grupo of porGrupo.values()) {
    const ordenado = [...grupo].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    let acumulado = 0;
    for (const t of ordenado) {
      const restante = Math.max(0, 2 - acumulado);
      const contribuicao = Math.min(t.pontos, restante);
      contribuicoes.set(t.id, contribuicao);
      acumulado += contribuicao;
    }
  }

  return contribuicoes;
}
