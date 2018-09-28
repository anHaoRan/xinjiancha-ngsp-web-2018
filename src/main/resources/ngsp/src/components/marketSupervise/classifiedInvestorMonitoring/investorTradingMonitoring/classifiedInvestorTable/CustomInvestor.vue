<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="cusInvestorData"
      ref="cusInvestor"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
      :cell-class-name="this.fnCellClassName"
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
  import { getClassifiedCusInvestorApi } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        cusInvestorData: [],
        columns: [
          {label: '投资者类别', field: 'investor_name', align: 'left', sortable: false, isShow: true},
          {
            label: '净成交金额(万)',
            field: 'net_trdamt_b',
            align: 'right',
            sortable: false,
            isShow: true,
            formatter: this.gfnElColFormatDecThou
          },
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
            label: '买入金额(万)',
            field: 'trdamt_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '卖出金额(万)',
            field: 'trdamt_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动净成交(万)',
            field: 'zd_net_amount',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_net_amount'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动买入金额(万)',
            field: 'active_trdamt_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'active_trdamt_b'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '主动卖出金额(万)',
            field: 'active_trdamt_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'active_trdamt_s'),
            formatter: this.gfnElColFormatDecThou
          }
        ]
      }
    },
    methods: {
      selectionChange (rows) {
        let investors = ''
        if (rows.investor_name) {
          investors = rows.investor_code + ','
          this.$refs.cusInvestor.clearSelection()
          this.$refs.cusInvestor.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            investors += row.investor_code + ','
          }
        }
        this.$store.commit(types.C_INVESTORS, investors.substring(0, investors.length - 1))
        this.$store.commit(types.C_CHOOSE_ACCOUNT, '')
      },
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'increase_amount' || column.property === 'increase_range') {
          return this.gfnFormatSecurityClass(row[column.property])
        } else if (column.property === 's5') {
          return 'turnover'
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getCmiData () {
        let _this = this
        this.$store.commit(types.CURRENT_MODULE, 'investorMonitoring')
        let params = JSON.parse(this.$store.getters.getIndustryParams)
        params.invesType = 'cusInves'
        params.invesOrderField = 'net_trdamt_b'
        params.invesOrderType = 'desc'
        getClassifiedCusInvestorApi(JSON.stringify(params)).then(resp => {
          _this.cusInvestorData = resp
          let investors = _this.$store.getters.getInvestors
          _this.$nextTick(function () {
            _this.cusInvestorData.forEach(row => {
              if (investors.indexOf(row.investor_code) > -1) {
                _this.$refs.cusInvestor.toggleRowSelection(row, true)
              }
            })
          })
        })
      }
    }
  }
</script>
