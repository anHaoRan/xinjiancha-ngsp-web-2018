<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="branchData"
      ref="branchTable"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
      @sort-change="handleSortChange"
      v-tableLoadMore="handleTableLoadMore"
      @select="selectionChange"
      @select-all="selectionChange"
      @row-click="selectionChange"
      style="width: 100%">
      <el-table-column align='center' type="selection"></el-table-column>
      <el-table-column align='center' type="index" label="序号"></el-table-column>
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
  import * as types from '../../../../../store/mutation-types'
  import editTable from '../../../stockOperationMonitor/commonBlock/editTable'
  import { getAccountApi } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring'
  import { G_C_NOTE_LAZY_LOAD } from './../../../../../utils/constants'

  export default {
    name: 'branch',
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        branchData: [],
        columns: [
          {label: '营业部代码', field: 'brnid', align: 'center', isShow: true},
          {label: '营业部名称', field: 'brnname', align: 'left', isShow: true},
          {label: '买入金额(万)', field: 'buy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '卖出金额(万)', field: 'sal_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '净成交金额(万)', field: 'net_amount', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '主动买入金额(万)', field: 'zd_buy_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '主动卖出金额(万)', field: 'zd_sal_mktval', align: 'right', sortable: 'custom', isShow: true, formatter: this.gfnElColFormatDecThou},
          {label: '交易股票数', field: 'stock_num', align: 'right', sortable: 'custom', isShow: true},
          {label: '交易行业数', field: 'voc_num', align: 'right', sortable: 'custom', isShow: true}
        ],
        rowStart: 1, // 从1开始
        rowNum: 100,
        step: 10, // 每次加载的数量
        orderBy: 'net_amount', // 排序字段，只支持单个
        orderType: 'desc', // ASC(升序)，DESC(降序)
        loadingMore: false, // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading
      }
    },
    methods: {
      selectionChange (rows) {
        let branchs = ''
        if (rows.brnid) {
          branchs = rows.brnid + ','
          this.$refs.branchTable.clearSelection()
          this.$refs.branchTable.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            branchs += row.brnid + ','
          }
        }
        this.$store.commit(types.C_CHOOSE_BRANCH, branchs.substring(0, branchs.length - 1))
      },
      // 后台排序
      handleSortChange ({prop, order}) {
        this.orderBy = prop
        this.orderType = order === 'ascending' ? 'asc' : 'desc'
        this.fnGetBranchData()
      },
      // 切换产品时，重新初始化参数
      fnInitLazyLoadAndSort () {
        this.rowStart = 1
        this.rowNum = 100
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
        this.fnGetMoreBranchData(this.rowNum + 1, this.step)
        this.rowNum += this.step
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      fnGetBranchData () {
        this.fnGetMoreBranchData(this.rowStart, this.rowNum)
      },
      // 用于懒加载
      fnGetMoreBranchData (start, num) {
        let params = JSON.parse(this.$store.getters.getAccountParams)
        params.rowStart = start
        params.rowNum = num
        params.orderField = this.orderBy
        params.orderType = this.orderType
        params.gridType = 'branch'
        let _this = this
        getAccountApi(JSON.stringify(params)).then(resp => {
          if (resp) {
            if (start !== _this.rowStart) {
              _this.branchData = _this.branchData.concat(resp)
              if (resp.length < _this.step) {
                _this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
              } else {
                _this.loadingMore = false
              }
            } else {
              // 防止数据更细倒挂
              if (num < _this.rowNum) {
                return
              }
              _this.branchData = resp
              let chooseBranch = _this.$store.getters.getChooseBranch
              _this.$nextTick(function () {
                _this.branchData.forEach(row => {
                  if (chooseBranch.indexOf(row.brnid) > -1) {
                    _this.$refs.branchTable.toggleRowSelection(row, true)
                  }
                })
              })
            }
          } else {
            _this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          }
        })
      }
    }
  }
</script>

<style lang="less">
</style>
