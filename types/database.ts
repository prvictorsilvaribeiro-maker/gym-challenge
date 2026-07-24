export type TipoTreino = 'musculacao' | 'cardio';

export interface Profile {
  id: string;
  apelido: string;
  avatar_url: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  data_treino: string; // YYYY-MM-DD
  tipo: TipoTreino;
  duracao_minutos: number;
  pontos: number;
  created_at: string;
}

export interface LeaderboardRow {
  id: string;
  apelido: string;
  avatar_url: string;
  total_pontos: number;
  dias_treinados: number;
}

// Datas oficiais do desafio
export const DESAFIO_INICIO = '2026-07-27';
export const DESAFIO_FIM = '2026-12-03';
