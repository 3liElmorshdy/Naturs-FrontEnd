import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://naturs-1.onrender.com',
        changeOrigin: true,
      },
      '/img': {
        target: 'https://naturs-1.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
