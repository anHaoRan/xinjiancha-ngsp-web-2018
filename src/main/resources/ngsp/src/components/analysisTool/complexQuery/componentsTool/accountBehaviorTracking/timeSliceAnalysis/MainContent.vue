<!--时间片分析-->
<template>
  <div class="timeSliceAnalysis">
    <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item, index) in tabPanes"
        :key="index"
        :label="item.label"
        :name="String(index)">
        <div v-if="String(index) === '0'">
          <common-echarts-component
            :class="echartsData && echartsData.length ? '' : 'set-width'"
            v-if="searchForm.isMultipleParams != 1"
            ref="echartsRef"
            :domId="setDomId"
            :defaultOption="defaultOption"
            :propsData="echartsData"
            :propsChartHeight="echartsData.length ? 600 : 590"
          ></common-echarts-component>
        </div>
        <div v-else>
          <export-btn slot='tableHeader' @handleExportData="handleExportData"></export-btn>
          <account-group-merge v-if="index == 1 || index == 2" :params="{index: index}"></account-group-merge>
          <common-table-pagination-component
            :loading="loading"
            :tableData="tableDatas[index]"
            :columns="tableColumns[index]"
            :pagination="paginations[index]"
            :totalNum="Number(totalNums[index]) || 0"
            @handlePaginationChange="handlePaginationChange"
          ></common-table-pagination-component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {tableColumns} from './tableColumns'
  // import { resp0, resp1, resp2, resp3, resp4, resp5, resp6 } from './dataJSON'
  import {defaultOption} from './chartOption'
  import {
    transactPriceTrendPerMinute,
    buyAccountSummary,
    sellAccountSummary,
    buyBranchSummary,
    sellBranchSummary,
    transactClassifySummary,
    orderClassifySummary,
    exportBuyAccountSummary,
    exportSellAccountSummary,
    exportBuyBranchSummary,
    exportSellBranchSummary,
    exportTransactClassifySummary,
    exportOrderClassifySummary
  } from '@/service/analysisTool/complexQuery/accountBehaviorTracking'

  export default {
    components: {
      CommonEchartsComponent: () => import('../../common/CommonEchartsComponent'),
      commonTablePaginationComponent: () => import('../../common/commonTablePaginationComponent'),
      // STable: () => import('@/components/base/STable'),
      ExportBtn: () => import('../../common/ExportButtonComponent'),
      AccountGroupMerge: () => import('./AccountGroupMerge')
      // TabTablePaginationComponent: () => import('../../common/tabTablePaginationComponent')
    },
    watch: {
      /* activeMenuName (newValue) {
       if (newValue && newValue === '3' && this.activeName === '0') {
       this.$nextTick(() => {
       this.Echart = resolve => require(['../../common/CommonEchartsComponent.vue'], resolve)
       })
       }
       }, */
      /* queryTrackForm3: {
        handler (newValue) {
          this.searchForm = newValue
          this.getDataByActiveName(1)
        },
        deep: true
      } */
    },
    props: {
      setDomId: {
        type: String,
        default: 'echartsContainer'
      },
      activeMenuName: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapGetters(['queryTrackForm3'])
    },
    data() {
      let paginations = []
      for (let i = 0; i < 7; i++) {
        paginations.push({
          currentPage: 1,
          pageSizeNumber: 10
        })
      }
      return {
        defaultOption,
        tableColumns,
        Echart: null,
        activeName: '0',
        loading: false,
        tabPanes: [{
          label: '每分钟平均成交价走势',
          slotType: 'rewrite',
          slotName: '0'
        }, {label: '买账户汇总'}, {label: '卖账户汇总'}, {label: '买营业部汇总'}, {label: '卖营业部汇总'}, {label: '成交分类汇总'}, {label: '委托分类汇总'}],
        // tableDatas: {},
        tableDatas: [],
        echartsData: [],
        totalNums: [],
        searchForm: {},
        currentngspUid: '',
        paginations: paginations
      }
    },
    methods: {
      handleSearch() {
        this.searchForm = JSON.parse(JSON.stringify(this.queryTrackForm3))
        this.echartsData = []
        this.paginations.map(item => {
          item.currentPage = 1
        })
        if (this.searchForm && this.searchForm.isMultipleParams == 1) {
          this.activeName = '1'
          this.getDataByActiveName('1')
        } else {
          this.activeName = '0'
          this.getDataByActiveName('0')
        }
      },
      handleExportData(type) {
        let mapFun = [exportBuyAccountSummary, exportSellAccountSummary, exportBuyBranchSummary, exportSellBranchSummary, exportTransactClassifySummary, exportOrderClassifySummary]
        if (!this.currentngspUid) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0, // 判断是否是新查询,1是新查询，0是分页或导出
          ngspUid: this.currentngspUid, // this.currentngspUid,
          // tabIndex: 'tab' + (this.activeName + 1),
          tableColumns: this.tableColumns[this.activeName]
        }
        if (type === 'csv') { // 只能导出当前tab下的csv文件
          params.tabIndex = 'tab' + (+this.activeName + 1)
        }
        mapFun[+this.activeName - 1](params)
      },
      handleTabClick() {
        this.getDataByActiveName(1, 'changeTab')
      },
      getCommonParams(type, activeName) {
        return {
          startDate: this.searchForm.startDate || this.searchForm.defaultTradeDate,
          endDate: this.searchForm.endDate || this.searchForm.defaultTradeDate,
          startTime: this.searchForm.startTime || '090000',
          endTime: this.searchForm.endTime || '150000',
          secCode: this.searchForm.secCode, // 证券代码集合
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          pageIndex: this.paginations[activeName].currentPage,
          pageRows: this.paginations[activeName].pageSizeNumber,
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type, // 判断是否是新查询,1是新查询，0是分页或导出
          isIncludeStartTime: this.searchForm.isIncludeStartTime ? 0 : 1, // 是否开始时间闭区间
          isIncludeEndTime: this.searchForm.isIncludeEndTime ? 0 : 1, // 是否结束时间闭区间
          isMultipleParams: this.searchForm.isMultipleParams, // 是否为多股导入模式
          paramList: JSON.stringify(this.searchForm.paramList) // 多股导入文件解析后参数
        }
      },
      getChartData(type, activeName) {
        let params = this.getCommonParams(type, activeName)
        // this.echartsData = resp0['data']
        this.loading = true
        transactPriceTrendPerMinute(params).then(resp => {
          this.loading = false
          if (resp) {
            this.currentngspUid = resp['ngsp_uid'] || ''
            this.echartsData = resp['data']
          } else {
            this.currentngspUid = ''
            this.echartsData = []
          }
        })
      },
      reqTableDataCallback(resp, activeName) {
        this.loading = false
        if (resp) {
          this.currentngspUid = resp['ngsp_uid'] || ''
          this.tableDatas[activeName] = resp['data']
          this.totalNums[activeName] = Number(resp['totalRowCount'])
        } else {
          this.currentngspUid = ''
          this.echartData = []
          this.totalNums[activeName] = 0
        }
      },
      getTableDatasFun(type, activeName) {
        let params = this.getCommonParams(type, activeName)
        let mapFun = [buyAccountSummary, sellAccountSummary, buyBranchSummary, sellBranchSummary, transactClassifySummary, orderClassifySummary]
        this.loading = true
        mapFun[+activeName - 1](params).then(resp => {
          this.reqTableDataCallback(resp, activeName)
        })
      },
      getDataByActiveName(type, mark) {
        let activeName = this.activeName
        if (activeName === '0') {
          this.getChartData(type, activeName)
        } else {
          // if (mark === 'changeTab' && this.tableDatas[activeName] && this.tableDatas[activeName].length > 0) return
          this.getTableDatasFun(type, activeName)
        }
      },
      handlePaginationChange(pagination) {
        this.paginations[this.activeName] = pagination
        this.getDataByActiveName(0)
      }
    },
    mounted() {
    }
  }

</script>
<style lang="less" scoped>
  .timeSliceAnalysis {
    width: 100%;
    min-width: 500px;
    /deep/ .set-width {
      width: 1800px;
    }
  }
</style>
