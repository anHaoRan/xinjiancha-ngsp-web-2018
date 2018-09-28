import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

export function getQureryRes(params) {
  return post(requestPrefix + '/regularqry/stockes-column/v1/get-stockes-column', params)
}
export function getProductTypeOptions(dataType, tag1) {
  return get(requestPrefix + `/admin/v1/link-no/tag1?dataType=${dataType}&tag1=${tag1}`)
}
