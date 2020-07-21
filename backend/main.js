const { app, BrowserWindow } = require('electron')
const server = require('./server')
const helper = require('../config')
const createWindow = () => {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: false
        },
        backgroundColor: "#000000",
        fullscreen: true,
        autoHideMenuBar: true

    })

    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    //mainWindow.webContents.openDevTools();


    //mainWindow.loadURL(`http://localhost:${helper.PORT}`)
    mainWindow.loadURL(`http://localhost:5000`)
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