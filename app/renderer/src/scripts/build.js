const fs = require('fs-extra')
const path = require('path')

function moveBuiltResources() {
  const dest = path.resolve(__dirname, '../../pages/main')
  const src = path.resolve(__dirname, '../build')

  fs.removeSync(dest)
  fs.moveSync(src, dest)
}

moveBuiltResources()
