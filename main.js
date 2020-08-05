const { app, BrowserWindow } = require('electron')
const server = require('./backend/server')
const path = require('path')
const url = require('url')

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: false,
    },
    backgroundColor: '#000000',
    fullscreen: true,
    autoHideMenuBar: true,
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  //mainWindow.webContents.openDevTools();
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './backend/build/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  )
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
