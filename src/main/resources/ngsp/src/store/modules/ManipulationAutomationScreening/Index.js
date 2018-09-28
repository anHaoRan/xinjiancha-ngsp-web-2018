export default {
  state: {
    lastSelectParams: {}
  },
  getters: {
    getLastSelectParams: state => {
      return state.lastSelectParams
    }
  },
  mutations: {
    setLastSelectParams: (state, lastSelectParams) => {
      state.lastSelectParams = lastSelectParams
    }
  },
  actions: {}
}
