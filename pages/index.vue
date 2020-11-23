<template>
  <div class="layout">
    <div>
      <h1>Repair Directory Proof of Concept</h1>
      <div v-for="business in businesses" :key="'business-' + business.uid">
        {{ business.name }}
      </div>
    </div>
    <div>
      <client-only>
        <l-map
          ref="map"
          style="width: 100%; height: 100vh"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :center="center"
          @ready="ready"
          @zoomend="idle"
          @moveend="idle"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <l-marker
            v-for="business in businesses"
            :key="'marker-' + business.uid"
            :lat-lng="[
              business.geolocation.latitude,
              business.geolocation.longitude,
            ]"
          />
        </l-map>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      minZoom: 10,
      maxZoom: 16,
      center: [51.5074, 0.1278],
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',

      category: null,
      location: 'London, UK',
      radius: 18,
    }
  },
  computed: {
    ...mapGetters({ businesses: 'businesses/list' }),
  },
  mounted() {
    this.search()
  },
  methods: {
    async search() {
      await this.$store.dispatch('businesses/search', {
        location: this.location,
        category: this.category,
        radius: this.radius,
      })
    },
    ready() {},
    idle() {},
  },
}
</script>

<style>
.layout {
  margin: 0 auto;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
