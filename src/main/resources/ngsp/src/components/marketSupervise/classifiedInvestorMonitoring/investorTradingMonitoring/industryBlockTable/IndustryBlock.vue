<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="swPlateVocData"
      ref="swPlateVoc"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      :cell-class-name="this.fnCellClassName"
      highlight-current-row
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
        :sort-method="column.sortMethod"
        :formatter="column.formatter"
        v-if="column.isShow">
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import editTable from '../../../stockOperationMonitor/commonBlock/editTable'
  import { getIndustryBlockApi } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        swPlateVocData: [],
        columns: [
          {label: '板块代码', field: 'voc_code', align: 'center', isShow: true},
          {label: '板块名称', field: 'voc', align: 'left', isShow: true},
          {
            label: '涨跌幅',
            field: 'zd_rate',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_rate'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '成交金额(万)',
            field: 'mktval',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval')
          },
          {
            label: '净成交金额(万)',
            field: 'net_amount',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'net_amount')
          },
          {
            label: '买入金额(万)',
            field: 'buy_mktval',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_mktval')
          },
          {
            label: '买入金额占比',
            field: 'buy_rate',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_rate'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '卖出金额(万)',
            field: 'sal_mktval',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sal_mktval')
          },
          {
            label: '卖出金额占比',
            field: 'sal_rate',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sal_rate'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '主动买入金额(万)',
            field: 'zd_buy_mktval',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_buy_mktval')
          },
          {
            label: '主动卖出金额(万)',
            field: 'zd_sal_mktval',
            align: 'right',
            sortable: true,
            isShow: true,
            formatter: this.gfnElColFormatDecThou,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_sal_mktval')
          }
        ]
      }
    },
    methods: {
      rowClick (row) {
        this.$refs.swPlateVoc.toggleRowSelection(row)
      },
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'zd_rate') {
          return this.gfnFormatSecurityClass(row[column.property])
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getIndustrySwData () {
        let params = this.$store.getters.getIndustryBlockParams
        params.vocType = 'sw' // 审万行业传sw,万德概念传wd,自定义传cus,股票传stock
        getIndustryBlockApi(JSON.stringify(params)).then(resp => {
          this.swPlateVocData = resp.DATA
        })
      }
    }
  }
</script>

<style lang="less">
</style>
