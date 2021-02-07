const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  })
  win.loadURL('http://localhost:8080/index.html')
}

const __initialize__ = async () => {
  await app.whenReady()

  const childProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
  })

  // childProcess.on('error', (error) => {
  //   console.error(error)
  // })
  createWindow()
}

__initialize__()
