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
  async list({ commit }, params) {
    const ret = await this.$axios.get('/api/category/list', {
      params: {
        region: params.region || null,
      },
    })

    if (ret && ret.data && ret.data.categories) {
      commit('setList', ret.data.categories)
    }
  },
}
