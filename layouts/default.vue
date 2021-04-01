<template>
  <div>
    <component :is="'style'" v-if="styles">
      <!--      eslint-disable-->
      .rd-primary-font {
        font-family: {{ styles.primaryFont }} !important;
      }

      .rd-secondary-font {
        font-family: {{ styles.secondaryFont }} !important;
      }

      .rd-list-percentage-color {
        color: {{ styles.listPercentageColor }} !important;
      }

      .rd-sidebar-background {
        background: {{ styles.sidebarBackground }} !important;
        background-color: {{ styles.sidebarBackgroundColor }} !important;
      }

      .rd-sidebar-button {
        color: {{ styles.sidebarButtonColor}} !important;
        background-color: {{ styles.sidebarButtonBackgroundColor}} !important;
      }

      .rd-sidebar input, .rd-sidebar select {
        color: {{ styles.sidebarInputColor }} !important;
        background: {{ styles.sidebarInputBackgroundColor }} !important;
      }

      .rd-sidebar input::placeholder, .rd-sidebar select::placeholder {
        color: {{ styles.sidebarInputPlaceholderColor }};
      }
      <!--      eslint-enable-->
    </component>
    <Nuxt />
  </div>
</template>
<script>
export default {
  computed: {
    styles() {
      // We allow customisation of certain styles.
      //
      // An example:
      // http://localhost:3000/?rd_style=%7B%22primaryFont%22%3A%22Poppins%22,%22secondaryFont%22%3A%22Poppins%22,%22listPercentageColor%22%3A%22%2301D66D%22,%22sidebarBackgroundColor%22%3A%22%23017602%22,%22sidebarBackground%22%3A%22%22,%22sidebarButtonColor%22%3A%22%2315181D%22,%22sidebarButtonBackgroundColor%22%3A%22%2301D66D%22,%22sidebarInputColor%22%3A%22black%22,%22sidebarInputBackgroundColor%22%3A%22white%22,%22sidebarInputActiveColor%22%3A%22black%22,%22sidebarInputFocusColor%22%3A%22black%22,%22sidebarInputPlaceholderColor%22%3A%22black%22%7D
      const styles = this.$store.getters['config/get']('styles')
      let ret = null

      try {
        ret = Object.assign(
          // Default values
          {
            primaryFont: 'Patua One',
            secondaryFont: '"Open Sans", sans-serif',
            listPercentageColor: '#f9a543',
            sidebarBackgroundColor: 'transparent',
            sidebarBackground:
              'linear-gradient(rgb(30, 134, 148), rgb(6, 77, 87))',
            sidebarButtonColor: 'white',
            sidebarButtonBackgroundColor: '#f9a33f',
            sidebarInputColor: 'white',
            sidebarInputBackgroundColor: 'linear-gradient(#22737d, #0e5f69)',
            sidebarInputActiveColor: 'white',
            sidebarInputFocusColor: 'white',
            sidebarInputPlaceholderColor: 'lightgrey',
          },
          styles ? JSON.parse(styles) : {}
          // REW values
          // {
          //   primaryFont: 'Poppins',
          //   secondaryFont: 'Poppins',
          //   listPercentageColor: '#01D66D',
          //   sidebarBackground: '',
          //   sidebarBackgroundColor: '#017602',
          //   sidebarButtonColor: '#15181D',
          //   sidebarButtonBackgroundColor: '#01D66D',
          //   sidebarInputColor: 'black',
          //   sidebarInputBackgroundColor: 'white',
          //   sidebarInputActiveColor: 'black',
          //   sidebarInputFocusColor: 'black',
          //   sidebarInputPlaceholderColor: 'black',
          // }
        )

        console.log('Styles ', JSON.stringify(ret))
      } catch (e) {
        console.error('Styles parse error', e, styles)
      }

      return ret
    },
  },
}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
