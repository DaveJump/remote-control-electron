const { app, Menu, Tray } = require('electron')
const { createAboutWindow } = require('../windows/about')
const { showMainWindow } = require('../windows/main')
const { trayLogoPath } = require('../../config/paths')

function configTray() {
  let tray = new Tray(trayLogoPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: `Open ${app.name}`, click: showMainWindow },
    { label: `About ${app.name}`, click: createAboutWindow },
    { type: 'separator' },
    { label: 'Quit', click: app.quit }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

function configMenu() {
  let appMenu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(appMenu)
}

module.exports = {
  configTray,
  configMenu
}
