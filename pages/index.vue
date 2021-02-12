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

    // We'll just search with a big radius, which will include anything in this region.
    let radius = 2000
    let location = null

    if (route.query.location) {
      location = route.query.location
    }

    if (route.query.category) {
      category = route.query.category
    }

    if (route.query.radius) {
      radius = route.query.radius
    }

    const region = route.query.region || REGION_LONDON

    await store.dispatch('businesses/search', {
      category,
      location,
      radius,
      region,
    })

    return {
      region,
    }
  },
  head() {
    return this.buildHead('Repair Directory', this.tagline)
  },
}
</script>
