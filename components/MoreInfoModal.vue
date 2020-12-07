<template>
  <b-modal id="moreinfo" v-model="showModal" size="lg" no-stacking>
    <h4>Broken gadget?</h4>
    <p>
      <strong
        >No time to fix it yourself or to bring it to a Restart Party in
        London?</strong
      >
      Search the Restart Repair Directory to find a reliable repair business in
      your area.
    </p>
    <p>
      <strong>This is a beta release</strong> and includes businesses in
      <strong>11 boroughs in London</strong>: Barnet, Camden, Enfield Hackney,
      Haringey, Islington and Waltham Forest in North London, and Barking and
      Dagenham, Newham, Havering, Redbridge in East London.
    </p>
    <h4>Get involved</h4>

    <p>You can help us grow the repair economy.</p>

    <ul>
      <li>
        <a
          target="_blank"
          href="https://therestartproject.org/repairdirectory/about"
          >Learn more about the Repair Directory</a
        >, and let us know what you think. Noticed a bug? Get in touch.
      </li>
      <li>
        Help us improve the list of businesses in these 11 London boroughs. Send
        us an
        <a target="_blank" href="mailto:tech@therestartproject.org">email</a> if
        you notice an error or omission, or with your own recommended business.
      </li>
      <li>
        Help us build the software. The Repair Directory is free, open-source
        software with the source code
        <a
          target="_blank"
          href="https://github.com/TheRestartProject/RepairDirectory"
          >available on Github TODO new location</a
        >. If you’re a coder, a designer, a UX person, or a tester, you can get
        involved.
      </li>
    </ul>

    <p>
      Mapping repair businesses in the 7 boroughs of North London was funded by
      a grant from the the North London Waste Authority Community Fund.
    </p>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <div class="d-flex justify-content-end w-100">
        <b-btn variant="light" @click="cancel"> Close </b-btn>
      </div>
    </template>
  </b-modal>
</template>
<script>
export default {
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
  },
}
</script>
