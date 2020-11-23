<template>
  <div class="layout">
    <div class="sidebar">
      <div class="d-flex justify-content-around bg-white p-3">
        <b-img src="/logo.png" class="logo" />
      </div>
      <div class="sidebar__content mb-2 p-2">
        <p class="sidebar__copy font-weight-bold">
          Find a London business to repair your broken devices.
          <span class="more-info"
            >(More info TODO
            <v-icon name="question-circle" scale="0.75" />)</span
          >
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
      <div class="business-list-container pl-2 pr-2">
        <div
          class="business-list-container__results-header text-white font-weight-bold"
        >
          <div
            v-if="businesses.length === 0"
            class="business-list-container__result-count"
          >
            Unfortunately, there are currently no results for your search
          </div>
          <div v-else class="business-list-container__result-count">
            {{ businesses.length }} results in your area
          </div>
          <div class="share-link">Share TODO</div>
        </div>
        <div class="business-list">
          <Business
            v-for="business in businesses"
            :key="'business-' + business.uid"
            class="business-list__item"
            :business="business"
          >
            {{ business.name }}
          </Business>
        </div>
      </div>
    </div>
    <div>
      <client-only>
        <l-map
          ref="map"
          style="width: 100%; height: 100vh"
          :center="center"
          @ready="ready"
          @zoomend="idle"
          @moveend="idle"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <l-marker
            v-for="business in businesses"
            :key="'marker-' + business.uid"
            :lat-lng="[
              business.geolocation.latitude,
              business.geolocation.longitude,
            ]"
          />
        </l-map>
      </client-only>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Business from '~/components/Business'

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: { Business },
  data() {
    return {
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',

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
          value: 3,
          text: '3 miles',
        },
        {
          value: 5,
          text: '5 miles',
        },
        {
          value: 7,
          text: '7 miles',
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
      businesses: 'businesses/list',
      center: 'businesses/center',
    }),
  },
  watch: {
    businesses: {
      immediate: true,
      handler(newVal) {
        if (this.$refs.map) {
          // We want to fit the map to the new businesses

          const markers = []
          newVal.forEach((b) => {
            markers.push(
              // eslint-disable-next-line new-cap
              new L.Marker([b.geolocation.latitude, b.geolocation.longitude])
            )
          })

          // eslint-disable-next-line new-cap
          const fg = new L.featureGroup(markers)

          this.$refs.map.mapObject.fitBounds(fg.getBounds().pad(0.1))
        }
      },
    },
  },
  mounted() {
    this.search()
  },
  methods: {
    async search() {
      await this.$store.dispatch('businesses/search', {
        location: this.location,
        category: this.category,
        radius: this.radius,
      })
    },
    ready() {},
    idle() {},
  },
}
</script>
<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.layout {
  margin: 0 auto;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.5fr 3fr;
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
</style>
