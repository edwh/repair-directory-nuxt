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
    map: {
      type: Object,
      required: false,
      default: null,
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
      setTimeout(() => {
        this.$emit('select', this.business.uid)
      }, 100)
    },
  },
}
</script>
