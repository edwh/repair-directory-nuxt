import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBqzOdSRgPAZO6wC_oxOOkb7lkarq0PjT8',
    libraries: 'places',
  },

  installComponents: true,
})
