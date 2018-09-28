/*
 import {
 getLineChartSelected
 } from '../../../service/marketSupervise'
 */
/* import {
 showBrushTooltip
 } from ’../../../utils/charts/lineChart‘ */
import * as types from '../../mutation-types'
import moment from 'moment'

moment.locale('zh-cn')
export default {
  state: {
    chartName: 'stockLineChart',
    currentType: 'index', // 当前选中数据来源 index: 指数, board: 板块, stock: 个股
    currentIndexCode: '000001', // 当前指数代码
    currentBoardCode: '', // 当前板块代码, 可多选
    currentStockCode: '', // 当前个股代码, 可多选
    boardType: 'board-sw' // 板块类型 board-sw：“申万行业”；board-wd:“万得概念”; board-cus:“3G自定义”
  },
  getters: {
    getCurrentIndexCode: state => {
      return state.currentIndexCode
    },
    getCurrentBoardCode: state => {
      return state.currentBoardCode
    },
    getCurrentStockCode: state => {
      return state.currentStockCode
    },
    getCurrentCode: (state) => {
      if (state.currentType === 'index') {
        return state.currentIndexCode
      } else if (state.currentType === 'board') {
        return state.currentBoardCode
      } else if (state.currentType === 'stock') {
        return state.currentStockCode
      }
      return ''
    },
    getMarketOverviewTimeLineParams: state => {
      let currentCode = ''
      if (state.currentType === 'index') {
        currentCode = state.currentIndexCode
      } else if (state.currentType === 'board') {
        currentCode = state.currentBoardCode
      } else if (state.currentType === 'stock') {
        currentCode = state.currentStockCode
      }
      return {
        codeType: state.currentType,
        code: currentCode,
        trdDate: '',
        startTime: '0930',
        endTime: '1500'
      }
    },
    getMarketOverviewDayLineParams: state => {
      let currentCode = ''
      let codeType = state.currentType
      if (state.currentType === 'index') {
        currentCode = state.currentIndexCode
      } else if (state.currentType === 'board') {
        currentCode = state.currentBoardCode
        codeType = state.boardType
      } else if (state.currentType === 'stock') {
        currentCode = state.currentStockCode
      }
      return {
        market: 'sh1',
        code: currentCode,
        codeType: codeType,
        candleStyle: 'D',
        startDate: null,
        endDate: null
      }
    },
    getBoardParams: state => {
      return {
        market: 'sh1',
        groupType: 'index',
        groupCodes: state.currentIndexCode,
        codeType: state.boardType,
        trdDate: '',
        startTime: '0930',
        endTime: '1500'
      }
    },
    getMarketOverviewStockParams: state => {
      return {
        type: 'time',
        market: 'sh1',
        codeType: 'stock',
        boardCodeList: state.currentBoardCode,
        indexCode: state.currentIndexCode,
        trdDate: '',
        startTime: '0930',
        endTime: '1500',
        secCodes: '',
        orderField: 'increase_range',
        orderType: 'desc',
        rowStart: 1,
        rowNum: 10
      }
    },
    getStockLineParams: state => {
      // TODO 市场概览分时图添加日期参数
      let params = ''
      if (state.currentType === 'index') {
        params = 'indexCode=' + state.currentIndexCode + '&boardCode=&stockCode='
      } else if (state.currentType === 'board') {
        params = 'indexCode=&boardCode=' + state.currentBoardCode + '&stockCode='
      } else if (state.currentType === 'stock') {
        params = 'indexCode=&boardCode=&stockCode=' + state.currentStockCode
      }
      return params
    },
    getStockRiseFallParams: state => {
      let params = {}
      if (state.currentType === 'index') {
        params = {
          indexCode: state.currentIndexCode
        }
      } else if (state.currentType === 'board') {
        params = {
          boardCodeList: state.currentBoardCode
        }
      }
      return params
    }
  },
  mutations: {
    [types.O_CHANGE_CHART_NAME] (state, name) {
      state.chartName = name
    },
    [types.O_CHANGE_CURRENT_TYPE] (state, type) {
      state.currentType = type
    },
    [types.O_CHANGE_INDEX_CODE] (state, code) {
      state.currentIndexCode = code
    },
    [types.O_CHANGE_BOARD_CODE] (state, code) {
      state.currentBoardCode = code
    },
    [types.O_CHANGE_STOCK_CODE] (state, code) {
      state.currentStockCode = code
    },
    [types.O_BOARD_TYPE] (state, type) {
      state.boardType = type
    }
  },
  actions: {
    // 分时图框选
    //    lineBrushTooltip(store, params) {
    //      let param = 'stockCode=' + store.state.currentStockCode + '&startTime=' + moment(params[0]).format("HHmm") + '&endTime=' + moment(params[1]).format("HHmm");
    //      getLineChartSelected(param).then(resp => {
    //        store.commit(types.CHART_SELECTED_TOOLTIP, resp.selectedTime);
    //        showBrushTooltip(store);
    //      });
    //    }
  }
}
