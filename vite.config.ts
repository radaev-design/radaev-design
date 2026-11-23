import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: имя репозитория на GitHub Pages. Если репозиторий называется иначе - поменяй.
export default defineConfig({
  plugins: [react()],
  base: '/radaev-design/',
});
