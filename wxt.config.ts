import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/unocss'],
  manifest: {
    name: 'gitlab-pn',
    description: 'A simple changer',
    icons: {
      '16': 'img/favicon.png',
      '32': 'img/favicon.png',
      '48': 'img/favicon.png',
      '128': 'img/favicon.png',
    },
    permissions: ['storage'],
    host_permissions: ['*://*/*'],
  },
  vite: () => ({
    resolve: {
      alias: {
        '@utils': resolve(__dirname, 'src/utils'),
        '@domain': resolve(__dirname, 'src/domain'),
        '@services': resolve(__dirname, 'src/services'),
        '@core': resolve(__dirname, 'src/core'),
        '@plugins': resolve(__dirname, 'src/plugins'),
      },
    },
  }),
});
