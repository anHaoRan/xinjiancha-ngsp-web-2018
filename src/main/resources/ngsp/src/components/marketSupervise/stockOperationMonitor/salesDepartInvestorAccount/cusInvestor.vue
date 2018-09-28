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
      :data="cusInvestorData"
      ref="industryBlock"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
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
        :sort-method="column.sortMethod"
        :formatter="column.formatter"
        v-if="column.isShow">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import editTable from '../../stockOperationMonitor/commonBlock/editTable'
  import { getMonitorInvestorStock } from '../../../../service/marketSupervise'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        cusInvestorData: [],
        columns: [
          {label: '投资者类别', field: 'flag_name', align: 'left', isShow: true},
          {
            label: '净买入金额(万)',
            field: 'je',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'je')
          },
          {
            label: '买入金额(万)',
            field: 'buyamount',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buyamount')
          },
          {
            label: '卖出金额(万)',
            field: 'saleamount',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'saleamount')
          },
          {
            label: '主动净成交(亿)',
            field: 'zd_net_amount',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_net_amount')
          },
          {
            label: '主动买入金额(万)',
            field: 'buyamount_1',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buyamount_1')
          },
          {
            label: '主动卖出金额(万)',
            field: 'saleamount_2',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'saleamount_2')
          }
        ]
      }
    },
    methods: {
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'riserate' || column.property === 'fallrise') {
          return this.gfnFormatSecurityClass(row[column.property])
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getCusinvData () {
        let params = this.$store.getters.getOperationIndustryBlockParams
        params.boardCodeList = this.$store.state.marketSupervise.boardCodeList
        params.securityIds = this.$store.state.marketSupervise.securityIds // 个股代码复数,可为空
        params.invesOrderField = '' // 分类排序字段  自定义分类:cusInvesOrderField  账户:accountOrderField  营业部:branchOrderField
        params.invesOrderType = '' // 分类排序方式 自定义分类:cusInvesOrderType   账户:accountOrderType 营业部:branchOrderType
        params.invesType = 'cusInves' // inves表示分类投资者,cusInves表示自定义分类,account表示账户,branch表示营业部
        params.pageIndex = 1 // 分页处理 表示第几页
        getMonitorInvestorStock(params).then(resp => {
          this.cusInvestorData = resp.DATA
        })
      }
    }
  }
</script>
