import {get, post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 数据浏览器-维度树形结构
export function getDimensionality() {
  return get(requestPrefix + '/dataviz/v1/dim/query-dimtype-tree')
}

// 数据浏览器-根据维度查询指标
export function getIndex(dimTypeId) {
  return get(requestPrefix + '/dataviz/v1/indic/query-indictype-tree?dimTypeId=' + dimTypeId)
}

// 数据浏览器-点击维度查询展示字段
export function getDimensionalityColum(dimTypeId) {
  return get(requestPrefix + '/dataviz/v1/dim/query-discol?dimTypeId=' + dimTypeId)
}

// 数据浏览器-点击指标查询展示字段
export function getIndexColum(dicTypeId, dimTypeId) {
  return get(requestPrefix + '/dataviz/v1/indic/query-indic-bytypeid?dicTypeId=' + dicTypeId + '&dimTypeId=' + dimTypeId)
}

// 数据浏览器-点击指标查询参数
export function getIndexParams(dicTypeId, dimTypeId) {
  return get(requestPrefix + '/dataviz/v1/indic/query-param?dicTypeId=' + dicTypeId + '&dimTypeId=' + dimTypeId)
}

// 数据浏览器-点击维度查询参数
export function getDimensionalityParams(dimTypeId) {
  return get(requestPrefix + '/dataviz/v1/dim/query-param?dimTypeId=' + dimTypeId)
}

// 数据浏览器-提取数据
export function pickUpData(params) {
  return post(requestPrefix + '/dataviz/v1/pumpdata', params)
}

// 数据浏览器-保存模板
export function saveBoard(params) {
  return post(requestPrefix + '/dataviz/v1/model/add', params)
}

// 数据浏览器-模板列表查询
export function getBoardList() {
  return get(requestPrefix + '/dataviz/v1/model/list')
}

// 数据浏览器-删除模板
export function deleteBoard(params) {
  return post(requestPrefix + '/dataviz/v1/model/delete', params)
}

// 数据浏览器-编辑模板
export function editBoard(params) {
  return post(requestPrefix + '/dataviz/v1/model/update', params)
}

// 数据浏览器-根据模板提取数据
export function getBoardData(modelId) {
  return get(requestPrefix + '/dataviz/v1/model/pumpdata?modelId=' + modelId)
}

// 数据浏览器-参数设置
export function getEditParams(dimTypeId, dicTypeId) {
  return get(requestPrefix + '/dataviz/v1/query-param-set?dimTypeId=' + dimTypeId + '&dicTypeId=' + dicTypeId)
}

// 数据浏览器-模板参数设置
export function getBoardEditParams(modelId) {
  return get(requestPrefix + '/dataviz/v1/model/query-param-set?modelId=' + modelId)
}
