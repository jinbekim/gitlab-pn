import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
  resolve: {
    alias: {
      '@utils': resolve(__dirname, 'src/utils'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@services': resolve(__dirname, 'src/services'),
      '@features': resolve(__dirname, 'src/features'),
    },
  },
});
