import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#0E1512',        // verde-preto de quadra à noite
          card: '#141F1A',
          line: '#243830',
          lime: '#C8FF3D',      // acento — placar de estádio
          lime2: '#9FE02A',
          gold: '#FFC94A',
          coral: '#FF6B57',
          ice: '#EAF3EE',
          mute: '#7C9086',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(200,255,61,0.15), 0 8px 30px rgba(200,255,61,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
