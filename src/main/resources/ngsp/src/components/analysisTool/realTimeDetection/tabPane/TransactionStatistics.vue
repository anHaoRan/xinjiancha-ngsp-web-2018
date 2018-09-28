<template>
  <div class="real-transaction-statistics">
    <!--查询条件-->
    <div class="transaction-statistics-header">
      <el-form :inline="true" :model="selectParams" ref="selectParams" :rules="rules" label-width="100px"
               label-position="right">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="成交价格区间">
              <div style="display: flex;">
                <el-form-item prop="startIntertval" style="margin-right: 0">
                  <el-input v-model="selectParams.startIntertval" size="mini" style="width: 120px;"></el-input>
                </el-form-item>
                <span>&nbsp;至&nbsp;</span>
                <el-form-item prop="endIntertval">
                  <el-input v-model="selectParams.endIntertval" size="mini" style="width: 120px;"></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="成交量排名" prop="rank">
              <el-input v-model="selectParams.rank" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="账户组">
              <down-more-select v-model="selectParams.accountGroup" ref="downMoreSelect"
                                :optionData="accountGroupOption"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="fnCountTableExport">导出</el-button>
              <el-button type="primary" size="small" @click="ajaxBargainStat('selectParams')">查询</el-button>
              <el-button type="info" size="small" @click="fnEmptySelectParams('selectParams')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="splitline"/>
    </div>
    <el-row style="margin-top: 20px;" :gutter="20">
      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="12">
            <div id="transaction-statistics-buy"></div>
          </el-col>
          <el-col :span="12">
            <div id="transaction-statistics-sell"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <margin-table :isPageination="false" :height="200" :columns="projectColumns" :cellClassName="fnCellClassName"
                      :data="{data:buySellTable}"/>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 25px">
      <el-col :span="12">
        <div class="font-color-main table-title"> 买：
          <el-button type="primary" class="right-button" size="small" @click="fnBuyTableExport">导出</el-button>
        </div>
        <margin-table :isPageination="false" :columns="columns" :rowClassName="handleRowClassName"
                      :data="{data:buyTable}"/>
      </el-col>
      <el-col :span="12">
        <div class="font-color-main table-title"> 卖：
          <el-button type="primary" class="right-button" size="small" @click="fnSaleTableExport">导出</el-button>
        </div>
        <margin-table :isPageination="false" :columns="columns1" :rowClassName="handleRowClassName"
                      :data="{data:saleTable}"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {securityStyle} from '@/utils/constants'
  import {
    bargainStat,
    countTableExport,
    buyTableExport,
    saleTableExport
  } from '@/service/analysisTool/realTimeDetection/index'
  import DownMoreSelect from '../../../common/downMoreSelect'
  import MinxinVue from '../Mixin'
  import moment from 'moment'


  let echarts = require('echarts')
  export default {
    name: 'transaction-statistics',
    components: {
      DownMoreSelect,
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [MinxinVue],
    data() {
      let checkNumberPos = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0) {
          callback(new Error('必须是正数'))
          return
        }
        callback()
      }
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
        } else {
          callback()
        }
      }
      let checkNumber2 = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
        } else {
          if (Number(value) < this.selectParams.startIntertval) {
            callback(new Error('必须大于前一个价格'))
          } else {
            callback()
          }
        }
      }
      let numberPosRules = {
        validator: checkNumberPos
      }
      let numberRules = {
        validator: checkNumber
      }
      let numberRules2 = {
        validator: checkNumber2
      }

      return {
        rules: {
          rank: [numberPosRules],
          startIntertval: [numberRules],
          endIntertval: [numberRules2]
        },
        accountGroupOption: [{
          value: '选中账户',
          label: '选中账户'
        }, {
          value: '待分析账户',
          label: '待分析账户'
        }, {
          value: '待监控账户',
          label: '待监控账户'
        }], //  传递给子组件的账户组数据
        selectParams: {
          startIntertval: '',
          endIntertval: '',
          rank: 20,
          accountGroup: []
        },
        tableOrGraphic: '0',
        projectColumns: [
          {field: 'project', label: '项目', width: '120', align: 'left'},
          {field: 'position_amount_old', label: '前一日持仓', width: '120', align: 'right'},
          {field: 'timeslot', label: '时间段', width: '120', align: 'left'},
          {field: 'buy', label: '买入数量', width: '120', align: 'right'},
          {field: 'trdamt_b', label: '买入金额', width: '120', align: 'right'},
          {field: 'avgprice_b', label: '买入均价', width: '120', align: 'right'},
          {field: 'proportion_b', label: '买入占比(%)', width: '120', align: 'right'},
          {field: 'sale', label: '卖出数量', width: '120', align: 'right'},
          {field: 'trdamt_s', label: '卖出金额', width: '120', align: 'right'},
          {field: 'avgprice_s', label: '卖出均价', width: '120', align: 'right'},
          {field: 'proportion_s', label: '卖出占比(%)', width: '120', align: 'right'}
        ],
        columns: [
          {field: 'rn', label: '序号', width: '55', align: 'right'},
          {field: 'trandat', label: '日期', width: '120', align: 'left', formatter: this.fnDate},
          {field: 'aid', label: '买方账户', width: '120', align: 'left'},
          {field: 'ianame', label: '买方账户名称', width: '120', align: 'left'},
          {field: 'yaid', label: '买方一码通账户', width: '120', align: 'left'},
          {field: 'pbuid', label: '买方PBU代码', width: '120', align: 'left'},
          {field: 'branchname', label: '买方营业部名称', width: '120', align: 'left'},
          {field: 'position_amount_old', label: '买方前持', width: '120', align: 'right'},
          {field: 'buy', label: '买入数量', width: '120', align: 'right'},
          {field: 'trdamt_b', label: '买入金额', width: '120', align: 'right'},
          {field: 'proportion_b', label: '买入比例(%)', width: '120', align: 'right'},
          {field: 'avgprice_b', label: '买入均价', width: '120', align: 'right'}
        ],
        columns1: [
          {field: 'rn', label: '序号', width: '55', align: 'right'},
          {field: 'trandat', label: '日期', width: '120', align: 'left', formatter: this.fnDate},
          {field: 'aid', label: '卖方账户', width: '120', align: 'left'},
          {field: 'ianame', label: '卖方账户名称', width: '120', align: 'left'},
          {field: 'yaid', label: '卖方一码通账户', width: '120', align: 'left'},
          {field: 'pbuid', label: '卖方PBU代码', width: '120', align: 'left'},
          {field: 'branchname', label: '卖方营业部名称', width: '120', align: 'left'},
          {field: 'position_amount_old', label: '卖方前持', width: '120', align: 'right'},
          {field: 'sale', label: '卖出数量', width: '120', align: 'right'},
          {field: 'trdamt_s', label: '卖出金额', width: '120', align: 'right'},
          {field: 'proportion_s', label: '卖出比例(%)', width: '120', align: 'right'},
          {field: 'avgprice_s', label: '卖出均价', width: '120', align: 'right'}
        ],
        buySellTable: [],
        buyTable: [],
        saleTable: [],
        buyChart: null,
        sellChart: null,
        buyOptions: {
          tooltip: {
            trigger: 'item'
          },
          title: {
            show: true,
            text: '账户组与市场买成交金额对比图',
            left: 'center',
            textStyle: {
              fontSize: 16
            },
            top: '10px'
          },
          xAxis: {
            type: 'category',
            data: ['账户组买方', '全市场买方']
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            top: 50,
            bottom: 30,
            left: 'center'
          },
          series: [
            {
              type: 'bar',
              label: {
                normal: {
                  formatter: '{b}\n{d}%'
                }
              },
              data: []
            }
          ]
        },
        sellOptions: {
          tooltip: {
            trigger: 'item'
          },
          title: {
            show: true,
            text: '账户组与市场卖成交金额对比图',
            left: 'center',
            textStyle: {
              fontSize: 16
            },
            top: '10px'
          },
          xAxis: {
            type: 'category',
            data: ['账户组卖方', '全市场卖方']
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            top: 50,
            bottom: 30,
            left: 'center'
          },
          series: [
            {
              type: 'bar',
              label: {
                normal: {
                  formatter: '{b}\n{d}%'
                }
              },
              data: []
            }
          ]
        },
        lastSelectParam: null
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      this.ajaxBargainStat('selectParams')
    },
    methods: {
      initPieChart(chart, domId, options) {
        chart = echarts.init(document.getElementById(domId), this.gfnGetTheme())
        this.gfnEchartShowLoading(chart)
        chart.clear()
        chart.setOption(options, true)
        chart.hideLoading()
      },
      initEcharts(res) {
        this.buyOptions.series[0].data = [res.trdamtBuy, res.mktval]
        this.initPieChart(this.buyChart, 'transaction-statistics-buy', this.buyOptions)
        this.sellOptions.series[0].data = [res.trdamtSale, res.mktval]
        this.initPieChart(this.sellChart, 'transaction-statistics-sell', this.sellOptions)
      },
      ajaxBargainStat(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(this.selectParams.accountGroup)
            let param = {
              stockCode: this.routerParams.isinCode,
              dateTimeStart: this.routerParams.dateTimeValue[0],
              dateTimeEnd: this.routerParams.dateTimeValue[1],
              priceStart: this.selectParams.startIntertval,
              priceEnd: this.selectParams.endIntertval,
              topN: this.selectParams.rank,
              accountGroup: this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
            }
            this.lastSelectParam = param
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0,0,0,0.7)'
            })
            bargainStat(param).then((res) => {
              loading.close()
              this.buySellTable = res.totalResult.bizData.metaData
              this.buyTable = res.buyResult.bizData.metaData
              this.saleTable = res.saleResult.bizData.metaData
              this.$nextTick(function () {
                this.initEcharts(res)
              })
            }, () => {
              loading.close()
            })
          }
        })
      },
      fnCellClassName({row, column}) {
        if (['buy', 'trdamt_b', 'avgprice_b', 'proportion_b'].indexOf(column.property) != -1) {
          return securityStyle.up
        }
        if (['sale', 'trdamt_s', 'avgprice_s', 'proportion_s'].indexOf(column.property) != -1) {
          return securityStyle.down
        }
        return ''
      },
      fnDate(row, column, cellValue) {
        let date = cellValue
        if (date != '小计' && date != '合计') {
          date = moment(date, 'YYYYMMDD').format('YYYY-MM-DD')
        }
        return date
      },
      handleRowClassName({row, rowIndex}) {
        let arr = [...this.routerParams.monitorAccount, ...this.routerParams.analysisAccount]
        let index = arr.findIndex(item => {
          return item == row.aid
        })
        if (index != -1) {
          return 'accounttimeout'
        }
        return ''
      },
      fnEmptySelectParams(formName) {
        this.$refs[formName].resetFields()
        this.selectParams.accountGroup = []
        this.$refs.downMoreSelect.cancel()
      },
      fnCountTableExport() {
        this.createElementA(countTableExport(), this.projectColumns)
      },
      fnBuyTableExport() {
        this.createElementA(buyTableExport(), this.columns)
      },
      fnSaleTableExport() {
        this.createElementA(saleTableExport(), this.columns1)
      },
      createElementA(url, columns) {
        let params = this.lastSelectParam
        params['tableColumns'] = columns
        params['fileType'] = 'excel'
        console.log(JSON.stringify(params))
        this.gfnExportFile(url, JSON.stringify(params))
      }
    }
  }
</script>

<style lang="less">
  .real-transaction-statistics {
    .transaction-statistics-header {
      padding: 20px 20px 0 20px;
    }
    .transaction-statistics__chart-container {
      background: rgba(0, 0, 0, 0.25);
    }
    .font-color-main {
      font-size: 18px;
      text-align: center;
      font-weight: bold;
      text-align: center;
    }
    .table-title {
      margin: 0 20px 10px 20px;
      text-align: left;
      position: relative;
      > .right-button {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    #transaction-statistics-buy, #transaction-statistics-sell {
      height: 200px;
      background-color: #17274b;
      border-radius: 4px;
    }
    .accounttimeout {
      background-color: #3d507a !important;
    }
  }
</style>
