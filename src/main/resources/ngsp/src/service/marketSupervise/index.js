import { get, post } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

/**
 * 市场运行监测 统一 分时图
 * @param {object} params 参数
 * @returns {*} list
 * @add 2018/06/25
 */
export function getMarketTimeLine (params) {
  return post(requestPrefix + '/fluct/quotation/v1/timeline', JSON.stringify(params))
}

/**
 * 市场运行监测 统一 K线图
 * @param {object} params 参数
 * @returns {*} list
 * @add 2018/06/25
 */
export function getMarketDayLine (params) {
  return post(requestPrefix + '/fluct/quotation/v1/kchart', JSON.stringify(params))
}

/**
 * 市场运行监测 统一 K线图框选
 * @param {object} params 参数
 * @returns {*} list
 * @add 2018/07/07
 */
export function getDayLineBrushed (params) {
  return post(requestPrefix + '/fluct/quotation/v1/kchart/range-select', JSON.stringify(params))
}

/**
 * 证券运行监测 板块及个股信息
 * @param {object} params 参数
 * @returns {*} list
 * @add 2018/06/30
 */
export function getMonitorStockApi (params) {
  return post(requestPrefix + '/fluct/quotation/v1/snap', JSON.stringify(params))
}

/**
 * 市场概览 - 快速统计报告
 * @param {object} params 参数
 * @returns {*} doc
 * @add 2018/07/20
 */
export function generateReport (params) {
  return get(requestPrefix + '/fluct/report/v1/generate-report', params)
}

// 获取沪市指数
export function getMainIndex () {
  return get(requestPrefix + '/fluct/market-overview/m1/latest-sh-stockindex?orderByParams=')
}

// 获取市场指数
export function getMarketIndex () {
  return get(requestPrefix + '/fluct/market-overview/v1/m1/market-index')
}

// 获取行业板块
export function getIndustryBlockStock (params) {
  return get(requestPrefix + '/fluct/market-overview/m3/stock-class-realtime?indexCode=' + params.indexCode + '&boardType=' + params.boardType)
}

// 获取个股
export function getIndividualStock (params) {
  return post(requestPrefix + '/fluct/market-overview/v1/realtime-stock', params)
}

// 获取市场概览股票分时图
export function getStockLineChart (params) {
  return get(requestPrefix + '/fluct/market-overview/v1/stock-or-index-realtime-chart?' + params + '&dltOrNot=0')
}

// 获取市场概览 内外盘差
export function getStockNetbuy (params) {
  return get(requestPrefix + '/fluct/market-overview/v1/stock-or-index-netbuy-realtime-chart?' + params + '&dltOrNot=0')
}

// 获取市场概览股票K线图
export function getStockKChart (params) {
  return get(requestPrefix + '/fluct/market-overview/v1/k-chart?' + params)
}

//  市场概览分时图框选显示tooltip
export function getStockSharingChartBrushed (params) {
  return get(requestPrefix + '/fluct/market-overview/v1/stock-or-index-realtime-chart-selected', params)
}

//  市场概览-指数或板块对应的涨跌数
export function getStockRiseFallInfo (params) {
  return post(requestPrefix + '/fluct/market-overview/v1/increase-num-and-decrease-num', params)
}

// 异常监测统计
export function getabnormolTransactionData (beginDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/get-trans-data?startDate=' + beginDate + '&endDate=' + endDate)
  //  return get(requestPrefix + url)
}

// 异常监测统计(维稳)STABILITYS
export function getStabilitysData (beginDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/supervision-statistics?startDate=' + beginDate + '&endDate=' + endDate)
}

// 获取波动振幅数据
export function getWaveData () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram')
}

// 证券运行监测时间段板块信息
export function getMonitorBlockStockApi (params) {
  return post(requestPrefix + '/fluct/index/v1/get-index-plate', params)
}

// 证券运行监测时间段个股信息
export function getMonitorIndividualStock (params) {
  return post(requestPrefix + '/fluct/operate-monitor/v1/get-index-product', params)
}

// 证券运行监测时间段投资者信息
export function getMonitorInvestorStock (params) {
  return post(requestPrefix + '/fluct/operate-monitor/v1/get-index-investor-account', params)
}

// 获取实时流动性监测数据
export function getRealTimeFlowLine (stockCode) {
  return get(requestPrefix + '/fluct/operate-monitor/get-liquidity-monitor?indexCode=' + stockCode)
}

// 获取每日乖离率走势数据
export function getDailyBiasTrend (startDate, endDate) {
  return get(requestPrefix + '/fluct/operate-monitor/get-deviation-rate?startDate=' + startDate + '&endDate=' + endDate)
}

// 获取市场活跃度地图数据
export function getTradeMap () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-region')
}

// 获取分类投资者交易监测初始化数据
export function getInitData () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/tab2/getCharts')
}

// 新接口
// 获取分类投资者成交统计所有图片数据
export function getAllChartsData () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/personalized-charts')
}

// 获取分类投资者成交统计个性化设置数据
export function postSetChartsData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/personalized-chartsetups', params)
}

// 获取分类投资者成交统计删除图片
export function postDeleteChartsData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/delete-personalized-chartsetup', params)
}

// 获取分类投资者成交统计图片修改数据
export function postChangeChartsData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/update-personalized-chartsetups', params)
}

// 获取分类投资者成交统计恢复默认设置
export function getResetData () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/reset-personalized-chartsetups')
}

// 获取分类投资者交易监测所有证券代码
export function getStockCode () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/get-index-vocation-stock')
}

// 获取分类投资者交易监测个性化生成数据
export function postPersonData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/tab2/OneUserChartSetUp', params)
}

// 传递分类投资者交易监测恢复默认的数据
export function getRestoreData () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/tab2/resetUserSet2DefaultCharts')
}

// 获取分类投资者交易监测全局设置的数据
export function postGlobalData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/tab2/updateAllUserCharts', params)
}

// 传递分类投资者交易监测删除的数据
export function postDeleteData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/tab2/deleteOneChart', params)
}

//  高级查询-获取机构类型
export function getInvestorTypeData (dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}

// 获取融资融券交易数据
export function getMarginTrading () {
  return get(requestPrefix + '/fluct/margin/postFluct')
}

// 获取融资融券实时统计监测数据
export function getCountMonitor () {
  return get(requestPrefix + '/fluct/margin-trading/v1/realtime-statistic-monitor')
}

// 获取融资融券证券投资者统计数据
export function postStockCount (params) {
  return post(requestPrefix + '/fluct/margin-trading/v1/securities-investor-statistic', params)
}

// 获取融资融券框选统计数据
export function getRegionData (indexCode, beginTime, endTime, trandat) {
  return get(requestPrefix + '/fluct/margin-trading/v1/region-quotation-chart?indexCode=' + indexCode + '&beginTime=' + beginTime + '&endTime=' + endTime + '&trandat=' + trandat)
}

// 获取融资融券折线图数据
export function getFinancingData (beginDate, endDate) {
  return get(requestPrefix + '/fluct/margin/monitorSys?beginDate=' + beginDate + '&endDate=' + endDate)
}

// 获取融资融券日内分时图数据
export function getIntradayChart (indexCode, beginTime, endTime, tranDat) {
  return get(requestPrefix + '/fluct/margin-trading/v1/realtime-quotation-chart?indexCode=' + indexCode + '&beginTime=' + beginTime + '&endTime=' + endTime + '&tranDat=' + tranDat)
}

// 获取融资融券跨日叠加图数据
export function getCrossChart (indexCode, beginDate, endDate) {
  return get(requestPrefix + '/fluct/margin-trading/v1/history-quotation-chart?indexCode=' + indexCode + '&beginDate=' + beginDate + '&endDate=' + endDate)
}

// 获取两融大股东盘中数据

export function getDgbSubhold (pageSize, pageIndex, orderField, orderType) {
  return get(requestPrefix + '/fluct/dgd-subhold/v1/subhold-realtime?pageSize=' + pageSize + '&pageIndex=' + pageIndex + '&orderField=' + orderField + '&orderType=' + orderType)
}

// 获取两融大股东历史数据
export function getHistoryCount (startDate, endDate) {
  return get(requestPrefix + '/fluct/dgd-subhold/v1/subhold-his?startDate=' + startDate + '&endDate=' + endDate)
}

// 获取两融大股东历史折线图数据
export function getHistoryLine (startDate, endDate) {
  return get(requestPrefix + '/fluct/dgd-subhold/v1/subholdhis-chart?startDate=' + startDate + '&endDate=' + endDate)
}

// 获取两融大股东历史明细数据
export function postHistoryDetail (params) {
  return post(requestPrefix + '/fluct/dgd-subhold/v1/subhold-hisdetail', params)
}

// 获取两融模糊查询股票代码
export function getStock (stock) {
  return get(requestPrefix + '/fluct/index/v1/all_stocks?stock=' + stock)
}

// 获取两融模糊查询一码通代码
export function getYmtStock (ymtStock) {
  return get(requestPrefix + '/fluct/index/v1/all_ymts?ymt=' + ymtStock)
}

// 获取程序化交易分时叠加图数据
export function postRoutinizationDealChart (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/index-overlay-algotrade-realtimechart', params)
}

// 获取程序化交易框选数据
export function postSelectData (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algo-realtime-selected', params)
}

// 获取程序化交易分类统计成交统计表格数据
export function postRoutinizationDealTable (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-trade-stat', params)
}

// 获取程序化交易分类统计申报统计表格数据
export function postRoutinizationDeclareTable (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-order-stat', params)
}

// 获取程序化交易分类统计申报统计表格占比数据
export function postRoutinizationDeclareProp (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-order-stat-prop', params)
}

// 获取账户统计成交统计表格数据
export function postAccountDealTable (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-trade-stat', params)
}

// 获取账户统计申报统计表格数据
export function postAccountDeclareTable (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-order-stat', params)
}

// 获取账户统计申报统计表格占比数据
export function postAccountDeclareProp (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-order-stat-prop', params)
}

// 获取账户统计成交统计买入折线图数据
export function postAccountBuyLine (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-trade-buy-prop-realtime', params)
}

// 获取账户统计成交统计卖出折线图数据
export function postAccountSaleLine (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-trade-sell-prop-realtime', params)
}

// 获取账户统计成交统计主动交易折线图数据
export function postAccountZdLine (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-trade-voluntary-prop-realtime', params)
}

// 获取账户统计成交统计饼图数据
export function postAccountPieLine (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/account-trade-chart-realtime', params)
}

// 获取程序化-分类成交统计饼图数据
export function postClassifyPieData (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-trade-chart-realtime', params)
}

// 获取程序化-分类成交统计买入折线图数据
export function postClassifyBuyData (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-trade-buy-prop-realtime', params)
}

// 获取程序化-分类成交统计卖出折线图数据
export function postClassifySaleData (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-trade-sell-prop-realtime', params)
}

// 获取程序化-分类成交统计主动成交折线图数据
export function postClassifyVoluntData (params) {
  return post(requestPrefix + '/fluct/algo-tade/v1/algotype-trade-voluntary-prop-realtime', params)
}

// 异常波动监测-市场情绪雷达图
export function getFluctradargraph (params) {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-radar', params)
}
