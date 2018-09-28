export default {
  state: {
    user: '',
    // 权限申请
    accessRequest: {
      taskNumber: '', // 任务编号
      keyWord: '', // 关键字
      createPeople: '', // 创建人
      localStatus: [], // 状态
      creatTime: [] // 创建时间
    },
    clueReport: {
      stockCodeName: '', // 证券代码及简称
      keyWords: '', // 关键字
      creatType: '', // 创建类型
      taskStatus: [], // 状态
      applicantPerson: '', // 申请人
      currentUser: '', // 在办人
      applicationDate: [], // 申请日期
      sendLetterDate: [] // 发函日期
    },
    dataAssociation: {
      stockCode: '', // 证券代码
      keyword: '', // 关键字
      createType: '', // 创建类型
      localStatus: [], // 状态
      applicanter: '', // 申请人
      people: '', // 在办人
      selectDateRange1: [], // 申请日期
      selectDateRange2: [] // 发函日期
    },
    demandManagement: {
      taskNumber: '', // 任务编号
      keyWord: '', // 关键字
      createPeople: '', // 创建人
      localStatus: [], // 状态
      creatTime: [] // 创建时间
    },
    focusMonitorAccountGroup: {
      groupName: '', // 账户组名称
      applicant: '', // 申请人
      monitorLevel: '', // 监控级别
      localStatus: '', // 状态
      monitorReason: '', // 监控原因
      handler: '', // 在办人
      applyDate: '' // 申请日期
    },
    focusMonitorSecurity: {
      stockCode: '', // 证券代码及简称
      applicant: '', // 申请人
      monitorLevel: '', // 监控级别
      localStatus: '', // 状态
      monitorReason: '', // 监控原因
      handler: '', // 在办人
      applyDate: '' // 申请日期
    },
    jointregulation: {
      activeTabs: 'one',
      sendForm: {
        stockCode: '', // 证券代码
        keyWord: '', // 关键字
        createdType: '', // 创建类型
        localStatus: [], // 状态
        applicanter: '', // 申请人
        people: '', // 在办人
        selectDateRange: [] // 申请日期范围
      },
      replyForm: {
        stockCode: '', // 证券代码
        keyword: '', // 关键字
        createType: '', // 创建类型
        localStatus: [], // 状态
        fromDept: [], // 来函单位
        proposer: '', // 申请人
        procePerson: '', // 在办人
        selectDateRange: [], // 申请开始日期
        isRpc: '' // 是否线索上报
      }
    },
    letterBorrow: {
      activeTabName: '0',
      letterNumber: '', // 函件编号
      keyWord: '', // 关键字
      requesterName: '', // 创建人
      currentUserNames: '', // 在办人
      localStatus: [], // 状态
      selectDateRange: [] // 借阅日期
    },
    logAudit: {
      taskNo: '', // 任务编号
      description: '', // 关键字
      createPerson: '', // 创建人
      selectDateRange: [], // 创建时间
      localStatus: [] // 状态
    },
    lyricAnalisis: {
      stockCode: '', // 证券代码
      keyword: '', // 关键字
      createType: '', // 创建类型
      sourceFrom: [], // 舆情来源
      isImportant: false, // 仅看重大事件
      people: '', // 拟稿人
      selectDateRange: [], // 发布时间
      localStatus: [] // 状态
    },
    marketAnalysis: {
      keyword: '', // 关键字
      reportNo: '', // 报告编号
      createDateRange: [], // 创建日期
      createPerson: '', // 创建人
      procePerson: '', // 在办人
      sendDateRange: '', // 发函日期
      localStatus: [] // 状态
    },
    retrieveinformation: {
      stockCode: '', // 证券代码
      keyWord: '', // 关键字
      createdType: '', // 创建类型
      localStatus: [], // 状态
      applicanter: '', // 申请人
      sendLetterNumber: '', // 发函编号
      selectDateRange: []
      // beginDate: '', // 申请开始日期
      // endDate: '' // 申请结束日期
    },
    selfsupervision: {
      stockCode: '', // 证券代码
      keyword: '', // 关键字
      createType: '', // 创建类型
      isclassification: [], // 监管分类
      localStatus: [], // 状态
      applicanter: '', // 申请人
      people: '', // 在办人
      selectDateRange: [], // 申请日期
      sendLetterNumber: '' // 发函编号
    },
    specialWork: {
      workType: [], // 工作类别
      startDate: '', // 开始日期
      foreFinishDate: '', // 预计完成日期
      charger: '', // 负责人
      localStatus: [] // 状态
    },
    temporaryCalculation: {
      taskNo: '', // 任务编号
      keyWord: '', // 关键字
      createType: '', // 创建类型
      createPerson: '', // 创建人
      selectDateRange: [], // 创建时间
      localStatus: [] // 状态
    }
  },
  getters: {},
  mutations: {
    // 保存当前用户
    saveUser (state, params) {
      state.user = params
    },
    // 权限申请
    saveAccessRequestQueryParams (state, params) {
      state.accessRequest = params
    },
    // 线索报告
    saveClueReportQueryParams (state, params) {
      state.clueReport = params
    },
    // 需求管理
    saveDemandManageQueryParams (state, params) {
      state.demandManagement = params
    },
    // 数据协查
    saveDataAssociationQueryParams (state, params) {
      state.dataAssociation = params
    },
    // 重点监控证券
    saveFocusMonitorSecQueryParams (state, params) {
      state.focusMonitorSecurity = params
    },
    // 重点监控证券组
    saveFocusMonitorSecGroupQueryParams (state, params) {
      state.focusMonitorAccountGroup = params
    },
    // 联合监管tab
    saveJointSupervisionTabs (state, params) {
      state.jointregulation.activeTabs = params
    },
    // 联合监管发函
    saveSentLetterQueryParams (state, params) {
      state.jointregulation.sendForm = params
    },
    // 联合监管复函
    saveReplyLetterQueryParams (state, params) {
      state.jointregulation.replyForm = params
    },
    // 函件借阅
    saveLetterBorrowQueryParams (state, params) {
      state.letterBorrow = params
    },
    // 函件借阅activeTab
    saveLetterBorrowLendTabs(state, params) {
      state.letterBorrow.activeTabName = params
    },
    // 日志审计
    saveLogAuditQueryParams (state, params) {
      state.logAudit = params
    },
    // 舆情分析
    saveLyricQueryParams (state, params) {
      state.lyricAnalisis = params
    },
    // 市场分析
    saveMarketAnalysisQueryParams (state, params) {
      state.marketAnalysis = params
    },
    // 调取资料
    saveRetrieveInfoQueryParams (state, params) {
      state.retrieveinformation = params
    },
    // 自律监管
    saveSelfGulationQueryParams (state, params) {
      state.selfsupervision = params
    },
    // 专项工作
    saveSpecialWorkQueryParams (state, params) {
      state.specialWork = params
    },
    // 临时计算
    saveMomentCalculationQueryParams (state, params) {
      state.temporaryCalculation = params
    }

  },
  action: {}
}
