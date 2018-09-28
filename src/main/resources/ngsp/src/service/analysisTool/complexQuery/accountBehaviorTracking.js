import Vue from 'vue'
import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 账户行为追踪-个股营业部分析及账户分析-按会员营业部汇总委托交易
export function summarizeBranchOrder(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/summarizeBranchOrder', params)
}
// 账户行为追踪-个股营业部分析及账户分析-按会员营业部汇总委托交易-表格导出
export function exportSummarizeBranchOrder(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/summarizeBranchOrder/export', params)
}

// 账户行为追踪-个股营业部分析及账户分析-根据营业部钻取账户委托明细
export function drillBranchOrder(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/drillBranchOrder', params)
}
// 账户行为追踪-个股营业部分析及账户分析-根据营业部钻取账户委托明细-表格导出
export function exportDrillBranchOrder(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/drillBranchOrder/export', params)
}

// 账户行为追踪-个股营业部分析及账户分析-根据账户钻取账户委托明细
export function drillAccountOrder(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/drillAccountOrder', params)
}
// 账户行为追踪-个股营业部分析及账户分析-根据账户钻取账户委托明细-表格导出
export function exportDrillAccountOrder(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/drillAccountOrder/export', params)
}

// 账户行为追踪-最新市场价
export function latestMarketPrice(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/latestMarketPrice', params)
}
// 账户行为追踪-最新市场价-表格导出
export function exportLatestMarketPrice(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/latestMarketPrice/export', params)
}

// 账户行为追踪-档位分析
export function gearAnalysis(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/gearAnalysis', params)
}
// 账户行为追踪-档位分析-表格导出
export function exportGearAnalysis(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/gearAnalysis/export', params)
}

// 账户行为追踪-时间片分析-每分钟平均成交价走势
export function transactPriceTrendPerMinute(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/tradePriceTrendPerMinute', params)
}

// 账户行为追踪-时间片分析-买账户汇总
export function buyAccountSummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/buyAccountSummary', params)
}
// 账户行为追踪-时间片分析-买账户汇总-表格导出
export function exportBuyAccountSummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/buyAccountSummary/export', params)
}

// 账户行为追踪-时间片分析-卖账户汇总
export function sellAccountSummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/sellAccountSummary', params)
}
// 账户行为追踪-时间片分析-卖账户汇总-表格导出
export function exportSellAccountSummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/sellAccountSummary/export', params)
}

// 账户行为追踪-时间片分析-买营业部汇总
export function buyBranchSummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/buyBranchSummary', params)
}
// 账户行为追踪-时间片分析-买营业部汇总-表格导出
export function exportBuyBranchSummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/buyBranchSummary/export', params)
}

// 账户行为追踪-时间片分析-卖营业部汇总
export function sellBranchSummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/sellBranchSummary', params)
}
// 账户行为追踪-时间片分析-卖营业部汇总-表格导出
export function exportSellBranchSummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/sellBranchSummary/export', params)
}

// 账户行为追踪-时间片分析-成交分类汇总
export function transactClassifySummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/tradeClassifySummary', params)
}
// 账户行为追踪-时间片分析-成交分类汇总-表格导出
export function exportTransactClassifySummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/tradeClassifySummary/export', params)
}

// 账户行为追踪-时间片分析-委托分类汇总
export function orderClassifySummary(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/orderClassifySummary', params)
}
// 账户行为追踪-时间片分析-委托分类汇总-表格导出
export function exportOrderClassifySummary(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/orderClassifySummary/export', params)
}

// 账户行为追踪-集合竞价
export function callAuction(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/callAuction', params)
}
// 账户行为追踪-集合竞价-表格导出
export function exportCallAuction(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/callAuction/export', params)
}

// 账户行为追踪-虚拟集合竞价
export function virtualCallAuction(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/virtualCallAuction', params)
}
// 账户行为追踪-虚拟集合竞价-表格导出
export function exportVirtualCallAuction(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/virtualCallAuction/export', params)
}

// 账户行为追踪-持有占比
export function getHoldRatio(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/holdRatio', params)
}
// 账户行为追踪-持有占比-表格导出
export function exportGetHoldRatio(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/holdRatio/export', params)
}

// 账户行为追踪-成交回放
export function transactionReplayDay(params) { // 日K
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/dayKTrend', params)
}
export function transactionReplayMin(params) { // 日内每分钟
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/minuteTrend', params)
}
export function exportTransactionReplayMin(params) { // 导出日内每分钟
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/minuteTrend/export', params)
}
export function transactionReplaySec(params) { // 分钟内每秒
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/secondTrend', params)
}
export function exportTransactionReplaySec(params) { // 分钟内每秒
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/secondTrend/export', params)
}

// export function transactionReplayOrder(params) { // 秒内每笔订单
//   return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/transactionReplay', params)
// }

// // 账户行为追踪-成交回放明细
// export function transactionReplayDetail(params) {
//   return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/transactionReplayDetail', params)
// }

// 账户行为追踪--秒内每笔订单成交回放-新进入订单簿订单及被撤单订单的列表
export function orderReplay(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/orderReplay', params)
}
export function exportOrderReplay(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/orderReplay/export', params)
}

// 账户行为追踪--秒内每笔订单成交回放-新进入订单簿订单的成交撮合记录
export function tradeReplay(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/tradeReplay', params)
}
export function exportTradeReplay(params) {
  return Vue.prototype.gfnExportFileWithForm('/complexqry/accountBehaviorTrack/v1/tradeReplay/export', params)
}

// 账户行为追踪--10档行情订单簿前后价格档位数量变化——差值
export function orderBookChange(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/orderBookChange', params)
}

// 账户行为追踪-秒内每笔订单成交回放-10档行情订单簿前后价格档位数量
export function orderBook(params) {
  return post(requestPrefix + '/complexqry/accountBehaviorTrack/v1/orderBook', params)
}
