import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//target: 'http://52.169.106.107:5193'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5193,
    proxy: {
      '/api': {
        target: 'http://localhost:5170',  // Backend local sur port 5170
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
