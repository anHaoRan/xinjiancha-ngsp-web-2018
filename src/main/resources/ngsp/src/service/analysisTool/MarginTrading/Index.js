import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const regularqry = requestPrefix + '/regularqry'

/*
 * 融资融卷交易-会员查询主表
 * @param params
 * @returns {*}
 */
export function getMember (params) {
  return post(regularqry + '/mtsl/v1/get-member', params)
}

/*
 * 融资融卷交易-会员查询子表
 * @param params
 * @returns {*}
 */
export function getMemberDetail (params) {
  return post(regularqry + '/mtsl/v1/get-member-detail', params)
}

/*
 * 融资融券交易-标的卷交易主表查询
 * @param params
 * @returns {*}
 */
export function getBd (params) {
  return post(regularqry + '/mtsl/v1/get-bd', params)
}

/*
 * 融资融券交易-标的卷交易子表查询
 * @param params
 * @returns {*}
 */
export function getBdDetail (params) {
  return post(regularqry + '/mtsl/v1/get-bd-detail', params)
}

/*
 * 融资融券交易-融券余量母表查询
 * @param params
 * @returns {*}
 */
export function financeBalanceSum (params) {
  return post(regularqry + '/mtsl/v1/finance-Balance-sum', params)
}

/*
 * 融资融券交易-融券余量子表查询
 * @param params
 * @returns {*}
 */
export function financeBalanceDetail (params) {
  return post(regularqry + '/mtsl/v1/finance-Balance-detail', params)
}

/*
 * 融资融券交易-融券余量母表查询
 * @param params
 * @returns {*}
 */
export function securitiesLoanMarginSum (params) {
  return post(regularqry + '/mtsl/v1/securities-loan-margin-sum', params)
}

/*
 * 融资融券交易-融券余量子表查询
 * @param params
 * @returns {*}
 */
export function securitiesLoanMarginDetail (params) {
  return post(regularqry + '/mtsl/v1/securities-loan-margin-detail', params)
}

/*
 * 融资融券交易-账户融资融券超比例查询
 * @param params
 * @returns {*}
 */
export function financeOverRatio (params) {
  return post(regularqry + '/mtsl/v1/mtsl/finance-over-ratio', params)
}

/*
 * 融资融券交易-信用账户关联关系查询
 * @param params
 * @returns {*}
 */
export function accountRelation (params) {
  return post(regularqry + '/mtsl/v1/mtsl/account-relation', params)
}

/*
 * 融资融券交易-卷商下拉框取值
 * @param params
 * @returns {*}
 */
export function memberDropDown (params) {
  return post(regularqry + '/mtsl/v1/mtsl/member-drop-down', params)
}

/*
 * 融资融券交易-信用账户主表查询
 * @param params
 * @returns {*}
 */
export function getCreditAcct (params) {
  return post(regularqry + '/mtsl/v1/get-creditAcct', params)
}

/*
 * 融资融券交易-信用账户子表查询
 * @param params
 * @returns {*}
 */
export function getCreditAcctDetail (params) {
  return post(regularqry + '/mtsl/v1/get-creditAcctDetail', params)
}

/*
 * 融资融券交易-交易过量查询
 * @param params
 * @returns {*}
 */
export function financeTradeOverRatio (params) {
  return post(regularqry + '/mtsl/v1/mtsl/finance-trade-over-ratio', params)
}

/*
 * 融资融券交易-公用导出
 * @param params
 * @returns {*}
 */
export function fnExport (params) {
  return '/regularqry/mtsl/v1/export'
}
