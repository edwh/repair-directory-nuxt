<template>
  <div class="layout">
    <div class="sidebar">
      <client-only>
        <div
          v-if="!embedded"
          class="d-flex justify-content-around bg-white p-3"
        >
          <b-img src="/logo.png" class="logo" />
        </div>
      </client-only>
      <div class="sidebar__content mb-2 p-2">
        <p class="sidebar__copy font-weight-bold m-0 mb-3">
          Find a London business to repair your broken devices.
          <client-only>
            <b-btn
              v-if="!embedded"
              variant="link"
              class="more-info"
              @click="showMoreInfo"
            >
              (More Info
              <v-icon name="question-circle" scale="0.75" />)
            </b-btn>
          </client-only>
          <MoreInfoModal ref="moreinfomodal" />
        </p>
        <div class="formlayout">
          <div class="left">
            <label for="location">Where are you looking?</label>
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
              class="sidebar__button font-weight-bold"
              variant="warning"
              squared
              @click="search"
              >Search</b-btn
            >
          </div>
        </div>
      </div>
      <div class="text-center bg-white p-2 font-weight-bold">
        Help us grow!
        <a
          href="https://therestartproject.org/suggest-a-business-for-the-repair-directory/"
          target="_blank"
        >
          Submit a business
        </a>
      </div>
      <div class="business-list-container pl-md-2 pr-md-2">
        <div
          v-if="!busy"
          class="business-list-container__results-header text-white font-weight-bold"
        >
          <div
            v-if="businesses.length === 0"
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
            {{ businesses.length }} results in your area
          </div>
          <b-btn
            v-if="businesses.length"
            class="share-link"
            variant="link"
            @click="share"
          >
            Share results
            <client-only>
              <v-icon name="share" />
            </client-only>
          </b-btn>
        </div>
        <BusinessList
          :businesses="businesses"
          class="business-list"
          :selected="selected"
          @select="select"
        />
      </div>
    </div>
    <div>
      <client-only>
        <Map
          :businesses="businesses"
          :center="center"
          :selected="selected"
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Map from '@/components/Map'
import BusinessList from '@/components/BusinessList'

export default {
  components: { BusinessList, Map },
  props: {
    id: {
      type: Number,
      required: false,
      default: null,
    },
  },
  async fetch() {
    // We want to fetch the list of categories from the server.
    // await this.$store.dispatch('categories/list')
  },
  data() {
    return {
      busy: false,
      showShareModal: false,
      selected: null,
      category: null,
      location: 'London, UK',
      radius: 18,
      radiusOptions: [
        {
          value: 1,
          text: '1 mile',
        },
        {
          value: 2,
          text: '2 miles',
        },
        {
          value: 5,
          text: '5 miles',
        },
        {
          value: 10,
          text: '10 miles',
        },
        {
          value: 18,
          text: 'All London',
        },
      ],
      categoryOptions: [
        {
          value: null,
          text: 'Show all product categories',
        },
        {
          value: 'Apple iPhone',
          text: 'Apple iPhone',
        },
        {
          value: 'Apple iPad',
          text: 'Apple iPad',
        },
        {
          value: 'Aircon/Dehumidifier',
          text: 'Aircon/Dehumidifier',
        },
        {
          value: 'Decorative or safety lights',
          text: 'Decorative or safety lights',
        },
        {
          value: 'Desktop computer',
          text: 'Desktop computer',
        },
        {
          value: 'Digital Camera',
          text: 'Digital Camera',
        },
        {
          value: 'Video Camera',
          text: 'Video Camera',
        },
        {
          value: 'Fan',
          text: 'Fan',
        },
        {
          value: 'Flat screen',
          text: 'Flat screen',
        },
        {
          value: 'Hair & Beauty item',
          text: 'Hair & Beauty item',
        },
        {
          value: 'Handheld entertainment device',
          text: 'Handheld entertainment device',
        },
        {
          value: 'Headphones',
          text: 'Headphones',
        },
        {
          value: 'Hi-Fi',
          text: 'Hi-Fi',
        },
        {
          value: 'Kettle',
          text: 'Kettle',
        },
        {
          value: 'Lamp',
          text: 'Lamp',
        },
        {
          value: 'Laptop',
          text: 'Laptop',
        },
        {
          value: 'Mobile/Smartphone',
          text: 'Mobile/Smartphone',
        },
        {
          value: 'Musical instrument',
          text: 'Musical instrument',
        },
        {
          value: 'Nintendo console',
          text: 'Nintendo console',
        },
        {
          value: 'Paper shredder',
          text: 'Paper shredder',
        },
        {
          value: 'PC Accessory',
          text: 'PC Accessory',
        },
        {
          value: 'Playstation console',
          text: 'Playstation console',
        },
        {
          value: 'Portable radio',
          text: 'Portable radio',
        },
        {
          value: 'Power tool',
          text: 'Power tool',
        },
        {
          value: 'Printer/scanner',
          text: 'Printer/scanner',
        },
        {
          value: 'Projector',
          text: 'Projector',
        },
        {
          value: 'Sewing machine',
          text: 'Sewing machine',
        },
        {
          value: 'Small kitchen item',
          text: 'Small kitchen item',
        },
        {
          value: 'Tablet',
          text: 'Tablet',
        },
        {
          value: 'Toaster',
          text: 'Toaster',
        },
        {
          value: 'Toy',
          text: 'Toy',
        },
        {
          value: 'TV',
          text: 'TV',
        },
        {
          value: 'Vacuum',
          text: 'Vacuum',
        },
        {
          value: 'Xbox console',
          text: 'Xbox console',
        },
        {
          value: 'White goods',
          text: 'White goods',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/list',
      businesses: 'businesses/list',
      center: 'businesses/center',
    }),
    categoryOptionsWIP() {
      const ret = [
        {
          value: null,
          text: 'Show all product categories',
        },
      ]

      if (this.categories) {
        this.categories.forEach((c) => {
          ret.push({
            value: c,
            text: c,
          })
        })
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
        window.location.protocol +
        '//' +
        window.location.hostname +
        '?location=' +
        encodeURIComponent(this.location) +
        '&category=' +
        encodeURIComponent(this.category) +
        '&radius=' +
        this.radius
      )
    },
  },
  created() {
    this.selected = this.id
  },
  mounted() {
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      this.selected = null
    })

    if (this.$route.query.location) {
      this.location = this.$route.query.location
    }

    if (this.$route.query.category) {
      this.category = this.$route.query.category
    }

    if (this.$route.query.radius) {
      this.radius = this.$route.query.radius
    }
  },
  methods: {
    async search() {
      this.busy = true

      await this.$store.dispatch('businesses/search', {
        location: this.location,
        category: this.category,
        radius: this.radius,
      })

      this.busy = false
    },
    select(uid) {
      this.selected = uid
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
      font-family: 'PatuaOne', serif;
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
  border-radius: 0;
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
}

.sidebar__button {
  width: 100%;
  border-radius: 0;
  //@include button-variant(#f9a33f, #f9a33f, #958751);
  color: white;
  padding: 9px 25px 10px;
  border: 0;
  border-bottom: 3px solid #155e67;
  background-color: #f9a33f;
  border-color: #f9a33f;
  height: calc(1.5em + 0.75rem + 2px);
}

.sidebar__button-label {
  visibility: hidden;
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
  font-family: 'PatuaOne', serif;
  font-size: 1rem;
  flex: 1;
}

.formlayout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
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
  grid-column: 2 / 3;
}

.logo {
  width: 279px;
}

.share-link {
  color: white;
  box-shadow: none;
}
</style>
