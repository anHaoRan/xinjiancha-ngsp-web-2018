import { downloadInvestor } from '../../../service/marketSupervise/classifiedInvestorMonitoring'
import * as types from '../../mutation-types'
import { changeLineBrush } from '../../../utils/charts/lineChart'
// import {changeCandlestickBrush} from '../../../utils/charts/candlestickChart'
import moment from 'moment'

moment.locale('zh-cn')

export default {
  state: {
    indexCodeOptions: [
      {
        value: '000001',
        label: '上证综指'
      }, {
        value: '000300',
        label: '沪深300'
      }, {
        value: '399006',
        label: '创业板指'
      }, {
        value: '399005',
        label: '中小板指'
      }, {
        value: '000016',
        label: '上证50'
      }, {
        value: '000010',
        label: '上证180'
      }, {
        value: '000009',
        label: '上证380'
      }, {
        value: '000905',
        label: '中证500'
      }],
    currentIndexCode: '000001',
    chartName: 'MonitorTime',
    isBrush: false,
    tradeDate: '', // moment(new Date()).format('YYYYMMDD'), // 分时图-日期
    startTime: new Date(2017, 11, 18, 9, 30), // 分时图-开始时间
    endTime: new Date(2017, 11, 18, 15, 0), // 分时图-结束时间
    startDate: '', // 日K图-开始日期
    endDate: '', // 日K图-结束日期
    liquidityMonitor: false, // 实时流动性监测
    deviationRate: false, // 大小盘乖离率
    investorType: '0',
    investors: '',
    accountOrBranch: 'account',
    chooseAccount: '',
    chooseBranch: '',
    orderField: '',
    orderType: '',
    swOrderField: '',
    swOrderType: '',
    wdOrderField: '',
    wdOrderType: '',
    cusOrderField: '',
    cusOrderType: '',
    stockOrderField: '',
    stockOrderType: ''
  },
  getters: {
    getChartName: state => {
      return state.chartName
    },
    getTimeRange: state => {
      return [state.startTime, state.endTime]
    },
    getDateRange: state => {
      return [state.startDate, state.endDate]
    },
    getInvestorType: state => {
      return state.investorType
    },
    getTradeDate: state => {
      return state.tradeDate
    },
    getInvestors: state => {
      return state.investors
    },
    getAccountOrBranch: state => {
      return state.accountOrBranch
    },
    getChooseAccount: state => {
      return state.chooseAccount
    },
    getChooseBranch: state => {
      return state.chooseBranch
    },
    getIndustryTimeLineParams: state => {
      return {
        codeType: 'index',
        code: state.currentIndexCode,
        trdDate: state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'),
        startTime: '0930',
        endTime: '1500'
      }
    },
    getIndustryDayLineParams: state => {
      return {
        market: 'sh1',
        code: state.currentIndexCode,
        codeType: 'index',
        candleStyle: 'D',
        startDate: '',
        endDate: ''
      }
    },
    getIndustryParams: state => {
      let params = {
        'type': state.isBrush ? 'day' : 'time', // time分时 day日K
        'indexCode': state.currentIndexCode, // 指数代码
        'tradeDate': state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'), // 分时参数 某一天日期
        'startTime': state.startTime === '' ? '' : moment(state.startTime).format('HHmm'), // 分时参数 开始时间
        'endTime': state.endTime === '' ? '' : moment(state.endTime).format('HHmm'), // 分时参数 结束时间
        'startDate': state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'), // 日K参数 开始日期
        'endDate': state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD') // 日K参数 结束日期
      }
      return JSON.stringify(params)
    },
    getAccountParams: state => {
      let params = {
        'type': state.isBrush ? 'day' : 'time', // time分时 day日K
        'indexCode': state.currentIndexCode, // 指数代码
        'tradeDate': state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'), // 分时参数 某一天
        'startTime': state.startTime === '' ? '' : moment(state.startTime).format('HHmm'), // 分时参数 开始时间
        'endTime': state.endTime === '' ? '' : moment(state.endTime).format('HHmm'), // 分时参数 结束时间
        'startDate': state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'), // 日K参数 开始日期
        'endDate': state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD'), // 日K参数 结束日期
        'orderField': state.orderField, // 表格排序字段
        'orderType': state.orderType, // 排序规则 desc降序  asc升序
        'investorType': state.investorType, // 1表示 自定义投资者,其他为分类投资者
        'investors': state.investors, // 投资者名称,多个用逗号分隔
        'gridType': '', // 需求变更,新加参数,查营业部表格用该参数,查账户表格,该参数可空可无
        'rowStart': 1,
        'rowNum': 10
      }
      return JSON.stringify(params)
    },
    getIndustryBlockParams: state => {
      return {
        'type': state.isBrush ? 'day' : 'time', // time分时 day日K
        'indexCode': state.currentIndexCode, // 指数代码
        'tradeDate': state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'), // 分时参数 某一天
        'startTime': state.startTime === '' ? '' : moment(state.startTime).format('HHmm'), // 分时参数 开始时间
        'endTime': state.endTime === '' ? '' : moment(state.endTime).format('HHmm'), // 分时参数 结束时间
        'startDate': state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'), // 日K参数 开始日期
        'endDate': state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD'), //  结束日期
        'investorType': state.investorType, // 1表示 自定义投资者,其他为分类投资者
        'swOrderField': state.swOrderField, // 行业板块排序字段 ,如果点击概念板块排序,该字段为wdOrderField,自定义板块:cusOrderField,个股:stockOrderField
        'swOrderType': state.swOrderType, // asc 行业排序方式,如果点击概念板块,该字段为wdOrderType,自定义板块:cusOrderType,个股：stockOrderType
        'wdOrderField': state.wdOrderField,
        'wdOrderType': state.wdOrderType,
        'cusOrderField': state.cusOrderField,
        'cusOrderType': state.cusOrderType,
        'stockOrderField': state.stockOrderField,
        'stockOrderType': state.stockOrderType,
        'investors': state.investors, // 投资者名称,多个用逗号分隔
        'invacctNos': state.chooseAccount, // 账户代码,多个用逗号分隔
        'pageIndex': '1', // 当vocType=stock时,股票数据使用分页,pageIndex表示第几页。一页多少条后台配置
        'isBranch': state.accountOrBranch === 'account' ? '' : 'Y', // 营业部页面时,需要该参数
        'brnids': state.accountOrBranch === 'account' ? '' : state.chooseBranch // 营业部页面,选择的营业部
      }
    }
  },
  mutations: {
    [types.C_CHART_NAME] (state, chartName) {
      state.chartName = chartName
    },
    [types.C_CHANGE_INDEX_CODE] (state, indexCode) {
      state.currentIndexCode = indexCode
    },
    [types.C_IS_BRUSH] (state, isBrush) {
      state.isBrush = isBrush
    },
    [types.C_CHANGE_TRADE_DATE] (state, tradeDate) {
      state.tradeDate = tradeDate === null ? '' : tradeDate
    },
    [types.C_CHANGE_TIME_RANGE] (state, time) {
      if (time !== null) {
        let timeData = [moment(time[0]).format('HH:mm'), moment(time[1]).format('HH:mm')]
        if (timeData[0] < '09:30') {
          state.startTime = new Date(2018, 1, 1, 9, 30)
        } else if (timeData[0] > '11:30' && timeData[0] <= '13:00') {
          state.startTime = new Date(2018, 1, 1, 13, 1)
        } else {
          state.startTime = time[0]
        }
        if (timeData[1] > '11:30' && timeData[1] <= '13:00') {
          state.endTime = new Date(2018, 1, 1, 13, 1)
        } else if (timeData[1] > '15:00') {
          state.endTime = new Date(2018, 1, 1, 15, 0)
        } else {
          state.endTime = time[1]
        }
      } else {
        state.startTime = ''
        state.endTime = ''
      }
    },
    [types.C_CHANGE_DATE_RANGE] (state, dates) {
      if (dates != null && dates[0] !== '') {
        state.isBrush = true
        state.startDate = dates[0]
        state.endDate = dates[1]
      } else {
        state.isBrush = false
        state.startDate = ''
        state.endDate = ''
      }
    },
    [types.C_LIQUIDITY_MONITOR] (state, or) {
      state.liquidityMonitor = or
    },
    [types.C_DEVIATION_RATE] (state, or) {
      state.deviationRate = or
    },
    [types.C_INVESTOR_TYPE] (state, data) {
      state.investorType = data
    },
    [types.C_INVESTORS] (state, data) {
      state.investors = data
    },
    [types.C_ACCOUNT_OR_BRANCH] (state, data) {
      state.accountOrBranch = data
    },
    [types.C_CHOOSE_ACCOUNT] (state, data) {
      state.chooseAccount = data
    },
    [types.C_CHOOSE_BRANCH] (state, data) {
      state.chooseBranch = data
    },
    [types.C_ORDER_FIELD] (state, field) {
      state.orderField = field
    },
    [types.C_ORDER_TYPE] (state, type) {
      state.orderType = type
    },
    [types.C_SW_ORDER_FIELD] (state, field) {
      state.swOrderField = field
    },
    [types.C_SW_ORDER_TYPE] (state, type) {
      state.swOrderType = type
    },
    [types.C_WD_ORDER_FIELD] (state, field) {
      state.wdOrderField = field
    },
    [types.C_WD_ORDER_TYPE] (state, type) {
      state.wdOrderType = type
    },
    [types.C_CUS_ORDER_FIELD] (state, field) {
      state.cusOrderField = field
    },
    [types.C_CUS_ORDER_TYPE] (state, type) {
      state.cusOrderType = type
    },
    [types.C_STOCK_ORDER_FIELD] (state, field) {
      state.stockOrderField = field
    },
    [types.C_STOCK_ORDER_TYPE] (state, type) {
      state.stockOrderType = type
    }
  },
  actions: {

    // 根据时间选择微调框选
    investorMonitoringChangeBrush (store) {
      changeLineBrush('MonitorTime', store)
    },

    // 框选微调触发联动
    investorMonitoringChangeData (store, changeData) {
      store.commit(types.C_CHANGE_TIME_RANGE, changeData)
    },

    // 分类投资者 账户 板块按条件下载数据
    downloadInvestorData (store, data) {
      let params = {
        'type': store.state.isBrush ? 'day' : 'time',
        'indexCode': store.state.currentIndexCode,
        'gridType': data[0], // investor: 表示分类表格 account: 表示账户表格 vocStock: 行业个股表格
        'investorType': store.state.investorType, // 0: 分类投资者 1: 自定义分类投资者
        'investors': store.state.investors, // 类别名称 多个用逗号分隔
        'orderField': store.state.orderField,
        'orderType': store.state.orderType,
        'invacctNos': store.state.chooseAccount, // 账户代码 多个用逗号分隔
        'swOrderField': store.state.swOrderField,
        'swOrderType': store.state.swOrderType,
        'wdOrderField': store.state.wdOrderField,
        'wdOrderType': store.state.wdOrderType,
        'cusOrderField': store.state.cusOrderField,
        'cusOrderType': store.state.cusOrderType,
        'stockOrderField': store.state.stockOrderField,
        'stockOrderType': store.state.stockOrderType,
        'tableColumns': data[1]
      }
      if (store.state.isBrush) {
        params.startDate = store.state.startDate === '' ? '' : moment(store.state.startDate).format('YYYYMMDD')
        params.endDate = store.state.endDate === '' ? '' : moment(store.state.endDate).format('YYYYMMDD')
      } else {
        params.tradeDate = store.state.tradeDate === '' ? '' : moment(store.state.tradeDate).format('YYYYMMDD')
        params.startTime = store.state.startTime === '' ? '' : moment(store.state.startTime).format('HHmm')
        params.endTime = store.state.endTime === '' ? '' : moment(store.state.endTime).format('HHmm')
      }
      downloadInvestor(params)
    }
  }
}
