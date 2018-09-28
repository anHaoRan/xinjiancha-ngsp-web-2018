export default {
  state: {
    currentOrgCode: '',
    currentBoardCode: ''
  },
  getters: {
    getcurrentOrgCode: state => state.currentOrgCode,
    getcurrentBoardCode: state => state.currentBoardCode
  },
  mutations: {
    updateCurrentOrgCode (state, value) { // 更新自定义投资者设置当前orgcode
      state.currentOrgCode = value
    },
    updateCurrentBoardCode (state, value) { // 更新自定义板块设置当前boardCode
      state.currentBoardCode = value
    }
  },
  action: {}
}
