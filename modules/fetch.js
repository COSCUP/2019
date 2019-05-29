const webpack = require('webpack')

module.exports = function() {
  // Extend build
  this.extendBuild(({ plugins, ...config }, { isClient }) => {
    if (isClient) {
      plugins.push(new webpack.ProvidePlugin({
        'fetch': 'exports-loader?self.fetch!whatwg-fetch'
      }))
    } else {
      plugins.push(new webpack.ProvidePlugin({
        'fetch': 'node-fetch'
      }))
    }
  })
}
