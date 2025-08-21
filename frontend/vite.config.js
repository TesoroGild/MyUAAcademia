import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

//const backend_url = import.meta.env.VITE_PORT || 8080;


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    root: "./",
    base: "/",
    build: {
      outDir: "./dist",
      emptyOutDir: true
    },
    test: {
      globals: true,
      environment: "jsdom"
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 8080,
      host: true
    }
  }
})
