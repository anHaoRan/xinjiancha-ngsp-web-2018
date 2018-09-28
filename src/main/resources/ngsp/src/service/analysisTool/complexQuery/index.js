import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 获取当前交易日
export function getTradeDay() {
  return get(requestPrefix + '/admin/v1/date/trade')
}

// 证券代码接口
export function stockQuery(params) {
  return get(requestPrefix + '/admin/v1/securities/fuzzy?fuzzyChars=' + params);
}

// 请求交易量N(TOPN)以上账户
export function postTradeVolumeTopN(params) {
  return post(requestPrefix + '/complexqry/account/v1/topn/accountvolume', params)
}
// 请求持有N(TOPN)以上账户
export function postholdingsVolumeTopN(params) {
  return post(requestPrefix + '/complexqry/account/v1/topn/accounthold', params)
}

// 维度信息 钻取明细表格——账户证券交易查询
export function getAcctSecTradeQuery(params) {
  return post(requestPrefix + '/complexqry/dimension/v1/acctSecTradeQuery', params);
}
// 维度信息 钻取明细表格——账户证券持仓查询
export function getDimenAcctSecHoldQuery(params) {
  return post(requestPrefix + '/complexqry/dimension/v1/acctSecHoldQuery', params);
}

// 维度信息查询接口  维度信息-钻取明细查询
export function getDimensionInfo(params) {
  return post(requestPrefix + '/complexqry/dimension/v1/dimensioninfo', params);
  // return post(requestPrefix + '/dimension/v1/dimensioninfo',params); //本地调试
}

// 获取持股曲线数据接口
export function getStockCurveData(params) {
  return post(requestPrefix + '/complexqry/dimension/v1/stockCurve', params);
}

// 获取持仓市值曲线数据接口
export function getHoldMarketValueCurveData(params) {
  return post(requestPrefix + '/complexqry/dimension/v1/holdMarketValueCurve', params);
}

// 港股通数据协查接口
export function getHKStocksThroughData(params) {
  return post(requestPrefix + '/complexqry/hkstassistquery/v1/hkstassistquery', params);
}

// 大宗交易查询接口
export function getBigDealTrade(params) {
  return post(requestPrefix + '/complexqry/bigDealTradeQuery/v1/bigDealTradeQuery', params);
}

// 营业部交易前N名
export function getBranchTradeTopN(params) {
  return post(requestPrefix + '/complexqry/branchTradeTopN/v1/branchTradeTopN', params);
}
// 交易营业部变更查询
export function getTradeBranchChange(params) {
  return post(requestPrefix + '/complexqry/tradeBranchChange/v1/tradeBranchChange', params);
}
// 沪股通数据协查
export function getShstassistQuery(params) {
  return post(requestPrefix + '/complexqry/shstassistquery/v1/shstassistquery', params);
}

// 账户证券持仓查询
export function getAcctSecHoldQuery(params) {
  return post(requestPrefix + '/complexqry/accountSercurities/v1/holding', params);
}

// 账户证券申报情况
export function getAccountSecurityDeclare(params) {
  return post(requestPrefix + '/complexqry/accountSercurities/v1/declarations', params);
}

export function getAccountOneYard(params) {
  return post(requestPrefix + '/complexqry/account/v1/oneyard/accountoneyard', params);
}

// 基金反向交易查询
export function getFundReverseTransaction(params) {
  return post(requestPrefix + '/complexqry/fundReverseTransactionQuery/v1/fundReverseTransactionQuery', params);
}
// 基金反向交易上传ECXEL验证
export function getFundReverseTransactionExcel(params) {
  return post(requestPrefix + '/complexqry/fundReverseTransactionQuery/v1/validateFundReverseExcel', params);
}

// 异常波动分析表格导出
export function exportAbnormFluctuateAnalysis(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/abnormFluctuateAnalysis/v1/abnormFluctuateAnalysis/export', params)
}
// 股权集中度分析表格导出
export function exportEquityConcentrationAnalysis(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/abnormFluctuateAnalysis/v1/equityConcentrationAnalysis/export', params)
}

// 综合查询-异常波动分析
export function postAbnormFluctuateAnalysis(params) {
  return post(requestPrefix + '/complexqry/abnormFluctuateAnalysis/v1/abnormFluctuateAnalysis', params)
}
// 综合查询-股权集中度分析
export function postEquityConcentrationAnalysis(params) {
  return post(requestPrefix + '/complexqry/abnormFluctuateAnalysis/v1/equityConcentrationAnalysis', params)
}

// 账户交易及非交易过户情况查询
export function getSecAccTradeQuery(params) {
  return post(requestPrefix + '/complexqry/accountSercurities/v1/secAccTrade', params);
}

// 订单档位指标查询
export function getOrderGearIndexQuery(params) {
  return post(requestPrefix + '/complexqry/orderGearIndex/v1/orderGearIndexQuery', params);
}

// 成交对手方明细查询
export function postTradeCounterparties(params) {
  return post(requestPrefix + '/complexqry/tradeReverseDetail/v1/tradeCounterparties', params)
}

// 对倒明细查询
export function postReverseDetail(params) {
  return post(requestPrefix + '/complexqry/tradeReverseDetail/v1/reverseDetail', params)
}

// 成交对手方明细表格导出
export function exportTradeCounterparties(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/tradeReverseDetail/v1/tradeCounterparties/export', params)
}

// 对倒明细表格导出
export function exportReverseDetail(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/tradeReverseDetail/v1/reverseDetail/export', params)
}

// 盈利计算-账面盈利
export function accountBookProfit(params) {
  return post(requestPrefix + '/complexqry/profitcalculate/v1/paperProfit', params)
}
// 盈利计算-账面盈利导出
export function exportAccountBookProfit(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/profitcalculate/v1/paperProfit/export', params)
}

// 可疑对象分析-竞价
export function suspiciousObjBidPrice(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjJJ', params)
}
// 可疑对象分析-竞价导出
export function exportSuspiciousObjBidPrice(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/suspiciousObj/v1/suspiciousObjJJ/export', params)
}
// 可疑对象分析-竞价+大宗
export function suspiciousObjBig(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjDZ', params)
}
// 可疑对象分析-竞价+大宗导出
export function exportSuspiciousObjBig(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/suspiciousObj/v1/suspiciousObjDZ/export', params)
}
// 可疑对象分析-竞价-连续N个交易日交易占比超过X%统计表
export function suspiciousObjTab8JJ(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjTab8JJ', params)
}
// 可疑对象分析-竞价-连续N个交易日对倒占比超过Y%统计表
export function suspiciousObjTab9JJ(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjTab9JJ', params)
}
// 可疑对象分析（竞价+大宗）-连续N个交易日交易占比超过X%统计表
export function suspiciousObjTab8DZ(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjTab8DZ', params)
}
// 可疑对象分析（竞价+大宗）-连续N个交易日对倒占比超过Y%统计表
export function suspiciousObjTab9DZ(params) {
  return post(requestPrefix + '/complexqry/suspiciousObj/v1/suspiciousObjTab9DZ', params)
}

// 先进先出/后进先出
// tab1-输出成交明细和费用
export function getTradDetailCostData(params) {
  return post(requestPrefix + '/complexqry/profitcalculate/v1/transactDetailFee', JSON.stringify(params))
}

// tab2-输出买卖记录对应数据表
export function getOutputRecordData(params) {
  return post(requestPrefix + '/complexqry/profitcalculate/v1/transactRecordTable', JSON.stringify(params))
}
// tab3-输出买卖记录对应数据表
export function getOutputProfitStaticData(params) {
  return post(requestPrefix + '/complexqry/profitcalculate/v1/profitStatisticTable', JSON.stringify(params))
}
// tab4-输出买卖记录对应数据表
export function gethighTransferDetailData(params) {
  return post(requestPrefix + '/complexqry/profitcalculate/v1/highTransferDetail', JSON.stringify(params))
}
