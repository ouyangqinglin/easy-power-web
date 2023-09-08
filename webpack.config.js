
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@img': resolve('src/assets/images'),
      '@subComp': resolve('sub-component/component'),
      '@assets': resolve('src/assets')
    }
  }
}
