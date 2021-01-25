<template>
  <BusinessPage :region="region" />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'
import { REGION_LONDON } from '@/regions'

export default {
  components: { BusinessPage },
  async asyncData({ route, store }) {
    // For SSR we want to have all the businesses loaded, unless we have a specific search filter.
    let category = null
    let location = 'London, UK'
    let radius = 18

    if (route.query.location) {
      location = route.query.location
    }

    if (route.query.category) {
      category = route.query.category
    }

    if (route.query.radius) {
      radius = route.query.radius
    }

    await store.dispatch('businesses/search', {
      category,
      location,
      radius,
    })

    return {
      region: route.query.region || REGION_LONDON,
    }
  },
  head() {
    return this.buildHead('Repair Directory', this.tagline)
  },
}
</script>
