<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="investorData"
      ref="investorTable"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
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
        :sort-method="column.sortMethod"
        :formatter="column.formatter"
        v-if="column.isShow">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import * as types from '../../../../../store/mutation-types'
  import editTable from '../../../stockOperationMonitor/commonBlock/editTable'
  import { getClassifiedInvestorApi } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        investorData: [],
        selectionRows: [],
        columns: [
          {label: '投资者类别', field: 'flag_name', align: 'left', sortable: false, isShow: true},
          {label: '净成交金额(亿)', field: 'je', align: 'right', sortable: false, isShow: true, formatter: this.gfnElColFormatDecThou},
          {
            label: '主动成交额(亿)',
            field: 'zd_trdamt',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_trdamt'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '买入金额(亿)',
            field: 'trdamt_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '卖出金额(亿)',
            field: 'trdamt_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动净成交(亿)',
            field: 'zd_net_amount',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_net_amount'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动买入金额(亿)',
            field: 'zd_trdamt_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_trdamt_b'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动卖出金额(亿)',
            field: 'zd_trdamt_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_trdamt_s'),
            formatter: this.gfnElColFormatDecThou
          }
        ]
      }
    },
    methods: {
      selectionChange (rows) {
        let investors = ''
        if (rows.accttype) {
          investors = rows.accttype + ','
          this.$refs.investorTable.clearSelection()
          this.$refs.investorTable.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            investors += row.accttype + ','
          }
        }
        this.$store.commit(types.C_INVESTORS, investors.substring(0, investors.length - 1))
        this.$store.commit(types.C_CHOOSE_ACCOUNT, '')
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getCfiData () {
        this.$store.commit(types.CURRENT_MODULE, 'investorMonitoring')
        let params = JSON.parse(this.$store.getters.getIndustryParams)
        params.invesType = ''
        params.invesOrderField = 'je'
        params.invesOrderType = 'desc'
        getClassifiedInvestorApi(JSON.stringify(params)).then(resp => {
          if (resp) {
            this.investorData = resp
            let investors = this.$store.getters.getInvestors
            this.$nextTick(function () {
              this.investorData.forEach(row => {
                if (investors.indexOf(row.accttype) > -1) {
                  this.$refs.investorTable.toggleRowSelection(row, true)
                }
              })
            })
          } else {
            this.investorData = []
          }
        })
      }
    }
  }
</script>
