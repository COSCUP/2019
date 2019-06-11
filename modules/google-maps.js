const path = require('path')

module.exports = function (options) {
  this.extendBuild((config, { isClient }) => {
    if (isClient) return;

    // This instructs Webpack to include `vue2-google-maps`'s Vue files
    // for server-side rendering
    config.externals = config.externals || []
    config.externals.splice(0, 0, (context, request, callback) => {
      if (/^vue2-google-maps($|\/)/.test(request)) {
        callback(null, false)
      } else {
        callback()
      }
    })
  })

  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/google-maps.template.js'),
    options,
  })
}
