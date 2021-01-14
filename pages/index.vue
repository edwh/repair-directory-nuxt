<template>
  <BusinessPage />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'

export default {
  components: { BusinessPage },
  async asyncData({ app, params, store }) {
    // await store.dispatch('businesses/search', {
    //   category: null,
    //   location: 'London, UK',
    //   radius: 18,
    // })
  },
  head() {
    return this.buildHead(
      'Repair Directory',
      'Find a London business to repair your broken devices.'
    )
  },
}
</script>
