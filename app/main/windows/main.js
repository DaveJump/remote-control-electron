const { BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const { sendWindow } = require('./common')
const { registerDevToolsShortcut } = require('../shortcut/global')

let win = null

let willQuitApp = false

function createMainWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 400,
    minWidth: 800,
    minHeight: 400,
    maxWidth: 800,
    maxHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  registerDevToolsShortcut(win)

  require('@electron/remote/main').enable(win.webContents)

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
  }

  // Prevent quit when close
  win.on('close', e => {
    if (willQuitApp) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })

  return win
}

function sendMainWindow(channel, ...args) {
  sendWindow(win, channel, ...args)
}

function showMainWindow() {
  win.show()
}

function closeMainWindow() {
  willQuitApp = true
  win.close()
}

module.exports = {
  createMainWindow,
  sendMainWindow,
  showMainWindow,
  closeMainWindow
}
