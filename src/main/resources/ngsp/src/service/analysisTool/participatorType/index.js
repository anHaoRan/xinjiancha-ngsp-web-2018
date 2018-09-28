
// 参与者查询
import Vue from 'vue'
import {get, post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// ********************* 参与者查询【父组件接口】 ********************************
// 双人双密接口
export function twoPersonTwoPsw(params) {
  return post(requestPrefix + '/uaa/uums/doubleCheck', params);
}
// 获取当前交易日
export function getTradeDay() {
  return get(requestPrefix + '/admin/v1/date/trade')
}

// 参与者查询 -- 账户类型公共接口
export function getQueryType(dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1);
}

//  参与者账户、一码通证券代码  公共接口
export function getStockQuery(params) {
  return get(requestPrefix + '/admin/v1/securities/fuzzy?fuzzyChars=' + params);
}

// 营业部证券代码 公共接口
export function getCommonSelecta(dataType, tag) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag)
}
// 营业部代码公共接口
export function storeStock(data) {
  return get(requestPrefix + '/admin/v1/participators/fuzzy?level=' + data.level + '&fuzzyChars=' + data.fuzzyChars + '&pageIndex=' + data.pageIndex + '&pageRows=' + data.pageRows)
}
export function getCommonSelect(level, fuzzyChars, pageIndex, pageRows) {
  return get(requestPrefix + '/admin/v1/participators/fuzzy?level=' + level + '&fuzzyChars=' + fuzzyChars + '&pageIndex=' + pageIndex + '&pageRows=' + pageRows)
}
// ********************* 参与者查询 【子组件公共接口】 ********************************
// 元数据-获取无关联带Tag1（子类） 【产品类型】公共接口
export function getProductType2(dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}

// 元数据-获取无关联元数据   【信用类型】/【订单类型】公共接口
export function getCreditType2(dataType) {
  return get(requestPrefix + '/admin/v1/link-no?dataType=' + dataType)
}

// 元数据-获取无关联元数据 【交易类型】公共接口
export function getDetailType(dataType, linkOneValue) {
  return get(requestPrefix + '/admin/v1/link-one?dataType=' + dataType + '&linkOneValue=' + linkOneValue)
}

// 参与者查询 【基本资料】 -- 预警记录接口
export function getAlarmReporting(data) {
  return post(requestPrefix + '/regularqry/product/v1/warnrecordfile', data)
}

// 参与者查询 【基本资料】 -- 批注文件表格接口
export function getAnnotationFile(data) {
  return post(requestPrefix + '/regularqry/product/v1/postilattachfile', data)
}

// *********************参与者查询********************************
// 参与者查询 【基本资料】接口
export function postBaisice(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/particibasic', params);
}
// 参与者查询 【基本资料-账户指定交易历史详情】接口
export function posOrderParticulars(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/accountdealhistory', params);
}
// 参与者【查询持仓统计】接口
export function postPartic(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/holdstat', params);
}
// 参与者【查询持仓统计】一码通子表接口
export function postParticChild(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/ymt-holdstat', params);
}
// 参与者查询【申报详情】接口
export function postDeclare(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/applydetail', params);
}
// 参与者查询 【申报统计】接口
export function postStatistics(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/get-declared-statistics', params);
}
// 参与者查询 【申报统计】一码通子表接口
export function postSonUniteCodeStatistics(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/get-declared-statistics-unite-code-son', params);
}
// 参与者查询 【成交详情查】询接口
export function postTransaction(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/declaredetail', params);
}
// 参与者查询 【成交统计】(账户/一码通单日,账户组,券商,pbu,营业部)接口
export function postSingleDay(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/bargainStat/singleDay', params);
}
// 参与者查询 【成交统计】(账户/一码通跨日)
export function postMultiDay(params) {
  return post(requestPrefix + '/regularqry/partcpt/v1/actor/bargainStat/multiDay', params);
}

/*
 * 参与者查询【成交统计】按条件下载数据（参与者查询导出数据均为以下接口）
 * @param params 包含参数
 * @returns {*}
 */
export function downloadTransactionStatistice(params) {
  Vue.prototype.gfnExportFile('/regularqry/partcpt/v1/export', JSON.stringify(params));
}

/**
 * 参与者查询【基本资料】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */

/**
 * 参与者查询【申报详情】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */

/**
 * 参与者查询【持仓统计】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */

/**
 * 参与者查询【申报统计】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */

/**
 * 参与者查询【成交详情】按条件下载数据
 * @param params 包含参数
 * @returns {*}
 */
