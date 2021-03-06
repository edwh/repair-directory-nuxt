<template>
  <div>
    <GmapMarker
      ref="marker"
      :icon="
        selected === business.uid
          ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      "
      :position="{
        lat: business.geolocation.latitude,
        lng: business.geolocation.longitude,
      }"
      :clickable="true"
      :draggable="false"
      :title="business.name"
      @click="select"
    />
    <b-modal v-model="show" size="xl" header-class="p-0" hide-backdrop>
      <template slot="modal-header" slot-scope="{ cancel }">
        <div class="large title w-100">
          <b-btn variant="link" class="float-right clickme" @click="cancel">
            <v-icon name="times" class="text-white" scale="2" />
          </b-btn>
          <h1>{{ business.name }}</h1>
          <p v-if="business.positiveReviewPc">
            <client-only>
              <star-rating
                v-model="business.averageScore"
                :round-start-rating="false"
                :show-rating="false"
                read-only
              />
            </client-only>
            {{ business.positiveReviewPc }}%
            <span class="small">positive reviews</span>
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
          <b-btn variant="link" @click="share">
            Share business
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
    <ShareModal
      v-if="showShareModal"
      ref="shareModal"
      :name="business.name"
      :url="url"
    />
  </div>
</template>
<script>
import ShareModal from '@/components/ShareModal'

export default {
  components: { ShareModal },
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
      showShareModal: false,
    }
  },
  computed: {
    url() {
      return (
        window.location.protocol +
        '//' +
        window.location.hostname +
        '/businesses/' +
        this.business.uid
      )
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
    selected: {
      immediate: true,
      handler(newVal) {
        this.show = newVal === this.business.uid

        if (this.map && this.show) {
          // // We want to ensure that the map marker is visible, if possible.  This is a bit fragile.
          const zoomLevel = this.map.$mapObject.getZoom()
          const dpPerDegree = (256.0 * Math.pow(2, zoomLevel)) / 170.0
          const mapHeight = this.map.$el.clientHeight
          const mapHeightPercent = (50.0 * mapHeight) / 100.0
          const latOffset = mapHeight > 768 ? mapHeightPercent / dpPerDegree : 0

          this.map.$mapObject.setCenter({
            lat: this.business.geolocation.latitude + latOffset,
            lng: this.business.geolocation.longitude,
          })
        }
      },
    },
  },
  methods: {
    select() {
      this.$emit('select', this.business.uid)
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
