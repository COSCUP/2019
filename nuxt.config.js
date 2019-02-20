const fetch = require('node-fetch')

const locales = [
  { code: 'en',    iso: 'en-US', file: 'en.ts' },
  { code: 'zh-TW', iso: 'zh-TW', file: 'zh-TW.ts' },
]

const generateRoutesFromAPI = (function () {
  var _cache = null

  return async function () {
    if (_cache) return _cache

    const API_ROOT = 'https://api2019.coscup.org'
    const apiRootResponse = await fetch(API_ROOT)
    const { index: langs = {} } = await apiRootResponse.json()

    const firstLangProgramsResponse = await fetch(`${API_ROOT}${Object.values(langs)[0].programs}`)
    const programs = await firstLangProgramsResponse.json()

    const routes = []
    Object.keys(
      Object.values(programs.tracks)
        .reduce((collection, { group }) => {
          collection[group] = true

          return collection
        }, {})
    ).forEach(function (group) {
      routes.push({
        route: `/tracks/${group}`,
        payload: null,
      })
    })

    Object.values(programs.talks)
      .forEach(function ({ talk }) {
        routes.push({
          route: `/programs/${talk}`,
          payload: null,
        })
      })

    return _cache = routes
  }
})()

module.exports = {
  router: { base :'/2019/'},
  /*
  ** Headers of the page
  */
  head: {
    title: 'COSCUP 2019',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: 'COSCUP 2019' },
      { hid: 'og:title', property: 'og:title', content: 'COSCUP 2019' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:image', property: 'og:image', content: 'https://coscup.org/coscup/logo-512.png' },
      { hid: 'og:image:width', property: 'og:image:width', content: '512' },
      { hid: 'og:image:height', property: 'og:image:height', content: '512' }
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
    ['@nuxtjs/markdownit', {
      xhtmlOut: true,
      linkify: true,
      breaks: true,
    }],
    ['@nuxtjs/google-analytics', {
      id: 'UA-12923351-7'
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
    routes: generateRoutesFromAPI,
    concurrency: 10,
  },
  sitemap: {
    hostname: 'https://coscup.org/2019',
    generate: true,
    routes: async function () {
      const routes = await generateRoutesFromAPI()

      return [
        ...routes.map((route) => (route.route)),
        ...routes.map((route) => (`/en${route.route}`))
      ]
    },
  },
  fontawesome: {
    component: 'Icon',
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: [
          'faExternalLinkAlt',
          'faBullhorn',
          'faChevronDown',
          'faMapMarkerAlt',
          'faClock',
          'faColumns',
          'faUserAlt',
          'faComment',
          'faStar',
          'faStarHalfAlt',
          'faUserFriends',
        ],
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: [
          'faStar',
        ],
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
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
  markdownit: {
    injected: true
  },
}
