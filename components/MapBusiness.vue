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
    map: {
      type: Object,
      required: false,
      default: null,
    },
  },
  watch: {
    selected: {
      immediate: true,
      handler(newVal) {
        this.show = newVal === this.business.uid

        if (this.map && this.show) {
          // // We want to ensure that the map marker is visible, if possible.  This is a bit fragile.
          const zoomLevel = this.map.mapObject.getZoom()
          const dpPerDegree = (256.0 * Math.pow(2, zoomLevel)) / 170.0
          const mapHeight = this.map.$el.clientHeight
          const mapHeightPercent = (50.0 * mapHeight) / 100.0
          const latOffset = mapHeight > 768 ? mapHeightPercent / dpPerDegree : 0

          this.map.mapObject.flyTo([
            this.business.geolocation.latitude + latOffset,
            this.business.geolocation.longitude,
          ])
        }
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
      const colour = this.show ? 'red' : 'blue'
      return new L.Icon({
        iconUrl: require('~/assets/images/marker-icon-2x-' + colour + '.png'),
        shadowUrl: require('~/assets/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    },
  },
}
</script>
