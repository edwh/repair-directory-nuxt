<template>
  <div class="business">
    <div class="business__heading">
      <h2 class="name">{{ business.name }}</h2>
      <div class="business__positive-review-percentage">
        <h2 class="percentage font-weight-bold">100%</h2>
        <span>positive reviews</span>
      </div>
    </div>
    <div class="business__details">
      <div class="row">
        <div class="col-md-12">
          <p class="business-detail">
            <v-icon name="globe" class="icon" />
            <a
              target="_blank"
              rel="noopener"
              :href="business.website"
              onclick="trackOutboundLink('https://dansphonecentre.business.site/');"
            >
              {{ business.website }}
            </a>
          </p>

          <p class="business-detail">
            <v-icon name="phone" class="icon" />
            <a
              href="tel:020 8366 5335"
              rel="noopener"
              onclick="trackOutboundLink('tel:020 8366 5335');"
            >
              {{ business.landline }}
            </a>
          </p>

          <p class="business-detail">
            <v-icon name="map-marker" class="icon" />
            <span>{{ business.address }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    business: {
      type: Object,
      required: true,
    },
  },
  computed: {},
}
</script>
<style scoped lang="scss">
.percentage {
  display: inline-block;
  font-family: PatuaOne, serif;
  color: #f9a543;
  margin: 0 0.5rem 0 0;
}

.name {
  color: #606060;
  font-family: PatuaOne, serif;
  margin-top: 0;
}

.icon {
  color: #0094a7;
}
</style>
