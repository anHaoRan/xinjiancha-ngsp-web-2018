import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'
import Vue from 'vue'

// 证券运行监测-叠加框数据
export function getComposeMeta () {
  return get(requestPrefix + '/fluct/index/v1/compose-meta')
}

// 证券运行监测-叠加窗口-股票搜索
export function getComposeStock (code, name, key) {
  return get(requestPrefix + '/fluct/index/v1/index-stock?code=' + code + '&name=' + name + '&key=' + key)
}

// 证券运行监测-分时图(日K)叠加
export function getComposeChart (params) {
  return post(requestPrefix + '/fluct/index/v1/market-compose', params)
}

// 证券运行监测-大小盘乖离率
export function getDeviationRateApi (params) {
  return get(requestPrefix + '/fluct/operate-monitor/v1/get-deviation-rate?startDate=' + params.startDate + '&endDate=' + params.endDate)
}

// 证券运行监测-大小盘乖离率
export function getLiquidityMonitorApi (indexCode, tradeDate) {
  return get(requestPrefix + '/fluct/operate-monitor/v1/get-liquidity-monitor?indexCode=' + indexCode + '&tradeDate=' + tradeDate)
}

/**
 * 证券运行监测 板块 个股 投资者 按条件下载数据
 * @param {params} params 包含参数
 * @returns {*} null
 */
export function downloadStock (params) {
  Vue.prototype.gfnExportFile('/fluct/operate-monitor/v1/export', JSON.stringify(params))
}
