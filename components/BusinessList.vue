<template>
  <div>
    <Business
      v-for="business in sortedBusinesses"
      :key="'business-' + business.uid"
      :business="business"
      :selected="selected"
      @select="$emit('select', business.uid)"
    />
  </div>
</template>
<script>
import Business from '@/components/Business'
import distance from '~/mixins/distance'

export default {
  components: { Business },
  mixins: [distance],
  props: {
    businesses: {
      type: Array,
      required: true,
    },
    selected: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    sortedBusinesses() {
      const businesses = this.businesses.slice()
      const location = this.$store.getters['businesses/searchLocation']

      if (location) {
        return businesses.sort((a, b) => {
          // Sort by distance then alphabetical.
          const aDistance = this.getDistance(
            [location.latitude, location.longitude],
            [a.geolocation.latitude, a.geolocation.longitude]
          )
          const bDistance = this.getDistance(
            [location.latitude, location.longitude],
            [b.geolocation.latitude, b.geolocation.longitude]
          )

          if (aDistance === bDistance) {
            return b.positiveReviewPc - a.positiveReviewPc
          } else {
            return aDistance - bDistance
          }
        })
      } else {
        // Sort by Review % then alphabetical.
        return businesses.sort((a, b) => {
          if (b.positiveReviewPc !== a.positiveReviewPc) {
            return b.positiveReviewPc - a.positiveReviewPc
          } else {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          }
        })
      }
    },
  },
  methods: {
    distanceAway(business) {
      return this.showDistance
        ? this.getDistance(this.center, [
            business.geolocation.latitude,
            business.geolocation.longitude,
          ])
        : null
    },
  },
}
</script>
<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.business-list {
  list-style: none;
  margin-bottom: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;

  @include media-breakpoint-up(md) {
    padding: 0 0.5rem;
  }
}
</style>
