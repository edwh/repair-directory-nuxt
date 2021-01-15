<template>
  <BusinessPage />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'

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
  },
  head() {
    return this.buildHead(
      'Repair Directory',
      'Find a London business to repair your broken devices.'
    )
  },
}
</script>
