module.exports = function ({ locales = [], defaultLocale }) {
  const router = this.options.router

  const localePrefixes = locales.map(({ code }) => (code))
    .filter((code) => (code !== defaultLocale))
    .map((code) => (`/${code}`))
  localePrefixes.push('') // default locale has empty prefix

  const interpolateLangPrefixRoutes = ({ route, payload }) => (
    localePrefixes.map((prefix) => ({
      route: `${prefix}${route}`,
      payload,
    }))
  )

  const flatStaticRoutes = (routes, pathPrefix = '') => (
    routes.filter(({ path }) => (
      path.indexOf(':') === -1
    )).reduce((flattenPaths, { children, path }) => {
      if (children && children.length > 0) {
        flattenPaths.push(...flatStaticRoutes(children, `${pathPrefix}${path}/`))
      } else if (path === '') {
        flattenPaths.push(pathPrefix.slice(0, -1))
      } else {
        flattenPaths.push(`${pathPrefix}${path}`)
      }

      return flattenPaths
    }, []).map((route) => (typeof route === 'string' ? {
      route,
      payload: null,
    } : route))
  )

  this.nuxt.hook('generate:extendRoutes', function (routes) {
    const routesToGenerate = []

    routes.forEach((route) => {
      routesToGenerate.push(...interpolateLangPrefixRoutes(route))
    })
    routesToGenerate.push(...flatStaticRoutes(router.routes))

    routes.splice(0, routes.length, ...routesToGenerate)
  })
}
