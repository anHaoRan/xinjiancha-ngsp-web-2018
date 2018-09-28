import { post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 预警详情
export function warndetail (params) {
  return post(requestPrefix + '/alarm/warning-detail/v1/warndetail', params)
}
