<template>
  <div>
    <Business
      v-for="business in sortedBusinesses"
      :key="'business-' + business.uid"
      :business="business"
      :selected="selected"
      @select="$emit('select', business.uid)"
    >
      {{ business.name }}
    </Business>
  </div>
</template>
<script>
import Business from '@/components/Business'

export default {
  components: { Business },
  props: {
    businesses: {
      type: Array,
      required: true,
    },
    selected: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    sortedBusinesses() {
      return this.businesses.slice().sort((a, b) => {
        if (b.positiveReviewPc !== a.positiveReviewPc) {
          return b.positiveReviewPc - a.positiveReviewPc
        } else {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.business-list {
  list-style: none;
  margin-bottom: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;

  @include media-breakpoint-up(md) {
    padding: 0 0.5rem;
  }
}
</style>
