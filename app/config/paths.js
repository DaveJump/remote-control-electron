const path = require('path')

// paths
const projectRoot = path.resolve(__dirname, '../../')
const manifestPath = path.resolve(projectRoot, 'package.json')
const appPath = path.resolve(projectRoot, 'app')
const assetsPath = path.resolve(appPath, 'assets')
const appLogoPath = path.resolve(assetsPath, 'icons/logo.png')
const trayLogoPath = path.resolve(assetsPath, 'icons/tray_logo.png')

module.exports = {
  projectRoot,
  manifestPath,
  appPath,
  appLogoPath,
  assetsPath,
  trayLogoPath
}
