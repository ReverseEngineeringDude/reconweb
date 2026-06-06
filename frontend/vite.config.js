import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '4fd9-117-243-225-28.ngrok-free.app'
    ],
    port: 5173, // optional: set your dev server port
  },
})
