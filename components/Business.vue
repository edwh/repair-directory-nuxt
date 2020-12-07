<template>
  <div
    :class="{
      business: true,
      faded: selected && selected !== business.uid,
    }"
    @click="select"
  >
    <div ref="heading" class="business__heading">
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
              onclick="trackOutboundLink(business.website);"
            >
              {{ business.website }}
            </a>
          </p>

          <p class="business-detail">
            <v-icon name="phone" class="icon" />
            <a
              :href="'tel:' + business.landline"
              rel="noopener"
              onclick="trackOutboundLink('tel:' + business.landline);"
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
    selected: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {},
  watch: {
    selected: {
      immediate: true,
      handler(newVal) {
        if (newVal === this.business.uid) {
          this.waitForRef('heading', () => {
            this.$refs.heading.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          })
        }
      },
    },
  },
  methods: {
    select() {
      this.$emit('select', this.business.uid)
    },
  },
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

.faded {
  opacity: 50%;
}
</style>
