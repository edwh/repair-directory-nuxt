import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon.vue'

// We list the icons we use explicitly because this reduces our bundle size.
require('vue-awesome/icons/globe')
require('vue-awesome/icons/map-marker')
require('vue-awesome/icons/phone')
require('vue-awesome/icons/question-circle')

Vue.component('v-icon', Icon)
