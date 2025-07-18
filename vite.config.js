import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Port du backend corrigé
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Configuration pour Azure Static Web Apps
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
