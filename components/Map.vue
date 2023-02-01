<template>
  <l-map ref="map" style="width: 100%; height: 100vh" :center="center">
    <l-tile-layer
      :url="osmtile"
      :attribution="attribution"
      :tile-size="256"
      :max-zoom="18"
      :zoom-offset="-1"
    />
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      :selected="selected"
      @select="select(business)"
    />
  </l-map>
</template>
<script>
import MapBusiness from '@/components/MapBusiness'
import { BOUNDS_LONDON, BOUNDS_WALES, REGION_WALES } from '@/regions'

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
    location: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      zoom: null,
      showModal: false,
      osmtile:
        'https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmVpbHJlc3RhcnQiLCJhIjoiY2ptbTV0bDM5MGJ6ODN2bnVzM3lzOXMxbyJ9.dUSm_n4UkDRcQY_LBw_ihQ&tilesize=256',
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong>',
      bounds: null,
      lastBusinessesFitted: null,
    }
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
      console.log('Idle, fit markers')

      // We only want to fit the map to the markers if the businesses have changed since last time we did this.
      if (
        !this.lastBusinessesFitted ||
        JSON.stringify(this.businesses) !== this.lastBusinessesFitted
      ) {
        this.lastBusinessesFitted = JSON.stringify(this.businesses)
        this.fitMarkers(this.businesses)
      } else {
        console.log('No change to businesses')
      }
    },
    select(business) {
      this.$emit('selected', business.uid)
    },
    fitMarkers(businesses) {
      if (!businesses.length) {
        // Nothing to show.
        console.log('Nothing to show')
        if (this.location) {
          // ...but zoom to the location to at least indicate that we searched.
          console.log('Got location')
          this.zoom = 14
        } else {
          // ...and no location specified - show the whole region.
          console.log('No location')
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

          const markers = []
          markers.push(new L.Marker([bounds.sw.lat, bounds.sw.lng]))
          markers.push(new L.Marker([bounds.ne.lat, bounds.ne.lng]))

          // eslint-disable-next-line new-cap
          const fg = new L.featureGroup(markers)
          this.waitForRef('map', () => {
            this.$refs.map.mapObject.fitBounds(fg.getBounds().pad(0.1))
          })
        }
      } else {
        // Got some businesses.
        console.log('Got some businesses')

        const markers = []

        // We want to fit the map to the new businesses
        markers.push(new L.Marker([this.center[0], this.center[1]]))
        businesses.forEach((b) => {
          markers.push(
            // eslint-disable-next-line new-cap
            new L.Marker([b.geolocation.latitude, b.geolocation.longitude])
          )
        })

        if (businesses.length === 1) {
          // Ensure we're not too zoomed in - set a decent zoom and centre.
          console.log('...only 1')
          this.$store.dispatch('businesses/setCenter', {
            lat: businesses[0].geolocation.latitude,
            lng: businesses[0].geolocation.longitude,
          })

          this.zoom = 14
        } else if (businesses.length > 1) {
          // Pad the map so the markers will show if they're at the edge.
          // eslint-disable-next-line new-cap
          const fg = new L.featureGroup(markers)
          console.log('...multiple', markers)

          this.waitForRef('map', () => {
            this.$refs.map.mapObject.fitBounds(fg.getBounds().pad(0.1))
          })
        }
      }
    },
  },
}
</script>
