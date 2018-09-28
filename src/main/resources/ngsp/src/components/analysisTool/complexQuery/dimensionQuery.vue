<template>
  <div class='dimension-query-container-s'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <el-button size='small' type='info' @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearchDimen'>查询</el-button>
      </div>

      <el-form label-width='100px' :model="formData" :inline="true" :rules="rules" ref="dimensionMainPage">
        <el-col :xl='7' :lg="7" :md='7' :sm='24'>
          <el-form-item label='开始日期：' prop='startDate'>
            <el-date-picker
              v-model='formData.startDate'
              type='date'
              placeholder='请选择开始日期'
              :picker-option='pickerOption'
              size='small'>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg="7" :md='7' :sm='24'>
          <el-form-item label='结束日期：' prop='endDate'>
            <el-date-picker
              v-model='formData.endDate'
              type='date'
              placeholder='请选择结束日期'
              :picker-option='pickerOption'
              size='small'>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg="7" :md='7' :sm='24'>
          <el-form-item label='证券代码：' prop='secCode'>
            <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg="7" :md='7' :sm='24'>
          <el-form-item label='维度类型：' prop='dimenType'>
            <el-select v-model='dimensionType' @change="selectChangeDimen" clearable placeholder='请选择' size='small' style='width: 100%'>
              <el-option
                v-for='item in dimensionTypeOptions'
                :key='item.value'
                :label='item.label'
                :value='item.value'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl='2' :md='3' :sm='24'>
          <el-form-item label='' prop='isDayCalculation'>
            <el-switch
              v-model='isDayCalculation'
              active-text='逐日计算'>
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :xl='4' :md='5' :sm='24' :offset='1'>
          <el-form-item label='' prop='isDrillDetail'>
            <el-switch
              v-model='isDrillDetail'
              active-text='同时钻取账户明细数据'>
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :xl='24' :lg="24" :md='24' :sm='24' class="statistics-style">
          <el-form-item label='统计指标：' prop='statisticsIndexs'>
            <el-col :xl='21' :lg="21" :md='21' :sm='21'>
              <el-select
                style='width: 100%'
                v-model='statisticsIndexs'
                multiple
                clearable
                placeholder='请选择统计指标(可选多项)'
                size='small'>
                <el-option
                  v-for='item in statisticsIndexOptions'
                  :key='item.value'
                  v-if='(dimensionOption == item.everyType || item.everyType == 1) && item.statisticsType[Number(dimensionType)-1] == 1'
                  :label='item.label'
                  :value='item.value'>
                </el-option>
              </el-select>
            </el-col>
            <el-col :xl='3' :lg="3" :md='3' :sm='3'>
              <span class='dimension-type-tips'>请先选择维度类型</span>
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class='dimension-query-area-s'>
      <el-col :span='24' class='dimension-export-btn'>
        <el-col :span='22' style='text-align: right;'>
          <el-radio-group v-model='exportRadio'>
            <el-radio :label='1' value='1'>
              导出前<input type='text' v-model='exportCount'>条查询结果为xls文件
            </el-radio>
            <el-radio :label='2' value='2'>导出全部查询结果为xls文件</el-radio>
            <el-radio :label='3' value='3'>导出全部查询结果为csv文件</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span='1' :offset='1'>
          <el-button type='primary' @click='handleDownload' size='mini'>导出</el-button>
        </el-col>
      </el-col>
      <div class=''>
        <el-col :span='24' style='width: 100%;'>
          <table-header
            ref="dimensionTableHeader"
            :drillingParams='drillingParams'
          ></table-header>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
  // markTableRender: 1: 账户，3：PBU, 5: 营业部，7：会员，2：账户—逐日 ，4：PBU—逐日， 6: 营业部—逐日 ，8: 会员—逐日

  import { getDimensionInfo } from '@/service/analysisTool/complexQuery/index'
  import TableHeader from './componentsTool/dimension/DimensionQueryTableHeader'
  import moment from 'moment'

  export default {
    components: {
      Breadcrumb: () => import('../../common/Breadcrumb'),
      StockCodeQuery: () => import('../../common/StockCodeQuery'),
      TableHeader
    },
    data () {
      return {
        drillingParams: {}, // 钻取界面需要参数
        ASH: false, // 是否是A股
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },

        dimensionType: '', // 保存['账户'，'PBU','营业部','会员'] 用户选中的数组中的index，用来展示哪个类别的统计指标
        dimensionOption: '2', // 维度信息类型统计指标  everyType: 1 表示都可以显示， everyType: 2 表示不勾选逐日的时候展示， everyType: 3 表示勾选逐日展示
        commonData: { // 证券代码
          disabled: false,
          stockCode: ''
        },

        exportCount: '', // 用户输入的导出条数
        isDayCalculation: false, // 逐日计算
        isDrillDetail: true, // 钻取明细
        formData: {
          secCode: '',
          startDate: '',
          endDate: '',
          dimenType: '', // 维度类型
          isDayCalc: '', // 逐日查询
          isDrillDetail: '' // 钻取明细
        },
        rules: {
          startDate: [
            {required: true, message: '请输入开始日期'}
          ],
          endDate: [
            {required: true, message: '请输入结束日期'}
          ],
          dimenType: [
            {required: true, message: '请选择维度类型'}
            ],
          secCode: [
            {required: true, message: '请输入证券代码'}
          ]
        },
        pickerOption: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        dimensionTypeOptions: [
          {value: '1', label: '账户'},
          {value: '2', label: 'PBU'},
          {value: '3', label: '营业部'},
          {value: '4', label: '会员'}
          ],
        statisticsIndexOptions: [
          {
            value: 'isTradeBuyVol',
            label: '买成交量',
            everyType: 1, // everyType: 1 表示都可以显示， everyType: 2 表示不勾选逐日的时候才展示， everyType: 3 表示勾选逐日才展示
            statisticsType: [1, 2, 1, 1] // 不同维度类型是否需要展示此字段，1表示展示，2表示不展示
          }, {
            value: 'isTradeBuyAmt',
            label: '买成交额',
            everyType: 1,
            statisticsType: [1, 2, 1, 1]
          }, {
            value: 'isTradeSellVol',
            label: '卖成交量',
            everyType: 1,
            statisticsType: [1, 2, 1, 1]
          }, {
            value: 'isTradeSellAmt',
            label: '卖成交额',
            statisticsType: [1, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isNetBuySellVol',
            label: '净买卖量',
            everyType: 1,
            statisticsType: [1, 2, 1, 1]
          }, {
            value: 'isNetBuySellAmt',
            label: '净买卖额',
            statisticsType: [1, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isTradeAcctCnt',
            label: '交易账户数',
            statisticsType: [2, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isOrderBuyVol',
            label: '买委托量',
            statisticsType: [1, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isOrderBuyAmt',
            label: '买委托额',
            everyType: 1,
            statisticsType: [1, 2, 1, 1]
          }, {
            value: 'isOrderSellVol',
            label: '卖委托量',
            statisticsType: [1, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isOrderSellAmt',
            label: '卖委托额',
            statisticsType: [1, 2, 1, 1],
            everyType: 1
          }, {
            value: 'isMaxHold',
            label: '期间最大持股',
            everyType: '2',
            statisticsType: [1, 2, 2, 2]
          }, {
            value: 'isBeforeHold',
            label: '期初前持股',
            everyType: '2',
            statisticsType: [1, 1, 2, 1]
          }, {
            value: 'isStartHold',
            label: '期初持股',
            everyType: '2',
            statisticsType: [1, 1, 2, 1]
          }, {
            value: 'isEndHold',
            label: '期末持股',
            everyType: '2',
            statisticsType: [1, 1, 2, 1]
          }, {
            value: 'isCurrDayHold',
            label: '当日持股',
            everyType: '3',
            statisticsType: [1, 1, 2, 1]
          }, {
            value: 'isSingleHold',
            label: '持股单一情况',
            everyType: '1',
            statisticsType: [1, 2, 2, 2]
          }, {
            value: 'isAcctInfo',
            label: '账户开户信息',
            statisticsType: [1, 2, 2, 2],
            everyType: '1'
          }],
        statisticsIndexs: [],
        handleStatisticsService: { // 处理发给服务器端的统计指标数据
          isTradeBuyVol: 0,
          isTradeBuyAmt: 0,
          isTradeSellVol: 0,
          isTradeSellAmt: 0,
          isNetBuySellVol: 0,
          isNetBuySellAmt: 0,
          isTradeAcctCnt: 0,
          isOrderBuyVol: 0,
          isOrderBuyAmt: 0,
          isOrderSellVol: 0,
          isOrderSellAmt: 0,
          isMaxHold: 0,
          isBeforeHold: 0,
          isStartHold: 0,
          isEndHold: 0,
          isCurrDayHold: 0,
          isSingleHold: 0,
          isAcctInfo: 0
        },
        exportRadio: 3, // 用户选择的导出类型
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/complexQuery',
            label: '综合查询'
          }, {
            router: '/dimensionQuery',
            label: '维度信息查询'
          }]
      }
    },
    watch: {
      isDayCalculation () {
        if (this.isDayCalculation) { // 维度信息类型  everyType: 1 表示都可以显示， everyType: 2 表示不勾选逐日的时候才展示， everyType: 3 表示勾选逐日才展示
          this.dimensionOption = 3
        } else {
          this.dimensionOption = 2
        }
        this.changeDimensionType()
      },
      dimensionType () {
        this.changeDimensionType()

      }
    },
    methods: {
      selectChangeDimen() {
        this.formData.dimenType = this.dimensionType
      },
      clearForm () {
        this.commonData.stockCode = ''
        this.dimensionType = ''
        this.formData = {
          secCode: '',
          startDate: '',
          endDate: '',
          dimenType: '', // 维度类型
          isDayCalc: '', // 逐日查询
          isDrillDetail: '' // 钻取明细
        }
      },
      changeDimensionType () { // 更改维度类型['账户'，'PBU','营业部','会员']
        if (this.dimensionType == 1) {
          this.statisticsIndexs = ['isSingleHold', 'isAcctInfo'] // 账户类型默认2个指标
        } else {
          this.statisticsIndexs = []
        }
      },
      clearStatistics () { // 指标重置
        this.handleStatisticsService = { // 处理发给服务器端的统计指标数据
          isTradeBuyVol: '0',
          isTradeBuyAmt: '0',
          isTradeSellVol: '0',
          isTradeSellAmt: '0',
          isNetBuySellVol: '0',
          isNetBuySellAmt: '0',
          isTradeAcctCnt: '0',
          isOrderBuyVol: '0',
          isOrderBuyAmt: '0',
          isOrderSellVol: '0',
          isOrderSellAmt: '0',
          isMaxHold: '0',
          isBeforeHold: '0',
          isStartHold: '0',
          isEndHold: '0',
          isCurrDayHold: '0',
          isSingleHold: '0',
          isAcctInfo: '0'
        }
      },
      getStockCode (...rest) {
        if(rest[0].length > 0) {
          this.formData.secCode = rest[0].split(' ')[0]
        } else {
          this.formData.secCode = ''
        }
        // A股，B股【BSH】
        rest[3] === 'ASH' ? this.ASH = true : this.ASH = false
      },
      handleReqParams() {
        let context = {
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
          secCode: this.commonData.stockCode.split(' ')[0],
          dimenType: this.dimensionType,
          isDayCalc: this.isDayCalculation ? '1' : '0',
          isDrillDetail: this.isDrillDetail ? '1' : '0',
          isDrillMem: '0', // 判断是否须按会员钻取
          memCode: '', // 钻取时传入的“会员代码”
          isDrillBranch: '0', // 判断是否须按营业部钻取
          branchCode: '', // 钻取时传入的“营业部代码”
          isDrillPbu: '0', // 判断是否须按PBU钻取
          pbuId: '', // 钻取时传入的“PBU代码”
          isDrillAcct: '0', // 判断是否须按账户钻取
          acctId: '', // 钻取时传入的“账户代码”
          ASH: this.ASH, // 证券代码是否是A股
        }
        // 统计指标处理
        let compareColumnStatistics = []
        this.clearStatistics()
        this.statisticsIndexs.map((item) => {
          this.statisticsIndexOptions.map((val) => {
            if (val.value == item) {
              this.handleStatisticsService[item] = '1'
              compareColumnStatistics.push(val.label)
            }
          })
        })

        context.startDate = moment(context.startDate).format('YYYY-MM-DD')
        context.endDate = moment(context.endDate).format('YYYY-MM-DD')
        this.drillingParams = Object.assign(context, this.handleStatisticsService)
        return compareColumnStatistics // 处理表头，根据用户选择的指标不同展示不同表头
      },
      handleSearchDimen () {
        let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
        let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
        if (sDate > eDate + 60 * 60 * 1000) {
          this.$message.error('开始日期不得大于结束日期')
          return
        }
        this.$refs['dimensionMainPage'].validate((valid) => {
          if (valid) {
            let compareColumnStatistics = this.handleReqParams()
            this.$refs['dimensionTableHeader'].handleSearch(1, compareColumnStatistics, this.drillingParams)
          }
        })
      },
      handleDownload () { // 下载
        this.$refs['dimensionTableHeader'].handleDownload(this.exportRadio, this.exportCount)
      }
    }
  }
</script>

<style lang='less'>
  .dimension-query-container-s {
    .statistics-style{
      .el-form-item {
        width: 90%;
        .el-form-item__content {
          width: 91%;
        }
      }
      .dimension-type-tips {
        line-height: 30px;
        margin-left: 10px;
        display: inline-block;
        margin-top: 6px;
      }
    }
    .dimension-query-area-s {
      .dimension-export-btn {
        margin-bottom: 10px;
        line-height: 30px;
        input {
          outline: none;
          background-color: transparent;
          border: 1px solid #455579;
          color: #aec0e6;
          width: 45px;
          height: 25px;
          border-radius: 3px;
          margin: 0 4px;
          padding-left: 5px;
        }
        .el-radio-group {
          .el-radio {
            .is-checked {
              overflow: visible;
            }
          }
        }
      }
    }
  }
</style>
