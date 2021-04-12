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
    // For SSR we want to have all the businesses loaded.  The business selected will pop up in a modal.
    //
    // Until the server has a concept of regions, we'll just search with a big radius, which will include anything in
    // this region.
    await this.$store.dispatch('businesses/search', {
      location: null,
      category: null,
      radius: 2000,
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
  head() {
    if (this.business) {
      return this.buildHead(this.business.name, this.business.description)
    } else {
      return this.buildHead('Repair Directory', this.$t('findBusinessGeneric'))
    }
  },
}
</script>
