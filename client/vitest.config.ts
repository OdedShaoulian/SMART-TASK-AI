import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
    },
    reporters: ['default', 'vitest-junit'],
    outputFile: {
      'vitest-junit': './reports/junit/junit.xml',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
