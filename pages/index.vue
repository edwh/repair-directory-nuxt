<template>
  <BusinessPage :id="id" />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'
import page from '@/mixins/page'

export default {
  components: { BusinessPage },
  mixins: [page],
  async fetch() {
    this.setConfig()

    // We have been asked to show a business page.  This is passed via a query parameter so that we can do this
    // when embedded.  The url is created inside MapBusiness.
    this.id = this.$route.query.business
      ? parseInt(this.$route.query.business)
      : null
    console.log('Index page, business', this.id)

    // For SSR we want to have all the businesses loaded, unless we have a specific search filter.
    let category = null

    // We'll just search with a big radius, which will include anything in this region.
    let radius = 2000
    let location = null

    if (this.$route.query.location) {
      location = this.$route.query.location
    }

    if (this.$route.query.category) {
      category = this.$route.query.category
    }

    if (this.$route.query.radius) {
      radius = this.$route.query.radius
    }

    await this.$store.dispatch('businesses/search', {
      category,
      location,
      radius,
      region: this.region,
    })
  },
  data() {
    return {
      id: null,
    }
  },
  head() {
    return this.buildHead('Repair Directory', this.tagline)
  },
}
</script>
