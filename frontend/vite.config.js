import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Asegura que los assets se busquen desde la raíz
  build: {
    outDir: 'dist', // Nombre de la carpeta de salida
    emptyOutDir: true, // Limpia la carpeta antes de construir
  }
})