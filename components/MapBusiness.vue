<template>
  <l-marker
    :lat-lng="[business.geolocation.latitude, business.geolocation.longitude]"
    @click="$emit('selected')"
  >
    <l-tooltip>
      {{ business.name }}
    </l-tooltip>
  </l-marker>
</template>
<script>
export default {
  props: {
    business: {
      type: Object,
      required: true,
    },
  },
}
</script>
