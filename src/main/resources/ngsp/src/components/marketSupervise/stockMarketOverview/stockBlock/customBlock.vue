<template>
  <div>
    <!--测试列表设置弹框-->
    <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
      <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
    </el-popover>
    <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
    <!--测试列表设置弹框-->
    <el-table
      :data="customBlockData"
      ref="customBlock"
      border
      tooltip-effect="dark"
      height="374"
      size="small"
      highlight-current-row
      @select="selectionChange"
      @select-all="selectionChange"
      @row-click="selectionChange"
      :cell-class-name="this.fnCellClassName"
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
  import * as types from '@/store/mutation-types'
  import editTable from '../../stockOperationMonitor/commonBlock/editTable'
  import { getMonitorStockApi } from '@/service/marketSupervise'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        editTableVisible: false,
        customBlockData: [],
        columns: [
          {label: '代码', field: 'vocation_code', minWidth: '7.5%', align: 'center', sortable: false, isShow: true},
          {label: '名称', field: 'vocation_name', minWidth: '7.5%', align: 'left', sortable: false, isShow: true},
          {
            label: '现价',
            field: 'curr_value',
            minWidth: '7.5%',
            align: 'right',
            isShow: true,
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌',
            field: 'ampli_value',
            minWidth: '7.5%',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ampli_value'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌幅',
            field: 'ampli_rate',
            minWidth: '7.5%',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ampli_rate'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '成交金额(亿元)',
            field: 'turn_over',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'turn_over'),
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '贡献点数',
            field: 'contri_point',
            minWidth: '6%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_point'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '贡献百分比',
            field: 'contri_per',
            minWidth: '6%',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_per'),
            formatter: this.gfnElColFormatDec2Percent
          }
        ]
      }
    },
    methods: {
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'ampli_value' || column.property === 'ampli_rate' || column.property === 'curr_value' || column.property === 'contri_point' || column.property === 'contri_per') {
          return this.gfnFormatSecurityClass(row['ampli_rate'])
        } else if (column.property === 'turn_over') {
          return 'turnover'
        }
      },
      selectionChange (rows) {
        let boardCodes = ''
        if (rows.vocation_code) {
          boardCodes = rows.vocation_code + ','
          this.$refs.customBlock.clearSelection()
          this.$refs.customBlock.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            boardCodes += row.vocation_code + ','
          }
        }
        if (!rows.vocation_code && !rows.length) {
          this.$store.commit(types.O_CHANGE_CURRENT_TYPE, 'index')
          this.$store.commit(types.O_CHANGE_BOARD_CODE, '')
        } else {
          this.$store.commit(types.O_CHANGE_CURRENT_TYPE, 'board')
          this.$store.commit(types.O_CHANGE_BOARD_CODE, boardCodes.substring(0, boardCodes.length - 1))
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getCustomData () {
        getMonitorStockApi(this.$store.getters.getBoardParams).then(resp => {
          if (resp && resp.bizData) {
            this.customBlockData = resp.bizData.metaData
            let boardCode = this.$store.getters.getCurrentBoardCode
            this.$nextTick(function () {
              this.customBlockData.forEach(row => {
                if (boardCode.indexOf(row.vocation_code) > -1) {
                  this.$refs.customBlock.toggleRowSelection(row, true)
                }
              })
            })
          } else {
            this.customBlockData = []
          }
        })
      }
    }
  }
</script>
