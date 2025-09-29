import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from "vite-plugin-mkcert";

//const backend_url = import.meta.env.VITE_PORT || 8080;


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), mkcert()],
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
      https: {
        cert: env.VITE_SSL_CRT_FILE,
        key: env.VITE_SSL_KEY_FILE
      },
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 8080,
      host: true
    }
  }
})
