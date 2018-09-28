import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const specialqry = requestPrefix + '/specialqry'

/*
 * 任务列表-查询
 */
export function queryManipulateTaskList (params) {
  return post(specialqry + '/operate/v1/qry-acct-task', params)
}

/*
 * 任务列表-新建
 */
export function addManipulateTaskList (params) {
  return post(specialqry + '/operate/v1/add-acct-task', params)
}

/*
 *  操纵分析-取得复核人员数据
 * @returns {*}
 */
export function getReanalUser() {
  return get(specialqry + '/operate/v1/reanal-user')
}
