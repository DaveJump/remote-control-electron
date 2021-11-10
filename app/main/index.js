const { app } = require('electron')
const {
  createMainWindow,
  closeMainWindow,
  showMainWindow
} = require('./windows/main')
const isSingleInstance = app.requestSingleInstanceLock()
const { productName } = require('../config/manifest')
const { configTray, configMenu } = require('./tray-menu')

if (!isSingleInstance) { // 阻止多开
  app.quit()
} else {
  app.setName(productName)
  // 设置 name 和 menu 需在 app.whenReady 之前，否则会被默认 menu 覆盖
  configMenu()

  app.on('second-instance', () => {
    showMainWindow()
  })

  let tray = null // tray 需在入口模块全局引用避免被 GC 导致托盘图标消失
  app.whenReady().then(() => {
    require('@electron/remote/main').initialize()

    app.allowRendererProcessReuse = false // 高版本 electron (< 14)设置关闭后才能使用原生 node 模块

    tray = configTray()

    createMainWindow()

    require('./control')()

    // robot()
    require('./robot')()
  })

  app.on('before-quit', () => {
    closeMainWindow()
  })

  app.on('activate', () => {
    showMainWindow()
  })
}
