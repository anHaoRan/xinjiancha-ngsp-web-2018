import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 股指期货每日数据查询
export function postStockIndexDaily(params) {
  return post(requestPrefix + '/regularqry/stockfutures/v1/stockfuture/stockfuturedata', params)
}

// 股指期货查询-沪深300成分股每日数据查询
export function constituentStockQuery(params) {
  return post(requestPrefix + '/regularqry/stockfutures/v1/stockfuture/hs300-stock-data', params)
}

// 股指期货查询-股指期货走势查询
export function stockFuturesTrend(params) {
  return post(requestPrefix + '/regularqry/stockfutures/v1/stockfuture/stock-futures-trend', params)
}

// 股指期货查询-股指期货走势查询导出
export function exportStockFuturesTrend(params) {
  return Vue.prototype.gfnExportFileWithForm('/regularqry/stockfutures/v1/export', params)
}