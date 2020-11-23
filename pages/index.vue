<template>
  <div class="layout">
    <div class="sidebar">
      <div class="d-flex justify-content-around bg-white p-4">
        <b-img-lazy src="/logo.png" />
      </div>
      <div class="sidebar__content">
        <p class="sidebar__copy font-weight-bold">
          Find a London business to repair your broken devices.
          <span class="more-info"
            >(More info <v-icon name="question-circle" />)</span
          >
        </p>
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
      <div class="business-list-container">
        <div
          class="business-list-container__results-header text-white font-weight-bold"
        >
          <div class="business-list-container__result-count">
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
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
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

export default {
  components: { Business },
  data() {
    return {
      minZoom: 10,
      maxZoom: 16,
      center: [51.5074, 0.1278],
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',

      category: null,
      location: 'London, UK',
      radius: 18,
    }
  },
  computed: {
    ...mapGetters({ businesses: 'businesses/list' }),
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
}

.sidebar__select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-border-radius: 0; /* Safari 3-4, iOS 1-3.2, Android 1.6- */
  -moz-border-radius: 0; /* Firefox 1-3.6 */
  border-radius: 0; /* Opera 10.5, IE 9, Safari 5, Chrome, Firefox 4, iOS 4, Android 2.1+ */

  > option {
    color: black;
  }
}

.sidebar__button {
  width: 100%;
  border-radius: 0;
  //@include button-variant(#f9a33f, #f9a33f, #958751);
  color: white;
  padding: 9px 25px 10px;
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
</style>
