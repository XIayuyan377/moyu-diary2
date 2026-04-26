const { app, BrowserWindow } = require('electron')
const { join } = require('path')

let mainWindow

app.commandLine.appendSwitch('disable-gpu')

// 检测可用的 Vite 端口
async function findAvailableVitePort() {
  const http = require('http')
  const ports = [5173, 5174, 5175]
  
  for (const port of ports) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
          resolve()
        })
        req.on('error', reject)
        req.setTimeout(500)
      })
      return `http://localhost:${port}`
    } catch (e) {
      // 端口不可用，继续尝试下一个
    }
  }
  
  return 'http://localhost:5173'
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, 'preload.js')
    }
  })

  // 开发环境
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    // 检测可用的开发服务器，否则加载生产版本
    findAvailableVitePort().then((url) => {
      mainWindow.loadURL(url).catch(() => {
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
      })
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
