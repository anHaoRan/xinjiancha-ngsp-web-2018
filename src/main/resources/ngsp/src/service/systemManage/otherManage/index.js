import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export function getMyAgentList (params) {
  return post(`${requestPrefix}/bpm/evectionprofixprocess/v1/search-proxy`, params)
}

export function postCreateAgent (params) {
  return post(`${requestPrefix}/bpm/evectionprofixprocess/v1/create-proxy`, params)
}

export function postCancelAgents (params) {
  return post(`${requestPrefix}/bpm/evectionprofixprocess/v1/cancel-proxy`, params)
}

// 在线用户查看列表
export function getOnlineUserList () {
  return get(`${requestPrefix}/admin/admin/v1/onLineUsers`)
}
