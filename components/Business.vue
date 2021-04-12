<template>
  <div
    :class="{
      'business-list__item': true,
      'business-list__item--active': selected && selected === business.uid,
      'business-list__item--inactive': selected && selected !== business.uid,
      'bg-white': !selected,
      'p-3': true,
      'mb-3': true,
      'm-0': true,
      rounded: true,
      forcebreak: true,
    }"
  >
    <div class="business" @click="select">
      <div ref="heading" class="business__heading">
        <h2 class="name rd-business-heading-color">
          {{ business.name }}
        </h2>
        <div
          v-if="business.positiveReviewPc"
          class="business__positive-review-percentage"
        >
          <h2
            class="percentage font-weight-bold rd-primary-font rd-list-percentage-color"
          >
            {{ business.positiveReviewPc }}%
          </h2>
          <span>{{ $t('positiveReviews') }}</span>
        </div>
      </div>
      <div class="business__details">
        <div class="row">
          <div class="col-md-12">
            <p v-if="business.website" class="business-detail">
              <client-only>
                <v-icon name="globe" class="icon" />
              </client-only>
              <a
                target="_blank"
                rel="noopener"
                :href="business.website"
                @click="trackOutboundLink(business.website)"
              >
                {{ business.website }}
              </a>
            </p>

            <p v-if="business.landline" class="business-detail">
              <client-only>
                <v-icon name="phone" class="icon" />
              </client-only>
              <a
                :href="'tel:' + business.landline"
                rel="noopener"
                @click="trackOutboundLink('tel:' + business.landline)"
              >
                {{ business.landline }}
              </a>
            </p>

            <p v-if="business.address" class="business-detail">
              <client-only>
                <v-icon name="map-marker" class="icon" />
              </client-only>
              <span>{{ business.address }}, {{ business.city }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <b-btn variant="link" class="moreinfo rd-view-more-info" @click="select">
        {{ $t('viewMoreInfo') }}
      </b-btn>
    </div>
  </div>
</template>
<script>
const VueScrollTo = require('vue-scrollto')

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
  data() {
    return {
      showShareModal: false,
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler(newVal) {
        if (newVal === this.business.uid) {
          this.waitForRef('heading', () => {
            VueScrollTo.scrollTo(this.$refs.heading, 750, {
              container: '#sidebar',
              offset: -60,
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
<style lang="scss">
@import 'assets/css/colours.scss';

.business-list__item {
  margin: 0 1rem 1rem 1rem;
  padding: 1rem;
  background-color: white;

  &:hover {
    background-color: #eee !important;
  }

  .business__heading > h2 {
    color: #606060;
  }

  .percentage {
    display: inline-block;
    margin: 0 0.5rem 0 0;
  }

  .name {
    color: #606060;
    margin-top: 0;
    font-size: 1.8rem;
  }

  .icon {
    color: #0094a7;
  }

  &.business-list__item.business-list__item--inactive {
    background-color: #707070;
    color: #333 !important;

    .name,
    a,
    li,
    .fa-icon,
    .percentage,
    .moreinfo {
      color: #333 !important;
    }
  }
}

.business-list-cta {
  background-color: white;

  &__inner {
    color: #606060;
    padding: 0.5rem;
    width: 100%;
    text-align: center;
  }
}

a {
  color: $colour-link2;
}
</style>
