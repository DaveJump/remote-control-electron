const { app, Menu, Tray } = require('electron')
const { createAboutWindow } = require('../windows/about')
const { showMainWindow } = require('../windows/main')
const { trayLogoPath } = require('../../config/paths')

function configTray() {
  let tray = new Tray(trayLogoPath)
  tray.on('click', () => {
    showMainWindow()
  })
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: showMainWindow },
    { label: 'Quit', click: app.quit }
  ])
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
  return tray
}

function configMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: `About ${app.name}`,
          click: createAboutWindow
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    { role: 'fileMenu' },
    { role: 'windowMenu' },
    { role: 'editMenu' }
  ])
  Menu.setApplicationMenu(appMenu)
}

module.exports = {
  configTray,
  configMenu
}
