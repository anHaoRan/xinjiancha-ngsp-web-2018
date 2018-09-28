<template>
  <div class="block-trade-info">
    <el-card class="el-card-table">
      <el-table
        :data="tableData"
        border
        show-overflow-tooltip
        v-loading="queryResLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="item in tableOption"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getBlockTrade} from '@/service/analysisTool/insiderTradAccountAnalysisBig/index'

export default {
  // name: "block-trade-info",
  data() {
    return {
      msg: '公司大宗交易情况',
      tableData: [],
      tableOption: [
        {prop: 'trade_date', label: '交易日期', align: 'left'},
        {prop: 'sec_code', label: '证券代码', align: 'left'},
        {prop: 'sec_name', label: '证券简称', align: 'left'},
        {prop: 'trade_no', label: '成交编号', align: 'left'},
        {prop: 'buy_acct_id', label: '买方股东账户', align: 'left'},
        {prop: 'buy_acct_name', label: '买方股东名称', align: 'left'},
        {prop: 'buy_branch_name', label: '买方会员营业部', align: 'left'},
        {prop: 'sell_acct_id', label: '卖方股东账户', align: 'left'},
        {prop: 'sell_acct_name', label: '卖方股东名称', align: 'left'},
        {prop: 'sell_branch_name', label: '卖方会员营业部', align: 'left'},
        {prop: 'trade_price', label: '成交价格', align: 'right'},
        {prop: 'trade_vol', label: '成交数量', align: 'right'},
        {prop: 'trade_amt', label: '成交金额', align: 'right'}
      ],
      queryResLoad: false,
      flag: true,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      resultNum: 0
    }
  },
  methods: {
    getResultData() {
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      let pageIdx = this.currentPage, pageRw = this.pageSize
      if (this.flag) {
        this.flag = false;
        this.queryResLoad = true
        this.getResponse(taskId, pageIdx, pageRw)
      }
    },
    getResponse(taskId, pageIdx, pageRw) {
      getBlockTrade(taskId, pageIdx, pageRw).then((resp) => {
        if (!$.isEmptyObject(resp)) {
          this.queryResLoad = false
          this.tableData = resp.bolckTrendList;
          this.resultNum = (resp.rowsCount - 0);
        } else {
          this.flag = true
          this.resultNum = 0
        }
      })
    },
    handleSizeChange(size) {
      this.queryResLoad = true
      this.pageSize = size
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      let pageIdx = this.currentPage, pageRw = this.pageSize
      this.getResponse(taskId, pageIdx, pageRw)
    },
    handleCurrentChange(rowNum) {
      this.queryResLoad = true
      this.currentPage = rowNum;
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      let pageIdx = this.currentPage, pageRw = this.pageSize
      this.getResponse(taskId, pageIdx, pageRw)
    }
  },
  mounted() {
    // this.getResultData()
  }
}
</script>

<style scoped lang="less">
  .block-trade-info {

    .el-card {
      margin-top: 0;
    }

  }
</style>
