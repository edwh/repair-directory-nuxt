<template>
  <div>
    <Business
      v-for="business in businesses"
      :key="'business-' + business.uid"
      class="business-list__item"
      :business="business"
      :selected="selected"
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
}
</script>
<style scoped lang="scss">
.business-list {
  color: black;
  list-style: none;
  margin-bottom: 0;
  padding: 0 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.business-list__item {
  margin: 0 1rem 1rem 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;

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
