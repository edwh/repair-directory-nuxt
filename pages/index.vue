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
    this.id = this.$route.query.rd_business
      ? parseInt(this.$route.query.rd_business)
      : null

    // For SSR we want to have all the businesses loaded, unless we have a specific search filter.
    let category = null

    // We'll just search with a big radius, which will include anything in this region.
    let radius = 2000
    let location = null

    if (this.$route.query.rd_location) {
      location = this.$route.query.rd_location
    }

    if (this.$route.query.rd_category) {
      category = this.$route.query.rd_category
    }

    if (this.$route.query.rd_radius) {
      radius = this.$route.query.rd_radius
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
