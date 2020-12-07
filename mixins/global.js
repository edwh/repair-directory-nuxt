// Global mixin so that every component can access the logged in state and user.
import Vue from 'vue'

Vue.mixin({
  methods: {
    waitForRef(name, callback) {
      // When a component is conditional using a v-if, it sometimes takes more than one tick for it to appear.  So
      // we have a bit of a timer.
      if (this.$refs[name]) {
        callback.apply(this)
      } else {
        setTimeout(() => {
          this.waitForRef(name, callback)
        }, 100)
      }
    },
    trackOutboundLink(url) {
      this.$ga.event('outbound', 'click', url)
    },
    buildHead(title, description, image) {
      const meta = [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },

        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
      ]

      const retImage = image || require('~/static/logo.png')

      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: retImage,
      })

      meta.push({
        hid: 'og:url',
        property: 'og:url',
        content: process.env.USER_SITE + this.$route.fullPath,
      })

      meta.push({
        hid: 'twitter:image',
        property: 'twitter:image',
        content: retImage,
      })

      return {
        title,
        meta,
      }
    },
  },
})
