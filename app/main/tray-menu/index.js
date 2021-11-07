if (process.platform === 'darwin') {
  module.exports = require('./darwin')
} else if (process.platform === 'win32') {
  module.exports = equire('./win32')
}
