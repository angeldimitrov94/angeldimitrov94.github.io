import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/sub-apps/fin-planner/',
  build: {
    outDir: '../docs/sub-apps/fin-planner',
    emptyOutDir: true,
  },
})
