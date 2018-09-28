<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover
      ref="editTablePop"
      placement="bottom"
      width="200"
      v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="accountData"
      ref="industryBlock"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      :empty-text="validate ? '暂无数据' : '需通过双人双密后，才能查看账户数据'"
      highlight-current-row
      @sort-change="handleSortChange"
      v-tableLoadMore="handleTableLoadMore"
      :cell-class-name="this.fnCellClassName"
      style="width: 100%">
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
  import editTable from '../../stockOperationMonitor/commonBlock/editTable'
  import { getMonitorInvestorStock } from '../../../../service/marketSupervise'
  import { G_C_NOTE_LAZY_LOAD } from './../../../../utils/constants'

  export default {
    components: {
      editTable
    },
    props: {
      validate: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
        editTableVisible: false,
        accountData: [],
        columns: [
          {label: '账号代码', field: 'invacctno', align: 'center', isShow: true},
          {label: '账户名称', field: 'investor_account_name', align: 'left', isShow: true},
          {label: '投资者类别', field: 'flag_name', align: 'left', isShow: true},
          {label: '净买入金额(万)', field: 'jbuy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '买入金额(万)', field: 'buy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '卖出金额(万)', field: 'sal_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '买入占比', field: 'buy_rate', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2Percent},
          {label: '卖出占比', field: 'sal_rate', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2Percent},
          {label: '交易集中度', field: 'affinity', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDec2}
        ],
        rowStart: 1, // 从1开始
        rowNum: 10,
        step: 10, // 每次加载的数量
        orderBy: 'buy_mktval', // 排序字段，只支持单个
        orderType: 'desc', // ASC(升序)，DESC(降序)
        loadingMore: false, // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading
      }
    },
    methods: {
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'riserate' || column.property === 'fallrise') {
          return this.gfnFormatSecurityClass(row[column.property])
        }
      },
      // 后台排序
      handleSortChange ({column, prop, order}) {
        this.orderBy = prop
        this.orderType = order === 'ascending' ? 'asc' : 'desc'
        this.getAccData()
      },
      // 切换产品时，重新初始化参数
      fnInitLazyLoadAndSort () {
        this.rowStart = 1
        this.rowNum = 10
        this.loadingMore = false
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.orderBy = 'buy_mktval'
        this.orderType = 'desc'
      },
      // Table 懒加载
      handleTableLoadMore () {
        if (this.loadingMore) {
          return
        }
        this.loadingMore = true
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.fnGetMoreAccData(this.rowNum + 1, this.step)
        this.rowNum += this.step
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      // 用于懒加载
      fnGetMoreAccData (start, num) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getOperationIndustryBlockParams))
        params.boardCodeList = this.$store.state.marketSupervise.boardCodeList
        params.securityIds = this.$store.state.marketSupervise.securityIds // 个股代码复数,可为空
        params.invesType = 'account' // inves表示分类投资者,cusInves表示自定义分类,account表示账户,branch表示营业部
        params.rowStart = start
        params.rowNum = num
        params.accountOrderField = this.orderBy
        params.accountOrderType = this.orderType

        getMonitorInvestorStock(params).then(resp => {
          if (resp && resp.DATA) {
            this.accountData = this.accountData.concat(resp.DATA)
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

      getAccData () {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getOperationIndustryBlockParams))
        params.boardCodeList = this.$store.state.marketSupervise.boardCodeList
        params.securityIds = this.$store.state.marketSupervise.securityIds // 个股代码复数,可为空
        params.invesType = 'account' // inves表示分类投资者,cusInves表示自定义分类,account表示账户,branch表示营业部
        params.rowStart = this.rowStart
        params.rowNum = this.rowNum
        params.accountOrderField = this.orderBy
        params.accountOrderType = this.orderType
        getMonitorInvestorStock(params).then(resp => {
          if (resp && resp.DATA) {
            // 防止数据更细倒挂
            if (params.rowNum < this.rowNum) {
              return
            }
            this.accountData = resp.DATA
          }
        })
      }
    }
  }
</script>
