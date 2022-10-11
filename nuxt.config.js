const proxyConfig = () => {
  // Setting the API environment variable allows you to point at a development server if required, e.g.
  // API=https://map.restarters.dev/map
  return {
    '/api/': process.env.API
      ? process.env.API
      : 'https://map.restarters.net/map/',
  }
}

export default {
  target: 'server',

  head: {
    title: 'Repair Directory',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'apple-mobile-web-app-title', content: 'Repair Directory' },
      { name: 'og:site_name', content: 'Repair Directory' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

      // We need to load this font as it is used by REW via the rd_style configuration.
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Poppins',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Asap',
      },
    ],
  },

  css: ['@/assets/css/global.scss'],

  plugins: [
    { src: '~/mixins/global.js' },
    { src: '~/plugins/axios-baseurl' },
    { src: '@/plugins/vue-google-maps', ssr: false },
    { src: '@/plugins/vue2-leaflet', ssr: false },
    { src: '@/plugins/vue-star-rating', ssr: false },
    { src: '@/plugins/vue-social-sharing', ssr: false },
    { src: '@/plugins/vue-awesome.js', ssr: false },
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-analytics',
    '@nuxtjs/google-fonts',
  ],

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'vue-scrollto/nuxt',
    'nuxt-i18n',
  ],

  i18n: {
    defaultLocale: 'en',
    fallbackLocale: 'en',

    vueI18n: {
      fallbackLocale: 'en',

      // Suppress translation warnings because we translate categories from the server, which are in English and
      // therefore may not appear in our translation file.
      silentTranslationWarn: true,
    },

    // We are not translating the URLs themselves, e.g. '/business'
    strategy: 'no_prefix',

    // We don't want to guess at the language - it's passed in to us via a parameter.
    detectBrowserLanguage: false,

    // Recommended for SEO.
    onlyOnRoot: true,

    // Lazy load translations from files in lang folder.
    lazy: true,
    langDir: 'lang/',
    locales: [
      {
        code: 'en',
        file: 'en.js',
      },
      {
        code: 'cy',
        file: 'cy.js',
      },
    ],

    vuex: {
      // When doing SSR, the language will be set from an URL parameter.  We want to sync the locale with the i18n
      // store so that when the client initialises, it picks up the locale used on the server to generate the page.
      syncLocale: true,
    },
  },

  axios: {
    proxy: true,
    retry: {
      // Retry failed requests to give a bit more resilience to flaky networks, especially on mobile.
      // This also helps with server upgrades.
      //
      // Note that this doesn't retry requests that never complete.
      retries: 10,
      retryDelay: (retryCount) => {
        return retryCount * 1000
      },
      // eslint-disable-next-line handle-callback-err
      retryCondition: (error) => {
        return true
      },
      shouldResetTimeout: true,
    },
  },

  // Proxy to avoid CORS restrictions on API in development environment
  proxy: proxyConfig(),

  env: {
    // This will be used on the client in axios-baseurl to send requests to the same API endpoing that the server-side
    // code uses.
    API: process.env.API || 'https://map.restarters.net/map/',
  },

  build: {
    transpile: [/^vue2-google-maps($|\/)/],

    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        })
      }
    },
  },

  googleAnalytics: {
    id: 'UA-46050944-3',

    // Enable debug in development mode so that we can see what events are tracked.
    debug: {
      enabled: process.env.NODE_ENV !== 'production',
      sendHitTask: true,
    },
    fields: {
      cookieFlags: 'secure;samesite=none',
    },
  },

  googleFonts: {
    families: {
      'Patua One': [300, 400, 600],
    },
  },
}
