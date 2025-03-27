import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';



export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@api': path.resolve(__dirname, './src/api'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@configs': path.resolve(__dirname, './src/configs'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@typings': path.resolve(__dirname, './src/types'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/variables.scss" as *;`,
        importer: [
          function(url) {
            if (url.startsWith('@styles/')) {
              return { file: path.resolve(__dirname, './src/styles', url.substring(8)) };
            }
            return null;
          }
        ]
      }
    }
  }
});