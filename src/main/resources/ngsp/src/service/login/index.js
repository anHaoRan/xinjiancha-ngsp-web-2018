import Vue from 'vue'
import { encryptByDES } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

/**
 * 登录请求
 * @param {object} params 用户名以及密码等参数
 * @returns {*} resp
 */
export function login (params) {
  Vue.http.options.headers = null
  let encryptionPassword = encryptByDES(params.password)

  return Vue.http.post(
    requestPrefix + '/uaa/oauth/token',
    {
      username: params.username,
      password: encryptionPassword,
      'grant_type': 'password',
      'client_id': 'ngsp',
      'client_secret': 'ngspsecret'
    },
    {
      emulateJSON: true
    }
  )
}
