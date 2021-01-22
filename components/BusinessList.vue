<template>
  <div>
    <Business
      v-for="business in sortedBusinesses"
      :key="'business-' + business.uid"
      class="business-list__item"
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
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
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
  color: black;
  list-style: none;
  margin-bottom: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;

  @include media-breakpoint-up(md) {
    padding: 0 0.5rem;
  }
}

.business-list__item {
  margin: 0 1rem 1rem 1rem;
  padding: 1rem;
  background-color: white;

  &:hover {
    background-color: #eee;
  }

  .business__heading > h2 {
    color: #606060;
  }

  .business__extra-details {
    display: none;
  }
}

.business-list__item.business-list__item--inactive {
  background-color: #707070;
  a,
  li,
  .fa {
    color: black;
  }
  h2 {
    color: #333;
  }
}

.business-list__item.business-list__item--active {
  .business__extra-details {
    display: block;
  }
}

.business-list-cta {
  background-color: white;

  &__inner {
    font-family: 'Patua One';
    color: #606060;
    padding: 0.5rem;
    width: 100%;
    text-align: center;
  }
}
</style>
