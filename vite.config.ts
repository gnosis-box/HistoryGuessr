import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy':
        "frame-ancestors 'self' https://*.gnosis.io https://*.vercel.app https://circles.gnosis.io https://circles-dev.gnosis.io",
    },
  },
  preview: {
    headers: {
      'Content-Security-Policy':
        "frame-ancestors 'self' https://*.gnosis.io https://*.vercel.app https://circles.gnosis.io https://circles-dev.gnosis.io",
    },
  },
})
