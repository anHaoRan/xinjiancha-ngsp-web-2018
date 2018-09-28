import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// ********************市场统计查询*********************************
// 市场统计查询 【参与者成交查询】接口
export function marketStatis(params) {
  return post(requestPrefix + '/regularqry/marketstatis/v1/marketstatis/actcomplete', params);
}
// 市场统计查询 【参与者详情查询】接口
export function postmarketStatis(params) {
  return post(requestPrefix + '/regularqry/marketstatis/v1/marketstatis/actcomdetail', params);
}
// 元数据-获取无关联带Tag1（子类） 【产品类型】/ 【参与者层级】公共接口
export function getProductTag1(dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}
// *****************************************************
/*
 * 市场统计统计查询 【参与者查询】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */
export function downloadBazaar(params) {
  Vue.prototype.gfnExportFile('/regularqry/partcpt/v1/export', JSON.stringify(params));
}

// 市场统计查询-参与者市值查询
export function getParticMarketValMain(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-actorMarketQuery', params);
}
export function getParticMarketValSub(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-actorMarketQuery-Submenu', params);
}

// 市场统计查询-持股集中度统计
export function getHoldDegreeData(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-shareHoldQuery', params);
}

// 市场统计查询-持债集中度统计
export function getHoldBondDataMain(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-bondHoldQuery', params);
}
export function getHoldBondDataSub(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-bondHoldQuery-Submenu', params);
}

// 市场统计查询-参与者申报查询主表
export function getParticDeclrationDataMain(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-actorApplydetail', params);
}
export function getParticDeclrationDataSub(params) {
  return post(requestPrefix + '/regularqry/general/v1/bazaar-statistics-actorApplydetail-submenu', params);
}

// 市场统计查询-融资回购余额排序统计
export function getProductCode () {
  return post(`${requestPrefix}/regularqry/marketstatis/v1/mtsl/product-code`)
}
export function getFinancBalanceRankData (params) {
  return post(`${requestPrefix}/regularqry/marketstatis/v1/mtsl/finance-buy-back-sort`,params)
}

// 市场统计查询-质押式回购风险指标
export function getPledgeRepurchaseData (params) {
  return post(`${requestPrefix}/regularqry/marketstatis/v1/mtsl/pledge-style-buy-back`,params)
}
