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
      :data="wdVocData"
      ref="wdPlateVoc"
      border
      tooltip-effect="dark"
      height="390"
      size="small"
      highlight-current-row
      @row-click="selectionChange"
      @select="selectionChange"
      @select-all="selectionChange"
      :cell-class-name="this.fnCellClassName"
      style="width: 100%">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" type="index" label="序号"></el-table-column>
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
        isCustomSetUpBox: false,
        wdVocData: [],
        boardWdList: '',
        columns: [
          {label: '板块名称', field: 'vocation_name', align: 'left', isShow: true},
          {
            label: '区间涨跌',
            field: 'ampli_value',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ampli_value'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌幅',
            field: 'ampli_rate',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ampli_rate'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '贡献点数',
            field: 'contri_point',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_point'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '贡献百分比',
            field: 'contri_per',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_per'),
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '成交额(亿元)',
            field: 'turn_over',
            align: 'right',
            sortable: true,
            isShow: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'turn_over'),
            formatter: this.gfnElColFormatDecThou
          }
        ]
      }
    },
    computed: {
      codeType () {
        return this.$store.getters.getCodeType
      }
    },
    watch: {
      codeType: function (type) {
        if (type === 'board-wd') {
          this.$store.commit(types.M_BOARD_CODE_LIST, this.boardWdList)
        }
      }
    },
    methods: {
      selectionChange (rows) {
        let codes = ''
        if (rows.vocation_code) {
          codes = rows.vocation_code + ','
          this.$refs.wdPlateVoc.clearSelection()
          this.$refs.wdPlateVoc.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            codes += row.vocation_code + ','
          }
        }
        this.boardWdList = codes.substring(0, codes.length - 1)
        this.$store.commit(types.M_BOARD_CODE_LIST, this.boardWdList)
        this.$store.commit(types.M_BOARD_CODE_LIST, codes.substring(0, codes.length - 1))
        this.$store.commit(types.M_SECURITY_IDS, '')
      },
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'ampli_value' || column.property === 'ampli_rate' || column.property === 'contri_point' || column.property === 'contri_per') {
          return this.gfnFormatSecurityClass(row['ampli_rate'])
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      getWdData () {
        getMonitorStockApi(this.$store.getters.getMonitorBlockParams).then(resp => {
          if (resp && resp.bizData) {
            this.wdVocData = resp.bizData.metaData
            let boardCodeList = this.$store.getters.getBoardCodeList
            this.$nextTick(function () {
              this.wdVocData.forEach(row => {
                if (boardCodeList.indexOf(row.vocation_code) > -1) {
                  this.$refs.wdPlateVoc.toggleRowSelection(row, true)
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
</style>
