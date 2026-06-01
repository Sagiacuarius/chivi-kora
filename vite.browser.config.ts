import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    browser: {
      provider: playwright({
        instances: {
          chromium: { browser: 'chromium', headless: true },
          firefox: { browser: 'firefox', headless: true },
        },
      }),
    },
    setupFiles: ['./tests/setup.ts'],
  },
});