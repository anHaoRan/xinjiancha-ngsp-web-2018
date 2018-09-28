import {get, post} from '../../../utils/api';
import {requestPrefix} from '../../../utils/constants';
import Vue from "vue";

// 元数据-查询沪股通证券（权限控制）
export function getStockcodeFromConnet() {
  return get(requestPrefix + '/admin/v1/securities-hk')
}

// 元数据-模糊查询沪股通证券（权限控制）
export function getFuzzyStockcodeFromConnet(data) {
  return get(requestPrefix + '/admin/v1/securities-hk/fuzzy', data)
}

// 沪港通申报统计
export function getReportStaticData(data) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/hgtdeclare', data)
}

// 沪港通申报统计详情查询
export function getReportStaticDetailData(data) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/hgtdeclaredetail', data)
}

// 沪港通成交统计
export function getTradStaticData(data) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/hgtbargain', data)
}

// 沪港通成交统计详情查询
export function getTradStaticDetailData(data) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/hgtbargaindetail', data)
}

// 沪港通境外投资者持股比例试算
export function getForeignInvestorsHoldTrial(data) {
  return get(requestPrefix + '/regularqry/hgtquery/v1/hgt/finvestorstat', data)
}

// 沪港通额度查询
export function getLimitQueryData(data) {
  return get(`${requestPrefix}/regularqry/hgtquery/v1/hgt/quotastat`, data)
}

/*
 * 沪港通查询-申报成交统计母表
 * @param params
 * @returns {*}
 */
export function getDecandtrd(params) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/decandtrd', params)
}

/*
 * 沪港通查询-申报成交统计子表
 * @param params
 * @returns {*}
 */
export function getDecandtrdChild(params) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/decandtrd-child', params)
}

/*
 * 沪港通查询-公用导出
 * @param params
 * @returns {*}
 */
export function postExport(params) {
  return '/regularqry/hgtquery/v1/hgt/export'
}

// 沪港通查询-境外投资者持股比例盘前处理
export function postPrediskTreatment(params) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/fi-dealbefore', params)
}
// 沪港通查询-境外投资者持股比例盘前处理-数据处理
export function prediskTreatmentHandleData(params) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/fi-dataprocess', params)
}
// 沪港通查询-境外投资者持股比例盘前处理-生成文件
export function prediskTreatmentCreatFile(params) {
  return post(requestPrefix + '/regularqry/hgtquery/v1/hgt/fi-create-file', params)
}
// 沪港通查询-境外投资者持股比例盘前处理-文件下载
export function prediskTreatmentDownloadFile(fileId, fileName) {
  return Vue.prototype.gfnDownloadFile(fileId, fileName)
}

// 沪港通查询-境外投资者持股比例盘前处理导出
export function exportPrediskTreatment(params) {
  return Vue.prototype.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params)
}