<template>
  <div>
    <l-marker
      :lat-lng="[business.geolocation.latitude, business.geolocation.longitude]"
      :icon="getIcon()"
      :z-index-offset="show ? 10000 : null"
      @click="select"
    >
      <l-tooltip>
        {{ business.name }}
      </l-tooltip>
    </l-marker>
    <b-modal v-model="show" size="xl" header-class="p-0" hide-backdrop>
      <template slot="modal-header" slot-scope="{ cancel }">
        <div class="large title w-100">
          <b-btn variant="link" class="float-right clickme" @click="cancel">
            <v-icon name="times" class="text-white" scale="2" />
          </b-btn>
          <h1>{{ business.name }}</h1>
          <p v-if="business.positiveReviewPc">
            {{ business.positiveReviewPc }}%
            <span class="small">positive reviews TODO Google TOS</span>
            <a
              v-if="business.reviewSourceUrl"
              :href="business.reviewSourceUrl"
              target="_blank"
              rel="noopener"
              >(source)</a
            >
          </p>
          <p v-if="business.description">
            {{ business.description }}
          </p>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <div class="d-flex justify-content-between w-100">
          <b-btn variant="light" @click="cancel"> Close </b-btn>
          <b-btn variant="link">
            TODO Share business
            <v-icon name="share" />
          </b-btn>
        </div>
      </template>
      <div class="mt-3">
        <b-badge
          v-for="category in business.categories"
          :key="category"
          size="lg"
          variant="dark"
          class="mb-2 mr-2 largish"
          pill
        >
          {{ category }}
        </b-badge>
      </div>

      <p v-if="website" class="mt-3">
        <v-icon name="globe" class="fa-fw" />
        <a
          target="_blank"
          rel="noopener"
          :href="website"
          @click="trackOutboundLink(business.website)"
        >
          {{ business.website }}
        </a>
      </p>

      <p v-if="business.email">
        <v-icon name="envelope" class="fa-fw" />
        <a
          :href="'mailto:' + business.email"
          @click="trackOutboundLink(business.website)"
          >{{ business.email }}</a
        >
      </p>

      <p>
        <v-icon name="phone" class="fa-fw" />
        <a
          :href="'tel:' + phone"
          rel="noopener"
          @click="trackOutboundLink('tel:' + phone)"
        >
          {{ phone }}
        </a>
      </p>

      <p>
        <v-icon name="map-marker" class="fa-fw" />
        <span>{{ business.address }}</span>
      </p>

      <p v-if="business.warrantyOffered">
        <v-icon name="calendar-check" class="fa-fw" />
        <span>Warranty: {{ business.warranty }}</span>
      </p>

      <p v-if="business.qualifications">
        <v-icon name="graduation-cap" class="fa-fw" />
        <span>Warranty: {{ business.qualifications }}</span>
      </p>

      <p>
        <v-icon name="calendar" class="fa-fw" />
        <span>Last updated: {{ updated }}</span>
      </p>
    </b-modal>
  </div>
</template>
<script>
let L = null

if (process.browser) {
  L = require('leaflet')
}

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
    map: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
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
    completeAddress() {
      return this.business
        ? [this.business.address, this.business.city, this.business.postcode]
            .filter(Boolean)
            .join(', ')
        : null
    },
    updated() {
      return this.business && this.business.updatedAt
        ? new Date(
            this.business.updatedAt.date.substring(0, 10)
          ).toLocaleDateString('en-GB')
        : ''
    },
  },
  watch: {
    selected(newVal) {
      this.show = newVal === this.business.uid

      if (this.map && this.show) {
        // We want to ensure that the map marker is visible, if possible.  This is a bit fragile.
        const zoomLevel = this.map.mapObject.getZoom()
        const dpPerDegree = (256.0 * Math.pow(2, zoomLevel)) / 170.0
        const mapHeight = this.map.$el.clientHeight
        const mapHeightPercent = (50.0 * mapHeight) / 100.0
        const latOffset = mapHeight > 768 ? mapHeightPercent / dpPerDegree : 0

        this.map.mapObject.flyTo([
          this.business.geolocation.latitude + latOffset,
          this.business.geolocation.longitude,
        ])
      }
    },
  },
  methods: {
    select() {
      this.$emit('select', this.business.uid)
    },
    getIcon() {
      const colour = this.show ? 'red' : 'blue'
      return new L.Icon({
        iconUrl: require('~/assets/images/marker-icon-2x-' + colour + '.png'),
        shadowUrl: require('~/assets/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import 'assets/css/colours.scss';

.title {
  color: #fff;
  background-color: $colour-modal-title;
  padding: 1rem;
}

.large {
  font-size: 2rem;
}

.largish {
  font-size: 1.5rem;
}

.title a {
  color: $colour-link;
}
</style>
