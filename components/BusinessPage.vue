<template>
  <div class="layout">
    <div id="sidebar" class="sidebar">
      <client-only>
        <div
          v-if="!embedded"
          class="d-flex justify-content-around bg-white p-3"
        >
          <b-img src="/logo.png" class="logo" />
        </div>
      </client-only>
      <div class="sidebar__content mb-2 p-2">
        <div class="sidebar__copy m-0 mb-3 d-flex flex-wrap">
          <div class="pr-2">
            {{ tagline }}
          </div>
          <client-only>
            <b-btn
              v-if="!embedded"
              variant="link"
              class="more-info p-0"
              @click="showMoreInfo"
            >
              ({{ $t('moreInfo') }}
              <v-icon name="question-circle" scale="0.75" />)
            </b-btn>
          </client-only>
          <MoreInfoModal ref="moreinfomodal" />
        </div>
        <div class="formlayout">
          <div class="left">
            <label for="location">{{ $t('whereAreYouLooking') }}</label>
            <b-input
              id="location"
              v-model="location"
              :placeholder="$t('enterAPostcodeOrArea')"
              class="sidebar__input"
            />
          </div>
          <div class="right">
            <label for="radius">{{ $t('searchRadius') }}</label>
            <b-select
              id="radius"
              v-model="radius"
              :options="radiusOptions"
              class="sidebar__select"
            />
          </div>
          <div class="left">
            <label for="category">{{ $t('whatDoYouNeedToFix') }}</label>
            <b-select
              id="category"
              v-model="category"
              :options="categoryOptions"
              class="sidebar__select"
            />
          </div>
          <div class="right align-self-end d-flex justify-content-end">
            <b-btn
              class="sidebar__button font-weight-bold"
              variant="warning"
              squared
              @click="search"
              >{{ $t('search') }}</b-btn
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
          <div v-else class="business-list-container__result-count">
            {{ businessesInBounds.length }} {{ $t('resultsInYourArea') }}
          </div>
          <b-btn
            v-if="businessesInBounds.length"
            class="share-link"
            variant="link"
            @click="share"
          >
            {{ $t('shareResults') }}
            <client-only>
              <v-icon name="share" />
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
      // We want to translate the category text.
      const ret = [
        {
          value: null,
          text: this.$t('showAllProductCategories'),
        },
      ]

      if (this.categories) {
        this.categories.forEach((c) => {
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

      // We need to translate what is returned.  We're hardcoding the singular/plural translation - we could do better
      // than that but we don't have many occurrences of that problem.
      switch (this.region) {
        case REGION_WALES: {
          ret = [
            {
              value: 3,
              text: '3 ' + this.$t('miles'),
            },
            {
              value: 5,
              text: '5 ' + this.$t('miles'),
            },
            {
              value: 10,
              text: '10 ' + this.$t('miles'),
            },
            {
              value: 20,
              text: '20 ' + this.$t('miles'),
            },
            {
              value: 30,
              text: '30 ' + this.$t('miles'),
            },
            {
              value: 200,
              text: this.$t('allWales'),
            },
          ]
          break
        }
        default: {
          ret = [
            {
              value: 1,
              text: '1 ' + this.$t('mile'),
            },
            {
              value: 2,
              text: '2 ' + this.$t('miles'),
            },
            {
              value: 5,
              text: '5 ' + this.$t('miles'),
            },
            {
              value: 10,
              text: '10 ' + this.$t('miles'),
            },
            {
              value: 18,
              text: this.$t('allLondon'),
            },
          ]
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
  font-family: 'Open Sans', sans-serif;
  background: #1e8694; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    #1e8694,
    #064d57
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(#1e8694, #064d57); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    #1e8694,
    #064d57
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(#1e8694, #064d57); /* Standard syntax */

  .sidebar__content {
    color: white;

    .sidebar__copy {
      margin: 1rem; //0 1rem 1rem 10px;
      font-family: 'Patua One', serif;
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
  color: white;
  background: #22737d; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    #22737d,
    #0e5f69
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(#22737d, #0e5f69); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    #22737d,
    #0e5f69
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(#22737d, #0e5f69); /* Standard syntax */

  &:active {
    color: white;
  }

  &:focus {
    color: white;
  }

  ::v-deep option {
    color: black;
  }

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: $colour-placeholder;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: $colour-placeholder;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: $colour-placeholder;
  }
}

.sidebar__button {
  width: 100%;
  border-radius: 0;
  //@include button-variant(#f9a33f, #f9a33f, #958751);
  color: white;
  border: 0;
  border-bottom: 3px solid #155e67;
  background-color: #f9a33f;
  border-color: #f9a33f;
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
  font-family: 'Patua One', serif;
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
    grid-template-columns: 3fr 2fr;
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
