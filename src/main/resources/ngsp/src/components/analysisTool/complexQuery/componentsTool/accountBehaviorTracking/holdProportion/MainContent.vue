<!--持有占比-->
<template>
  <div class='holdProportion'>
    <export-btn @handleExportData="handleExportData"></export-btn>
    <common-table-pagination-component
      :loading='loading'
      :tableData='tableData'
      :columns='tableColumns'
      :pagination='pagination'
      :totalNum='totalNum'
      @handlePaginationChange='handlePaginationChange'
    ></common-table-pagination-component>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import commonTablePaginationComponent from '../../common/commonTablePaginationComponent'
import { getHoldRatio, exportGetHoldRatio } from '@/service/analysisTool/complexQuery/accountBehaviorTracking'
import {tableColumns} from './tableColumns'
export default {
  components: {
    commonTablePaginationComponent,
    ExportBtn: () => import('../../common/ExportButtonComponent')
  },
  computed: {
    ...mapGetters(['queryTrackForm6'])
  },
  watch: {
    'queryTrackForm6': {
      handler() {
        this.queryData = this.queryTrackForm6
        this.reqTableData(1)
      },
      deep: true
    }
  },
  data() {
    return {
      queryData: {},
      tableColumns,
      tableData: [],
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      loading: false
    }
  },
  methods: {
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    reqTableData(type) {
      let params = {
        startDate: this.queryData.dateRange[0],
        endDate: this.queryData.dateRange[1],
        secCodes: this.queryData.secType ? '' : this.queryData.secCodes, // 证券代码集合
        acctIds: this.queryData.acctIds, // 账户代码集合
        secType: this.queryData.secType,
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        pageIndex: this.pagination.currentPage,
        pageRows: this.pagination.pageSizeNumber,
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      this.loading = true
      getHoldRatio(params).then(resp => {
        this.loading = false
        if (resp) {
          this.currentngspUid = resp.ngsp_uid
          this.tableData = resp.data
          this.totalNum = Number(resp.totalRowCount)
        } else {
          this.currentngspUid = ''
          this.tableData = []
        }
      })
    },
    handleExportData(type) {
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.tableColumns
      }
      exportGetHoldRatio(params)
    }
  }
}

</script>
<style lang='less' scoped>
  .holdProportion {

  }
</style>
