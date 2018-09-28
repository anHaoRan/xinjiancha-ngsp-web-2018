import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 融资(Finacing)融券(Securities)盘前数据

// 融资余额查询
export function getBeforeFinacing(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/finance', params)
}

// 融券余额查询
export function getBeforeSecurities(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/loansec', params)
}

// 融资余额明细
export function getBeforeFinacingDetail(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/financedetail', params)
}

// 融券余额明细
export function getBeforeSecuritiesDetail(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/loansecdetail', params)
}

// 融资融券盘前数据-数据处理
export function getDataDeal(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/deal', params)
}

// 融资融券潘前数据-文件管理-生成
export function createFile(params) {
  return get(requestPrefix + '/regularqry/financeloansec/dealbefore/createfile', params)
}

// 融资融券潘前数据-文件管理-下载
export function saveFile(params) {
  return post(requestPrefix + '/regularqry/financeloansec/dealbefore/downloadfile', params)
}