<template>
  <GmapMap
    ref="map"
    :center="{ lat: center[0], lng: center[1] }"
    :zoom="7"
    map-type-id="roadmap"
    style="width: 100%; height: 100vh"
    @idle="idle"
  >
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      :show-modal="showModal === business.uid"
      :selected="selected"
      :map="map"
      @select="select(business)"
    />
  </GmapMap>
</template>
<script>
import MapBusiness from '@/components/MapBusiness'
import { gmapApi } from 'vue2-google-maps'

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
      map: null,
      fitted: false,
      showModal: false,
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }
  },
  computed: {
    google: gmapApi,
  },
  watch: {
    businesses: {
      immediate: true,
      handler(newVal) {
        this.fitMarkers(newVal)
      },
    },
    selected: {
      immediate: true,
      handler(newVal) {
        // Delay modal as this interferes with list scrolling.
        setTimeout(() => {
          this.showModal = newVal
        }, 1000)
      },
    },
  },
  methods: {
    idle() {
      if (!this.fitted) {
        this.fitMarkers(this.businesses)
        this.fitted = true
      }
    },
    select(business) {
      this.$emit('selected', business.uid)
    },
    fitMarkers(businesses) {
      if (this.$refs.map) {
        this.map = this.$refs.map

        // We want to fit the map to the new businesses
        const bounds = new this.google.maps.LatLngBounds()
        businesses.forEach((b) => {
          bounds.extend(
            // eslint-disable-next-line new-cap
            new this.google.maps.LatLng(
              b.geolocation.latitude,
              b.geolocation.longitude
            )
          )
        })

        if (businesses.length) {
          this.$refs.map.$mapPromise.then((map) => {
            map.fitBounds(bounds)
          })
        }
      }
    },
  },
}
</script>
