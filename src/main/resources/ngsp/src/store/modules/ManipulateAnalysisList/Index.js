export default {
  state: {
    shuttleLeft: [],
    shuttleRight: [],
    // 穿梭框的ref
    transfer: null,
    // 查询条件
    selectParams: {},
    checkAccount: []
  },
  getters: {
    getTransfer: state => {
      return state.transfer
    },
    // 获取总的账户信息
    getShuttleLeft: state => {
      return state.shuttleLeft
    },
    // 获取删除账户信息
    getShuttleRight: state => {
      return state.shuttleRight
    },
    // 获取保留账户信息
    getGoDeleteRight: state => {
      let delAcctIds = JSON.parse(JSON.stringify(state.shuttleRight)),
        reservedAcctIds = JSON.parse(JSON.stringify(state.shuttleLeft))
      for (let key of delAcctIds) {
        for (let i = 0; i < reservedAcctIds.length; i++) {
          if (key.acct_id === reservedAcctIds[i].acct_id) {
            reservedAcctIds.splice(i, 1)
            break
          }
        }
      }
      return reservedAcctIds
    },
    getSelectParams: state => {
      return state.selectParams
    },
    getCheckAccount: state => {
      return state.checkAccount
    }
  },
  mutations: {
    setTransfer: (state, transfer) => {
      state.transfer = transfer
    },
    setShuttleLeft: (state, arr) => {
      state.shuttleLeft = arr
    },
    setShuttleRight: (state, arr) => {
      state.shuttleRight = arr
    },
    setSelectParams: (state, obj) => {
      state.selectParams = obj
    },
    setCheckAccount: (state, arr) => {
      state.checkAccount = arr
    }
  },
  actions: {
    setShuttleLeft ({commit, state}, list) { // eslint-disable-line
      let arr = [...state.shuttleLeft, ...list]
      let arr1 = []
      // 按照acct_rs去重，1>3>2
      for (let key of arr) {
        if (arr1.findIndex(item => item.acct_id === key.acct_id) === -1 && key.acct_rs === '1') {
          arr1.push(key)
        }
      }
      for (let key of arr) {
        if (arr1.findIndex(item => item.acct_id === key.acct_id) === -1 && key.acct_rs === '3') {
          arr1.push(key)
        }
      }
      for (let key of arr) {
        if (arr1.findIndex(item => item.acct_id === key.acct_id) === -1) {
          arr1.push(key)
        }
      }
      if (state.shuttleRight.length > 0) {
        let arrRight = JSON.parse(JSON.stringify(state.shuttleRight))
        for (let key of arrRight) {
          let index = arr1.findIndex(item => item.acct_id === key.acct_id)
          if (index !== -1) {
            key.acct_rs = arr1[index].acct_rs
          }
        }
        commit('setShuttleRight', arr_r)
      }
      commit('setShuttleLeft', arr1)
    }
  }
}
