<template>
  <GmapMap
    ref="map"
    :center="{ lat: center[0], lng: center[1] }"
    map-type-id="roadmap"
    style="width: 100%; height: 100vh"
    @idle="idle"
  >
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      :selected="selected"
      :map="map"
      :region="region"
      @select="select(business)"
    />
  </GmapMap>
</template>
<script>
import MapBusiness from '@/components/MapBusiness'
import { gmapApi } from 'vue2-google-maps'
import { BOUNDS_LONDON, BOUNDS_WALES, REGION_WALES } from '@/regions'

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
        let bounds = null

        switch (this.region) {
          case REGION_WALES: {
            bounds = BOUNDS_WALES
            break
          }
          default: {
            bounds = BOUNDS_LONDON
            break
          }
        }

        if (!businesses.length) {
          bounds = new this.google.maps.LatLngBounds(
            new this.google.maps.LatLng(bounds.sw),
            new this.google.maps.LatLng(bounds.ne)
          )
        } else {
          bounds = new this.google.maps.LatLngBounds()

          businesses.forEach((b) => {
            bounds.extend(
              // eslint-disable-next-line new-cap
              new this.google.maps.LatLng(
                b.geolocation.latitude,
                b.geolocation.longitude
              )
            )
          })
        }

        this.$refs.map.$mapPromise.then((map) => {
          map.fitBounds(bounds)
        })
      }
    },
  },
}
</script>
