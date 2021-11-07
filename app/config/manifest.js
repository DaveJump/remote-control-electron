const { manifestPath } = require('./paths')

const productName = require(manifestPath).productName

module.exports = {
  productName
}
