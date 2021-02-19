// Mixin used on every page.
export default {
  fetch() {
    // If you override fetch then you need to call this manually.
    this.setConfig()
  },
}
