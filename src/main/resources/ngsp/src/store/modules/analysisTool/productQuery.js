export default {
  state: {
    creditOptions: [],
    orderOptions: [],
    participantLevelOptions: []
  },
  getters: {},
  mutations: {
    getCreditOptions (state, val) {
      state.creditOptions = val
    },
    getOrderOptions (state, val) {
      state.orderOptions = val
    },
    getParticipantLevelOptions (state, val) {
      state.participantLevelOptions = val
    }
  },
  actions: {}
}