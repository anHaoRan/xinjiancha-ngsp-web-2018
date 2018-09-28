<template>
  <div class='securityCount'>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        证券统计
        <el-button type='info' size='mini' @click='exportForm' style='padding: 6.5px 14px'>导出</el-button>
      </div>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='股票' name='8'>
          <el-table
            v-if='activeName === "8"'
            :data='stockCount'
            border
            tooltip-effect='dark'
            size='small'
            max-height="480"
            :cell-class-name='this.tableColumnClassName'
            highlight-current-row
            @current-change='handleCurrentChange'
            style='width: 100%'>
            <el-table-column
              align='center'
              label=''
              type='index'
              width='50'>
            </el-table-column>
            <el-table-column
              v-for='column in stockColumns'
              :key=column.field
              :align=column.align
              header-align="center"
              :prop=column.field
              :label=column.label
              :sortable=column.sortable
              :sort-method=column.sortMethod
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='stockSizeChange'
              @current-change='stockCurrentChange'
              :current-page='stockCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='stockpageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='stockPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='行业板块' name='1'>
          <el-table
            v-if='activeName === "1"'
            :data='tradeCount'
            border
            tooltip-effect='dark'
            size='small'
            max-height="480"
            :cell-class-name='this.tableColumnClassName'
            highlight-current-row
            @current-change='handleCurrentChange'
            style='width: 100%'>
            <el-table-column
              align='center'
              label=''
              type='index'
              width='50'>
            </el-table-column>
            <el-table-column
              v-for='column in tradeColumns'
              :key=column.field
              :align=column.align
              header-align="center"
              :prop=column.field
              :label=column.label
              :sortable=column.sortable
              :sort-method='column.sortMethod'
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='tradeSizeChange'
              @current-change='tradeCurrentChange'
              :current-page='tradeCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='tradepageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='tradePageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='概念板块' name='2'>
          <el-table
            v-if='activeName === "2"'
            :data='conceptCount'
            border
            tooltip-effect='dark'
            size='small'
            max-height="480"
            :cell-class-name='this.tableColumnClassName'
            highlight-current-row
            @current-change='handleCurrentChange'
            style='width: 100%'>
            <el-table-column
              align='center'
              label=''
              type='index'
              width='50'>
            </el-table-column>
            <el-table-column
              v-for='column in conceptColumns'
              :key=column.field
              :align=column.align
              header-align="center"
              :prop=column.field
              :label=column.label
              :sortable=column.sortable
              :sort-method='column.sortMethod'
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='conceptSizeChange'
              @current-change='conceptCurrentChange'
              :current-page='conceptCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='conceptpageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='conceptPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import {postStockCount} from '../../../../service/marketSupervise/index'

  export default {
    props: ['time'],
    data() {
      return {
        activeName: '8',
        stockCount: [],
        tradeCount: [],
        conceptCount: [],
        stockColumns: [
          {label: '代码', field: 'code', align: 'center', minWidth: '5%'},
          {label: '名称', field: 'name', align: 'center', minWidth: '5%'},
          {label: '融资买入金额(万元)', field: 'rzmr', align: 'right', minWidth: '6%'},
          {label: '融资买入金额占比(%)', field: 'rzmr_proportion', align: 'right', minWidth: '8%'},
          {
            label: '卖券还款金额(万元)',
            field: 'mqhk',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhk')
          },
          {
            label: '融券卖出金额(万元)',
            field: 'rqmc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rqmc')
          },
          {label: '融券卖出金额占比(%)', field: 'rqmc_proportion', align: 'right', minWidth: '8%'},
          {
            label: '买券还券金额(万元)',
            field: 'mqhq',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhq')
          },
          {
            label: '融资强平金额(万元)',
            field: 'rzpc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rzpc')
          },
          {label: '融资强平金额占比(%)', field: 'rzpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融券强平金额(万元)', field: 'rqpc', align: 'right', minWidth: '6%'},
          {label: '融券强平金额占比(%)', field: 'rqpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融资余额(万元)', field: 'rzye', align: 'right', minWidth: '5%'},
          {label: '融券余额(万元)', field: 'rqye', align: 'right', minWidth: '5%'}
        ],
        tradeColumns: [
          {label: '名称', field: 'name', align: 'center', minWidth: '5%'},
          {label: '融资买入金额(万元)', field: 'rzmr', align: 'right', minWidth: '6%'},
          {label: '融资买入金额占比(%)', field: 'rzmr_proportion', align: 'right', minWidth: '8%'},
          {
            label: '卖券还款金额(万元)',
            field: 'mqhk',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhk')
          },
          {
            label: '融券卖出金额(万元)',
            field: 'rqmc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rqmc')
          },
          {label: '融券卖出金额占比(%)', field: 'rqmc_proportion', align: 'right', minWidth: '8%'},
          {
            label: '买券还券金额(万元)',
            field: 'mqhq',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhq')
          },
          {
            label: '融资强平金额(万元)',
            field: 'rzpc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rzpc')
          },
          {label: '融资强平金额占比(%)', field: 'rzpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融券强平金额(万元)', field: 'rqpc', align: 'right', minWidth: '6%'},
          {label: '融券强平金额占比(%)', field: 'rqpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融资余额(万元)', field: 'rzye', align: 'right', minWidth: '5%'},
          {label: '融券余额(万元)', field: 'rqye', align: 'right', minWidth: '5%'}
        ],
        conceptColumns: [
          {label: '名称', field: 'name', align: 'center', minWidth: '5%'},
          {label: '融资买入金额(万元)', field: 'rzmr', align: 'right', minWidth: '6%'},
          {label: '融资买入金额占比(%)', field: 'rzmr_proportion', align: 'right', minWidth: '8%'},
          {
            label: '卖券还款金额(万元)',
            field: 'mqhk',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhk')
          },
          {
            label: '融券卖出金额(万元)',
            field: 'rqmc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rqmc')
          },
          {label: '融券卖出金额占比(%)', field: 'rqmc_proportion', align: 'right', minWidth: '8%'},
          {
            label: '买券还券金额(万元)',
            field: 'mqhq',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhq')
          },
          {
            label: '融资强平金额(万元)',
            field: 'rzpc',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rzpc')
          },
          {label: '融资强平金额占比(%)', field: 'rzpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融券强平金额(万元)', field: 'rqpc', align: 'right', minWidth: '6%'},
          {label: '融券强平金额占比(%)', field: 'rqpc_proportion', align: 'right', minWidth: '8%'},
          {label: '融资余额(万元)', field: 'rzye', align: 'right', minWidth: '5%'},
          {label: '融券余额(万元)', field: 'rqye', align: 'right', minWidth: '5%'}
        ],
        stockPageTotal: 0,
        tradePageTotal: 0,
        conceptPageTotal: 0,
        stockCurrentPage: 1,
        tradeCurrentPage: 1,
        conceptCurrentPage: 1,
        stockpageSize: 10,
        tradepageSize: 10,
        conceptpageSize: 10,
        pageSize: '10',
        indexCode: '',
        beginTime: '',
        endTime: '',
        statisticType: '8',
        trandat: '',
        pageIndex: ''
      }
    },
    mounted() {
       this.getTableData()
    },
    watch: {
      time: {
        handler: function (param1, param2) {
          this.getTableData(this.activeName)
        },
        deep: true
      }
    },
    methods: {
      // 列颜色定义
      tableColumnClassName({row, column}) {
        if (column.label == '融资买入金额占比(%)' || column.label == '融券卖出金额占比(%)' || column.label == '融资强平金额占比(%)' || column.label == '融券强平金额占比(%)') {
          return 'orange'
        }
        return ''
      },
      // 股票分页间隔
      stockSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.stockCurrentPage = 1
        this.stockpageSize = val
        this.getTableData(this.activeName)
      },
      // 股票当前页
      stockCurrentChange(val) {
        this.pageIndex = val
        this.stockCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 行业分页间隔
      tradeSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.tradeCurrentPage = 1
        this.tradepageSize = val
        this.getTableData(this.activeName)
      },
      // 行业当前页
      tradeCurrentChange(val) {
        this.pageIndex = val
        this.tradeCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 概念分页间隔
      conceptSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.conceptCurrentPage = 1
        this.conceptpageSize = val
        this.getTableData(this.activeName)
      },
      // 概念当前页
      conceptCurrentChange(val) {
        this.pageIndex = val
        this.conceptCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 表格table
      handleCurrentChange(val) {

      },
      // tabs切换获取账户类别
      handleClick(tab) {
        this.statisticType = tab.name
        if (this.statisticType == '8') {
          this.pageSize = this.stockpageSize
          this.pageIndex = this.stockCurrentPage
        } else if (this.statisticType == '1') {
          this.pageSize = this.tradepageSize
          this.pageIndex = this.tradeCurrentPage
        } else {
          this.pageSize = this.conceptpageSize
          this.pageIndex = this.conceptCurrentPage
        }
        this.getTableData(tab.name)
      },
      getTableData(flag) {
        if (!this.time.beginTime) {
          this.time.beginTime = ''
          this.time.endTime = ''
        } else {
          this.time.beginTime = this.time.beginTime.split(':').join('')
          this.time.endTime = this.time.endTime.split(':').join('')
        }
        if (!this.time.date) {
          this.time.date = ''
        } else {
          this.time.date = this.time.date.split('-').join('')
        }
        if (!this.time.code) {
          this.time.code = ''
        }
        let params = {
          indexCode: this.time.code,
          beginTime: this.time.beginTime,
          endTime: this.time.endTime,
          statisticType: this.statisticType,
          trandat: this.time.date,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }
        postStockCount(params)
          .then((resp) => {
            // resp.securitiesInvestorStatistic.forEach((el) => {
            //   el.rzmr = (el.rzmr / 10000).toFixed(3)
            //   el.mqhk = (el.mqhk / 10000).toFixed(3)
            //   el.rqmc = (el.rqmc / 10000).toFixed(3)
            //   el.mqhq = (el.mqhq / 10000).toFixed(3)
            //   el.rzpc = (el.rzpc / 10000).toFixed(3)
            //   el.rqpc = (el.rqpc / 10000).toFixed(3)
            //   el.rzye = (el.rzye / 10000).toFixed(3)
            //   el.rqye = (el.rqye / 10000).toFixed(3)
            // })
            if (flag == '8') {
              this.stockCount = resp.securitiesInvestorStatistic
              this.stockPageTotal = resp.totalRows
            } else if (flag == '1') {
              this.tradeCount = resp.securitiesInvestorStatistic
              this.tradePageTotal = resp.totalRows
            } else {
              this.conceptCount = resp.securitiesInvestorStatistic
              this.conceptPageTotal = resp.totalRows
            }

            //  this.stockCount = resp.securitiesInvestorStatistic
            //  this.tradeCount = resp.securitiesInvestorStatistic
            //  this.conceptCount = resp.securitiesInvestorStatistic
            //  this.stockPageTotal = resp.totalRows
            //  this.tradePageTotal = resp.totalRows
            //  this.conceptPageTotal = resp.totalRows
          })
      },
      // 导出图表
      exportForm() {
        if (!this.time.beginTime) {
          this.time.beginTime = ''
          this.time.endTime = ''
        } else {
          this.time.beginTime = this.time.beginTime.split(':').join('')
          this.time.endTime = this.time.endTime.split(':').join('')
        }
        if (!this.time.date) {
          this.time.date = ''
        } else {
          this.time.date = this.time.date.split('-').join('')
        }
        if (!this.time.code) {
          this.time.code = ''
        }
        window.open('/ngsp/fluct/margin-trading/v1/securities-investor-statistic-export?indexCode=' + this.time.code + '&trandat=' + this.time.date + '&beginTime=' + this.time.beginTime + '&endTime=' + this.time.endTime + '&statisticType=' + this.statisticType)
      }
    }
  }
</script>

<style lang='less'>
  .securityCount {
    .el-card {
      .el-tabs--card {
        position: relative;
        > .el-tabs__header {
          position: absolute;
          left: 8%;
          top: -70px;
        }
        > .el-tabs__content {
          margin-top: 15px;
        }
      }
    }
  }

  .securityCount .block {
    padding: 10px;
    .el-pagination {
      text-align: center;
    }
  }

  .securityCount .orange {
    > div {
      color: orange;
    }
  }
</style>
