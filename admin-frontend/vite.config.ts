// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Detecta si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: isDevelopment
      ? {
          protocol: 'ws',
          host: 'localhost',
        }
      : false, // 🚀 Desactivamos HMR en producción
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  preview: {
    port: 4173,
  },
});
