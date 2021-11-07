const { globalShortcut } = require('electron')
const isDev = require('electron-is-dev')

function registerDevToolsShortcut(win) {
  if (!win) return
  if (isDev) {
    globalShortcut.register('CmdOrCtrl+shift+i', () => {
      win.webContents.openDevTools()
    })
  }
}

module.exports = {
  registerDevToolsShortcut
}
