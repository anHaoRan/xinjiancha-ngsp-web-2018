<template>
  <div class='monitorStock'>
    <el-card class='el-card-table'>
      <margin-table :columns="stockColumns" :data="data" @getPageination="handSelectedRow"
                    :cell-class-name='this.tableColumnClassName' @handlerChange="handlerChange"></margin-table>
    </el-card>
  </div>

</template>

<script>
  import {postMonitorStockData} from '../../../service/analysisTool/realTimeMonitorAnalysisToll/index'
  import TableBtn from './TableBtn'
  import moment from 'moment'

  export default {
    name: 'stock-quotation',
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
    },
    data() {
      return {
        data: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        stockColumns: [
          {
            label: '序号',
            field: 'id',
            align: 'center',
            minWidth: '8%'
          },
          {
            label: '监控证券编号',
            field: 'monitor_id',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'monitor_id')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            align: 'center',
            minWidth: '8%',
            template: TableBtn,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券名称',
            field: 'instrument_name',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_name')
          },
          {
            label: '当日涨跌幅(%)',
            field: 'zd_rate',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zd_rate')
          },
          {
            label: '监控起始日期',
            field: 'start_date',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'start_date')
          },
          {
            label: '监控结束日期',
            field: 'end_date',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'end_date')
          },
          {
            label: '监控原因',
            field: 'monitor_reason',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'monitor_reason')
          },
          {
            label: '监控级别',
            field: 'monitor_leavel',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'monitor_leavel')
          },
          {
            label: '创建者',
            field: 'create_person',
            align: 'center',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'create_person')
          }
        ],  // 账户成交统计表格
        stockCurrentPage: 1,  // 账户成交统计当前页
        pageSize: 10
      }
    },
    mounted() {
      // let indexCode = this.$store.state.realTimeMonitorAnalysisToll.stockCode
      // if (indexCode) {
      //   this.getTableData()
      // }
      this.getTableData()
    },
    methods: {
      // 列颜色定义
      tableColumnClassName({row, column}) {
        if (column.label == '当日涨跌幅(%)') {
          if (row.zd_rate > 0) {
            return 'up'
          } else {
            return 'down'
          }
        }
        return ''
      },
      handlerChange(val) {
        this.$emit('changeActiveName', val)
      },
      handSelectedRow(val) {
        this.stockCurrentPage = val.currentPage
        this.pageSize = val.pageSizeNumber
        this.data.pageIndex = val.currentPage
        this.data.pageRows = val.pageSizeNumber
        this.getTableData()
      },
      // 获取表格数据
      getTableData() {
        // let indexCode = this.$store.state.realTimeMonitorAnalysisToll.stockCode
        let params = {indexCode: '', pageIndex: this.stockCurrentPage, pageRows: this.pageSize}
        postMonitorStockData(params).then((resp) => {
          if (!resp.STOCK_DATA.length) {
            this.stockPageTotal = 0
          } else {
            resp.STOCK_DATA.forEach((el) => {
              el.start_date = moment(el.start_date, 'YYYYMMDD').format('YYYY-MM-DD')
              el.end_date = moment(el.end_date, 'YYYYMMDD').format('YYYY-MM-DD')
            })
            this.data.data = resp.STOCK_DATA
            this.data.total = Number(resp.TOTAL)
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  .monitorStock {
    .up {
      color: #ff402b;
    }
    .down {
      color: #12bba5;
    }
  }
</style>
