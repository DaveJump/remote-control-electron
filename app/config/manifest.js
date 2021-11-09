const { manifestPath } = require('./paths')

const productName = require(manifestPath).build.productName

module.exports = {
  productName
}
