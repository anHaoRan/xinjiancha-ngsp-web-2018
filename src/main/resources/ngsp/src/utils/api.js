import Vue from 'vue'
import { passwordKey } from './constants'
import { Message } from 'element-ui'
import { getTokenWithType } from './storageUtil.js'
import { getUrlParam } from './common'

function requestUrlParams () {
  /*  将url里面的role和username，放置headers  */
  let {role, username} = getUrlParam(location.href)
  let propsHeaders = {}
  if (role && username) {
    propsHeaders = {
      role: role || '',
      username: username || ''
    }
  }
  return propsHeaders
}

/**
 * 封装的get请求
 * 返回结果层级为value层
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @return {function} function
 */
export function get (url, params) {
  url = encodeURI(url)
  Vue.http.options.headers = {
    ...{'Authorization': getTokenWithType()}, ...requestUrlParams()
  }
  return Vue.http.get(
  url,
  {
    params: params,
    timeout: 0
  }
  ).then(resp => {
    //  当返回值为空时，直接处理
    if (handleResp(resp).message === null) {
      return Promise.resolve(handleResp(resp).value)
    }
    return Promise.reject(Message.error(handleResp(resp).message))
  })
}

/**
 * 封装的post请求
 * 返回结果层级为value层
 *
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @return {function} function
 */
export function post (url, params) {
  url = encodeURI(url)
  Vue.http.options.headers = {
    ...{'Authorization': getTokenWithType()}, ...requestUrlParams()
  }
  return Vue.http.post(
  url,
  params,
  {
    emulateJSON: true,
    timeout: 0
  }
  ).then(resp => {
    //  当返回值为空时，直接处理
    if (handleResp(resp).message === null) {
      return Promise.resolve(handleResp(resp).value)
    }
    return Promise.reject(Message.error(handleResp(resp).message))
  })
}

/**
 * 请求成功处理
 * @param {object} resp 请求地址
 * @return {object} object
 */
function handleResp (resp) {
  let obj = {
    value: null,
    message: null
  }
  switch (resp.body.code) {
    case 0:
      obj.value = resp.body.value
      break
    default:
      obj.message = resp.body.message
      break
  }
  return obj
}

/**
 * 登录页面密码加密算法
 * @param {string} message 登录输入的密码
 * @return {object} object
 */
export function encryptByDES (message) {
  let keyHex = CryptoJS.enc.Utf8.parse(passwordKey)
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
