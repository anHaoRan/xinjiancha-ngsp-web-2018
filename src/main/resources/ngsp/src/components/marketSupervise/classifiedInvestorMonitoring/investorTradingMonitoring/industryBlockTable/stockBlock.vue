<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="stockData"
      ref="stockTable"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
      @sort-change="handleSortChange"
      v-tableLoadMore="handleTableLoadMore"
      :cell-class-name="this.fnCellClassName"
      style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        v-for="column in columns"
        :show-overflow-tooltip="true"
        :key="column.field"
        :label="column.label"
        :prop="column.field"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align == null ? 'center' : column.align"
        :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
        :sortable="column.sortable == null ? false : column.sortable"
        :formatter="column.formatter"
        v-if="column.isShow">
      </el-table-column>
      <template slot="append" v-if="loadingMore">
        <table>
          <tr>
            <td>
              {{loadingMoreNote}}
            </td>
          </tr>
        </table>
      </template>
    </el-table>
  </div>

</template>

<script>
  import editTable from '../../../stockOperationMonitor/commonBlock/editTable'
  import { getIndustryBlockApi } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring'
  import { G_C_NOTE_LAZY_LOAD } from './../../../../../utils/constants'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        isCustomSetUpBox: false,
        stockData: [],
        columns: [
          {label: '证券代码', field: 'instrument_id', align: 'center', isShow: true},
          {label: '证券简称', field: 'instrument_short', align: 'left', isShow: true},
          {label: '申万行业', field: 'industry_sw1', align: 'left', isShow: true},
          {label: '万得概念', field: 'industry_wind1', align: 'left', isShow: true},
          {label: '涨跌幅', field: 'zd_rate', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2Percent},
          {label: '成交金额(万)', field: 'trade_amount', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '净成交金额(万)', field: 'je', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '买入金额(万)', field: 'buy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '买入金额占比', field: 'buy_rate', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2Percent},
          {label: '卖出金额(万)', field: 'sal_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '卖出金额占比', field: 'sal_rate', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2Percent},
          {label: '主动买入金额(万)', field: 'zd_buy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '主动卖出金额(万)', field: 'zd_sal_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou}
        ],
        rowStart: 1, // 从1开始
        rowNum: 10,
        step: 10, // 每次加载的数量
        orderBy: 'je', // 排序字段，只支持单个
        orderType: 'desc', // ASC(升序)，DESC(降序)
        loadingMore: false, // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading
      }
    },
    methods: {
      rowClick (row) {
        this.$refs.stockTable.toggleRowSelection(row)
      },
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'zd_rate') {
          return this.gfnFormatSecurityClass(row[column.property])
        }
      },
      // order: 'ascending' or 'descending'
      // 后台排序
      handleSortChange ({column, prop, order}) {
        this.orderBy = prop
        this.orderType = order === 'ascending' ? 'asc' : 'desc'
        this.getIndustryStockData()
      },
      // 切换产品时，重新初始化参数
      fnInitLazyLoadAndSort () {
        this.rowStart = 1
        this.rowNum = 10
        this.loadingMore = false
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.orderBy = 'je'
        this.orderType = 'desc'
      },
      // Table 懒加载
      handleTableLoadMore () {
        if (this.loadingMore) {
          return
        }
        this.loadingMore = true
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.fnGetMoreIndustryData(this.rowNum + 1, this.step)
        this.rowNum += this.step
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      // 用于懒加载
      fnGetMoreIndustryData (start, num) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getIndustryBlockParams))
        params.vocType = 'stock' // 审万行业传sw,万德概念传wd,自定义传cus,股票传stock
        params.rowStart = start
        params.rowNum = num
        params.stockOrderField = this.orderBy
        params.stockOrderType = this.orderType

        getIndustryBlockApi(JSON.stringify(params)).then(resp => {
          if (resp && resp.DATA) {
            this.stockData = this.stockData.concat(resp.DATA)
            if (resp.DATA.length < this.step) {
              this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
            } else {
              this.loadingMore = false
            }
          } else {
            this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          }
        })
      },
      getIndustryStockData () {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getIndustryBlockParams))
        params.vocType = 'stock' // 审万行业传sw,万德概念传wd,自定义传cus,股票传stock
        params.rowStart = this.rowStart
        params.rowNum = this.rowNum
        params.stockOrderField = this.orderBy
        params.stockOrderType = this.orderType
        getIndustryBlockApi(JSON.stringify(params)).then(resp => {
          this.stockData = resp.DATA
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .plate-info-area {
    position: relative;
    .data-download-btn {
      position: absolute;
      right: 20px;
      top: 16px;
      z-index: 2;
      .el-button--mini, .el-button--small {
        padding: 3px 5px;
        font-size: 20px;
      }
    }
  }

  .radioBox, .setUpBtn {
    position: absolute;
    top: 15px;
    right: 100px;
    z-index: 3;
  }
</style>
