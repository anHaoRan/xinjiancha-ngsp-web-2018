<template>
  <el-card class="mainCard el-card-table">
    <el-tabs v-model="activeName">
      <el-tab-pane label="个股" name="individualStock">
        <!--测试列表设置弹框-->
        <el-popover ref="editTablePop" placement="bottom" width="200" v-model="editTableVisible">
          <editTable :tableLabels="columns" @refreshShowList="refreshShowListFunc"></editTable>
        </el-popover>
        <div class="overview-individual-searchbox">
          <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes" style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
        </div>
        <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-popover:editTablePop></el-button>
        <!--测试列表设置弹框-->
        <el-table
          :data="individualStockData"
          ref="individualStock"
          border
          tooltip-effect="dark"
          height="374"
          size="small"
          highlight-current-row
          @current-change="handleCurrentChange"
          @sort-change="handleSortChange"
          v-tableLoadMore="handleTableLoadMore"
          :cell-class-name="this.fnCellClassName"
          style="width: 100%">
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
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadStockExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '@/store/mutation-types'
  import editTable from '../stockOperationMonitor/commonBlock/editTable'
  import SelectLazyMultiple from '../../common/SelectLazyMultiple'
  import { getMonitorStockApi } from '@/service/marketSupervise'
  import { G_C_NOTE_LAZY_LOAD } from '@/utils/constants'

  export default {
    components: {
      editTable,
      SelectLazyMultiple
    },
    data () {
      return {
        editTableVisible: false,
        activeName: 'individualStock',
        individualStockData: [],
        individualTimeOut: null,
        columns: [
          {label: '代码', field: 'stock_code', align: 'center', sortable: true, isShow: true},
          {label: '名称', field: 'stock_name', align: 'left', sortable: false, isShow: true},
          {
            label: '现价',
            field: 'current_price',
            align: 'right',
            isShow: true,
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '涨跌',
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
            label: '振幅',
            field: 'amplitude',
            align: 'right',
            sortable: 'custom',
            sortMethod: this.gfnSortColByNumber.bind(this, 'amplitude'),
            isShow: true,
            formatter: this.gfnElColFormatDec2Percent
          },
          {
            label: '成交金额(万元)',
            field: 's5',
            align: 'right',
            sortable: 'custom',
            sortMethod: this.gfnSortColByNumber.bind(this, 's5'),
            isShow: true,
            formatter: this.gfnElColFormatDecThou
          },
          {
            label: '个股对于指数的贡献点数',
            field: 'contri_point',
            align: 'right',
            sortable: 'custom',
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_point'),
            isShow: true,
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '个股对于指数的贡献百分比',
            field: 'contri_per',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'contri_per'),
            formatter: this.gfnElColFormatDec2Percent
          }
        ],
        selectParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        secCodes: '',
        rowStart: 1, // 从1开始
        rowNum: 10,
        step: 10, // 每次加载的数量
        orderField: 'increase_range', // 排序字段，只支持单个
        orderType: 'DESC', // ASC(升序)，DESC(降序)
        loadingMore: false, // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading
      }
    },
    computed: {
      currentType () {
        return this.$store.state.marketOverview.currentType
      },
      currentIndexCode () {
        return this.$store.getters.getCurrentIndexCode
      },
      currentBoardCode () {
        return this.$store.getters.getCurrentBoardCode
      }
    },
    watch: {
      currentType: function (val) {
        if (val === 'index') {
          this.columns[7].label = '个股对于指数的贡献点数'
          this.columns[8].label = '个股对于指数的贡献百分比'
        } else if (val === 'board') {
          this.columns[7].label = '个股对于该板块的贡献点数'
          this.columns[8].label = '个股对于该板块的贡献百分比'
        }
      },
      currentIndexCode: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      },
      currentBoardCode: function () {
        this.fnInitLazyLoadAndSort()
        this.getIndividualData()
      }
    },
    methods: {
      // order: 'ascending' or 'descending'
      // 后台排序
      handleSortChange ({column, prop, order}) {
        if (prop) {
          this.orderField = prop
        } else {
          this.orderField = 'increase_range'
        }
        this.orderType = order === 'ascending' ? 'ASC' : 'DESC'
        this.getIndividualData()
      },

      // 切换产品时，重新初始化参数
      fnInitLazyLoadAndSort () {
        this.individualStockData = []
        this.rowStart = 1
        this.rowNum = 10
        this.loadingMore = false
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        // this.orderField = 'increase_range'
        // this.orderType = 'DESC'
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
      fnGetSelectRes (val) {
        this.secCodes = val.join(',')
        this.getIndividualData()
      },
      fnCellClassName ({row, column}) { // eslint-disable-line
        if (column.property === 'increase_amount') {
          return this.gfnFormatSecurityClass(row[column.property])
        } else if (column.property === 'increase_range' || column.property === 'current_price' || column.property === 'increase_year_range' || column.property === 'contri_point' || column.property === 'contri_per') {
          return this.gfnFormatSecurityClass(row['increase_range'])
        } else if (column.property === 's5') {
          return 'turnover'
        }
      },
      handleCurrentChange (val) {
        if (val) {
          this.$store.commit(types.O_CHANGE_CURRENT_TYPE, 'stock')
          this.$store.commit(types.O_CHANGE_STOCK_CODE, val.stock_code)
        }
      },
      refreshShowListFunc (data) { // 测试列表设置弹框,上移，下移
        this.columns = data
      },
      downloadStockExcel () {
        let tableColumns = [
          {'sheetName': '个股', 'fileColumns': this.columns}
        ]
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMarketOverviewStockParams))
        params.orderField = this.orderField
        params.orderType = this.orderType
        params.rowStart = ''
        params.rowNum = ''
        params.tableColumns = tableColumns
        this.gfnExportFileWithForm('/fluct/quotation/v1/export', params)
      },
      // 用于懒加载
      fnGetMoreIndividualData (start, num) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMarketOverviewStockParams))
        params.secCodes = this.secCodes
        params.rowStart = start
        params.rowNum = num
        params.orderField = this.orderField
        params.orderType = this.orderType
        getMonitorStockApi(params).then(resp => {
          if (resp && resp.bizData) {
            this.individualStockData = this.individualStockData.concat(resp.bizData.metaData)
            if (resp.bizData.rows < this.step) {
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
        clearTimeout(this.individualTimeOut)
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMarketOverviewStockParams))
        params.secCodes = this.secCodes
        params.rowStart = this.rowStart
        params.rowNum = this.rowNum
        params.orderField = this.orderField
        params.orderType = this.orderType
        getMonitorStockApi(params).then(resp => {
          if (resp && resp.bizData) {
            // 防止数据更细倒挂
            if (params.rowNum < this.rowNum) {
              return
            }
            this.individualStockData = resp.bizData.metaData
          } else {
            this.individualStockData = []
          }
          this.individualTimeOut = setTimeout(this.getIndividualData, 30000)
        })
      }
    },
    mounted () {
      this.getIndividualData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.individualTimeOut != null) {
        clearTimeout(this.individualTimeOut)
      }
    }
  }
</script>
<style scoped lang="less">
  .overview-individual-searchbox {
    width: 250px;
    position: absolute;
    top: -45px;
    left: 80px;
  }
</style>
