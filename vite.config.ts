import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config para tests de dominio (Node environment - rápido)
// Uso: npm run test:domain
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});