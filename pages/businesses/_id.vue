<template>
  <BusinessPage :id="id" />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'
import { TAGLINE_GENERIC } from '@/regions'

export default {
  components: { BusinessPage },
  async asyncData({ store }) {
    // For SSR we want to have all the businesses loaded.  The business selected will pop up in a modal.
    await store.dispatch('businesses/search', {
      location: 'London, UK',
      category: null,
      radius: 18,
    })
  },
  data() {
    return {
      id: null,
    }
  },
  computed: {
    business() {
      return this.id ? this.$store.getters['businesses/get'](this.id) : null
    },
  },
  created() {
    this.id = parseInt(this.$route.params.id)
  },
  head() {
    if (this.business) {
      return this.buildHead(this.business.name, this.business.description)
    } else {
      return this.buildHead('Repair Directory', TAGLINE_GENERIC)
    }
  },
}
</script>
