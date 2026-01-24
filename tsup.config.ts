import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/features/popup/index.ts',
    'src/features/inject/index.ts',
  ],
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'esnext',
});
