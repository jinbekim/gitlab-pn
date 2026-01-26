import { defineConfig } from 'vite';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';

const alias = {
  '@utils': resolve(__dirname, 'src/utils'),
  '@domain': resolve(__dirname, 'src/domain'),
  '@services': resolve(__dirname, 'src/services'),
  '@core': resolve(__dirname, 'src/core'),
  '@plugins': resolve(__dirname, 'src/plugins'),
};

export default defineConfig(({ mode }) => {
  const target = process.env.BUILD_TARGET || 'popup';

  if (target === 'inject') {
    return {
      resolve: { alias },
      plugins: [UnoCSS()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/plugins/inject/index.ts'),
          name: 'GitLabPN',
          formats: ['iife'],
          fileName: () => 'index.global.js',
        },
        outDir: 'dist/inject',
        emptyOutDir: true,
        sourcemap: true,
        minify: mode === 'production',
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            assetFileNames: 'style.css',
          },
        },
      },
    };
  }

  // popup (default)
  return {
    resolve: { alias },
    plugins: [UnoCSS()],
    base: './',
    root: 'src/plugins/popup',
    build: {
      outDir: resolve(__dirname, 'dist/popup'),
      emptyOutDir: true,
      sourcemap: true,
      minify: mode === 'production',
      rollupOptions: {
        input: resolve(__dirname, 'src/plugins/popup/index.html'),
      },
    },
  };
});
