import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public', // public/images/* -> 빌드 결과물에서 /images/* 경로로 그대로 노출됨
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
