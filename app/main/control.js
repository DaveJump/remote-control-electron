const { ipcMain } = require('electron')
const { sendMainWindow } = require('./windows/main')
const { createControlWindow, sendControlWindow } = require('./windows/control')
const { signal } = require('./signal')

function handleLogin() {
  ipcMain.handle('login', async () => {
    const { code } = await signal.invoke('login', null, 'logined', true)
    return code
  })
}

function handleControl() {
  ipcMain.on('control', (event, remote) => {
    signal.send('control', { remote })
  })

  // 监听主动控制
  signal.on('controlled', data => {
    createControlWindow()
    changeControlState(data.remote, 1)
  })

  // 监听被控制
  signal.on('be-controlled', data => {
    changeControlState(data.remote, 2)
  })

  // 转发信令，用于 P2P 对发
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data })
  })

  signal.on('offer', data => {
    sendMainWindow('offer', data)
  })
  signal.on('answer', data => {
    sendControlWindow('answer', data)
  })
  signal.on('puppet-candidate', data => {
    sendControlWindow('candidate', data)
  })
  signal.on('control-candidate', data => {
    sendMainWindow('candidate', data)
  })
}

function changeControlState(remoteCode, state) {
  sendMainWindow('control-state-change', remoteCode, state)
}

module.exports = () => {
  handleLogin()
  handleControl()
}
