// Strict Vuex stores can have a horrible perf cost.
import { REGION_LONDON } from '@/regions'

export const strict = false

export const actions = {
  async nuxtServerInit({ commit }, { store, route, app }) {
    // We need to use this hook to set parameters in the store before SSR occurs.
    //
    // Check if we've been passed some key info in URL parameters.  If so, record that in the store so that
    // it's accessible everywhere.
    //
    // This method is called by the fetch method in the page mixin, or manually if that's overriden.
    await store.dispatch('config/set', {
      key: 'region',
      value: route.query.rd_region || REGION_LONDON,
    })

    await store.dispatch('config/set', {
      key: 'domain',
      value: route.query.rd_parenturl || 'https://map.restarters.net',
    })

    if (route.query.rd_language) {
      // Set the requested language.
      await app.i18n.setLocale(route.query.rd_language)
    }

    await store.dispatch('config/set', {
      key: 'language',
      value: route.query.rd_language || null,
    })

    // We allow customisation of certain styles by passing in an rd_style query parameter which contains some
    // known fields.  We put these in the store here; the default layout will pick them up and construct
    // CSS from the result.
    await store.dispatch('config/set', {
      key: 'styles',
      value: route.query.rd_style,
    })

    await store.dispatch('config/set', {
      key: 'addbusiness',
      value: route.query.rd_addbusiness || null,
    })
  },
}
