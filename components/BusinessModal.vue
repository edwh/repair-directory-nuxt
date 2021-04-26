<template>
  <div>
    <b-modal
      v-if="business"
      id="businessModal"
      v-model="showModal"
      size="lg"
      header-class="p-0"
      hide-backdrop
    >
      <template slot="modal-header" slot-scope="{ cancel }">
        <div
          class="large title w-100 rd-secondary-font rd-more-info-modal-header"
        >
          <b-btn variant="link" class="float-right clickme" @click="cancel">
            <v-icon name="times" class="text-white" scale="2" />
          </b-btn>
          <h1 class="m-0 rd-primary-font">{{ business.name }}</h1>
          <p v-if="business.positiveReviewPc" class="rd-primary-font">
            <client-only>
              <star-rating
                v-model="business.averageScore"
                :round-start-rating="false"
                :show-rating="false"
                read-only
                active-color="#eebd01"
                :star-size="30"
              />
            </client-only>
            {{ business.positiveReviewPc }}%
            <span class="small">{{ $t('positiveReviews') }}</span>
            <a
              v-if="business.reviewSourceUrl"
              :href="business.reviewSourceUrl"
              target="_blank"
              rel="noopener"
              class="small"
              >({{ $t('source') }})</a
            >
          </p>
          <p v-if="business.description" class="m-0 description">
            {{ business.description }}
          </p>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <div class="d-flex justify-content-between w-100">
          <b-btn variant="light" @click="cancel"> {{ $t('close') }} </b-btn>
          <b-btn variant="link" class="share" @click="share">
            {{ $t('shareBusiness') }}
            <v-icon name="share" />
          </b-btn>
        </div>
      </template>
      <div class="rd-secondary-font">
        <div class="mt-1">
          <b-badge
            v-for="category in business.categories"
            :key="category"
            size="md"
            variant="dark"
            class="mb-2 mr-2 category text-wrap"
            pill
          >
            {{ $t(category) }}
          </b-badge>
        </div>

        <p v-if="website" class="mt-3">
          <v-icon name="globe" class="fa-fw icon" />
          <a
            target="_blank"
            rel="noopener"
            :href="website"
            class="clickme"
            @click="trackOutboundLink(website)"
          >
            {{ business.website }}
          </a>
        </p>

        <p v-if="business.email">
          <v-icon name="envelope" class="fa-fw icon" />
          <a
            :href="'mailto:' + business.email"
            @click="trackOutboundLink(business.website)"
            >{{ business.email }}</a
          >
        </p>

        <p v-if="phone">
          <v-icon name="phone" class="fa-fw icon" />
          <a
            :href="'tel:' + phone"
            rel="noopener"
            @click="trackOutboundLink('tel:' + phone)"
          >
            {{ phone }}
          </a>
        </p>

        <p v-if="business.address">
          <v-icon name="map-marker" class="fa-fw icon" />
          <span>{{ business.address }}, {{ business.city }}</span>
        </p>

        <p v-if="business.warrantyOffered">
          <v-icon name="calendar-check" class="fa-fw icon" />
          <span>{{ $t('warranty') }}: {{ business.warranty }}</span>
        </p>

        <p v-if="business.qualifications">
          <v-icon name="graduation-cap" class="fa-fw icon" />
          <span>{{ $t('qualifications') }}: {{ business.qualifications }}</span>
        </p>

        <p>
          <v-icon name="calendar" class="fa-fw icon" />
          <span>{{ $t('lastUpdated') }}: {{ updated }}</span>
        </p>
      </div>
    </b-modal>
    <ShareModal
      v-if="showShareModal"
      ref="shareModal"
      :name="business ? business.name : null"
      :url="url"
    />
  </div>
</template>
<script>
import ShareModal from '@/components/ShareModal'

export default {
  components: { ShareModal },
  props: {
    id: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showModal: true,
      showShareModal: false,
    }
  },
  computed: {
    business() {
      return this.id ? this.$store.getters['businesses/get'](this.id) : null
    },
    website() {
      if (this.business && this.business.website) {
        return this.business.website.indexOf('http') === 0
          ? this.business.website
          : 'http://' + this.business.website
      }
      return null
    },
    phone() {
      return this.business
        ? this.business.landline || this.business.mobile
        : null
    },
    updated() {
      return this.business && this.business.updatedAt
        ? new Date(
            this.business.updatedAt.date.substring(0, 10)
          ).toLocaleDateString('en-GB')
        : ''
    },
    url() {
      return this.business
        ? this.domain +
            '?rd_business=' +
            this.business.uid +
            '&rd_region=' +
            encodeURIComponent(this.region) +
            '&rd_language=' +
            encodeURIComponent(this.language) +
            '&rd_parenturl=' +
            encodeURIComponent(this.domain)
        : null
    },
    completeAddress() {
      return this.business
        ? [this.business.address, this.business.city, this.business.postcode]
            .filter(Boolean)
            .join(', ')
        : null
    },
  },
  watch: {
    id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.show()
        } else {
          this.hide()
        }
      },
    },
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    share() {
      this.showShareModal = true

      this.waitForRef('shareModal', () => {
        this.$refs.shareModal.show()
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';
@import 'assets/css/colours.scss';

.title {
  color: #fff;
  background-color: $colour-modal-title;
  padding: 1rem;
}

.large {
  font-size: 1.5rem;

  h1 {
    font-size: 2rem;
  }

  @include media-breakpoint-up(xl) {
    font-size: 2rem;

    h1 {
      font-size: 2.5rem;
    }
  }
}

.category {
  font-size: 0.8rem;

  @include media-breakpoint-up(md) {
    font-size: 1rem;
  }

  @include media-breakpoint-up(xl) {
    font-size: 1.25rem;
  }
}

.title a {
  color: $colour-link;
}

p {
  margin-bottom: 0.25rem;

  @include media-breakpoint-up(xl) {
    margin-bottom: 0.5rem;
  }
}

.badge {
  font-weight: 200;
}

.icon {
  color: #0094a7;
}

.share {
  color: $colour-share;
}

a {
  color: $colour-link2;
}

.description {
  font-size: 14pt;
  line-height: 1;
}
</style>
