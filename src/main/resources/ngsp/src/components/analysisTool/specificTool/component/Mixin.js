import { getActivityNameByProcessName } from '@/service/superviseTask'
import {keyMonitorAccountsAndSecurityExport, getSecurityInfoIdByMonitorId, getAccountInfoIdByMonitorId} from '@/service/analysisTool/specificTool'
import {columns1, columns2} from './constants'
import ChartsCard from './ChartsCard'
export default {
  name: 'mixin.js',
  props: [],
  components: {
    MarginTable: () => import('@/components/base/MarginTable'),
    Breadcrumb: () => import('@/components/common/Breadcrumb'),
    StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
    SDatePicker: () => import('@/components/base/SDatePicker'),
    SelectorDealer: () => import('@/components/common/SelectorDealer'),
    ChartsCard
  },
  mixins: [],
  data () {
    return {
      defaultPropsDisabledTime: Date.now(),
      tableData: {
        data: [],
        total: 0,
        pageRows: 10,
        pageIndex: 1
      },
      localStatusNameList: [], // 节点列表
      loading: false // 任务列表页表格加载状态
    }
  },
  computed: {},
  watch: {},
  methods: {
    /* 日期控件disabled控制 */
    handleSdatePickerDateRangeChange(dateRange) {
      this.selectParams.selectDateRange = dateRange
    },
    // 分页事件
    getPageination (val) {
      this.tableData['pageIndex'] = val['currentPage']
      this.tableData['pageRows'] = val['pageSizeNumber']
      this.getTableData()
    },
    handleExport (type) { // 导出报表
      // type: 1 // 证券
      let params = {
        gridType: type ? 'ws' : 'wg',
        accountName: this.selectParams.accountName || '',
        accountCode: this.selectParams.accountCode || '',
        monitorReason: this.selectParams.monitorReason || '',
        monitorLeavel: this.selectParams.monitorLeavel || '',
        createPerson: this.selectParams.createPerson || '',
        clueMark: this.selectParams.clueMark || '',
        instrumentShot: this.selectParams.instrumentShot || '',
        startDate: this.selectParams.startDate || '',
        endDate: this.selectParams.endDate || '',
        tableColumns: [{
          sheetName: type ? '重点监控证券' : '重点监控账户组',
          fileColumns: type ? columns1 : columns2
        }]
      }
      this.gfnExportFileWithForm(keyMonitorAccountsAndSecurityExport(), params)
    },
    handleSlotComponentEvent ({type, scope, item}) {
      if (type === 'tableColumnCanClickComponent') {
        window.open(`#/clueReportForm?instanceId=${scope.row.clue_id}&operate=1&isNewTab=true`)
      }
    },
    getInfoIdByMonitorId(scope, type) {
      if (type) { // 证券
        getSecurityInfoIdByMonitorId({monitorNo: scope.row.monitor_id}).then(resp => {
          this.goToDetailPage(resp)
        })
      } else { // 账户
        getAccountInfoIdByMonitorId({monitorNo: scope.row.monitor_id}).then(resp => {
          this.goToChangePage(resp)
        })
      }
    },
    goToDetailPage(infoId) {
      window.open(`#/overBuiltAccountGroup?instanceId=${infoId}&operate=1&isNewTab=true`)
    },
    goToChangePage(infoId) {
      window.open(`#/changeBuiltAccountGroup?instanceId=${infoId}&operate=1&isNewTab=true`)
    },
    getProcessStatusNameList(processName, callback) {
      getActivityNameByProcessName(processName).then(res => {
        this.localStatusNameList = res['localStatusName']
        callback && callback()
      })
    }

  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
