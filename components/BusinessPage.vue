<template>
  <div class="layout">
    <div id="sidebar" class="sidebar rd-sidebar rd-secondary-font">
      <client-only>
        <div
          v-if="!embedded"
          class="d-flex justify-content-around bg-white p-3"
        >
          <b-img src="/logo.png" class="logo" />
        </div>
      </client-only>
      <div class="sidebar__content mb-2 p-2 rd-sidebar-background">
        <div class="sidebar__copy m-0 mb-3 d-flex">
          <div class="d-flex flex-column justify-content-center">
            <span class="rd-primary-font">
              {{ tagline }}
            </span>
          </div>
          <div class="d-flex flex-column justify-content-center">
            <client-only>
              <!--            eslint-disable-->
              <b-btn v-if="!embedded" variant="link" class="more-info rd-more-info" @click="showMoreInfo">(More Info <v-icon name="question-circle" scale="0.75" />)</b-btn>
              <!--            eslint-enable-->
            </client-only>
          </div>
          <MoreInfoModal ref="moreinfomodal" />
        </div>
        <div class="formlayout rd-secondary-font">
          <div class="left">
            <label for="location">{{ $t('whereAreYouLooking') }}</label>
            <b-input
              id="location"
              v-model="location"
              placeholder="Enter a postcode or area"
              class="sidebar__input"
            />
          </div>
          <div class="right">
            <label for="radius">Search radius?</label>
            <b-select
              id="radius"
              v-model="radius"
              :options="radiusOptions"
              class="sidebar__select"
            />
          </div>
          <div class="left">
            <label for="category">What do you need to fix?</label>
            <b-select
              id="category"
              v-model="category"
              :options="categoryOptions"
              class="sidebar__select"
            />
          </div>
          <div class="right align-self-end d-flex justify-content-end">
            <b-btn
              class="sidebar__button font-weight-bold rd-sidebar-button"
              variant="warning"
              squared
              @click="search"
              >Search</b-btn
            >
          </div>
        </div>
      </div>
      <div v-if="showSubmit" class="text-center bg-white p-2 font-weight-bold">
        Help us grow!
        <a
          href="https://therestartproject.org/suggest-a-business-for-the-repair-directory/"
          target="_blank"
        >
          Submit a business
        </a>
      </div>
      <div class="business-list-container pl-md-2 pr-md-2 d-flex flex-wrap">
        <div
          v-if="!busy"
          class="business-list-container__results-header text-white"
        >
          <div
            v-if="businessesInBounds.length === 0"
            class="business-list-container__result-count"
          >
            <p>
              Unfortunately, there are currently no businesses in the Repair
              Directory that match your search criteria.
            </p>
            <p>Try selecting a wider search radius.</p>
            <p>
              If you still don’t obtain results, it means that we don’t know of
              a repair business for this item that meets our listing criteria.
            </p>
          </div>
          <div
            v-else
            class="business-list-container__result-count rd-primary-font"
          >
            {{ businessesInBounds.length }} results in your area
          </div>
          <b-btn
            v-if="businessesInBounds.length"
            class="share-link rd-primary-font"
            variant="link"
            @click="share"
          >
            {{ $t('shareResults') }}
            <client-only>
              <v-icon name="share" class="rd-icon-white" />
            </client-only>
          </b-btn>
        </div>
        <BusinessList
          :businesses="businessesInBounds"
          class="business-list"
          :selected="selected"
          @select="select"
        />
      </div>
    </div>
    <div>
      <client-only>
        <Map
          :businesses="businessesInBounds"
          :center="center"
          :selected="selected"
          :location="location"
          @selected="select"
        />
      </client-only>
    </div>
    <ShareModal
      v-if="showShareModal"
      ref="shareModal"
      name="results"
      :url="shareUrl"
    />
    <BusinessModal :id="selected" ref="businessModal" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Map from '@/components/Map'
import BusinessList from '@/components/BusinessList'
import {
  BOUNDS_LONDON,
  BOUNDS_WALES,
  DISTANCES_LONDON,
  DISTANCES_WALES,
  REGION_WALES,
  SEARCH_HINT_LONDON,
  SEARCH_HINT_WALES,
  showSubmitBusiness,
} from '@/regions'
import BusinessModal from '@/components/BusinessModal'
import ShareModal from '@/components/ShareModal'

export default {
  components: { ShareModal, BusinessModal, BusinessList, Map },
  props: {
    id: {
      type: Number,
      required: false,
      default: null,
    },
  },
  async fetch() {
    // We want to fetch the list of categories from the server.
    await this.$store.dispatch('categories/list', {
      region: this.region,
    })
  },
  data() {
    return {
      busy: false,
      showShareModal: false,
      selected: null,
      category: null,
      radius: null,
      location: null,
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/list',
      businesses: 'businesses/list',
      center: 'businesses/center',
    }),
    businessesInBounds() {
      // We want the businesses which are in the bounds for the region.
      let bounds = null

      switch (this.region) {
        case REGION_WALES: {
          bounds = BOUNDS_WALES
          break
        }
        default: {
          bounds = BOUNDS_LONDON
          break
        }
      }

      const ret = []

      this.businesses.forEach((b) => {
        if (
          b.geolocation.latitude >= bounds.sw.lat &&
          b.geolocation.latitude <= bounds.ne.lat &&
          b.geolocation.longitude >= bounds.sw.lng &&
          b.geolocation.longitude <= bounds.ne.lng
        ) {
          ret.push(b)
        }
      })

      return ret
    },
    categoryOptions() {
      const ret = [
        {
          value: null,
          text: 'Show all product categories',
        },
      ]

      if (this.categories) {
        this.categories.forEach((c) => {
          // We want to translate the category text.
          ret.push({
            value: c,
            text: this.$t(c),
          })
        })
      }

      return ret
    },
    radiusOptions() {
      let ret = null

      switch (this.region) {
        case REGION_WALES: {
          ret = DISTANCES_WALES
          break
        }
        default: {
          ret = DISTANCES_LONDON
          break
        }
      }

      return ret
    },
    searchHint() {
      let ret = null

      switch (this.region) {
        case REGION_WALES: {
          ret = SEARCH_HINT_WALES
          break
        }
        default: {
          ret = SEARCH_HINT_LONDON
          break
        }
      }

      return ret
    },
    embedded() {
      // We can embed this page elsewhere.
      let ret = false

      if (process.client) {
        try {
          ret = window.self !== window.top
        } catch (e) {
          ret = true
        }
      }

      return ret
    },
    shareUrl() {
      return (
        this.domain +
        '?' +
        (this.location
          ? '&rd_location=' + encodeURIComponent(this.location)
          : '') +
        (this.category
          ? '&rd_category=' + encodeURIComponent(this.category)
          : '') +
        '&rd_radius=' +
        this.radius +
        '&rd_region=' +
        this.region +
        '&rd_language=' +
        encodeURIComponent(this.language) +
        '&rd_parenturl=' +
        encodeURIComponent(this.domain)
      )
    },
    showSubmit() {
      return showSubmitBusiness(this.region)
    },
  },
  mounted() {
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      if (modalId === 'businessModal') {
        this.selected = null
      }
    })

    if (this.$route.query.rd_location) {
      this.location = this.$route.query.rd_location
    }

    if (this.$route.query.rd_category) {
      this.category = this.$route.query.rd_category
    }

    if (this.$route.query.rd_radius) {
      // Specified
      this.radius = this.$route.query.rd_radius
    } else {
      // Set to the maximum for this region.
      this.radius = this.radiusOptions.slice(-1)[0].value
    }

    this.selected = this.id
  },
  methods: {
    async search() {
      this.busy = true

      await this.$store.dispatch('businesses/search', {
        location: this.location + ', ' + this.searchHint,
        category: this.category,
        radius: this.radius,
        region: this.region,
      })

      this.busy = false

      // Track the search.
      this.$ga.event(
        'search',
        'submit_' + this.region,
        this.category || 'All Categories'
      )
    },
    select(uid) {
      this.selected = uid

      // Track the select.
      const business = this.$store.getters['businesses/get'](uid)
      const value = [business.name, business.address, business.postcode].join(
        ', '
      )
      this.$ga.event('map', 'select_' + this.region, value)
    },
    showMoreInfo() {
      this.waitForRef('moreinfomodal', () => {
        this.$refs.moreinfomodal.show()
      })
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

.layout {
  margin: 0 auto;
  min-height: 100vh;
  display: grid;

  grid-template-columns: 1fr 0px;

  @include media-breakpoint-up(md) {
    grid-template-columns: 1.5fr 3fr;
  }
}

.sidebar {
  height: 100vh;
  overflow-y: scroll;

  .sidebar__content {
    color: white;

    .sidebar__copy {
      margin: 1rem; //0 1rem 1rem 10px;
      font-size: 1.1rem;
      letter-spacing: 0.5px;

      .more-info {
        font-size: 0.8rem;
        cursor: pointer;
        color: $colour-link;
      }
    }
  }
}

.sidebar__search {
  margin: 0 1rem;
}

.sidebar__input,
.sidebar__select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-border-radius: 0; /* Safari 3-4, iOS 1-3.2, Android 1.6- */
  -moz-border-radius: 0; /* Firefox 1-3.6 */
  border-radius: 0; /* Opera 10.5, IE 9, Safari 5, Chrome, Firefox 4, iOS 4, Android 2.1+ */

  ::v-deep option {
    color: black;
  }

  &::placeholder {
    opacity: 1; /* Firefox */
  }
}

.sidebar__button {
  width: 100%;
  border-radius: 0;
  //@include button-variant(#f9a33f, #f9a33f, #958751);
  border: 0;
  height: calc(1.5em + 0.75rem + 2px);
}

.business-list-container {
  background-color: #606060;
}

.business-list-container__results-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  & > * {
    padding: 1rem;
  }
}

.business-list-container__result-count {
  font-size: 1rem;
  flex: 1;
}

.formlayout {
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;

  @include media-breakpoint-up(xl) {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    grid-row-gap: 10px;
  }
}

.top {
  grid-row: 1 / 2;
}

.bottom {
  grid-row: 2 /3;
}

.left {
  grid-column: 1 / 2;
}

.right {
  grid-column: 1 / 2;

  @include media-breakpoint-up(xl) {
    grid-column: 2 / 3;
  }
}

.logo {
  width: 200px;
}

.share-link {
  color: white;
  box-shadow: none;
  font-weight: bold;
}
</style>
