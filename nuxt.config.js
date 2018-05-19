const locales = [
  { code: 'en',    iso: 'en-US', file: 'en.ts' },
  { code: 'zh-TW', iso: 'zh-TW', file: 'zh-TW.ts' },
]

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'COSCUP',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'COSCUP 2018' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: 'rgba(59, 156, 96, 0.4)' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendors: [
      'babel-polyfill',
    ],
  },
  modules: [
    "~/modules/fetch.js",
    "~/modules/typescript.js",
    ['nuxt-i18n', {
      parsePages: false,
      locales: locales,
      defaultLocale: 'zh-TW',
      langDir: 'languages/',
      lazy: true,
    }],
    ['@nuxtjs/moment', [
      /* en is embedded inside moment.js */
      'zh-tw',
      'ja',
    ]],
    ['~/modules/google-maps.js', {
      key: 'AIzaSyBXDjcMb0gqT_UwYSYSsA6WlJr3tu1uRyc',
    }],
    ['~/modules/static-route.js', {
      locales: locales,
      defaultLocale: 'zh-TW',
    }],
  ],
  plugins: [
    {
      src: '~/plugins/nuxt-client-init.ts',
      ssr: false,
    },
    '~/plugins/i18n.ts',
  ],
  generate: {
    fallback: true,
  },
}
