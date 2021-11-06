const { app, BrowserWindow } = require('electron')
const { createMainWindow } = require('./windows/main')
const handleControl = require('./control')
const robot = require('./robot')

app.whenReady().then(() => {
  app.allowRendererProcessReuse = false

  let mainWindow = createMainWindow()

  handleControl()

  robot()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
