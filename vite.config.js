import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5193,
    host: '0.0.0.0',  // Permettre les connexions externes
    proxy: {
      '/api': {
        target: 'http://52.169.106.107:5170',  // Backend sur VM Azure
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