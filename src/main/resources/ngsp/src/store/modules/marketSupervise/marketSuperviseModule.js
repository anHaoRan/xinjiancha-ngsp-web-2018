// import Vue from 'vue'
import * as types from '../../mutation-types'
// import {changeLineBrush} from '../../../utils/charts/lineChart'
import { downloadStock } from '../../../service/marketSupervise/stockOperationMonitor'
import moment from 'moment'

moment.locale('zh-cn')
export default {
  state: {
    currentIndexCode: '000001',
    isBrush: false,
    tradeDate: '', // 分时图-日期
    startTime: new Date(2017, 11, 18, 9, 30), // 分时图-开始时间
    endTime: new Date(2017, 11, 18, 15, 0), // 分时图-结束时间
    startDate: '', // 日K图-开始日期
    endDate: '', // 日K图-结束日期
    codeType: 'board-sw', // board-sw表示审万行业, board-wd表示万德概念, board-cus表示自定义板块
    boardCodeList: '', // 选中的板块代码
    invesType: '', // inves表示分类投资者,cusInves表示自定义分类,account表示账户,branch表示营业部
    plateName: '',
    securityIds: '',
    isMonitorTableShow: true,
    liquidityMonitor: false, // 实时流动性监测
    deviationRate: false, // 大小盘乖离率
    codes: '', // 指数或股票
    swVocs: '', // 审万行业 板块代码
    wdVocs: '', // 万德概念 板块代码
    cusVocs: '' // 自定义板块 板块代码
  },
  getters: {
    getStockTimeRange: state => {
      return [state.startTime, state.endTime]
    },
    getStockDateRange: state => {
      return [state.startDate, state.endDate]
    },
    getStockTradeDate: state => {
      return state.tradeDate
    },
    getMarketTimeLineParams: state => {
      return {
        codeType: 'index',
        code: state.currentIndexCode,
        trdDate: state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'),
        startTime: '0930',
        endTime: '1500'
      }
    },
    getMarketDayLineParams: state => {
      return {
        market: 'sh1',
        code: state.currentIndexCode,
        codeType: 'index',
        candleStyle: 'D',
        startDate: state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'),
        endDate: state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD')
      }
    },
    getMonitorBlockParams: state => {
      if (state.isBrush && state.startDate !== '' && state.endDate !== '') {
        return {
          type: 'day',
          market: 'sh1',
          groupType: 'index',
          groupCodes: state.currentIndexCode,
          codeType: state.codeType,
          startDate: state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'),
          endDate: state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD')
        }
      }
      return {
        type: 'time',
        market: 'sh1',
        groupType: 'index',
        groupCodes: state.currentIndexCode,
        codeType: state.codeType,
        trdDate: state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'),
        startTime: state.startTime === '' ? '' : moment(state.startTime, 'HH-mm-ss').format('HHmm'),
        endTime: state.endTime === '' ? '' : moment(state.endTime, 'HH-mm-ss').format('HHmm')
      }
    },
    getMonitorBlockStockParams: state => {
      if (state.isBrush && state.startDate !== '' && state.endDate !== '') {
        return {
          type: 'day',
          market: 'sh1',
          codeType: 'stock',
          boardCodeList: state.boardCodeList,
          indexCode: state.currentIndexCode,
          startDate: state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'),
          endDate: state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD'),
          secCodes: '',
          orderField: 'rate',
          orderType: 'desc',
          rowStart: 1,
          rowNum: 10
        }
      }
      return {
        type: 'time',
        market: 'sh1',
        codeType: 'stock',
        boardCodeList: state.boardCodeList,
        indexCode: state.currentIndexCode,
        trdDate: state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'),
        startTime: state.startTime === '' ? '' : moment(state.startTime, 'HH-mm-ss').format('HHmm'),
        endTime: state.endTime === '' ? '' : moment(state.endTime, 'HH-mm-ss').format('HHmm'),
        secCodes: '',
        orderField: 'rate',
        orderType: 'desc',
        rowStart: 1,
        rowNum: 10
      }
    },
    getOperationIndustryBlockParams: state => {
      return {
        type: state.isBrush ? 'day' : 'time',
        indexCode: state.currentIndexCode,
        boardType: state.codeType,
        tradeDate: state.tradeDate === '' ? '' : moment(state.tradeDate).format('YYYYMMDD'), // 分时参数,表示某天的日期,为空时默认当前日期,
        startTime: state.startTime === '' ? '' : moment(state.startTime, 'HH-mm-ss').format('HHmm'),
        endTime: state.endTime === '' ? '' : moment(state.endTime, 'HH-mm-ss').format('HHmm'),
        startDate: state.startDate === '' ? '' : moment(state.startDate).format('YYYYMMDD'),
        endDate: state.endDate === '' ? '' : moment(state.endDate).format('YYYYMMDD')
      }
    },
    getPlateName: state => {
      return state.plateName
    },
    getBoardCodeList: state => {
      return state.boardCodeList
    },
    getCodeType: state => {
      return state.codeType
    },
    getSecurityIds: state => {
      return state.securityIds
    }
  },
  mutations: {
    [types.M_CHANGE_INDEX_CODE] (state, data) {
      state.currentIndexCode = data
    },
    [types.M_IS_BRUSH] (state, isBrush) {
      state.isBrush = isBrush
    },
    [types.M_CHANGE_TRADE_DATE] (state, tradeDate) {
      state.tradeDate = tradeDate === null ? '' : tradeDate
    },
    // time [HH:mm, HH:mm]
    [types.M_CHANGE_TIME_RANGE] (state, timeData) {
      let todayStr = new Date()
      if (timeData !== null) {
        timeData = [moment(timeData[0]).format('HH:mm'), moment(timeData[1]).format('HH:mm')]
        if (timeData[0] < '09:30') {
          state.startTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), 9, 30)
        } else if (timeData[0] > '11:30' && timeData[0] <= '13:00') {
          state.startTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), 13, 1)
        } else {
          state.startTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), timeData[0].split(':')[0], timeData[0].split(':')[1])
        }
        if (timeData[1] > '11:30' && timeData[1] <= '13:00') {
          state.endTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), 13, 1)
        } else if (timeData[1] > '15:00') {
          state.endTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), 15, 0)
        } else {
          state.endTime = new Date(todayStr.getFullYear(), todayStr.getMonth(), todayStr.getDay(), timeData[1].split(':')[0], timeData[1].split(':')[1])
        }
      } else {
        state.startTime = ''
        state.endTime = ''
      }
    },
    [types.M_CHANGE_DATE_RANGE] (state, dates) {
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
    [types.M_CODE_TYPE] (state, codeType) {
      state.codeType = codeType
    },
    [types.M_PLATE_NAME] (state, plateName) {
      state.plateName = plateName
    },
    [types.M_BOARD_CODE_LIST] (state, boardCodeList) {
      state.boardCodeList = boardCodeList
    },
    [types.M_SECURITY_IDS] (state, securityIds) {
      state.securityIds = securityIds
    },
    [types.M_LIQUIDITY_MONITOR] (state, or) {
      state.liquidityMonitor = or
    },
    [types.M_DEVIATION_RATE] (state, or) {
      state.deviationRate = or
    },
    [types.M_CODES] (state, codes) {
      state.codes = codes
    },
    [types.M_SWVOCS] (state, swVocs) {
      state.swVocs = swVocs
    },
    [types.M_WDVOCS] (state, wdVocs) {
      state.wdVocs = wdVocs
    },
    [types.M_CUSVOCS] (state, cusVocs) {
      state.cusVocs = cusVocs
    }
  },
  actions: {
    // 框选微调触发联动
    marketSuperviseChangeData (store, changeData) {
      store.commit(types.M_CHANGE_TIME_RANGE, changeData)
    },
    // 证券运行监测板块、个股、分类投资者、营业部、居前账户等按条件下载数据
    downloadStockData (store, data) {
      let startDate = store.state.startDate
      let params = {
        'gridType': data[0], // voc: 表示板块表格 stock: 表示个股表格 investor: 调试投资者表格
        'type': store.state.isBrush ? 'day' : 'time',
        'indexCode': store.state.currentIndexCode,
        'boardType': store.state.codeType, // 0: 分类投资者 1: 自定义分类投资者
        'plateName': store.state.plateName, // 类别名称 多个用逗号分隔
        'securityIds': store.state.securityIds,
        'orderField': data[2],
        'orderType': data[3],
        'tableColumns': data[1]
      }
      if (store.state.isBrush) {
        params.startDate = startDate === '' ? '' : moment(startDate).format('YYYYMMDD')
        params.endDate = store.state.endDate === '' ? '' : moment(store.state.endDate).format('YYYYMMDD')
      } else {
        params.tradeDate = startDate === '' ? '' : moment(startDate).format('YYYYMMDD')
        params.startTime = store.state.startTime === '' ? '' : moment(store.state.startTime).format('HHmm')
        params.endTime = store.state.endTime === '' ? '' : moment(store.state.endTime).format('HHmm')
      }
      downloadStock(params)
    }
  }
}
