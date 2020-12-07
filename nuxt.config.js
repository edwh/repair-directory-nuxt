export default {
  target: 'universal',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Repair Directory Proof of Concept',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/vue2-leaflet', ssr: false },
    { src: '~/plugins/vue-awesome.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
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

  // Proxy to avoid CORS restrictions on API
  proxy: {
    // '/api/': { target: 'http://api.example.com', pathRewrite: {'^/api/': ''} }
    '/api/': 'https://map.restarters.net/map/',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
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
}
