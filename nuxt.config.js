const locales = [
  { code: 'en',    iso: 'en-US', file: 'en.ts' },
  { code: 'zh-TW', iso: 'zh-TW', file: 'zh-TW.ts' },
]

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'COSCUP 2018 x openSUSE.Asia x GNOME.Asia',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'COSCUP 2018 x openSUSE.Asia x GNOME.Asia' },
      { vmid: 'og:title', property: 'og:title', content: 'COSCUP 2018 x openSUSE.Asia x GNOME.Asia' },
      { vmid: 'og:type', property: 'og:type', content: 'website' },
      { vmid: 'og:image', property: 'og:image', content: '/assets/logo-512.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      /* Webfonts */
      { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/css?family=Noto+Sans' },
      { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/earlyaccess/notosanstc.css' },
      /* DNS prefetching */
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
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

      // Tree shaking fontAwesome icons
      ['fontawesome-free-solid', 'fontawesome-free-brands'].forEach((iconset) => {
        config.resolve.alias[`@fortawesome/${iconset}$`] = `@fortawesome/${iconset}/shakable.es.js`
      })
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
    '@nuxtjs/sitemap',
    'nuxt-fontawesome',
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
  sitemap: {
    hostname: 'https://2018.coscup.org',
    generate: true,
  },
  fontawesome: {
    component: 'Icon',
    imports: [
      {
        set: '@fortawesome/fontawesome-free-solid',
        icons: [
          'faExternalLinkAlt',
          'faBullhorn',
          'faChevronDown',
          'faMapMarkerAlt',
          'faClock',
        ],
      },
      {
        set: '@fortawesome/fontawesome-free-brands',
        icons: [
          /* Social networks */
          'faBlogger',
          'faFacebook',
          'faFlickr',
          'faGooglePlus',
          'faTwitter',
          'faYoutube',
          'faTelegram',
        ],
      },
      {
        set: '~/fonticons',
        icons: [
          'extPlurk',
        ],
      },
    ],
  },
  css: [
    'vue2vis/dist/vue2vis.css'
  ],
}
