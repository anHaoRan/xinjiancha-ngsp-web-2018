export default {
  name: 'mixin.js',
  props: [],
  components: {
    MarginTable: () => import('@/components/base/MarginTable'),
    Breadcrumb: () => import('@/components/common/Breadcrumb'),
    StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
    SDatePicker: () => import('@/components/base/SDatePicker'),
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
      this.getAllData()
    },
    handleExport () { // 导出报表

    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
