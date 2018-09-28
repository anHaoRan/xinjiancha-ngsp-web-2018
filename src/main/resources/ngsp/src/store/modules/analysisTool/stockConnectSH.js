export default {
  state: {
    SecuritiesFilingRadio: ''
  },
  getters: {
    getSecuritiesFilingRadio: state => {
      return state.SecuritiesFilingRadio
    }
  },
  mutations: {
    setSecuritiesFilingRadio: (state, val) => {
      state.SecuritiesFilingRadio = val
    }
  },
  actions: {}
}
