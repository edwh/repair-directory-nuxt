<template>
  <b-modal
    id="sharemodal"
    v-model="showModal"
    :title="'Share ' + business.name"
    size="lg"
  >
    <template slot="default">
      <div v-if="business">
        <social-sharing
          :url="url"
          :title="'Sharing ' + business.name"
          hashtags="repair"
          inline-template
        >
          <div>
            <div class="d-flex flex-wrap justify-content-around mt-3">
              <network network="facebook">
                <b-btn variant="secondary" size="lg" class="facebook m-1">
                  <v-icon name="brands/facebook" /> Facebook
                </b-btn>
              </network>
              <network network="whatsapp">
                <b-btn variant="primary" size="lg" class="whatsapp m-1">
                  <v-icon name="brands/whatsapp" /> Whatsapp
                </b-btn>
              </network>
              <network network="twitter">
                <b-btn variant="secondary" size="lg" class="twitter m-1">
                  <v-icon name="brands/twitter" /> Twitter
                </b-btn>
              </network>
              <network network="email">
                <b-btn variant="primary" size="lg" class="gmail m-1">
                  <v-icon name="envelope" /> Email
                </b-btn>
              </network>
            </div>
          </div>
        </social-sharing>
      </div>
    </template>
    <template slot="modal-footer">
      <b-button variant="secondary" @click="close"> Close </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    business: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
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
  },
  methods: {
    show() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    },
  },
}
</script>
<style scoped lang="scss">
@import 'assets/css/colours.scss';

::v-deep .facebook {
  background-color: $color-facebook !important;
  color: white;
}

::v-deep .twitter {
  background-color: $color-twitter !important;
  color: white;
}

::v-deep .whatsapp {
  background-color: $color-whatsapp !important;
}

::v-deep .gmail {
  background-color: $color-gmail !important;
}
</style>
