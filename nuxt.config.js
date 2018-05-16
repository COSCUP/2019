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
  },
  modules: [
    "~/modules/fetch.js",
    "~/modules/typescript.js",
    ['nuxt-i18n', {
      parsePages: false,
      locales: [
        { code: 'en',    iso: 'en-US', file: 'en.ts' },
        { code: 'zh-TW', iso: 'zh-TW', file: 'zh-TW.ts' },
      ],
      defaultLocale: 'zh-TW',
      langDir: 'languages/',
      lazy: true,
    }],
    ['@nuxtjs/moment', [
      /* en is embedded inside moment.js */
      'zh-tw',
      'ja',
    ]],
  ],
  plugins: [
    '~/plugins/i18n.ts',
  ],
}
