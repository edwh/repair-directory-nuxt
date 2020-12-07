<template>
  <l-map ref="map" style="width: 100%; height: 100vh" :center="center">
    <l-tile-layer :url="osmtile" :attribution="attribution" />
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      :show-modal="showModal === business.uid"
      :selected="selected"
      :map="map"
      @select="select(business)"
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
    selected: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }
  },
  computed: {
    map() {
      return this.$refs.map ? this.$refs.map : null
    },
  },
  watch: {
    businesses: {
      immediate: true,
      handler(newVal) {
        this.fitMarkers(newVal)
      },
    },
    selected(newVal) {
      // Delay modal as this interferes with list scrolling.
      setTimeout(() => {
        this.showModal = newVal
      }, 1000)
    },
  },
  mounted() {
    this.fitMarkers(this.businesses)
  },
  methods: {
    select(business) {
      this.$emit('selected', business.uid)
    },
    fitMarkers(businesses) {
      if (this.$refs.map) {
        // We want to fit the map to the new businesses
        const markers = []
        businesses.forEach((b) => {
          markers.push(
            // eslint-disable-next-line new-cap
            new L.Marker([b.geolocation.latitude, b.geolocation.longitude])
          )
        })

        if (markers.length) {
          // eslint-disable-next-line new-cap
          const fg = new L.featureGroup(markers)

          this.$refs.map.mapObject.fitBounds(fg.getBounds().pad(0.1))
        }
      }
    },
  },
}
</script>
