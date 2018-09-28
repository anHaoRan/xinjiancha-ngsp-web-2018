import {
  getActivityNameByProcessName,
  getInfoId,
  deletefile,
  ispermitload,
  getUserRoles
} from '../../service/superviseTask'
import {activityNameMapRouteName} from './constants'
import subMixIn from './subMixIn'
import moment from 'moment'
export default {
  name: 'mixin.js',
  props: [],
  components: {
    StepsCommonComponent: () => import('./superviseTaskComponent/StepsCommonComponent'),
    selectPersonComponent: () => import('./superviseTaskComponent/selectPersonComponent'),
    SelectorDealer: () => import('@/components/common/SelectorDealer'),
    MarginTable: () => import('@/components/base/MarginTable'),
    Breadcrumb: () => import('@/components/common/Breadcrumb'),
    StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
    SuggestionTextareaComponent: () => import('./superviseTaskComponent/SuggestionTextareaComponent'),
    BottomButtonGroup: () => import('./superviseTaskComponent/BottomButtonGroup'),
    SDatePicker: () => import('@/components/base/SDatePicker'),
    BatchDialog: () => import('./superviseTaskComponent/LetterBorrowLendBatchDialog'),
    LetterBorrowLendBatchButtonGroup: () => import('./superviseTaskComponent/LetterBorrowLendBatchButtonGroup')
  },
  mixins: [subMixIn],
  data () {
    let selfDisabledDate = 0
    let isSelectStartDate = true
    return {
      selfPickerOption: { // 开始时间不能大于今天，结束时间不能大于今天且不能小于开始时间
        disabledDate: (time) => {
          if (isSelectStartDate) {
            return time.getTime() >= Date.now() - 8.46e6
          }
          return time.getTime() < selfDisabledDate || time.getTime() >= Date.now() - 8.46e6
        },
        onPick: ({maxDate, minDate}) => {
          if (!maxDate) {
            isSelectStartDate = false
            selfDisabledDate = new Date(minDate).getTime()
          } else {
            isSelectStartDate = true
          }
        }
      },
      defaultPropsDisabledTime: new Date(moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00').getTime(),
      fromPage: '',
      showUploadButton: true, // 上传按钮展示与否
      fileNameList1: [], // 文件列表 name
      fileNameList2: [],
      fileNameList3: [],
      fileNameList4: [],
      infoId: '',
      // 自律监管、调取资料中调取资料历史信息表格数据
      tableData: {
        data: [],
        total: 0,
        pageRows: 10,
        pageIndex: 1
      },
      tableHeight: 200,
      loading: false, // 任务列表页表格加载状态
      total: 0,
      oneword: [],
      steps: [], // 步骤图节点数组
      stepsDescription: [], // 步骤图描述信息数组
      acivityNameArray: [],
      selectData: {
        dialogFormVisble: false,
        activityName: '',
        instanceId: '',
        processName: '', // ngsp_obd_flow
        businessData: {},
        userId: ''
      },
      approveFlag: 'true',
      processStatus: 0, // 当前流程节点状态
      instanceId: '',
      taskId: '',
      handleStatus: '',
      suggestionForm: '', // 意见内容
      suggestionTableData: [], // 意见表格数据
      showSelectPersonArray: [],
      showSelectPersonArrayMap: {
        selfSupervisionFormPage: [1, 2], // 自律监管重构[0, 1, 2, 3]
        surveyFormPage: [1, 2], // 调取资料重构[0, 1, 2, 3]
        sendLetterFormPage: [1, 3], // 联合监管发函重构[0, 1, 3]
        replyLetterFormPage: [0, 1, 2, 4, 6], // 联合监管复函重构[0, 1, 2, 3, 4, 6]
        // processform: [], // 自律监管
        // surveyprocessform: [], // 调取资料
        dataAssocFormPage: [0, 1, 3, 5], // 数据协查（创建并分配）[0, 1, 2, 3]
        // dataAssociationassign: [], // 数据协查（创建并分配）
        // dataAssociationdraft: [], // 数据协查（创建并拟稿）
        // creatprocess: [], // 联合监管发函
        // departmentHeadAssign: [], // 联合监管复函
        temporaryCalculationForm: [], // 临时计算
        creatingSpecialWork: [], // 专项工作
        accessRequestForm: [], // 权限申请
        halfform: [2, 3, 5], // 舆情分析（已重构）
        newBuiltSecurity: [], // 重点监控证券
        newBuiltAccountGroup: [], // 重点监控账户组
        marketAnalysisForm: [], // 市场分析
        letterBorrowForm: [], // 函件借阅
        letterLendFormPage: [], // 函件传阅
        logAuditForm: [], // 日志审计
        demandManagementForm: [], // 需求管理
        clueReportForm: [] // 线索报告
      },
      isBatchLetterLendFlow: false, // 是否发起批量传阅流程
      letterBorrowBatchSelectArray: [], // 函件借阅或传阅批量操作选中的数组
      letterLendBatchSelectArray: [], // 函件借阅或传阅批量操作选中的数组
      defaultLimitFileType: ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'rar', 'zip', '7z'],
      commitLoading: false // 提交时loading
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleSdatePickerDateRangeChange(dateRange) {
      this.selectParams.selectDateRange = dateRange
    },
    // 下载权限修改，获取文件列表 name 仅供展示
    getFileNameList (fileList, fileNameList) {
      fileNameList = fileList.map(item => {
        return item.name
      })
      if (!fileNameList.length) {
        fileNameList.push('无附件')
      }
      return fileNameList
    },
    // 判断用户，是否刷新页面重置vuex
    resetVuex () {
      let userNow = this.gfnGetUsername() // 当前用户
      let userSave = this.$store.state.superviseTask.user // vuex存储的账户
      return userNow === userSave
    },
    // 分页事件
    getPageination (val) {
      this.pagination = val
      this.getAllData()
    },
    updateApproveFlag (val) {
      this.approveFlag = val
    },
    handleInputSuggestion (val) {
      this.suggestionForm = val
    },
    updateStepsDescription (val) {
      this.stepsDescription = val
    },
    // 借阅点击事件
    handleLetterBorrrow (val) {
      this.$router.push({
        path: '/letterBorrowForm',
        query: {
          fromInstanceId: val.instanceId,
          processName: '0'
        }
      })
    },
    // 传阅点击事件
    handleLetterLend (val) {
      this.$router.push({
        path: '/letterLendFormPage',
        query: {
          fromInstanceId: val.instanceId,
          processName: '0'
        }
      })
    },
    handleLetterBorrowLendBatchDialogShow(flag) { // 展示函件借阅或传阅批量操作dialog
      if (flag) { // 传阅
        if (!this.letterLendBatchSelectArray.length) {
          this.$message.error(`请先选择有效的记录进行批量传阅操作`)
          return
        }
        this.isBatchLetterLendFlow = true
      } else {
        if (!this.letterBorrowBatchSelectArray.length) {
          this.$message.error(`请先选择有效的记录进行批量借阅操作`)
          return
        }
        this.isBatchLetterLendFlow = false
      }
      this.$refs['letterBorrowLendBatchDialog'].showDialog = true
      this.$nextTick(() => {
        this.$refs['letterBorrowLendBatchDialog'].clearForm()
      })
    },
    handleLetterBorrowLendBatchSelectionChange(val) {
      let array1 = []
      let array2 = []
      val.forEach(v => {
        if (v.isCanBorrow) {
          array1.push(v.instanceId)
        }
        if (v.isCanLend) {
          array2.push(v.instanceId)
        }
      })
      this.letterBorrowBatchSelectArray = array1
      this.letterLendBatchSelectArray = array2
    },
    reqActivityNameByProcessName(callback, propsProcessStatus) { // 根据流程状态获取一些信息
      const currentPage = this.$route.name
      this.selectData.processName = activityNameMapRouteName[currentPage]
      getActivityNameByProcessName(this.selectData.processName).then(res => {
        this.steps = res['localStatusName']
        this.acivityNameArray = res['activityName']
        let processStatus = propsProcessStatus ||  (+this.processStatus + 1)
        this.selectData.activityName = res['activityName'][processStatus]
        this.selectData.businessData = res['businessData']
        callback && callback()
      })
    },
    goBack () {
      const {from} = this.$route.query
      const {name} = this.$route
      if (from && from === 'flowList') {
        this.$router.push({name: 'topPage'})
      } else {
        if (name === 'dataAssocFormPage') {
          this.$router.push({name: 'tablelist'})
        } else if (name === 'selfSupervisionFormPage') {
          this.$router.push({name: 'selfregulation'})
        } else if (name === 'surveyFormPage') {
          this.$router.push({name: 'informationtable'})
        } else if (name === 'replyLetterFormPage') {
          this.$store.commit('saveJointSupervisionTabs', 'two')
          this.$router.push({name: 'letterlist'})
        } else if (name === 'sendLetterFormPage') {
          this.$store.commit('saveJointSupervisionTabs', 'one')
          this.$router.push({name: 'letterlist'})
        } else if (['affirmBuiltAccountGroup', 'changeBuiltAccountGroup', 'checkBuiltAccountGroup', 'newBuiltAccountGroup', 'overBuiltAccountGroup'].indexOf(name) > -1) {
          this.$router.push({name: 'focusMonitorAccountGroup'})
        } else if (['affirmMonitorSecurity', 'changeMonitorSecurity', 'checkMonitorSecurity', 'newBuiltSecurity', 'overMonitorSecurity'].indexOf(name) > -1) {
          this.$router.push({name: 'focusMonitorSecurity'})
        } else if (['fullform', 'halfform'].indexOf(name) > -1) {
          this.$router.push({name: 'lyricTablelist'})
        } else if (name === 'accessRequestForm') {
          this.$router.push({name: 'accessRequestTablelist'})
        } else if (name === 'clueReportForm') {
          this.$router.push({name: 'clueReportTablelist'})
        } else if (name === 'demandManagementForm') {
          this.$router.push({name: 'demandManagementTablelist'})
        } else if (name === 'letterBorrowForm' || name === 'letterLendFormPage') {
          this.$router.push({name: 'letterBorrowTablelist'})
        } else if (name === 'logAuditForm') {
          this.$router.push({name: 'logAuditTablelist'})
        } else if (name === 'marketAnalysisForm') {
          this.$router.push({name: 'marketAnalysisTable'})
        } else if (name === 'creatingSpecialWork') {
          this.$router.push({name: 'specialWorkTablelist'})
        } else if (name === 'temporaryCalculationForm') {
          this.$router.push({name: 'temporaryCalculationTablelist'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    createInfoId () {
      getInfoId().then((resp) => {
        this.infoId = resp
      })
    },
    callbackMessage(resp) {
      this.commitLoading = false
      if (resp.assignee) {
        let message = typeof resp.assignee === 'string' ? resp.assignee : resp.assignee[0] ? resp.assignee[0].assigneeName : ''
        if (message) {
          this.$message.success(`流程下一处理人：${message.replace(/,/g, ' ')}`)
        }
      }
    },
    deleteFile (file) {
      if (file.status && file.status === 'ready') {
        return
      }
      let fileId = file.fileId || file.response.value.fileId
      if (fileId) {
        deletefile(fileId).then((resp) => {
          this.getFileList()
          if (resp) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    downloadFile(fileId, file) {
      if (String(this.handleStatus) === '1') {
        ispermitload(this.instanceId).then((resp) => {
          if (resp) {
            window.location.href = this.gfnGetDownloadFileUrl(fileId, file.name)
          } else {
            this.$message.error('没有下载权限！')
          }
        })
      } else {
        window.location.href = this.gfnGetDownloadFileUrl(fileId, file.name)
      }
    }
  },
  created () {
  },
  mounted () {
    const {operate, taskId, instanceId, processStatus} = this.$route.query
    const {name} = this.$route
    if (processStatus) {
      this.processStatus = processStatus
    }
    this.handleStatus = operate
    this.taskId = taskId
    this.instanceId = instanceId
    // 设置显示选人组件的节点数组
    this.showSelectPersonArray = this.showSelectPersonArrayMap[name]
  },
  beforeDestroy () {
  }
}
