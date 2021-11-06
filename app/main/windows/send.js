exports.sendWindow = (win, channel, ...args) => {
  win && win.webContents.send(channel, ...args)
}
