/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      all: true,
      provider: 'istanbul',
    },
    clearMocks: true,
    setupFiles: ['./test/setup.ts'],
  },
  plugins: [vue()],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore:next-line */
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/app/styles/vars"; @import "./src/app/styles/mixins";`,
      },
      less: {
        modifyVars: {
          'card-radius': '8px',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },
});
