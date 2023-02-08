<template>
  <l-marker
    :lat-lng="[business.geolocation.latitude, business.geolocation.longitude]"
    :icon="getIcon()"
    :z-index-offset="show ? 10000 : null"
    @click="select"
  >
    <l-tooltip>
      {{ business.name }}
    </l-tooltip>
  </l-marker>
</template>
<script>
let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  props: {
    business: {
      type: Object,
      required: true,
    },
    selected: {
      type: Number,
      required: false,
      default: null,
    },
  },
  watch: {
    selected: {
      immediate: true,
      handler(newVal) {
        this.show = newVal === this.business.uid
      },
    },
  },
  methods: {
    select() {
      setTimeout(() => {
        this.$emit('select', this.business.uid)
      }, 100)
    },
    getIcon() {
      const colour = this.selected === this.business.uid ? 'red' : 'blue'
      return new L.Icon({
        iconUrl: require('~/assets/images/marker-icon-2x-' + colour + '.png'),
        shadowUrl: require('~/assets/images/marker-shadow.png'),
        iconSize: [20, 33],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    },
  },
}
</script>
