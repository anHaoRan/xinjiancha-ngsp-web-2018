import Vue from 'vue'
import { get, post } from '../../../../utils/api'
import { requestPrefix } from '../../../../utils/constants'

// 初始化利空列表
export function getbadlist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-indics-account', params)
}
// 点击营业部维度生成的账户维度列表
export function getdepartmentData(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-account-by-dept', params)
}
// 初始化利好列表
export function getgoodlist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-indics-account', params)
}
// 查询列表
export function getlist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-account', params)
}
// 编辑列表
export function edittablelist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/account-edit', params)
}
// 删除列表
export function postdelete(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/account-drop', params)
}
// 营业部列表
export function getdepartmentlist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-indics-dept', params)
}
// 营业部一条列表
export function getdepartmentOnelist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/qry-dept', params)
}
// 买卖股票金额趋势图
export function drawCodeTrend(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/query-stock-trend', params)
}
// 日内申报及股价走势图
export function drawStockTrend(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/query-stock-day', params)
}
// 交易股票分析表
export function getvaritytable(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/analysis-stock-graph', params)
}
// 交易时点分析
export function drawTransationStyle(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/analysis-stock-style', params)
}
// 持股习惯分析
export function drawhabitanalysis(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/hold-stock-style', params)
}
// 获取基本信息
export function getallinfo(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/query-task', params)
}
// 账户的逐日成交汇总数据
export function gettable(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/account-statistics-day', params)
}
// 买入占比和期末持仓占比
export function gettitleinfo(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/stock-proportion', params)
}
// 获取列
export function getcolmlist(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/quota-clms', params)
}
// 新增账户
export function postaddnewcode(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading-dim/account-add', params)
}
// 终止分析
export function finishanalysis(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/changeStatus-analysis', params)
}
// 选取审核人组件接口
export function getCheckPerson() {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/reanal-user')
}
