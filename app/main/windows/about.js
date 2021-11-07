const openAboutWindow = require('about-window').default
const { projectRoot, appLogoPath, manifestPath } = require('../../config/paths')

const createAboutWindow = () =>
  openAboutWindow({
    product_name: require(manifestPath).productName,
    icon_path: appLogoPath,
    package_json_dir: projectRoot,
    copyright: 'Copyright (c) 2021 DaveJump',
    homepage: 'https://github.com/davejump/remote-control-electron'
  })

module.exports = {
  createAboutWindow
}
