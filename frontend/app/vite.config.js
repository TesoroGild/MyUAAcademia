import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isLocalHttps = env.VITE_SSL_CERT_FILE && env.VITE_SSL_KEY_FILE

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
      https: isLocalHttps ? {
        cert: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_CERT_FILE)),
        key: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_KEY_FILE)),
      } : false,
      //port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 8080,
      port: parseInt(env.VITE_PORT),
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false, 
        },
      }
    }
  }
})