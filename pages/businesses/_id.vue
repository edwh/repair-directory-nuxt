<template>
  <BusinessPage :id="id" />
</template>
<script>
import BusinessPage from '@/components/BusinessPage'

export default {
  components: { BusinessPage },
  async asyncData({ app, params, store }) {
    await store.dispatch('businesses/search', {
      category: null,
      location: 'London, UK',
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
      return this.buildHead(
        'Repair Directory',
        'Find a London business to repair your broken devices.'
      )
    }
  },
}
</script>
