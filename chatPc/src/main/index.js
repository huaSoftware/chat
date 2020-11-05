/*
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-05 22:15:11
 */
import { app, BrowserWindow, Menu, ipcMain, screen } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  Menu.setApplicationMenu(null);
  mainWindow = new BrowserWindow({
    height: 455,
    useContentSize: true,
    width: 420,
    frame: false,
    resizable: false,
    maximizable: true,
    minimizable: true,
    transparent: true
  })

  mainWindow.loadURL(winURL)

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

ipcMain.on('mianWindowLogin', (event, arg) => { // arg为接受到的消息
  let winW = screen.getPrimaryDisplay().workAreaSize.width;
  let winH = screen.getPrimaryDisplay().workAreaSize.height;
  mainWindow.setBounds({ width: 800, height: 600, x: (winW / 2) - 400, y: (winH / 2) - 300 });
  mainWindow.setResizable(true);
})

ipcMain.on('mianWindowLogout', (event, arg) => { // arg为接受到的消息
  let winW = screen.getPrimaryDisplay().workAreaSize.width;
  let winH = screen.getPrimaryDisplay().workAreaSize.height;
  mainWindow.setBounds({ width: 420, height: 455, x: (winW / 2) - 210, y: (winH / 2) - 227 });
  mainWindow.setResizable(false);
})

ipcMain.on('mianWindowCheck', (event, arg) => { // arg为接受到的消息
  mainWindow.setSize(800,  600);
  mainWindow.setResizable(true);
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
