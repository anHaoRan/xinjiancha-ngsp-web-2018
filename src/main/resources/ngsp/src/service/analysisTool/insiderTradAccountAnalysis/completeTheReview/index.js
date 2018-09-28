import { get, post } from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const request = requestPrefix + '/specialqry'

// 内幕分析-查询任务基础信息
export function queryTask (params) {
  return post(request + '/speclqry/v1/insider-trading-dim/query-task', params)
}

// 内幕分析-账户维度列表-利空/利好
export function qryIndicsAccount (params) {
  return post(request + '/speclqry/v1/insider-trading-dim/qry-account', params)
}

// 内幕交易分析-宏观分析-公司股价和交易量走势
export function shIndexQuery (params) {
  return get(request + `/speclqry/v1/insider-trading/macro-analysis/trade-trend/shIndex-query?taskId=${params}`)
}

// 内幕分析-账户维度-内幕交易特征描述编辑
export function accountDescEdit (params) {
  return post(request + '/speclqry/v1/insider-trading-dim/account-desc-edit', params)
}

// 内幕交易分析-宏观分析-公司基本信息和重大事项
export function query (params) {
  return get(request + '/speclqry/v1/insider-trading/macro-analysis/info-matters/query', params)
}

// 内幕分析-账户-指标列定义
export function quotaClms (params) {
  return post(request + '/speclqry/v1/insider-trading-dim/quota-clms', params)
}

// 内幕交易分析-结论查询
export function conclusionQuery (params) {
  return get(request + `/speclqry/v1/insider-trading/conclusion-query?taskId=${params}`)
}
