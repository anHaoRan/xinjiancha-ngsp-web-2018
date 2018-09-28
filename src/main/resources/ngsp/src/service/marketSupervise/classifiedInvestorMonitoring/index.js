import Vue from 'vue'
import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

/**
 * 分类投资者-半小时净额分时图
 * @param {tradeDate} tradeDate 交易日
 * @param {startTime} startTime 开始时间
 * @param {endTime} endTime 结束时间
 * @returns {*} null
 */
export function getIndividualCharts (tradeDate, startTime, endTime) {
  return get(requestPrefix + '/fluct/index/v1/market-time?indexCode=000001&tradeDate=&startTime=&endTime=')
}

// 分类投资者-半小时净额列表
export function getInvestorHalfNetAmount () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/investor-half-netamount')
}

/**
 * 分类投资者-分时图
 * @param {object} params 包含参数: {indexCode 指数代码 tradeDate 日期 startTime 开始时间 endTime 结束时间}
 * @returns {*} resp
 */
export function getMarketTimeApi (params) {
  return get(requestPrefix + '/fluct/index/v1/market-time?indexCode=' + params.indexCode + '&tradeDate=' + params.tradeDate + '&startTime=&endTime=')
}

/**
 * 分类投资者-日K图
 * @param {params} params 包含参数
 * @returns {*} resp
 */
export function getMarketDayApi (params) {
  return get(requestPrefix + '/fluct/index/v1/market-day?indexCode=' + params.indexCode + '&startDate=&endDate=')
}

/**
 * 分类投资者表数据-分类投资者
 * @param {object} params 包含参数
 * @returns {*} resp
 */
export function getClassifiedInvestorApi (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/index-investor', params)
}

/**
 * 分类投资者表数据-自定义分类投资者
 * @param {object} params 包含参数
 * @returns {*} resp
 */
export function getClassifiedCusInvestorApi (params) {
  return post(requestPrefix + '/fluct/investor-customs/v1/index-investor-custom', params)
}

/**
 * 获取分类投资者-账户数据
 * @param {object} params 包含参数
 * @returns {*} resp
 */
export function getAccountApi (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/index-investor-account', params)
}

/**
 * 获取分类投资者-账户-板块数据
 * @param {object} params 包含参数
 * @returns {*} resp
 */
export function getIndustryBlockApi (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/index-vocation-product', params)
}

/**
 * 分类投资者 账户 板块按条件下载数据
 * @param {object} params 包含参数
 * @returns {*} resp
 */
export function downloadInvestor (params) {
  Vue.prototype.gfnExportFile('/fluct/investor-classifieds-trade-supervise/v1/export', JSON.stringify(params))
}

// 分类投资者历史监控-成交及持股情况
export function postDetailHoldingData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-history-position-trade', params)
}

// 分类投资者历史监控-专业投资者持仓情况
export function getMajorInverstorData (tradeDate) {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-professional-investor-position?tradeDate=' + tradeDate)
}

// 分类投资者历史监控-换手率
export function postTurnOverData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-turnover-rate', params)
}

// 分类投资者历史监控-各会员持有市值
export function postMemberHoldValueData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-companies-position', params)
}

// 分类投资者历史监控-各会员持有市值-图表数据
export function postMemberHoldValueMapData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-companies-position-map', params)
}

// 分类投资者历史监控-分类投资者持有证券分类
export function reqHodingStockClasses (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-position-calssify', params)
}

// 分类投资者历史监测-分类投资者持有大盘 中盘 小盘的市值及占比
export function reqHoding3Market (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-supervise/v1/get-calssified-investor-position-plat', params)
}

// 自定义多维度查询
export function cusMulQuery (params) {
  return post(requestPrefix + '/dataviz/v1/pumpdata', params)
}

// 各类投资者申报统计
export function variousInvestors (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-order/v1/all-account', params)
}

// 一般机构投资者申报统计
export function generalInvestors (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-order/v1/general-account', params)
}

// 一般机构投资者申报统计(买卖明细)
export function generalInvestorsTrade (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-order/v1/general-account-trade-detail', params)
}
