const fetch = require('node-fetch')

const locales = [
  { code: 'en',    iso: 'en-US', file: 'en.ts' },
  { code: 'zh-TW', iso: 'zh-TW', file: 'zh-TW.ts' },
]
const defaultLocale = 'zh-TW'

const generateRoutesFromAPI = (function () {
  var _cache = null

  return async function () {
    if (_cache) return _cache

    const API_ROOT = 'https://api2019.coscup.org'
    const apiRootResponse = await fetch(API_ROOT)
    const { index: langs = {} } = await apiRootResponse.json()

    const firstLangProgramsResponse = await fetch(`${API_ROOT}/programs.json`)
    const programs = await firstLangProgramsResponse.json()

    const routes = []

    const pushLocaledRoute = function (route) {
      locales.forEach(function ({ code }) {
        routes.push({
          route: `${code === defaultLocale ? '' : `/${code}`}${route}`,
          payload: null,
        })
      })
    }

    Object.values(programs.sessions)
      .forEach(function ({ id }) {
        pushLocaledRoute(`/programs/${id}`)
      })

    // EventDay (Workaround)
    ;[1, 2].forEach(function (day) {
      pushLocaledRoute(`/programs/day${day}`)
    })

    return _cache = routes
  }
})()

module.exports = {
  router: { base : process.env.NODE_ENV === 'staging' ? '/' : '/2019/'},
  /*
  ** Headers of the page
  */
  head: {
    title: 'COSCUP 2019 | Conference for Open Source Coders, Users, and Promoters',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'og:description', property: 'og:description', content: 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.' },
      { hid: 'og:title', property: 'og:title', content: 'COSCUP 2019, Conference for Open Source Coders, Users, and Promoters' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.' },
      { hid: 'og:image', property: 'og:image', content: 'https://coscup.org/2019/logo-512.png' },
      { hid: 'og:image:width', property: 'og:image:width', content: '512' },
      { hid: 'og:image:height', property: 'og:image:height', content: '512' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/2019/favicon.ico' },
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
    ['nuxt-i18n', {
      parsePages: false,
      locales: locales,
      defaultLocale: defaultLocale,
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
    '@nuxtjs/proxy',
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
  proxy: {
    '/api': {
      target: 'http://192.168.11.134:8000',
      pathRewrite: {
        '^/api' : '/'
      }
    }
  },
}
