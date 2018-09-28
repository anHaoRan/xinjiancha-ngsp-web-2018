import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const specialqry = requestPrefix + '/specialqry'

/*
 * 操作分析-账户初筛
 * @param params
 * @returns {*}
 */
export function analysisAcctScreen (params) {
  return post(specialqry + '/operate/v1/analysis-acct-screen', params)
}

/*
 * 操作分析-账户初筛导出
 * @param params
 * @returns {*}
 */
export function analysisAcctScreenExport () {
  return '/specialqry/operate/v1/analysis-acct-screen-export'
}

/*
 * 操纵分析列表-列表查询
 * @param params
 * @returns {*}
 */
export function accountArrListQuery (params) {
  return post(specialqry + '/operate/v1/analysis-list/accountArr-list-query', params)
}

/*
 * 操纵分析列表-账户查询
 * @param params
 * @returns {*}
 */
export function accountListQuery (params) {
  return post(specialqry + '/operate/v1/analysis-list/account-list-query', params)
}
