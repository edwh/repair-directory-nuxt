export const state = () => ({
  list: [],
})

export const mutations = {
  setList(state, list) {
    state.list = list
  },
}

export const getters = {
  list: (state) => state.list,
}

export const actions = {
  async list({ commit }) {
    const ret = await this.$axios.get('/api/category/list')

    if (ret && ret.data && ret.data.categories) {
      commit('setList', ret.data.categories)
    }
  },
}
