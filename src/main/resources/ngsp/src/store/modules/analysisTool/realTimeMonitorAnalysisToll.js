export default {
  state: {
    stockCode: '',
    stockCodeName: '',
    selectCheckedCode: [], // 选中账户
    selectMonitorCode: [], // 待监控账户
    selectAnalysisCode: [] // 待监控账户
  },
  getters: {},
  mutations: {
    saveStockCode (state, params) {
      state.stockCode = params
    },
    saveStockCodeName (state, params) {
      state.stockCodeName = params
    },
    saveSelectCheckedCode (state, params) {
      state.selectCheckedCode = params
    },
    saveSelectMonitorCode (state, params) {
      state.selectMonitorCode = params
    },
    saveSelectAnalysisCode (state, params) {
      state.selectAnalysisCode = params
    }
  },
  action: {}
}
