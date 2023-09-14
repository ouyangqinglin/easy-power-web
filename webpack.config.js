
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@img': resolve('src/assets/images'),
      '@sub': resolve('power-ati-sub'),
      '@subComp': resolve('power-ati-sub/component'),
      '@subImg': resolve('power-ati-sub/assets/img'),
      '@assets': resolve('src/assets')
    }
  }
}
