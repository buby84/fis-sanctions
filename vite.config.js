import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/fis.ico',
            dest: ''
          }
        ]
      })
    ]
  };
  if (mode === 'development') {
    config.server = {
      proxy: {
        '/api': {
          target: 'https://api.fis-ski.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    };
  }

  return config;
});
