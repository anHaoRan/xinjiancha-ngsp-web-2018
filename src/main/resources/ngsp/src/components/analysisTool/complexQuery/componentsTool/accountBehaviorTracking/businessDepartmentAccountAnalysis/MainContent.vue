<!--个股营业部及账户分析-->
<template>
  <div class='businessDepartmentAccountAnalysis businessDepartmentAccountAnalysisStyle'>
    <el-tabs :type='`card`' v-model='activeName' @tab-click='handleTabClick'>
      <el-tab-pane
        v-for='(item, index) in tabPanes'
        :key='index'
        :label='item.label'
        :name='String(index)'>
        <export-btn @handleExportData="handleExportData" :otherParams="{index: index}"></export-btn>
        <common-table-pagination-component
          :loading='loading'
          :tableData='tableDatas[index]'
          :columns='tableColumns[index]'
          :pagination='paginations[index]'
          :totalNum='totalNums[index]'
          @handleRowClick='handleRowClick'
          @handlePaginationChange='handlePaginationChange'
        ></common-table-pagination-component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  summarizeBranchOrder, drillBranchOrder, drillAccountOrder,
  exportSummarizeBranchOrder, exportDrillBranchOrder, exportDrillAccountOrder
} from '@/service/analysisTool/complexQuery/accountBehaviorTracking'
import { tableColumns } from './tableColumns'
import ExportBtn from '../../common/ExportButtonComponent'
export default {
  components: {
    commonTablePaginationComponent: () => import('../../../componentsTool/common/commonTablePaginationComponent'),
    ExportBtn
  },
  computed: {
    ...mapGetters(['queryTrackForm0'])
  },
  watch: {
    'queryTrackForm0': {
      handler() {
        this.queryData = this.queryTrackForm0
        this.reqTableData(1, 1)
      },
      deep: true
    }
  },
  data() {
    let paginations = []
    for (let i = 0; i < 3; i++) {
      paginations.push({
        currentPage: 1,
        pageSizeNumber: 10
      })
    }
    return {
      queryData: {},
      tableColumns,
      tableDatas: [[], [], []],
      totalNums: [0, 0, 0],
      loading: false,
      currentngspUids: ['', '', ''], // 用来记录上一次返回的ngspUid
      tabPanes: [{label: '会员营业部汇总委托交易'}, {label: '营业部钻取账户委托明细'}, {label: '账户钻取账户委托明细'}],
      activeName: '0',
      paginations: paginations,
      memCode: '',
      branchCode: '',
      acctId: ''
    }
  },
  methods: {
    handleRowClick(row, event, column) {
      this.memCode = row.mem_code
      this.branchCode = row.branch_code
      // this.memCode = 'CH1JSST77706'
      // this.branchCode = 'SHJSTSZ-00039238'
      if (this.activeName == 0) {
        this.activeName = '1'
      } else if (this.activeName == 1) {
        this.activeName = '2'
        this.acctId = row.acct_id
        // this.acctId = 'A909472884'
      }
      this.paginations[this.activeName].currentPage = 1
      this.reqTableData(0, 1)
    },
    handleTabClick(activeName) {},
    handlePaginationChange(pagination) {
      this.paginations[this.activeName] = pagination
      this.reqTableData(0, 0)
    },
    reqTableData(type, newQuery) {
      if (type) {
        this.activeName = '0'
        this.paginations[0].currentPage = 1
        this.currentngspUids = ['', '', '']
        this.tableDatas[1] = []
        this.tableDatas[2] = []
      }
      let params = {
        startDate: this.queryData.dateRange[0],
        endDate: this.queryData.dateRange[1],
        secCode: this.queryData.secCode,
        ngspUid: type ? '' : this.currentngspUids[this.activeName], // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        pageIndex: this.paginations[this.activeName].currentPage,
        pageRows: this.paginations[this.activeName].pageSizeNumber,
        memCode: this.activeName != 0 ? this.memCode : '',
        branchCode: this.activeName != 0 ? this.branchCode : '',
        acctId: this.activeName == 2 ? this.acctId : '',
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: newQuery // 判断是否是新查询,1是新查询，0是分页或导出
      }

      this.loading = true
      if (this.activeName == 1) { // 营业部钻取账户委托明细
        drillBranchOrder(params).then(resp => {
          this.renderData(resp, 1)
        })
      } else if (this.activeName == 2) { // 账户钻取账户委托明细
        // params.secCode = '600392' // 测试数据
        // params.acctId = 'A886723207'
        // params.branchCode = 'STSH069-587'
        // params.memCode = 'CH8SHST--736'
        drillAccountOrder(params).then(resp => {
          this.renderData(resp, 2)
        })
      } else { // 会员营业部汇总委托交易
        summarizeBranchOrder(params).then(resp => {
          this.renderData(resp, 0)
        })
      }
    },
    renderData(resp, index) {
      this.loading = false
      if (resp) {
        this.currentngspUids[index] = resp.ngsp_uid
        this.tableDatas[index] = resp.data
        this.totalNums[index] = Number(resp.totalRowCount)
      } else {
        this.currentngspUids[index] = ''
        this.tableDatas[index] = []
      }
    },
    handleExportData(type, option) {
      if (!this.currentngspUids[option.index]) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUids[option.index],
        tableColumns: this.tableColumns[this.activeName]
      }
      this.activeName != 0 ? params.memCode = this.memCode : ''
      this.activeName != 0 ? params.branchCode = this.branchCode : ''
      this.activeName == 2 ? params.acctId = this.acctId : ''

      if (this.activeName == 0) {
        exportSummarizeBranchOrder(params)
      } else if (this.activeName == 1) {
        exportDrillBranchOrder(params)
      } else {
        exportDrillAccountOrder(params)
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .businessDepartmentAccountAnalysisStyle {
    /deep/ .el-tabs__header {
      /deep/ .el-tabs__nav-wrap {
        padding-bottom: 0;
      }
    }
  }
</style>
