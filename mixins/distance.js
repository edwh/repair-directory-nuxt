import pluralize from 'pluralize'

function toRadian(degree) {
  return (degree * Math.PI) / 180
}

export default {
  methods: {
    getDistance(origin, destination) {
      const lon1 = toRadian(origin[1])
      const lat1 = toRadian(origin[0])
      const lon2 = toRadian(destination[1])
      const lat2 = toRadian(destination[0])

      const deltaLat = lat2 - lat1
      const deltaLon = lon2 - lon1

      const a =
        Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
      const c = 2 * Math.asin(Math.sqrt(a))

      // Return in miles
      const EARTH_RADIUS = 3958.8
      return c * EARTH_RADIUS
    },
    roundedPlural(distance) {
      if (distance) {
        // Round it, so that it doesn't look foolishly precise..
        const rounded =
          distance >= 5
            ? Math.round(this.distance)
            : Math.round(this.distance * 10) / 10
        return pluralize(this.$t('miles'), rounded, true)
      }

      return null
    },
  },
}
