<template>
  <BusinessPage :id="id" />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'
import page from '@/mixins/page'
import { TAGLINE_GENERIC } from '@/regions'

export default {
  components: { BusinessPage },
  mixins: [page],
  async fetch() {
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
      location = location === 'null' ? location : null
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
    const business = this.id
      ? this.$store.getters['businesses/get'](this.id)
      : null

    if (business) {
      return this.buildHead(business.name, business.description)
    } else {
      return this.buildHead('Repair Directory', TAGLINE_GENERIC)
    }
  },
}
</script>
