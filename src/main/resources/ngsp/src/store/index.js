import Vue from 'vue'
import Vuex from 'vuex'
import customPlateSettingModule from './modules/customPlateSetting'
import accountGroupSettingModule from './modules/accountGroupSetting'
import sidebarModule from './modules/home/sidebarModule'
import homepageModule from './modules/home/homepageModule'
import marketSuperviseModule from './modules/marketSupervise/marketSuperviseModule'
import marketOverviewModule from './modules/marketSupervise/marketOverviewModule'
import investorMonitoringModule from './modules/marketSupervise/investorMonitoringModule'
import insiderTradAnalysisModule from './modules/analysisTool/insiderTradAnalysis' // 内幕交易分析
import accountBehaviorTracking from './modules/analysisTool/accountBehaviorTracking'
import participatorTypeSetModule from './modules/analysisTool/participatorTypeSet'
import operationMonitorWarnModule from './modules/marketSupervise/operationMonitorWarn'
import highQueryModule from './modules/marketSupervise/highQuery'
import realTimeMonitorAnalysisTollModule from './modules/analysisTool/realTimeMonitorAnalysisToll'
import ManipulationAutomationScreening from './modules/ManipulationAutomationScreening/Index' // 操纵初筛
import ManipulateAnalysisList from './modules/ManipulateAnalysisList/Index' // 操纵分析列表
import MarginTrading from './modules/MarginTrading/Index' // 融资融券
import stockConnectSH from './modules/analysisTool/stockConnectSH' // 沪股通
import productQuery from './modules/analysisTool/productQuery' // 产品查询
import superviseTask from './modules/superviseTask' // 监察任务
import { getLocalStore } from './../utils/storageUtil'
import * as types from './mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    accountGroupSetting: accountGroupSettingModule,
    customPlateSetting: customPlateSettingModule,
    sidebar: sidebarModule,
    homepage: homepageModule,
    marketSupervise: marketSuperviseModule,
    marketOverview: marketOverviewModule,
    investorMonitoring: investorMonitoringModule,
    insiderTradAnalysis: insiderTradAnalysisModule,
    accountBehaviorTracking: accountBehaviorTracking,
    participatorTypeSet: participatorTypeSetModule,
    operationMonitorWarn: operationMonitorWarnModule,
    highQuery: highQueryModule,
    realTimeMonitorAnalysisToll: realTimeMonitorAnalysisTollModule,
    ManipulationAutomationScreening: ManipulationAutomationScreening,
    ManipulateAnalysisList: ManipulateAnalysisList,
    MarginTrading: MarginTrading,
    stockConnectSH: stockConnectSH,
    productQuery:productQuery,
    superviseTask: superviseTask
  },
  state: {
    refreshTime: 0,
    isLargeSidebar: false,
    quickMenu: JSON.parse(getLocalStore('quickMenu')),
    theme: 'dark',
    currentModule: '', // 当前使用charts的模块
    chartSelectedTooltip: '', // 图表框选提示
    alwaysShow: true,
    fullLoadingText: '数据加载中，请耐心等待...',
    fullLoading: false
  },
  getters: {
    getBrushActionName: (state) => {
      if (state.currentModule === 'marketOverview') { // 市场概览
        return 'lineBrushTooltip'
      } else if (state.currentModule === 'marketSupervise') { // 证券运行监测
        return 'marketSuperviseChangeData'
      } else if (state.currentModule === 'investorMonitoring') { // 分类投资者监测
        return 'investorMonitoringChangeData'
      }
      return ''
    }
  },
  mutations: {
    toggleSidebar: (state) => {
      state.isLargeSidebar = !state.isLargeSidebar
    },
    [types.CURRENT_MODULE] (state, moduleName) {
      state.currentModule = moduleName
    },
    [types.CHART_SELECTED_TOOLTIP] (state, tooltip) {
      state.chartSelectedTooltip = tooltip
    },
    [types.ALWAYS_SHOW] (state, always) {
      state.alwaysShow = always
    },
    setFullLoading(state, value) {
      state.fullLoading = value
    },
    setFullLoadingText(state, value) {
      state.fullLoadingText = value
    }
  },
  actions: {
    /*
     * 公共分时图十字框选事件分发
     * @ param store
     * @ param params 返回处理数据
     */
    lineChartBrushSelectedAction (store, params) {
      store.dispatch(store.getters.getBrushActionName, params)
    },
    /*
     * 公共K线图十字框选事件分发
     * @ param store
     * @ param params 返回处理数据
     */
    candlestickBrushSelectedAction (store, params) {
      store.dispatch(store.getters.getBrushActionName, params)
    }
  }
})

export default store
