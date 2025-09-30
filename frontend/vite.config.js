import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
//import mkcert from "vite-plugin-mkcert";
import fs from 'fs'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    //, mkcert()
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
      https: {
        cert: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_CERT_FILE)),
        key: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_KEY_FILE)),
      },
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 8080,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
        },
      }
    }
  }
})
