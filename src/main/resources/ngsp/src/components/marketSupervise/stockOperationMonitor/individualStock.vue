<template>
  <el-card class="individual-stock-area el-card-table">
    <el-tabs v-model="activeName">
      <el-tab-pane label="个股交易明细" name="individualStock">
        <el-table
          :data="individualData"
          ref="individualBlock"
          border
          tooltip-effect="dark"
          height="390"
          size="small"
          highlight-current-row
          @select="selectionChange"
          @select-all="selectionChange"
          @row-click="selectionChange"
          :cell-class-name="this.fnCellClassName"
          v-tableLoadMore="handleTableLoadMore"
          @sort-change="handleSortChange"
          style="width: 100%">
          <el-table-column type="selection" align="center" show-overflow-tooltip></el-table-column>
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
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-popover
        ref="editTablePop"
        placement="bottom"
        width="200"
        v-model="editTableVisible">
        <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
      </el-popover>
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadStockExcel"></el-button>
      <el-button type="primary" icon="el-icon-tickets" size="small" class="tickets" v-popover:editTablePop></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '@/store/mutation-types'
  import editTable from './commonBlock/editTable'
  import { getMonitorStockApi } from '@/service/marketSupervise'
  import { G_C_NOTE_LAZY_LOAD } from '@/utils/constants'

  export default {
    components: {
      editTable
    },
    data () {
      return {
        activeName: 'individualStock',
        editTableVisible: false,
        individualData: [],
        columns: [
          {label: '证券代码', field: 'stock_code', align: 'center', isShow: true},
          {label: '证券简称', field: 'stock_name', align: 'left', isShow: true},
          {label: '申万行业', field: 'voc_name', align: 'left', isShow: true},
          {
            label: '区间涨跌',
            field: 'increase_amount',
            align: 'right',
            sortable: 'custom',
            sortMethod: this.gfnSortColByNumber.bind(this, 'increase_amount'),
            isShow: true,
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌幅',
            field: 'increase_range',
            align: 'right',
            sortable: 'custom',
            sortMethod: this.gfnSortColByNumber.bind(this, 'increase_range'),
            isShow: true,
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '贡献点数',
            field: 'contri_point',
            align: 'right',
            sortable: 'custom',
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
          {label: '成交额(万)', field: 's5', align: 'right', sortable: true, isShow: true, formatter: this.gfnElColFormatDecThou}
        ],
        rowStart: 1, // 从1开始
        rowNum: 10,
        step: 10, // 每次加载的数量
        orderBy: 'rate', // 排序字段，只支持单个
        orderType: 'desc', // ASC(升序)，DESC(降序)
        loadingMore: false, // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading,
        IDTimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.state.marketSupervise.currentIndexCode
      },
      boardCodeList () {
        return this.$store.getters.getBoardCodeList
      },
      stockTimeRange () {
        return this.$store.getters.getStockTimeRange
      },
      tradeDate () {
        return this.$store.getters.getStockTradeDate
      },
      dateRage () {
        return this.$store.getters.getStockDateRange
      }
    },
    watch: {
      currentIndexCode: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      },
      boardCodeList: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      },
      stockTimeRange: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      },
      tradeDate: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      },
      dateRage () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      }
    },
    methods: {
      // order: 'ascending' or 'descending'
      // 后台排序
      handleSortChange ({prop, order}) {
        this.orderBy = prop
        this.orderType = order === 'ascending' ? 'asc' : 'desc'
        this.getIndividualData()
      },
      // 切换产品时，重新初始化参数
      fnInitLazyLoadAndSort () {
        this.rowStart = 1
        this.rowNum = 10
        this.loadingMore = false
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
      },
      // Table 懒加载
      handleTableLoadMore () {
        if (this.loadingMore) {
          return
        }
        this.loadingMore = true
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.fnGetMoreIndividualData(this.rowNum + 1, this.step)
        this.rowNum += this.step
      },
      fnCellClassName ({row, column}) { //eslint-disable-line
        if (column.property === 'increase_range' || column.property === 'increase_amount' || column.property === 'contri_point' || column.property === 'contri_per') {
          return this.gfnFormatSecurityClass(row['increase_range'])
        }
      },
      selectionChange (rows) {
        let securityIds = ''
        if (rows.stock_code) {
          securityIds = rows.stock_code + ','
          this.$refs.individualBlock.clearSelection()
          this.$refs.individualBlock.toggleRowSelection(rows, true)
        } else {
          for (let row of rows) {
            securityIds += row.stock_code + ','
          }
        }
        this.$store.commit(types.M_SECURITY_IDS, securityIds.substring(0, securityIds.length - 1))
      },
      downloadStockExcel () {
        let tableColumns = [
          {'sheetName': '个股交易明细', 'fileColumns': this.columns}
        ]
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMonitorBlockStockParams))
        params.rowStart = ''
        params.rowNum = ''
        params.tableColumns = tableColumns
        this.gfnExportFileWithForm('/fluct/quotation/v1/export', params)
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      // 用于懒加载
      fnGetMoreIndividualData (start, num) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMonitorBlockStockParams))
        params.rowStart = start
        params.rowNum = num
        params.orderField = this.orderBy
        params.orderType = this.orderType
        getMonitorStockApi(params).then(resp => {
          if (resp && resp.bizData) {
            this.individualData = this.individualData.concat(resp.bizData.metaData)
            if (resp.bizData.metaData.length < this.step) {
              this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
            } else {
              this.loadingMore = false
            }
          } else {
            this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          }
        })
      },
      getIndividualData () {
        clearTimeout(this.IDTimeOut)
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMonitorBlockStockParams))
        params.rowStart = this.rowStart
        params.rowNum = this.rowNum
        params.orderField = this.orderBy
        params.orderType = this.orderType
        getMonitorStockApi(params).then(resp => {
          if (resp && resp.bizData) {
            // 防止数据更细倒挂
            if (params.rowNum < this.rowNum) {
              return
            }
            this.individualData = resp.bizData.metaData
            let securityIds = this.$store.getters.getSecurityIds
            this.$nextTick(function () {
              this.individualData.forEach(row => {
                if (securityIds.indexOf(row.stock_code) > -1) {
                  this.$refs.individualBlock.toggleRowSelection(row, true)
                }
              })
            })
          }
          this.IDTimeOut = setTimeout(this.getIndividualData, 30000)
        })
      }
    },
    mounted () {
      this.getIndividualData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.IDTimeOut != null) {
        clearTimeout(this.IDTimeOut)
      }
    }
  }
</script>
