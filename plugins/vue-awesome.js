import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon.vue'

// We list the icons we use explicitly because this reduces our bundle size.
require('vue-awesome/icons/calendar')
require('vue-awesome/icons/calendar-check')
require('vue-awesome/icons/check')
require('vue-awesome/icons/copy')
require('vue-awesome/icons/envelope')
require('vue-awesome/icons/globe')
require('vue-awesome/icons/graduation-cap')
require('vue-awesome/icons/map-marker')
require('vue-awesome/icons/phone')
require('vue-awesome/icons/question-circle')
require('vue-awesome/icons/share')
require('vue-awesome/icons/times')

require('vue-awesome/icons/brands/discourse')
require('vue-awesome/icons/brands/facebook')
require('vue-awesome/icons/brands/google-plus')
require('vue-awesome/icons/brands/pinterest')
require('vue-awesome/icons/brands/skype')
require('vue-awesome/icons/brands/telegram')
require('vue-awesome/icons/brands/twitter')
require('vue-awesome/icons/brands/whatsapp')

Vue.component('v-icon', Icon)
