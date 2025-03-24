import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  base: "./", // ou "/wwwroot/"
  build: {
    outDir: "./dist",
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: "jsdom"
  },
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0'
  }
})
