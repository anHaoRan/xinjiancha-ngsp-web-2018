export default {
  state: {
    brushTime: {
      startTime: '',
      overTime: ''
    },
    brushSharingTime: {
      beginTime: '',
      endTime: ''
    },
    dateParams: '',
    tabName: 'sharingTime',
    tableOne: {
      status: false,
      tabName: ''
    },
    tableOneRows: '',
    tableTwo: {
      status: false,
      tabName: ''
    },
    tableTwoRows: '',
    tableThree: {
      status: false,
      tabName: ''
    },
    tableThreeRows: '',
    tableFour: {
      status: false,
      tabName: ''
    },
    tableFourRows: '',
    tableFive: {
      status: false,
      tabName: ''
    },
    tableFiveRows: '',
    tableSix: {
      status: false,
      tabName: ''
    }
  },
  getters: {},
  mutations: {
    saveTabsNameParams (state, params) {
      state.tabName = params
    },
    saveDateParams (state, params) {
      state.dateParams = params
    },
    savebrushSharingTimeParams (state, params) {
      state.brushSharingTime.beginTime = params.beginTime
      state.brushSharingTime.endTime = params.endTime
    },
    savebrushTimeParams (state, params) {
      state.brushTime.startTime = params.startTime
      state.brushTime.overTime = params.overTime
    },
    savetableOneParams (state, params) {
      state.tableOne.status = params.status
      state.tableOne.tabName = params.tabName
    },
    savetableOneRows (state, params) {
      state.tableOneRows = params
    },
    savetableTwoParams (state, params) {
      state.tableTwo.status = params.status
      state.tableTwo.tabName = params.tabName
    },
    savetableTwoRows (state, params) {
      state.tableTwoRows = params
    },
    savetableThreeParams (state, params) {
      state.tableThree.status = params.status
      state.tableThree.tabName = params.tabName
    },
    savetableThreeRows (state, params) {
      state.tableThreeRows = params
    },
    savetableFourParams (state, params) {
      state.tableFour.status = params.status
      state.tableFour.tabName = params.tabName
    },
    savetableFourRows (state, params) {
      state.tableFourRows = params
    },
    savetableFiveParams (state, params) {
      state.tableFive.status = params.status
      state.tableFive.tabName = params.tabName
    },
    savetableFiveRows (state, params) {
      state.tableFiveRows = params
    },
    savetableSixParams (state, params) {
      state.tableSix = params.status
    }
  },
  action: {}
}
