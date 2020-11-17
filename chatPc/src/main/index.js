/*
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-17 20:30:39
 */
import { app, BrowserWindow, Menu, ipcMain, screen, Tray } from 'electron'

const path = require('path');

//托盘对象
var appTray = null;
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

  if(process.platform === 'win32'){
    //设置托盘图标和菜单
    var trayMenuTemplate = [
      {
        label: '打开',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit();
          app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
        }
      }
    ];
    //系统托盘图标
    appTray = process.env.NODE_ENV === 'development' ?new Tray('build/icons/icon.ico'):new Tray(`${__dirname}/static/img/icon.ico`);
    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('我的托盘图标');
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    //单击右下角小图标显示应用左键
    appTray.on('click',function(){
      mainWindow.show();
    })
    //右键
    appTray.on('right-click', () => {
      appTray.popUpContextMenu(trayMenuTemplate);
    });
  };
  
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
