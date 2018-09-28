export default {
  state: {
    requestParamsOfTaskList: {
      // incomeLetterNum:'',
      // incomeLetterDate:'',
      // stockCode:'',
      // analyst:'',
      // reviewer:'',
      // taskStatus:'',
      // pageI:'',
      // pageR:'',
      // resultNum:0,
      // taskNum:22222
    },
    currentTaskData: {
      // stockCode:'',
      // taskId:'T20180224155026',
      // operatorType:'',
      // hasInsiderData:''
    },
    taskStatus: '',
    analysisType: '',
    branchCode: '',
    departmentcode: '',
    taskListData: [],
    insiderTradAnalyParam: {},
    checkedData: {},
    selectCitiesList: [],
    accountparam: [],
    macroAnalyRequestCount: 0,//宏观分析页面请求成功接口数量
    markTableRender: 0, // 维度信息查询页面 1: 账户，3：PBU, 5: 营业部，7：会员，2：账户—逐日 ，4：PBU—逐日， 6: 营业部—逐日 ，8: 会员—逐日
    saveDrillingDetailSecurity: { // 维度信息查询钻取详情表格——账户证券交易查询，账户证券持仓查询按钮对话框弹出
      dialog: false,
      type: 'trading' // holding: 证券持仓  trading: 证券交易
    },
    demensionTaskInfo: {
      // affiche_enddate: '2018-08-13',
      // affiche_startdate: '2018-07-10',
      // anal_type_name: 'lk',
      // base_info_id: 'B20180705200836',
      // check_enddate: '2015-07-24',
      // check_startdate: '2015-07-21',
      // city: '新疆',
      // create_time: '20180705',
      // create_user: 'ghe',
      // group_detail_id: 'ZD0101',
      // lasttrd_date: '2018-07-03',
      // lastupdate_time: '20180718',
      // lastupdate_user: 'ghe',
      // province: null,
      // resumption_date: '2018-07-11',
      // sec_code: '600581',
      // sec_name: '八一钢铁',
      // sector_name: '材料',
      // sector_name_wind: '钢铁',
      // task_id: '20180705200836',
      // task_monitor_type: '3',
      // version: '1'
    }, // 维度信息查询页面查询到的该任务基本信息
    requestPassCount: 0
  },
  getters: {},
  mutations: {
    saveDrillingDetailSecurity (state, params) { // 维度信息查询钻取详情弹框表格,避免弹框中再弹框的情况
      state.saveDrillingDetailSecurity.dialog = params.dialog
      state.saveDrillingDetailSecurity.type = params.type || state.saveDrillingDetailSecurity.type
    },
    saveDemensionType (state, params) { // 维度信息查询页面,表头判断
      state.markTableRender = params
    },
    saveTaskInfo (state, params) {
      state.demensionTaskInfo = params
    },
    changeMacroAnalyRequestCount (state, params) {
      state.macroAnalyRequestCount = params
    },
    changeDemensionRequestCount (state, params) {
      state.requestPassCount = params
    },
    changedepartmentcode (state, params) {
      state.departmentcode = params
    },
    saveaccountParams (state, params) {
      state.accountparam = params
    },
    savebranchCode (state, params) {
      state.branchCode = params
    },
    saveParams (state, params) {
      state.requestParamsOfTaskList = params
    },
    saveCurrentTaskData (state, params) {
      state.currentTaskData = params
    },
    saveTaskListData (state, params) {
      state.taskListData = params
    },
    saveCheckedData (state, params) {
      state.checkedData = params
    },
    saveInsiderTradAnalyParams (state, params) {
      state.insiderTradAnalyParam = params
    },
    saveSelectCitiesList (state, params) {
      state.selectCitiesList = params
    },
    changeBackStatus (state, params) {
      state.insiderTradAnalyParam.back = params
    },
    changeAnalysisType (state, params) {
      state.analysisType = params
    },
    changeTaskStatus (state, params) {
      state.taskStatus = params
    }
  },
  action: {}
}
