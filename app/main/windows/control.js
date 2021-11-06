const { BrowserWindow } = require('electron')
const path = require('path')
const { sendWindow } = require('./send')

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

  win.on('closed', () => {
    win = null
  })

  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))

  return win
}

function sendControlWindow(channel, ...args) {
  sendWindow(win, channel, ...args)
}

module.exports = {
  createControlWindow,
  sendControlWindow
}
