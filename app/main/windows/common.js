const sendWindow = (win, channel, ...args) => {
  win && win.webContents.send(channel, ...args)
}

module.exports = {
  sendWindow
}
