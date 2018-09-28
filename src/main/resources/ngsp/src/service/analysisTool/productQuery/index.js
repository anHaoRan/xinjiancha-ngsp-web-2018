import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 获取当前交易日
export function getTradeDay() {
  return get(requestPrefix + '/admin/v1/date/trade')
}
// 证券代码接口
export function stockQuery(params, secSubTypecode, pageIndex, pageRows) {
  if (!pageIndex && !pageRows) {
    return get(requestPrefix + `/admin/v1/securities/fuzzy?fuzzyChars=${params}&secSubTypecode=${secSubTypecode}`);
  }
  return get(requestPrefix + `/admin/v1/securities/fuzzy?fuzzyChars=${params}&secSubTypecode=${secSubTypecode}&pageIndex=${pageIndex}&pageRows=${pageRows}`);
}
// 双人双密接口
export function twoPersonTwoPsw(params) {
  return post(requestPrefix + '/uaa/uums/doubleCheck', params);
}
// 平台类型公共接口
export function linkNo(dataType) {
  return get(requestPrefix + '/admin/v1/link-no?dataType=' + dataType)
}
// 交易类型公共接口
export function detailSelect(dataType, linkOneValue) {
  return get(requestPrefix + '/admin/v1/link-one?dataType=' + dataType + '&linkOneValue=' + linkOneValue)
}
// 参与者代码模糊查询公共接口
export function commonSelect(level, fuzzyChars, pageIndex, pageRows) {
  return get(requestPrefix + '/admin/v1/participators/fuzzy?level=' + level + '&fuzzyChars=' + fuzzyChars + '&pageIndex=' + pageIndex + '&pageRows=' + pageRows)
}
// 参与者代码非模糊查询公共接口
export function commonSelectAll(level, pageIndex, pageRows) {
  return get(requestPrefix + '/admin/v1/participators?level=' + level + '&pageIndex=' + pageIndex + '&pageRows=' + pageRows)
}
// 证券代码多选，懒加载，模糊查询接口
export function getStockSelectOption (securityCodes, pageIndex, pageRows) {
  return get(requestPrefix + '/admin/v1/securities/lazy/sel?securityCodes=' + securityCodes + '&pageIndex=' + pageIndex + '&pageRows=' + pageRows)
}

// 参与者层级公共接口
export function transactionSelect(dataType, tag) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag)
}

// 成交详情
// 成交详情查询接口
export function getTransactionDetail(data) {
  return post(requestPrefix + '/regularqry/bargaindetail', data)
}

// 成交统计
// 成交统计单日快速查询接口
export function getTransactionQuick(data) {
  return post(requestPrefix + '/regularqry/v1/bargainStat/singleDay/query', data)
}
// 成交统计单日条件查询接口
export function getTransactionCondition(data) {
  return post(requestPrefix + '/regularqry/v1/bargainStat/singleDay/conditionQuery', data)
}
// 成交多日查询接口
export function getTransactionMultiDay(data) {
  return post(requestPrefix + '/regularqry/v1/bargainStat/multiDay/query', data)
}
// 申报详情
// 申报详情查询接口
export function getStockOrderDetail(data) {
  return post(requestPrefix + '/regularqry/declaredetail', data)
}
// 申报统计
// 申报统计快速查询接口
export function getReportStatistics(data) {
  return post(requestPrefix + '/regularqry/orderTotal/v1', data)
}
// 申报统计条件查询接口
export function getConditionReportStatistics(data) {
  return post(requestPrefix + '/regularqry/orderTotalQuick/v1', data)
}
// 持股集中度
// 持股集中度接口
export function getHoldDegree(data) {
  return post(requestPrefix + '/regularqry/positiondegree', data)
}
// 股权结构
// 股权结构查询接口
export function getEquityStructureQuery(data) {
  return post(requestPrefix + '/regularqry/v1/stockStructure', data)
}
// 基本资料
// 基本资料查询接口
export function getBasicInfoQuery(data) {
  return post(requestPrefix + '/regularqry/product/v1/sbfbasicinfo', data)
}

// 预警记录接口
export function getAlarmReporting(data) {
  return post(requestPrefix + '/regularqry/product/v1/warnrecordfile', data)
}

// 批注文件表格接口
export function getAnnotationFile(data) {
  return post(requestPrefix + '/regularqry/product/v1/postilattachfile', data)
}
// 持有统计
// 持有统计接口
export function getHoldStatistics(data) {
  return post(requestPrefix + '/regularqry/holdstat', data)
}

// 基金申购详情
export function getSubscribeDetailRes(data) {
  return post(requestPrefix + '/regularqry/v1/applydetail', data)
}
// 基金赎回详情
export function getRedemptionDetailRes(data) {
  return post(requestPrefix + '/regularqry/v1/redeemdetail', data)
}

// 基金申购赎回详情树形图数据接口
export function getTreeData(data) {
  return get(requestPrefix + '/admin/v1/account-groups?tradeDate=' + data)
}

// 基金申购统计
export function getSubscribeStaticRes(data) {
  return post(requestPrefix + '/regularqry/v1/applystat', data)
}
// 基金赎回统计
export function getRedemptionStaticRes(data) {
  return post(requestPrefix + '/regularqry/v1/redeemstat', data)
}
