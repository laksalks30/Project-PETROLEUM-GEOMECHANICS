const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const http = require('http')

let mainWindow
let backendProcess
const BACKEND_PORT = 8000
const FRONTEND_PORT = 5173
const isDev = process.env.NODE_ENV !== 'production'

// ── Backend startup ────────────────────────────────────────────────────────────
function startBackend() {
  const backendDir = path.join(__dirname, '..', 'backend')

  // Try python3 first, fallback to python
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'

  backendProcess = spawn(pythonCmd, [
    '-m', 'uvicorn', 'main:app',
    '--host', '127.0.0.1',
    '--port', String(BACKEND_PORT),
    '--log-level', 'info',
  ], {
    cwd: backendDir,
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  })

  backendProcess.stdout?.on('data', d => console.log('[backend]', d.toString().trim()))
  backendProcess.stderr?.on('data', d => console.error('[backend]', d.toString().trim()))

  backendProcess.on('error', err => console.error('Failed to start backend:', err))
  backendProcess.on('close', code => console.log('Backend exited with code', code))

  console.log('Backend process started (PID:', backendProcess.pid, ')')
}

// ── Wait for backend to be ready ───────────────────────────────────────────────
function waitForBackend(retries = 30, delay = 1000) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      if (remaining === 0) {
        reject(new Error('Backend did not start in time'))
        return
      }
      const req = http.get(`http://127.0.0.1:${BACKEND_PORT}/`, res => {
        if (res.statusCode === 200) {
          resolve()
        } else {
          setTimeout(() => check(remaining - 1), delay)
        }
      })
      req.on('error', () => setTimeout(() => check(remaining - 1), delay))
      req.setTimeout(800, () => { req.destroy(); setTimeout(() => check(remaining - 1), delay) })
    }
    check(retries)
  })
}

// ── Create window ──────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 960,
    minWidth: 1280,
    minHeight: 800,
    title: 'Hydraulic Fracturing Design Engine Dashboard',
    backgroundColor: '#0a1428',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    icon: path.join(__dirname, '..', 'public', 'icon.ico'),
    show: false,
    titleBarStyle: 'default',
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  const url = isDev
    ? `http://localhost:${FRONTEND_PORT}`
    : `file://${path.join(__dirname, '..', 'dist', 'index.html')}`

  mainWindow.loadURL(url)

  mainWindow.on('closed', () => { mainWindow = null })
}

// ── App lifecycle ──────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  startBackend()

  try {
    console.log('Waiting for backend to be ready…')
    await waitForBackend(40, 1000)
    console.log('Backend is ready!')
  } catch (e) {
    console.warn('Backend not ready within timeout – opening UI anyway')
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill('SIGTERM')
    backendProcess = null
  }
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill('SIGTERM')
    backendProcess = null
  }
})
