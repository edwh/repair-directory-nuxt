const proxyConfig = () => {
  // Setting the API environment variable allows you to point at a development server if required, e.g.
  // API=https://map.restarters.dev
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['@/assets/css/global.scss'],

  plugins: [
    { src: '~/mixins/global.js' },
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
  ],

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
  },

  googleFonts: {
    families: {
      'Patua One': [300, 400, 600],
    },
  },
}
