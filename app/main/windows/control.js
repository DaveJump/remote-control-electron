const { BrowserWindow } = require('electron')
const path = require('path')
const { sendWindow } = require('./common')
const { registerDevToolsShortcut } = require('../shortcut/global')

let win = null

function createControlWindow() {
   win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  registerDevToolsShortcut(win)

  win.on('close', () => {
    win = null
  })

  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
}

function sendControlWindow(channel, ...args) {
  sendWindow(win, channel, ...args)
}

module.exports = {
  createControlWindow,
  sendControlWindow
}
