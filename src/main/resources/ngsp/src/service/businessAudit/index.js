import Vue from 'vue'
import { get } from '../../utils/api'
import { post } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 获取日志数据
export function getLogData(url) {
  return get(requestPrefix + url)
}
export function postModuleData (params) {
  let url = '/profit/v1/get-kind-data'
  return post(requestPrefix + '/admin' + url, params)
}// 提交
