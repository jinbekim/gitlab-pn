import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  presets: [
    presetWind(),
  ],
  content: {
    filesystem: ['src/**/*.ts'],
  },
});
