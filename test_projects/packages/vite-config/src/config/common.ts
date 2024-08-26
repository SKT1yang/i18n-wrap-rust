/*
 * @name: Do not edit
 * @description: Do not edit
 */

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { type UserConfig } from 'vite';

const commonConfig: UserConfig = {
  base: '',
  server: {
    host: true,
  },

  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue({
      script: {
        // 手动开启 defineModel, 保留配置，兼容vue: 3.3.11
        defineModel: true,
      },
    }),
    vueJsx(),
  ],
};

export { commonConfig };
