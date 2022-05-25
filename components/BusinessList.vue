<template>
  <div>
    <Business
      v-for="business in sortedBusinesses"
      :key="'business-' + business.uid"
      :business="business"
      :selected="selected"
      :distance="distanceAway(business)"
      @select="$emit('select', business.uid)"
    >
      {{ business.name }} {{ distance }}, {{ business.geolocation }}
    </Business>
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
    center: {
      type: Array,
      required: false,
      default: null,
    },
    showDistance: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    sortedBusinesses() {
      const businesses = this.businesses.slice()

      if (this.center) {
        return businesses.sort((a, b) => {
          // Sort by distance then alphabetical.
          const aDistance = this.getDistance(this.center, [
            a.geolocation.latitude,
            a.geolocation.longitude,
          ])
          const bDistance = this.getDistance(this.center, [
            b.geolocation.latitude,
            b.geolocation.longitude,
          ])

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
      return this.center
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
