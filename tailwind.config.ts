import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#150D0D',        // preto com fundo quente
          card: '#1F1414',
          line: '#3A2323',
          lime: '#FF3B3B',      // acento — vermelho CACHARATS (nome mantido p/ não quebrar as classes)
          lime2: '#D92B2B',
          gold: '#FFC94A',
          coral: '#FF9F1C',     // erros — laranja, pra não confundir com o vermelho da marca
          ice: '#F3EAEA',
          mute: '#907C7C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,59,59,0.18), 0 8px 30px rgba(255,59,59,0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
