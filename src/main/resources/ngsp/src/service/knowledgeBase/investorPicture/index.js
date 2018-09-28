import {post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

export function postIntestorPic(params) {
  return post(requestPrefix + '/iptr/api', params)
}
