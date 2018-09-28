<template>
  <div class='investorCount'>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        投资者统计
        <el-button type='info' size='mini' @click='exportForm' style='padding: 6.5px 14px' v-if="exportBtnShow">导出
        </el-button>
      </div>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='分类投资者' name='3'>
          <el-table
            v-if='activeName === "3"'
            :data='classifyCount'
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
              v-for='column in classifyColumns'
              :key=column.field
              header-align="center"
              :align=column.align
              :prop=column.field
              :label=column.label
              :sortable=column.sortable
              :sort-method='column.sortMethod'
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='classifySizeChange'
              @current-change='classifyCurrentChange'
              :current-page='classifyCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='classifypageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='classifyPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='会员' name='4'>
          <el-table
            v-if='activeName === "4"'
            :data='memberCount'
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
              v-for='column in memberColumns'
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
              @size-change='memberSizeChange'
              @current-change='memberCurrentChange'
              :current-page='memberCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='memberpageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='memberPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='营业部' name='5'>
          <el-table
            v-if='activeName === "5"'
            :data='salesCount'
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
              v-for='column in salesColumns'
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
              @size-change='salesSizeChange'
              @current-change='salesCurrentChange'
              :current-page='salesCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='salespageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='salesPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='一码通' name='6'>
          <div v-if="isShow">
            <el-table
              v-if='activeName === "6"'
              :data='ymtCount'
              border
              max-height="480"
              tooltip-effect='dark'
              size='small'
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
                v-for='column in ymtColumns'
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
                @size-change='ymtSizeChange'
                @current-change='ymtCurrentChange'
                :current-page='ymtCurrentPage'
                :page-sizes='[10,20,50,100,200,400]'
                :page-size='ymtpageSize'
                layout='total,sizes,prev,pager,next,jumper'
                :total='ymtPageTotal'
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label='自定义分类' name='7'>
          <el-table
            v-if='activeName === "7"'
            :data='customCount'
            border
            tooltip-effect='dark'
            max-height="480"
            size='small'
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
              v-for='column in customColumns'
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
              @size-change='customSizeChange'
              @current-change='customCurrentChange'
              :current-page='customCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='custompageSize'
              layout='total,sizes,prev,pager,next,jumper'
              :total='customPageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                        :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
  </div>
</template>

<script>
  import {postStockCount} from '../../../../service/marketSupervise/index'
  import DoublePerDouPsw from '../../../common/DoublePerDouPsw'

  export default {
    props: ['time'],
    components: {
      DoublePerDouPsw
    },
    data() {
      return {
        dialogFormVisble: false,
        isShow: false,
        sign: true,
        activeName: '3',
        classifyCount: [],
        memberCount: [],
        salesCount: [],
        ymtCount: [],
        customCount: [],
        classifyColumns: [
          {label: '投资者代码', field: 'code', align: 'center', minWidth: '5%'},
          {label: '投资者类别', field: 'name', align: 'center', minWidth: '5%'},
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
        memberColumns: [
          {label: '会员代码', field: 'code', align: 'center', minWidth: '5%'},
          {label: '会员名称', field: 'name', align: 'center', minWidth: '5%'},
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
        salesColumns: [
          {label: '营业部代码', field: 'code', align: 'center', minWidth: '5%'},
          {label: '营业部名称', field: 'name', align: 'center', minWidth: '5%'},
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
        ymtColumns: [
          {label: '一码通', field: 'code', align: 'center', minWidth: '5%'},
          {label: '账户名称', field: 'name', align: 'center', minWidth: '5%'},
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
        customColumns: [
          {label: '投资者分类', field: 'code', align: 'center', minWidth: '5%'},
          {label: '投资者分类', field: 'name', align: 'center', minWidth: '5%'},
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
        classifyPageTotal: 0,
        classifyCurrentPage: 1,
        classifypageSize: 10,
        memberPageTotal: 0,
        memberCurrentPage: 1,
        memberpageSize: 10,
        salesPageTotal: 0,
        salesCurrentPage: 1,
        salespageSize: 10,
        ymtPageTotal: 0,
        ymtCurrentPage: 1,
        ymtpageSize: 10,
        customPageTotal: 0,
        customCurrentPage: 1,
        custompageSize: 10,
        pageSize: '10',
        indexCode: '',
        beginTime: '',
        endTime: '',
        statisticType: '3',
        trandat: '',
        pageIndex: '',
        exportBtnShow: true
      }
    },
    mounted() {
      this.getTableData(this.activeName)
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
      isPass(val) {
        this.sign = !val
        this.isShow = val
        this.exportBtnShow = val
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      handleClick(tab) {
        this.statisticType = tab.name
        if (this.statisticType == '3') {
          this.pageSize = this.classifypageSize
          this.pageIndex = this.classifyCurrentPage
          this.exportBtnShow = true
        } else if (this.statisticType == '4') {
          this.pageSize = this.memberpageSize
          this.pageIndex = this.memberCurrentPage
          this.exportBtnShow = true
        } else if (this.statisticType == '5') {
          this.pageSize = this.salespageSize
          this.pageIndex = this.salesCurrentPage
          this.exportBtnShow = true
        } else if (this.statisticType == '6') {
          if (this.sign) {
            this.dialogFormVisble = true
            this.isShow = false
            this.exportBtnShow = false
          }
          this.pageSize = this.ymtpageSize
          this.pageIndex = this.ymtCurrentPage
        } else {
          this.pageSize = this.custompageSize
          this.pageIndex = this.customCurrentPage
          this.exportBtnShow = true
        }
        this.getTableData(tab.name)
      },
      handleCurrentChange(val) {
      },
      tableColumnClassName({row, column}) {
        if (column.label == '融资买入金额占比(%)' || column.label == '融券卖出金额占比(%)' || column.label == '融资强平金额占比(%)' || column.label == '融券强平金额占比(%)') {
          return 'orange'
        }
        return ''
      },
      // 分类投资者
      classifySizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.classifyCurrentPage = 1
        this.classifypageSize = val
        this.getTableData(this.activeName)
      },
      classifyCurrentChange(val) {
        this.pageIndex = val
        this.classifyCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 会员
      memberSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.memberCurrentPage = 1
        this.memberpageSize = val
        this.getTableData(this.activeName)
      },
      memberCurrentChange(val) {
        this.pageIndex = val
        this.memberCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 营业部
      salesSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.salesCurrentPage = 1
        this.salespageSize = val
        this.getTableData(this.activeName)
      },
      salesCurrentChange(val) {
        this.pageIndex = val
        this.salesCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 一码通
      ymtSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.ymtCurrentPage = 1
        this.ymtpageSize = val
        this.getTableData(this.activeName)
      },
      ymtCurrentChange(val) {
        this.pageIndex = val
        this.ymtCurrentPage = val
        this.getTableData(this.activeName)
      },
      // 自定义分类
      customSizeChange(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.customCurrentPage = 1
        this.custompageSize = val
        this.getTableData(this.activeName)
      },
      customCurrentChange(val) {
        this.pageIndex = val
        this.customCurrentPage = val
        this.getTableData(this.activeName)
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
            if (flag == '3') {
              this.classifyCount = []
              this.classifyPageTotal = resp.totalRows
              this.classifyCount = resp.securitiesInvestorStatistic
            } else if (flag == '4') {
              this.memberCount = []
              this.memberPageTotal = resp.totalRows
              this.memberCount = resp.securitiesInvestorStatistic
            } else if (flag == '5') {
              this.salesCount = []
              this.salesPageTotal = resp.totalRows
              this.salesCount = resp.securitiesInvestorStatistic
            } else if (flag == '6') {
              this.ymtCount = []
              this.ymtPageTotal = resp.totalRows
              this.ymtCount = resp.securitiesInvestorStatistic
            } else {
              this.customCount = []
              this.customPageTotal = resp.totalRows
              this.customCount = resp.securitiesInvestorStatistic
            }
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
  .investorCount {
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

  .investorCount .block {
    padding: 10px;
    .el-pagination {
      text-align: center;
    }
  }

  .investorCount .orange {
    > div {
      color: orange;
    }
  }
</style>
