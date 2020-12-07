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
  created() {
    this.id = parseInt(this.$route.params.id)
  },
}
</script>
