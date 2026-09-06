import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { spawn } from 'child_process'
import http from 'http'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function autoStartBackendPlugin() {
  return {
    name: 'auto-start-fastapi-backend',
    configureServer() {
      // Check if backend is already active on port 8001
      const req = http.get('http://127.0.0.1:8001/health', (res) => {
        if (res.statusCode === 200) {
          console.log('\x1b[32m[CropShield AI] FastAPI backend is already running on http://127.0.0.1:8001\x1b[0m')
        }
      })
      req.on('error', () => {
        console.log('\x1b[33m[CropShield AI] Starting FastAPI backend on http://127.0.0.1:8001...\x1b[0m')
        const rootDir = path.resolve(__dirname, '..')
        const venvPython = path.join(rootDir, 'ml', '.venv', 'Scripts', 'python.exe')
        const pythonCmd = fs.existsSync(venvPython) ? venvPython : 'python'

        const backendProcess = spawn(
          pythonCmd,
          ['-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '8001'],
          {
            cwd: rootDir,
            stdio: 'inherit',
            shell: true,
          }
        )

        backendProcess.on('error', (err) => {
          console.error('\x1b[31m[CropShield AI] Failed to auto-start backend:\x1b[0m', err)
        })

        process.on('exit', () => backendProcess.kill())
        process.on('SIGINT', () => {
          try {
            backendProcess.kill()
          } catch (e) {}
          process.exit()
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), autoStartBackendPlugin()],
  server: {
    proxy: {
      '/predict': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
})
