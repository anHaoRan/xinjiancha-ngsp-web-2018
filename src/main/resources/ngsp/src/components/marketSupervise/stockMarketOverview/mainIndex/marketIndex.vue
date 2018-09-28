<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="mainIndexData"
      ref="marketIndex"
      border
      tooltip-effect="dark"
      height="374"
      size="small"
      highlight-current-row
      @current-change="handleCurrentChange"
      :cell-class-name="this.fnCellClassName"
      style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
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
  import * as types from '../../../../store/mutation-types'
  import editTable from '../../stockOperationMonitor/commonBlock/editTable'
  import { getMarketIndex } from '../../../../service/marketSupervise'

  export default {
    name: 'market-index',
    components: {
      editTable
    },
    computed: {
      currentType: {
        get () {
          return this.$store.state.marketOverview.currentType
        }
      }
    },
    watch: {
      currentType: function (val) {
        if (val !== 'index') {
          this.$refs.marketIndex.setCurrentRow()
        }
      }
    },
    data () {
      return {
        editTableVisible: false, // 测试列表设置框
        mainIndexData: [],
        columns: [
          {label: '代码', field: 'index_code', minWidth: '7.5%', align: 'center', sortable: true, isShow: true},
          {label: '名称', field: 'index_name', minWidth: '7.5%', align: 'left', sortable: false, isShow: true},
          {
            label: '现价',
            field: 'current_price',
            minWidth: '7.5%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'current_price'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌',
            field: 'increase_amount',
            minWidth: '7.5%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'increase_amount'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌幅',
            field: 'increase_range',
            minWidth: '7.5%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'increase_range'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '振幅',
            field: 'amplitude',
            minWidth: '6%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'amplitude'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '成交量(亿股)',
            field: 'volume',
            minWidth: '9%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'volume'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '成交金额(亿元)',
            field: 'turnover',
            minWidth: '9%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'turnover'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '年初至今',
            field: 'increase_year_range',
            minWidth: '7.5%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'increase_year_range'),
            formatter: this.gfnElColFormatDec2Percent
          }
        ]
      }
    },
    methods: {
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'increase_amount' || column.property === 'increase_year_range') {
          return this.gfnFormatSecurityClass(row[column.property])
        } else if (column.property === 'increase_range' || column.property === 'current_price') {
          return this.gfnFormatSecurityClass(row['increase_range'])
        } else if (column.property === 'volume') {
          return 'volume'
        } else if (column.property === 'turnover') {
          return 'turnover'
        }
      },
      handleCurrentChange (val) {
        if (val) {
          this.$store.commit(types.O_CHANGE_CURRENT_TYPE, 'index')
          this.$store.commit(types.O_CHANGE_INDEX_CODE, val.index_code)
          this.$store.commit(types.O_CHANGE_BOARD_CODE, '')
          this.$store.commit(types.O_CHANGE_STOCK_CODE, '')
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getMarketData () {
        let _this = this
        getMarketIndex().then(resp => {
          if (resp && resp.bizData) {
            _this.mainIndexData = resp.bizData.metaData
            if (_this.$store.state.marketOverview.currentType === 'index') {
              let indexCode = _this.$store.getters.getCurrentIndexCode
              _this.$nextTick(function () {
                _this.mainIndexData.forEach(row => {
                  if (indexCode.indexOf(row.index_code) > -1) {
                    _this.$refs.marketIndex.setCurrentRow(row, true)
                  }
                })
              })
            }
          } else {
            _this.mainIndexData = []
          }
        })
      }
    }
  }
</script>
