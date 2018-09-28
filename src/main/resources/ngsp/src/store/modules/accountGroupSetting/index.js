export default {
  state: {
    jumpToAccountGroupSettingCode: ''
  },
  getters: {
    getJumpToAccountGroupSettingCode: state => state.jumpToAccountGroupSettingCode
  },
  mutations: {
    updateJumpToAccountGroupSettingCode (state, value) { // 更新跳转到账户组设置页面的当前账户组类型code
      state.jumpToAccountGroupSettingCode = value
    }
  },
  action: {}
}
