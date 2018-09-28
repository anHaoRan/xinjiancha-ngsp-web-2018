import Vue from 'vue'
import { get } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 获取用户信息页面
export function getUserInfo (params) {
  return Vue.http({
    url: '/api/data',
    method: 'GET',
    data: params
    //  设置请求头
    //  headers: {
    //  'Content-Type': 'x-www-from-urlencoded'
    //  }
  })
}

// 点击搜索按钮调用接口
// export function searchInfo () {
//   return get(requestPrefix + '/regularqry/30.17/0.1?productSource=bond&loginPersonId=3gss')
// }

// 登出请求
export function logout () {
  return get(requestPrefix + '/admin/admin/v1/logout')
}

//  验证登录
export function loginAgain () {
  return get(requestPrefix + '/admin/admin/v1/login')
}
