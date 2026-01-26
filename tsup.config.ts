import { defineConfig } from 'tsup';

export default defineConfig([
  // Popup - ES 모듈 유지 (HTML에서 type="module"로 로드)
  {
    entry: ['src/plugins/popup/index.ts'],
    outDir: 'dist/popup',
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    target: 'esnext',
  },
  // Content Script - IIFE 포맷 (모듈 지원 안됨)
  {
    entry: ['src/plugins/inject/index.ts'],
    outDir: 'dist/inject',
    format: ['iife'],
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    target: 'esnext',
  },
]);
