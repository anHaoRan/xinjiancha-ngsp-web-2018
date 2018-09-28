// import Vue from 'vue'
export default {
  state: {
    trackingForm0: {},
    trackingForm1: {},
    trackingForm2: {},
    trackingForm3: {},
    trackingForm4: {},
    trackingForm5: {},
    trackingForm6: {},
    trackingForm7: {}
  },
  getters: {
    queryTrackForm0: state => state.trackingForm0,
    queryTrackForm1: state => state.trackingForm1,
    queryTrackForm2: state => state.trackingForm2,
    queryTrackForm3: state => state.trackingForm3,
    queryTrackForm4: state => state.trackingForm4,
    queryTrackForm5: state => state.trackingForm5,
    queryTrackForm6: state => state.trackingForm6,
    queryTrackForm7: state => state.trackingForm7
  },
  mutations: {
    storeForm0 (state, params) {
      state.trackingForm0 = params
    },
    storeForm1 (state, params) {
      state.trackingForm1 = params
    },
    storeForm2 (state, params) {
      state.trackingForm2 = params
    },
    storeForm3 (state, params) {
      state.trackingForm3 = params
    },
    storeForm4 (state, params) {
      state.trackingForm4 = params
    },
    storeForm5 (state, params) {
      state.trackingForm5 = params
    },
    storeForm6 (state, params) {
      state.trackingForm6 = params
    },
    storeForm7 (state, params) {
      state.trackingForm7 = params
    }
  },
  action: {}
}
