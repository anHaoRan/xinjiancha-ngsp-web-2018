import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'
import { getAccessToken } from '@/utils/storageUtil'

// ************************** 证券板块设置 *****************************

// 证券板块设置(列表和查询) - 根据名称查询具体板块信息
export function postPlate (params) {
  return post(requestPrefix + '/admin/admin/v1/query/plate', params)
}

// 证券板块设置 - 新增
export function postPlateAdd (params) {
  return post(requestPrefix + '/admin/admin/v1/add/plate', params)
}

// 证券板块设置 - 修改
export function postPlateAmend (params) {
  return post(requestPrefix + '/admin/admin/v1/update/plate', params)
}

// 证券板块设置 - 删除
export function getPlateDelete (params) {
  return get(requestPrefix + '/admin/admin/v1/delete/plate', params)
}

// **************************
// 证券板块设置  (左)
export function postPlateLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search/security', params)
}

// 证券板块设置  (右)
export function postPlateRight (params) {
  return post(requestPrefix + '/admin/admin/v1/search/ConnectSec', params)
}

// 证券板块设置 --添加 (右移)
export function postPlateLeftMove (params) {
  return post(requestPrefix + '/admin/admin/v1/add/connectSec', params)
}

// 证券板块设置 --移除 (左移)
export function postPlateRightMove (params) {
  return post(requestPrefix + '/admin/admin/v1/del/connectSec', params)
}

// ************************** 账户组设置 *****************************

// 从账户组类型设置跳转到账户组设置 - 列表数据和查询
export function postSearchAccountTyepList (params) {
  return post(requestPrefix + '/admin/admin/v1/search-account-Group-by-condition', params)
}

// 账户组设置 - 账户组类型下拉框
export function postUserGroupType (params) {
  return post(requestPrefix + '/admin/admin/v1/get-user-group-type-id-name', params)
}

// 账户组设置 - 新增
export function postCreateAccountGroupAdd (params) {
  return post(requestPrefix + '/admin/admin/v1/create-account-Group', params)
}

// 账户组设置 - 修改
export function postCreateAccountGroupAmend (params) {
  return post(requestPrefix + '/admin/admin/v1/update-account-Group-by-id', params)
}

// 账户组设置 - 删除
export function postCreateAccountGroupDelete (params) {
  return post(requestPrefix + '/admin/admin/v1/delete-accountGroup', params)
}

// 账户组设置 - 新增和修改证券代码弹框中的下拉框
export function postSecurityCodeAddInAmend (params) {
  return post(requestPrefix + '/admin/admin/v1/getall-instrument-idname', params)
}

// 账户组设置--搜索账户组下的账户
export function postCreateAccountGroupCode (params) {
  return post(requestPrefix + '/admin/admin/v1/get-related-account', params)
}

// 账户组设置--删除账户组下的账户
export function removeAccountFromGroup (params) {
  return post(requestPrefix + '/admin/admin/v1/remove-account-fromgroup', params)
}

// 账户组设置--添加账户代码
export function postAccountGroupNew (params) {
  return post(requestPrefix + '/admin//admin/v1/add-account-togroup', params)
}

// 账户组设置--上传附件
 export function getUploadAcctgrpFileUrl() {
  return requestPrefix + '/admin/admin/v1/upload-acctgrp-file?access_token=' + getAccessToken()
 }

// 账户组设置--下载附件
export function downloadAppendFile ({appendName, accountGroupId, appendId}) {
  window.location.href = `${requestPrefix}/admin/admin/v1/acctgrp-file-download?fileName=${appendName}&acctgrpId=${accountGroupId}&appendId=${appendId}&access_token=${getAccessToken()}`
}

// 账户组设置--附件列表
export function acctgrpFileList (params) {
  return get(`${requestPrefix}/admin/admin/v1/acctgrp-file-list`, params)
}

// 账户组设置--批量导入
export function insertAccountGroups (params) {
  return post(`${requestPrefix}/admin/admin/v1/insert-accountGroups`, params)
}

// 账户组设置--批量删除
export function deleteAcctgrpBytype (params) {
  return post(`${requestPrefix}/admin/admin/v1/delete-acctgrp-bytype`, params)
}

// 账户组设置--终止、再生效
export function updateAccountGroupState (params) {
  return post(`${requestPrefix}/admin/admin/v1/update-accountGroup-state`, params)
}

// ************************** 账户组类型设置 *****************************
// 账户组类型设置 - 列表数据和查询
export function postSearchAccountTypeList (params) {
  return post(requestPrefix + '/admin/admin/v1/search-user-group-type-by-page', params)
}

// 账户组类型设置 - 新增
export function postAccountTypeListAdd (params) {
  return post(requestPrefix + '/admin/admin/v1/create-user-group', params)
}

// 账户组类型设置 - 修改
export function postAccountTypeListAmend (params) {
  return post(requestPrefix + '/admin/admin/v1/update-user-group-by-id', params)
}

// 账户组类型设置 - 删除
export function postAccountTypeListDelete (params) {
  return post(requestPrefix + '/admin/admin/v1/delete-usergrouptype', params)
}

// ************************** 监控对象设置 *****************************

// 监控对象设置- 列表信息
export function postSearchWatchobjectList (params) {
  return post(requestPrefix + '/admin/admin/v1/search-watchobject-bycondition', params)
}

// 监控对象设置- 监控对象类别下拉框  - 产品类别下拉框
export function getMonitoringObjectType (dataType, tag) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag)
}

// 监控对象设置 - 新增
export function postSearchWatchobjectListAdd (params) {
  return post(requestPrefix + '/admin/admin/v1/create-watchobject', params)
}

// 监控对象设置 - 修改
export function postSearchWatchobjectListAmend (params) {
  return post(requestPrefix + '/admin/admin/v1/update-watchobject', params)
}

// 监控对象设置 - 删除
export function deleteWatchObj (params) {
  return post(`${requestPrefix}/admin/admin/v1/delete-watchobject`, params)
}

// **************************
// 监控对象设置 - 监控对象--添加 (右移)
export function postLeftMove (params) {
  return post(requestPrefix + '/admin/admin/v1/addto-watchobject', params)
}

// 监控对象设置 - 监控对象--移除 (左移)
export function postRightMove (params) {
  return post(requestPrefix + '/admin/admin/v1/removefrom-watchobject', params)
}

// .................. 劵商 ....................

// 监控对象设置 - 监控对象--未连接的劵商搜索 (劵商--左)
export function postSecuritiesTraderLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search-member-bycondition', params)
}

// 监控对象设置 - 监控对象--已连接的劵商查询 (劵商--右)
export function postSecuritiesTraderRight (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectmember-bycondition', params)
}

// ....................... 营业部 ...............
// 监控对象设置 - 监控对象--未连接的营业部搜索 (营业部--左)
export function postSalePartLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search-branch-bycondition', params)
}

// 监控对象设置 - 监控对象--已连接的营业部查询 (营业部--右)
export function postSalePartRight (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectbranch-bycondition', params)
}

// .................. PBU ....................
// 监控对象设置 - 监控对象--未连接的 PBU 搜索 (PBU--左)
export function postPBULeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search-PBU-bycondition', params)
}

// 监控对象设置 - 监控对象--已连接的PBU查询 (PBU--右)
export function postPBURight (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectPBU-bycondition', params)
}

// .................. 账户组 ....................
// 监控对象设置 - 监控对象--未连接的 账户组 搜索 (账户组--左)
export function postGroupLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search-group-bycondition', params)
}

// 监控对象设置 - 监控对象--已连接的账户组查询 (账户组--右)
export function postGroupRight (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectgroup-bycondition', params)
}

// .................. 证券板块 ....................
// 监控对象设置 - 监控对象--未连接的 证券板块 搜索 (证券板块--左)
export function postSecuritiesPlateLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/search-gather-bycondition', params)
}

// 监控对象设置 - 监控对象--已连接的证券板块查询 (证券板块--右)
export function postSecuritiesPlateRight (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectgather-bycondition', params)
}

// ************************** 系统参数 *****************************
// 异常波动监测-市场情绪雷达图
export function getFluctradargraph (params) {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-radar', params)
}

// 根据一个或多个条件查询系统参数
export function getKindData (params) {
  return post(request + '/profit/v1/get-kind-data', params)
}

// 批量更新系统参数
export function updateParamData (params) {
  return post(request + '/profit/v1/update-param-data', params)
}

// 双人双密接口
export function twoPersonTwoPsw (params) {
  return post(requestPrefix + '/uaa/uums/doubleCheck', params)
}

// ************************** 用户角色权限管理 *****************************
// 用户管理 【角色权限】获取组织架构树
export function getAllRoleOrgs () {
  return get(requestPrefix + '/uaa/uums/getAllRoleOrgs')
}

// 3GSS -- 【 浩东】
export function post3GSSData (params) {
  return post(requestPrefix + '', params)
}

// 数据权限查看按钮  -- 【数据权限查看】
export function getCreateParamData (params) {
  return get(requestPrefix + '/admin/admin/v1/searchAuthMonitor', params)
}

// 搜索按钮 -- 【监控对象分配--未分配的监控对象查询/条件查询_copy】
export function postSeachData (params) {
  return post(requestPrefix + '/admin/admin/v1/getwatchobject-bycondition', params)
}

// 数据-左 -- 【监控对象分配--未分配的监控对象查询/条件查询】
export function postAllocationDataLeft (params) {
  return post(requestPrefix + '/admin/admin/v1/getwatchobject-bycondition', params)
}

// 数据-右 -- 【监控对象分配--已分配的监控对象查询】
export function postAllocationDataRight (params) {
  return post(requestPrefix + '/admin/admin/v1/getwatchobject-connected', params)
}

// 添加--右移 -- 【监控对象分配--给用户批量添加监控对象】
export function postAllocationDataLeftMove (params) {
  return post(requestPrefix + '/admin/admin/v1/addwatchobject-touser', params)
}

// 移除--左移 -- 【监控对象分配--从用户上批量移除监控对象】
export function postAllocationDataRightMove (params) {
  return post(requestPrefix + '/admin/admin/v1/remove-watchobject', params)
}

// 模糊查询证券代码 -- 【自定义板块设置--模糊查询证券代码】
export function searchStockCodeListByCharsAndSubTypeCode (params) {
  return get(requestPrefix + '/admin/v1/securities/fuzzy', params)
}

// 模糊查询账户代码 -- 【自定义分类投资者设置--模糊查询账户代码】
/* export function searchStockCodeListByCharsAndInvestorType(params) {
 return get(requestPrefix + '/admin/v1/orginvestors/fuzzy', params);
 } */

// 查询自定义投资者模板 -- 【自定义分类投资者设置--查询自定义投资者模板】
export function getClassifyinvestorList () {
  return post(requestPrefix + '/admin/admin/v1/get-classifyinvestor')
}

// 新建自定义投资者模板 -- 【自定义分类投资者设置--新建自定义投资者模板】
export function createClassifyinvestor (params) {
  return post(requestPrefix + '/admin/admin/v1/create-investor', params)
}

// 更新自定义投资者模板 -- 【自定义分类投资者设置--更新自定义投资者模板】
export function updateClassifyinvestor (params) {
  return post(requestPrefix + '/admin/admin/v1/update-investor', params)
}

// 删除自定义投资者模板 -- 【自定义分类投资者设置--删除自定义投资者模板】
export function deleteClassifyinvestor (params) {
  return post(requestPrefix + '/admin/admin/v1/delete-investor', params)
}

// 查询可添加账户类型列表 -- 【自定义分类投资者设置--查询可添加账户类型列表】
export function getInvestortypeList () {
  return post(requestPrefix + '/admin/admin/v1/get-investortype')
}

// 查询连接的账户列表 -- 【自定义分类投资者设置--查询连接的账户列表】速度慢
export function getUnconnectinvestoraccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/search-unconnectinvestoraccount', params)
}

// 查询连接的账户列表 -- 【自定义分类投资者设置--查询连接的账户列表】较快
export function getUnconnectinvestoraccountsBycur (params) {
  return post(requestPrefix + '/admin/admin/v1/search-unconinvestoraccountbycur', params)
}

// 查询已经连接的账户列表 -- 【自定义分类投资者设置--查询已经连接的账户列表】
export function getConnectinvestoraccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/search-connectinvestoraccount', params)
}

// 模糊搜索账户 -- 【自定义分类投资者设置--模糊搜索账户】
export function quzzySearchAllAccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/quzzysearch-allaccount', params)
}

// 文件导入账户 -- 【自定义分类投资者设置--文件导入账户】
export function fileExportAccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/massimportcreate-finalaccount', params)
}

// 覆盖更新 -- 【自定义分类投资者设置--手动添加保存】
export function handSelectSaveAccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/save-finalaccountlist', params)
}

// 批量添加分类投资者 -- 【自定义分类投资者设置--批量添加】
export function createInvestors (params) {
  return post(requestPrefix + '/admin/admin/v1/masscreate-investoraccount', params)
}

// 批量删除接口
export function deleteAccounts (params) {
  return post(requestPrefix + '/admin/admin/v1/massdelete-investoraccount', params)
}

// 获取板块列表 -- 【自定义板块设置--板块列表】
export function getUserdefinedBoardList (params) {
  return get(requestPrefix + '/admin/biz-param/v1/userdefined-board', params)
}

// 新增板块 -- 【自定义板块设置--新增板块】
export function createUserdefinedBoard (params) {
  return post(requestPrefix + '/admin/biz-param/v1/add-userdefined-board', params)
}

// 修改板块 -- 【自定义板块设置--修改板块】
export function updateUserdefinedBoard (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/modify-userdefined-board`, JSON.stringify(params))
}

// 删除板块 -- 【自定义板块设置--删除板块】
export function deleteUserdefinedBoard (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/delete-userdefined-board`, JSON.stringify(params))
}

// 删除板块下股票 -- 【自定义板块设置--删除板块下股票】
export function deleteStockByCode (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/userdefined-board/delete-stock`, JSON.stringify(params))
}

// 根据板块代码查询所有已选股票 -- 【自定义板块设置--根据板块代码查询所有已选股票】
export function getStockListByBoardCode (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/userdefined-board/stocks`, JSON.stringify(params))
}

// 根据股票code查询是否在已选股票列表中 -- 【自定义板块设置--根据股票code查询是否在已选股票列表中】
export function searchStock (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/userdefined-board/search-stock`, JSON.stringify(params))
}

// 根据板块代码查询所有下面所有股票 -- 【自定义板块设置--根据板块代码查询所有下面所有股票】
export function getAllStockListByBoardCode (params) {
  return get(`${requestPrefix}/fluct/index/v1/index-stock`, params)
}

// 增量更新板块下的股票 -- 【自定义板块设置--根据板块代码查询所有股票】
export function updateBoardStockList (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/userdefined-board/add-stock`, JSON.stringify(params))
}

// 覆盖更新所选股票 -- 【自定义板块设置--覆盖更新所选股票
export function coverUpdateBoardStockList (params) {
  return post(`${requestPrefix}/admin/biz-param/v1/userdefined-board/overwrite-stock`, JSON.stringify(params))
}

// 根据账户code搜索账户信息 -- 【账户组设置--根据账户code搜索账户信息】
export function getAccountInfosBycode (params) {
  return get(`${requestPrefix}/regularqry/v1/accountinfos`, params)
}

// 组织架构树新接口
export function getAllRoleOrgsNew () {
  return get(`${requestPrefix}/admin/admin/v1/getAllRoleOrgs`)
}

// 自定义板块设置和自定义投资者设置中的模板下载所需的fileId和fileName
export function getDownloadTemplateFileInfo (code) {
  return get(`${requestPrefix}/admin/v1/template/code?code=${code}`)
}

// 监控对象设置类型导入接口
export function importWatchObjectType (params) {
  return post(`${requestPrefix}/admin/admin//v1/import-objecttype`, params)
}

// 监控对象设置导出接口
export function exportWatchObject (id) {
  window.location.href = requestPrefix + '/admin/admin/v1/export?watchOBID=' + id + '&access_token=' + getAccessToken()
}

// 证券板块设置导出接口
export function exportSecurity (id) {
  window.location.href = requestPrefix + '/admin/admin/v1/export-security?gatherID=' + id + '&access_token=' + getAccessToken()
}

// 证券板块设置导入接口
export function importSecurity (params) {
  return post(`${requestPrefix}/admin/admin//v1/import-security`, params)
}
