import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const admin = requestPrefix + '/admin'
export const alarm = requestPrefix + '/alarm'

/*
 * 组织架构树接口
 * @param params
 * @returns {*}
 */
export function getAllRoleOrgs (params) {
  return get(admin + '/admin/v1/getAllRoleOrgs', params)
}

/*
 * 预警-按预警查询
 * @param params
 * @returns {*}
 */
export function getAlarm (params) {
  return post(alarm + '/lore-alarm-history/v1/get-alarm', params)
}

/*
 * 预警-按账户查询
 * @param params
 * @returns {*}
 */
export function getAlarmByAccount (params) {
  return post(alarm + '/lore-alarm-history/v1/get-alarm-by-account', params)
}

/*
 * 预警-导出
 * @returns {*}
 */
export function countTableExport () {
  return '/alarm/lore-alarm-history/v1/export'
}
