<template>
  <l-map
    ref="map"
    style="width: 100%; height: 100vh"
    :center="center"
    @ready="ready"
    @zoomend="idle"
    @moveend="idle"
  >
    <l-tile-layer :url="osmtile" :attribution="attribution" />
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      @selected="selected"
    />
  </l-map>
</template>
<script>
import MapBusiness from '@/components/MapBusiness'
let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: { MapBusiness },
  props: {
    businesses: {
      type: Array,
      required: true,
    },
    center: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }
  },
  watch: {
    businesses: {
      immediate: true,
      handler(newVal) {
        if (this.$refs.map) {
          // We want to fit the map to the new businesses

          const markers = []
          newVal.forEach((b) => {
            markers.push(
              // eslint-disable-next-line new-cap
              new L.Marker([b.geolocation.latitude, b.geolocation.longitude])
            )
          })

          // eslint-disable-next-line new-cap
          const fg = new L.featureGroup(markers)

          this.$refs.map.mapObject.fitBounds(fg.getBounds().pad(0.1))
        }
      },
    },
  },
  methods: {
    ready() {},
    idle() {},
    selected(business) {
      this.$emit('selected', this.business.id)
    },
  },
}
</script>
