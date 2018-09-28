import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 优先股查询-产品查询
export function getPrecedenceProductData(params) {
  return post(`${requestPrefix}/regularqry/preferred-stock/v1/preferred-stock/product`, params)
}

// 优先股查询-账户查询
export function getPrecedenceAccountData(params) {
  return post(`${requestPrefix}/regularqry/preferred-stock/v1/preferred-stock/account`, params)
}

// 优先股查询-市场统计
export function postMarketStatic(params) {
  return post(`${requestPrefix}/regularqry/preferred-stock/v1/market-statis`, params)
}

// 优先股查询-明细查询
export function postDetailQuery(params) {
  return post(`${requestPrefix}/regularqry/preferred-stock/v1/detailInfo`, params)
}

// 优先股查询-公共导出
export function exportCommonFunc(params) {
  return Vue.prototype.gfnExportFileWithForm('/regularqry/preferred-stock/v1/export', params)
}