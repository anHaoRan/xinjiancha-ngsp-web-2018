import {get} from '../../utils/api'
import {requestPrefix} from '../../utils/constants'

// 请求侧边栏菜单
export function getSidebar() {
  return get(requestPrefix + '/uaa/uums/getMenu')
}

// 监测路由权限
export function checkPermissions(router) {
  return get(requestPrefix + '/uaa/uums/authResult?param=' + router)
}
