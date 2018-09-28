const analysisToolRouter = {
  path: '/analysisTool',
  name: 'analysisTool',
  component: function (resolve) {
    require(['@/router/analysisTool/index.vue'], resolve)
  },
  children: [
    {
      path: '/orderGearIndexQuery',
      name: 'orderGearIndexQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/orderGearIndexQuery'], resolve)
      }
    },
    {
      path: '/secAccTrade',
      name: 'secAccTrade',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/secAccTrade'], resolve)
      }
    },
    {
      path: '/branchTradeTopN', // 营业部交易前N名
      name: 'branchTradeTopN',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/branchTradeTopN'], resolve)
      }
    },
    {
      path: '/dimensionQuery', // 维度信息查询
      name: 'dimensionQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/dimensionQuery'], resolve)
      }
    },
    {
      path: '/drillQuery',
      name: 'drillQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/drillQuery'], resolve)
      }
    },
    {
      path: '/stockTradeQuery',
      name: 'stockTradeQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/stockTradeQuery'], resolve)
      }
    },
    {
      path: '/stockPositionQuery',
      name: 'stockPositionQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/stockPositionQuery'], resolve)
      }
    },
    {
      path: '/HKStocksThroughAssistQuery', // 港股通协查
      name: 'HKStocksThroughAssistQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/HKStocksThroughAssistQuery'], resolve)
      }
    },
    {
      path: '/accountBehaviorTrack',
      name: 'accountBehaviorTrack',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/accountBehaviorTrack'], resolve)
      }
    },
    {
      path: '/tradeBranchChange', // 交易营业部变更查询
      name: 'tradeBranchChange',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/tradeBranchChange'], resolve)
      }
    },
    {
      path: '/shstassistQuery', // 沪股通协查
      name: 'shstassistQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/shstassistQuery'], resolve)
      }
    },
    {
      path: '/bigDealTradeQuery', // 大宗交易
      name: 'bigDealTradeQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/bigDealTradeQuery'], resolve)
      }
    },
    {
      path: '/tradingVolumeTOPN', // 交易量N(TOPN)以上账户
      name: 'tradingVolumeTOPN',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/tradingVolumeTOPN'], resolve)
      }
    },
    {
      path: '/holdingsVolumeTOPN', // 持有N(TOPN)以上账户
      name: 'holdingsVolumeTOPN',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/holdingsVolumeTOPN'], resolve)
      }
    },
    {
      path: '/acctSecHoldQuery', // 账户证券持仓情况
      name: 'acctSecHoldQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/acctSecHoldQuery'], resolve)
      }
    },
    {
      path: '/accountSecurityDeclare', // 账户证券申报情况
      name: 'accountSecurityDeclare',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/accountSecurityDeclare'], resolve)
      }
    },
    {
      path: '/fundReverseTransaction', // 基金反向交易查询
      name: 'fundReverseTransaction',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/fundReverseTransaction'], resolve)
      }
    },
    {
      path: '/accountOneYard', // 一码通
      name: 'accountOneYard',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/accountOneYard'], resolve)
      }
    },
    {
      path: '/abnormFluctuateAnalysis', // 市场异常波动
      name: 'abnormFluctuateAnalysis',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/abnormFluctuateAnalysis'], resolve)
      }
    },
    {
      path: '/equityConcentrationAnalysis', // 市场异常波动-股权集中度分析
      name: 'equityConcentrationAnalysis',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/equityConcentrationAnalysis'], resolve)
      }
    },
    {
      path: '/tradeReverseDetail', // 成交明细和对倒明细
      name: 'tradeReverseDetail',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/tradeReverseDetail'], resolve)
      }
    },
    {
      path: '/accountBehaviorTracking', // 账户行为追踪
      name: 'accountBehaviorTracking',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/accountBehaviorTracking'], resolve)
      }
    },
    {
      path: '/accountBookProfit', // 综合查询-账面盈利
      name: 'accountBookProfit',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/accountBookProfit'], resolve)
      }
    },
    {
      path: '/profitFIFOLIFO', // 综合查询-先进先出/后进先出
      name: 'profitFIFOLIFO',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/profitFIFOLIFO'], resolve)
      }
    },
    {
      path: '/suspiciousTargetAnalysis', // 综合查询-可疑对象分析
      name: 'suspiciousTargetAnalysis',
      component: function (resolve) {
        require(['@/components/analysisTool/complexQuery/suspiciousTargetAnalysis'], resolve)
      }
    },
    {
      path: '/profitMakingAccounts',
      name: 'profitMakingAccounts',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/profitMakingAccounts'], resolve)
      }
    },
    {
      path: '/tradeAccountMeasure', // 内幕交易账户数据测算
      name: 'tradeAccountMeasure',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/tradeAccountMeasure'], resolve)
      }
    },
    {

      path: '/insiderDealingIllegalGains', // 内幕交易违法所得
      name: 'insiderDealingIllegalGains',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/insiderDealingIllegalGains'], resolve)
      }
    },
    {
      path: '/accountHistoryInsiderTrading', // 账户历史内幕交易
      name: 'accountHistoryInsiderTrading',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/accountHistoryInsiderTrading'], resolve)
      }
    },
    {
      path: '/tradeTargetMeasure', // 内幕交易账户指标测算
      name: 'tradeTargetMeasure',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/tradeTargetMeasure'], resolve)
      }
    },
    {
      path: '/convergenceTradesOne', // 趋同交易模块一
      name: 'convergenceTradesOne',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/convergenceTradesOne'], resolve)
      }
    },
    {
      path: '/convergenceTradesTwo', // 趋同交易模块二
      name: 'convergenceTradesTwo',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/convergenceTradesTwo'], resolve)
      }
    },
    {
      path: '/manipulateIllegalIncome', // 市场操纵违法所得计算
      name: 'manipulateIllegalIncome',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/manipulateIllegalIncome'], resolve)
      }
    },
    {
      path: '/shortTradeRegularScreening', // 短线交易定期筛查
      name: 'shortTradeRegularScreening',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/shortTradeRegularScreening'], resolve)
      }
    },
    {
      path: '/orderConvergence', // 指令趋同
      name: 'orderConvergence',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/orderConvergence'], resolve)
      }
    },
    {
      path: '/participatorType', // 参与者查询
      name: 'participatorType',
      component: function (resolve) {
        require(['@/components/analysisTool/participatorType'], resolve)
      }
    },
    {
      path: '/overrunRepurchaseTransaction',
      name: 'overrunRepurchaseTransaction',
      component: function (resolve) {
        require(['@/components/analysisTool/customQuery/overrunRepurchaseTransaction'], resolve)
      }
    },
    {
      path: '/privatePlacement', // 私募季报
      name: 'privatePlacement',
      component: function (resolve) {
        require(['@/components/analysisTool/customQuery/privatePlacement'], resolve)
      }
    },
    {
      path: '/profitExchangeStatistics', // 收益互换统计
      name: 'profitExchangeStatistics',
      component: function (resolve) {
        require(['@/components/analysisTool/customQuery/profitExchangeStatistics'], resolve)
      }
    },
    {
      path: '/virtualTransaction', // 集合竞价虚拟交易
      name: 'virtualTransaction',
      component: function (resolve) {
        require(['@/components/analysisTool/customQuery/virtualTransaction'], resolve)
      }
    },
    {
      path: '/marketStatistics', // 市场统计查询
      name: 'marketStatistics',
      component: function (resolve) {
        require(['@/components/analysisTool/marketStatistics'], resolve)
      }
    },
    {
      path: '/productQuery', //  产品查询
      name: 'productQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/productQueryTabs'], resolve)
      }
    },
    {
      path: '/moreStockWithColumn',
      name: 'moreStockWithColumn', //  多股同列
      component: function (resolve) {
        require(['@/components/analysisTool/moreStockWithColumn'], resolve)
      }
    },
    {
      path: '/fixedIncomeQuery',
      name: 'fixedIncomeQuery', // 固定收益平台查询
      component: function (resolve) {
        require(['@/components/analysisTool/fixedIncomeQuery'], resolve)
      }
    },
    {
      path: '/precedenceStockQuery',
      name: 'precedenceStockQuery', // 优先股查询
      component: function (resolve) {
        require(['@/components/analysisTool/precedenceStockQuery'], resolve)
      }
    },
    {
      path: '/insiderTradAnalysis', // 内幕交易分析
      name: 'insiderTradAnalysis',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysis'], resolve)
      }
    },
    {
      path: '/insiderTradAnalysisParams',
      name: 'insiderTradAnalysisParams',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysis/insiderTradAnalysisParams'], resolve)
      }
    },
    {
      path: '/macroAnalysisRes',
      name: 'macroAnalysisRes',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysis/macroAnalysisRes'], resolve)
      }
    },
    {
      path: '/insiderTradAccountAnalysis',
      name: 'insiderTradAccountAnalysis',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysis/insiderTradAccountAnalysis'], resolve)
      }
    },
    {
      path: '/completeTheReview', // 完成复核  复核ID
      name: 'completeTheReview',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysis/completeTheReview/Index'], resolve)
      }
    },
    {
      path: '/stockIndexFutures',
      name: 'stockIndexFutures',
      component: function (resolve) {
        require(['@/components/analysisTool/stockIndexFutures'], resolve)
      }
    },
    {
      path: '/securitiesMarginTrading',
      name: 'securitiesMarginTrading',
      component: function (resolve) {
        require(['@/components/analysisTool/MarginTrading/Index'], resolve)
      }
    },
    {
      path: '/stockConnectSH',
      name: 'stockConnectSH',
      component: function (resolve) {
        require(['@/components/analysisTool/stockConnectSH'], resolve)
      }
    },
    {
      path: '/realTimeMonitorAnalysisToll',
      name: 'realTimeMonitorAnalysisToll',
      component: function (resolve) {
        require(['@/components/analysisTool/realTimeMonitorAnalysisToll'], resolve)
      }
    },
    {
      path: '/standardDataInvestigation', // 标准化数据协查
      name: 'standardDataInvestigation',
      component: function (resolve) {
        require(['@/components/analysisTool/standardDataInvestigation'], resolve)
      }
    },
    {
      path: '/dataInvesBigData', // 标准化数据协查（大数据迁移）
      name: 'dataInvesBigData',
      component: function (resolve) {
        require(['@/components/analysisTool/dataInvesBigData'], resolve)
      }
    },
    {
      path: '/manipulationAutomationScreening/:params', // 操纵分析账户初筛
      name: 'manipulationAutomationScreening',
      component: function (resolve) {
        require(['@/components/analysisTool/ManipulationAutomationScreening/Index'], resolve)
      }
    },
    {
      path: '/manipulateAnalysisList/:params', // 操纵分析列表
      name: 'manipulateAnalysisList',
      component: function (resolve) {
        require(['@/components/analysisTool/ManipulateAnalysisList/Index'], resolve)
      }
    },
    {
      path: '/manipulateTaskList', // 操纵任务列表
      name: 'manipulateTaskList',
      component: function (resolve) {
        require(['@/components/analysisTool/manipulateTaskList/index'], resolve)
      }
    },
    {
      path: '/reportQuery',
      name: 'reportQuery',
      component: function (resolve) {
        require(['@/components/analysisTool/reportQuery'], resolve)
      }
    },
    {
      path: '/reportDispose',
      name: 'reportDispose',
      component: function (resolve) {
        require(['@/components/analysisTool/reportDispose'], resolve)
      }
    },
    // start 大数据-内幕交易
    {
      path: '/insiderTradAnalysisBig', // 内幕交易分析
      name: 'insiderTradAnalysisBig',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysisBig'], resolve)
      }
    },
    {
      path: '/insiderTradAnalysisParamsBig',
      name: 'insiderTradAnalysisParamsBig',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysisBig/insiderTradAnalysisParams'], resolve)
      }
    },
    {
      path: '/insiderTradAccountAnalysisBig',
      name: 'insiderTradAccountAnalysisBig',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysisBig/insiderTradAccountAnalysis'], resolve)
      }
    },
    {
      path: '/completeTheReviewBig/:taskId', // 完成复核  复核ID
        name: 'completeTheReviewBig',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysisBig/completeTheReview/Index'], resolve)
      }
    },
    {
      path: '/macroAnalysisResBig',
      name: 'macroAnalysisResBig',
      component: function (resolve) {
        require(['@/components/analysisTool/insiderTradAnalysisBig/macroAnalysisRes'], resolve)
      }
    },
    {
      path: '/keyMonitorSecurity', // 分析工具-特定分析工具-重点监控证券
      name: 'keyMonitorSecurity',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/keyMonitorSecurity'], resolve)
      }
    },
    {
      path: '/keyMonitorAccounts', // 分析工具-特定分析工具-重点监控账户
      name: 'keyMonitorAccounts',
      component: function (resolve) {
        require(['@/components/analysisTool/specificTool/keyMonitorAccounts'], resolve)
      }
    }
    // end 大数据-内幕交易
  ]
}
export default analysisToolRouter
