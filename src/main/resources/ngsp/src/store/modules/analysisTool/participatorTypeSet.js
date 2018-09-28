export default {
  state: {
    salePartParams: {},
    profitTypeParams: {},
    codeUploadParams: {},
    codeSalePartParams: {},
    profitTypeTimeParams: {},
    timeParams: {}
  },
  getters: {},
  mutations: {
    // 营业部证券代码
    salePartStatus (state, params) {
      state.salePartParams = params
    },
    profitTypeStatus (state, params) {
      state.profitTypeParams = params
    },
    codeUploadStatus (state, params) {
      state.codeUploadParams = params
    },
    codeSalePartStatus (state, params) {
      state.codeSalePartParams = params
    },
    profitTypeTimeStatus (state, params) {
      state.profitTypeTimeParams = params
    },
    TimeStatus (state, params) {
      state.timeParams = params
    }
    // codeSalePartStatus(state,params){
    //   state.codeSalePartParams = params
    // }
  },
  action: {}
}
