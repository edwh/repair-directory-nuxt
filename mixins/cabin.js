import Vue from 'vue'

Vue.mixin({
  methods: {
    cabin(event, p1, p2) {
      console.log('Event', event, p1, p2)
      window.cabin.event(
        JSON.stringify({
          event,
          p1,
          p2,
        })
      )
    },
  },
})
