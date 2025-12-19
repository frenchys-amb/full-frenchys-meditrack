import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // 'base' debe ser '/' para que Django encuentre los archivos en la raíz de static
  base: '/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      // Forzamos a Vite a usar este archivo como entrada
      input: resolve(__dirname, 'index.html'),
    },
  },
})