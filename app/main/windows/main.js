const { BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const { sendWindow } = require('./send')

let win = null

function createMainWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.on('closed', () => {
    win = null
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
  }

  return win
}

function sendMainWindow(channel, ...args) {
  sendWindow(win, channel, ...args)
}

module.exports = {
  createMainWindow,
  sendMainWindow
}
