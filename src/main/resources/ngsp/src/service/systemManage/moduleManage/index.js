import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 模块管理添加模块
export function postAddModule (params) {
  return post(requestPrefix + '/admin/v1/module/add', params)
}

// 更新模块管理信息
export function postUpdateInfo (params) {
  return post(requestPrefix + '/admin/v1/module/update', params)
}

// 更新模块管理状态
export function postUpdateStatus (params) {
  return post(requestPrefix + '/admin/v1/module/status/update', params)
}

// 删除模块
export function postDeleteInfo (params) {
  return post(requestPrefix + '/admin/v1/module/delete', params)
}

// 查询所有模块
export function getAllInfo () {
  return get(requestPrefix + '/admin/v1/modules/all')
}
