import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const bpm = requestPrefix + '/bpm'
export const specialqry = requestPrefix + '/specialqry'

/*
 * 操纵分析列表-列表查询
 * @param params
 * @returns {*}
 */
export function accountArrListQuery (params) {
  return post(specialqry + '/operate/v1/analysis-list/accountArr-list-query', params)
}

/*
 * 操纵分析列表-账户列表导入
 * @param params
 * @returns {*}
 */
export function accountListImport (params) {
  return post(specialqry + '/operate/v1/analysis-list/account-list-import', params)
}

/*
 * 操纵分析列表-列表账户信息查询
 * @param params
 * @returns {*}
 */
export function accountInfoListQuery (params) {
  return post(specialqry + '/operate/v1/analysis-list/accountInfo-list-query', params)
}

/*
 * 操纵分析列表- 异常交易行为统计表
 * @param params
 * @returns {*}
 */
export function unusualTrade (params) {
  return post(bpm + '/v1/sls/unusual-trade', params)
}

/*
 * 操纵分析列表-计算
 * @param params
 * @returns {*}
 */
export function calculate (params) {
  return post(specialqry + '/operate/v1/analysis-list/calculate', params)
}

/*
 * 操纵分析列表-计算-TD版
 * @param params
 * @returns {*}
 */
export function calculateTD (params) {
  return post(specialqry + '/operate/v1/analysis-list/calculate-td', params)
}

/*
 * 操纵分析列表-列表-获取对应结果
 * @param params
 * @returns {*}
 */
export function getLookTaskList (params) {
  return post(specialqry + '/operate/v1/analysis-list/account-list-res', params)
}

/*
 * 操纵分析列表-取得账户组成交量
 * @param params
 * @returns {*}
 */
export function acctidsTrdvol (params) {
  return post(specialqry + '/operate/v1/analysis-list/acctids-trdvol', params)
}

/*
 * 操纵分析列表-取得叠加信息
 * @param params
 * @returns {*}
 */
export function extraInfo (params) {
  return post(specialqry + '/operate/v1/analysis-list/extra-info', params)
}

/*
 * 操纵分析列表-取得账户列表名
 * @param params
 * @returns {*}
 */
export function getAccountListName (params) {
  return post(specialqry + '/operate/v1/analysis-list/get-account-listName', params)
}

/*
 * 操纵分析列表-保存账户列表
 * @param params
 * @returns {*}
 */
export function saveAccountListName (params) {
  return post(specialqry + '/operate/v1/analysis-list/save-account-list', params)
}

/*
 * 实时监控分析工具-股票行情-分时图
 * @param params
 * @returns {*}
 */
export function postStockTimeData (params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-time', params)
}

/*
 *  实时监控分析工具-十档行情
 * @param params
 * @returns {*}
 */
export function postStockTenData (params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-timeten', params)
}

/*
 *  操纵分析列表-账户组盈利统计表导出
 * @returns {*}
 */
export function acctsprofitExport () {
  return '/specialqry/operate/v1/analysis-list/acctsprofit-export'
}

/*
 *  操纵分析列表-操纵分析结果表导出
 * @returns {*}
 */
export function optresultExport () {
  return '/specialqry/operate/v1/analysis-list/optresult-export'
}

/*
 *  操纵分析列表-账户异常交易行为导出
 * @returns {*}
 */
export function unusualExport () {
  return '/bpm/v1/sls/acct-unusual-trade/export'
}

/*
 *  操纵分析列表-提交复核
 * @returns {*}
 */
export function submitReview() {
  return get(specialqry + '/operate/v1/reanal-user')
}

/*
 * 操作分析-改变任务状态
 * @param params
 * @returns {*}
 */
export function changeTaskStatus (params) {
  return post(specialqry + '/operate/v1/upd-acct-task', params)
}

