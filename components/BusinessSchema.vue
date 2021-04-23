<template>
  <div
    v-if="business"
    itemscope
    itemtype="http://schema.org/Store"
    class="d-none"
  >
    <div itemprop="name">{{ business.name }}</div>
    <address
      v-if="business.address"
      itemprop="address"
      itemscope
      itemtype="https://schema.org/PostalAddress"
    >
      <span itemprop="streetAddress">{{ business.address }}</span>
      <span itemprop="addressLocality">{{ business.city }}</span>
    </address>
    <div itemprop="geo" itemscope itemtype="https://schema.org/GeoCoordinates">
      <meta itemprop="latitude" :content="business.geolocation.latitude" />
      <meta itemprop="longitude" :content="business.geolocation.longitude" />
    </div>
    <meta itemprop="latitude" :content="business.geolocation.latitude" />
    <meta itemprop="longitude" :content="business.geolocation.longitude" />
    <div v-if="business.landline" itemprop="telephone">
      {{ business.landline }}
    </div>
    <a v-if="business.website" :href="business.website" itemprop="url">{{
      business.website
    }}</a>
    <div
      itemprop="aggregateRating"
      itemscope
      itemtype="https://schema.org/AggregateRating"
    >
      <span itemprop="ratingValue">{{ business.averageScore }}</span>
      <span itemprop="reviewCount">{{ business.numberOfReviews }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {
    business() {
      return this.id ? this.$store.getters['businesses/get'](this.id) : null
    },
  },
}
</script>
