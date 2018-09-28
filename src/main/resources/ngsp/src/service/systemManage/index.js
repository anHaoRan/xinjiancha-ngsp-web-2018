import {post} from '@/utils/api'
import {requestPrefix} from '@/utils/constants'

export const request = requestPrefix + '/admin'

// 根据一个或多个条件查询系统参数
export function getKindData(params) {
  return post(request + '/profit/v1/get-kind-data', params)
}

// 批量更新系统参数
export function updateParamData(params) {
  return post(request + '/profit/v1/update-param-data', params)
}
