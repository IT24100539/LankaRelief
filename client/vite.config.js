import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function apiTarget() {
  if (process.env.VITE_API_PROXY) return process.env.VITE_API_PROXY

  try {
    const envFile = fs.readFileSync(
      path.resolve(import.meta.dirname, '../server/.env'),
      'utf8',
    )
    const match = envFile.match(/^PORT=(\d+)\s*$/m)
    if (match) return `http://127.0.0.1:${match[1]}`
  } catch {
    // use the documented default
  }

  return 'http://127.0.0.1:5000'
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: apiTarget(),
        changeOrigin: true,
      },
    },
  },
})
