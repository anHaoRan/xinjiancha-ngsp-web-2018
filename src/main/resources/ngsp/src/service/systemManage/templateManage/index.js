import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

export function getTemplates (params) {
  return get(requestPrefix + '/admin/v1/templates/fuzzy', params)
}

export function addTemplate (params) {
  return post(requestPrefix + '/admin/v1/template/add', params)
}

export function updateTemplate (params) {
  return post(requestPrefix + '/admin/v1/template/update', params)
}

export function deleteTemplate (params) {
  return get(requestPrefix + '/admin/v1/template/delete', params)
}
