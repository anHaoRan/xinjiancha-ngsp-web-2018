import {
  get,
  post
} from '../../utils/api'
import { requestPrefix } from '../../utils/constants'
import { getAccessToken } from '../../utils/storageUtil'

// 自律监管接口
export function postprocessform (url, params) {
  return post(requestPrefix + '/bpm' + url, params)
}//
export function postlaughform (taskId, params, toWhom) {
  let url = '/launchsls/' + taskId + '?toWhom=' + toWhom
  return post(requestPrefix + '/bpm' + url, params)
}// 发起
export function postsucessform (label, taskId, params, toWhom) {
  let url = '/subtorealtime/' + label + '/' + taskId + '?toWhom=' + toWhom
  return post(requestPrefix + '/bpm' + url, params)
}// 通过
export function postselfgulationlist (params) {
  let url = '/supervisionlist'
  return post(requestPrefix + '/bpm' + url, params)
}// 获取列表数据
export function getcheckform (instanceId) {
  let url = '/slsinfos?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 获取页面数据
export function gethistoryopiniondata (instanceId) {
  let url = '/historyopinion/sls/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 获取历史意见
export function getanalyresult (infoId, oneword) {
  let url = '/v1/sls/autoanalize?infoId=' + infoId + '&oneword=' + oneword
  return get(requestPrefix + '/bpm' + url)
}// 获取分析结果
export function getbuttonname (taskId) {
  let url = '/operateoption/' + taskId
  return get(requestPrefix + '/bpm' + url)
}// 获取按钮名称
export function postissubmit (url, params) {
  return post(requestPrefix + '/bpm' + url, params)
}

export function getnumber (createtype) {
  let url = '/nextwarningno?createType=' + createtype
  return get(requestPrefix + '/bpm' + url)
}// 获取编号
export function postdelete (instanceId) {
  let url = '/v1/sls/delete/' + instanceId
  return post(requestPrefix + '/bpm' + url)
}// 删除记录
export function getaccountinfo (TxtData) {
  let url = '/regularqry/v1/accountinfos?accountCode=' + TxtData
  return get(requestPrefix + url)
}// 获取基本信息列表
export function gethistoryinfo (oneword) {
  let url = '/bpm/v1/history?oneword=' + oneword
  return get(requestPrefix + url)
}// 获取历史列表
export function save (taskId, params) {
  let url = '/savesls/' + taskId
  return post(requestPrefix + '/bpm' + url, params)
}// 保存页面数据
export function getselfletternumber (lettertype2) {
  let url = '/nextletterno?letterType2=' + lettertype2
  return get(requestPrefix + '/bpm' + url)
}// 获取函件编号数字
export function getselflettercompeletenum (surverletter, assitletter, number) {
  let url = '/v1/letterno/change?letterType1=' + surverletter + '&letterType2=' + assitletter + '&preType=' + number
  return get(requestPrefix + '/bpm' + url)
}// 获取完整函件编号
export function postsendletter (taskId, params) {
  let url = '/letter/' + taskId
  return post(requestPrefix + '/bpm' + url, params)
}// f发函
export function postreturnletter (taskId, params) {
  let url = '/uploadreply/' + taskId
  return post(requestPrefix + '/bpm' + url, params)
}// f回函
export function getcompeletedata (warningNo) {
  let url = '/slsinfos?instanceId=' + warningNo
  return get(requestPrefix + '/bpm' + url)
}// 历史监管表格转出
export function postfinishform (taskId, params) {
  let url = '/finishscheme/' + taskId
  return post(requestPrefix + '/bpm' + url, params)
}// 完结
export function getsuspendtable (accountCode, instrumentId) {
  let url = '/regularqry/v1/accountinfos?accountCode=' + accountCode + '&instrumentId=' + instrumentId
  return get(requestPrefix + url)
}// 暂停交易表
export function getdisplaywarninfo (alarmId) {
  let url = '/alarm/warning-detail/v1/warndetail?alarmId=' + alarmId
  return post(requestPrefix + url)
}// 预警转入
export function recalllist (params) {
  let url = '/v1/withdraw'
  return post(requestPrefix + '/bpm' + url, params)
}// 撤回
export function postgenerateletter (params) {
  let url = '/slsprocess/v1/letter/generate'
  return post(requestPrefix + '/bpm' + url, params)
}// 自律监管生成函件

// 调取资料接口
export function postsurveylist (params) {
  let url = '/obdprocess/v1/obdlist'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function getletternum (surverletter, assitletter) {
  let url = '/nextletterno?letterType1=' + surverletter + '&letterType2=' + assitletter
  return get(requestPrefix + '/bpm' + url)
}// 获取发函编号
export function getsurveynumber (createType) {
  let url = '/nextobdno?createType=' + createType
  return get(requestPrefix + '/bpm' + url)
}// 获取预警基本信息中编号
export function getsurveycheckform (instanceId) {
  let url = '/obdprocess/v1/obdinfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 页面form数据
export function postsurveyprocessform (params) {
  let url = '/obdprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 发起
export function getsurveyhistoryopiniondata (instanceId) {
  let url = '/historyopinion/obd/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 历史意见表格数据
export function getsurveybuttonname (taskId) {
  let url = '/operateoption/' + taskId
  return get(requestPrefix + '/bpm' + url)
}// 获取按钮
export function postsurveyapproveform (params) {
  let url = '/obdprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 所有通过按钮
export function getsurveyaccountinfo (isaccountCode) {
  let url = '/regularqry/v1/accountinfos?accountCode=' + isaccountCode
  return get(requestPrefix + url)
}// 获取预警信息表格数据
export function getsurveyhistroyinfo (isaccountCodes) {
  let url = '/v1/history?accountCodes=' + isaccountCodes
  return get(requestPrefix + '/bpm' + url)
}// 获取历史信息表格数据
export function postdeleteobd (params) {
  let url = '/obdprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除记录
export function postsaveobd (params) {
  let url = '/obdprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function getsurveyletternumber (letterType2) {
  let url = '/nextletterno?letterType2=' + letterType2
  return get(requestPrefix + '/bpm' + url)
}// 获取函件编号数字
export function getsurveylettercompeletenum (surverletter, assitletter, number) {
  let url = '/v1/letterno/change?letterType1=' + surverletter + '&letterType2=' + assitletter + '&preType=' + number
  return get(requestPrefix + '/bpm' + url)
}// 获取完整函件编号

// 联合监管发函
export function postsendletterlist (params) {
  let url = '/unsprocess/send/v1/unslist'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function postsendletterprocessform (params) {
  let url = '/unsprocess/send/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 发起
export function getsendletternum (r) {
  let url = '/v1/unsletterno/next'
  return get(requestPrefix + '/bpm' + url)
}// 获取发函编号
export function postsaveprocessform (params) {
  let url = '/unsprocess/send/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function getsendletterform (instanceId) {
  let url = '/unsprocess/send/v1/unsinfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 页面form数据
export function postreviewletterprocessform (params) {
  let url = '/unsprocess/send/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 通过
export function getsendletterhistoryopiniondata (instanceId) {
  let url = '/historyopinion/unssend/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 历史意见表格数据
export function postdeletesendletter (params) {
  let url = '/unsprocess/send/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除记录

// 联合监管复函
export function postreplyletterlist (params) {
  let url = '/unsprocess/check/v1/unslist'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function postreplyletterprocessform (params) {
  let url = '/unsprocess/check/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 发起
export function getletterrecordtable (security) {
  let url = '/unsprocess/check/v1/letterstat/history?security=' + security
  return get(requestPrefix + '/bpm' + url)
}// 相关股票来函记录
export function getreplyletterform (instanceId) {
  let url = '/unsprocess/check/v1/unsinfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 页面form数据
export function submitreplyletter (params) {
  let url = '/unsprocess/check/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 提交
export function getnum (lastLetterType, letterType) {
  let url = '/v1/unscheckno/next?lastLetterType=' + lastLetterType + '&letterType=' + letterType
  return get(requestPrefix + '/bpm' + url)
}// 相关股票来函记录
export function getreplyletterhistoryopiniondata (instanceId) {
  let url = '/historyopinion/unscheck/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 历史意见表格数据
export function replysaveprocessform (params) {
  let url = '/unsprocess/check/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function postdeletecheckletter (params) {
  let url = '/unsprocess/check/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除记录

export function getsubmitname (params) {
  let url = '/v1/user/approve'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function getfilelist (infoId) {
  let url = '/v2/attachments/show?infoId=' + infoId
  return get(requestPrefix + '/bpm' + url)
}// 文件展示
export function deletefile (fileId) {
  let url = '/v1/attachment/delete?fileId=' + fileId
  return post(requestPrefix + '/bpm' + url)
}// 文件删除
export function ispermitload (instanceID) {
  let url = '/affixAuthority?instanceID=' + instanceID
  return get(requestPrefix + '/bpm' + url)
}// 文件下载权限

// /数据协查
export function dataassociationtablelist (params) {
  let url = '/digprocess/v1/diglist'
  return post(requestPrefix + '/bpm' + url, params)
}// 数据协查列表
export function getUserRoles (username) {
  let url = '/uaa/uums/getUserRoles?username=' + username
  return get(requestPrefix + url)
}// 数据协查新建获取人员角色
export function postdataassociationLunchForm (params) {
  let url = '/digprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
} // 数据协查发起
export function postdataassociationleaderform (params) {
  let url = '/digprocess/v1/launch/leader'
  return post(requestPrefix + '/bpm' + url, params)
}// 数据协查组长发起
export function postdataassociationgrouperform (params) {
  let url = '/digprocess/v1/launch/grouper'
  return post(requestPrefix + '/bpm' + url, params)
}// 数据协查组员发起
export function postdataassociationsaveform (params) {
  let url = '/digprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 数据协查保存
export function getdataassociationhistoryopiniondata (instanceId) {
  let url = '/historyopinion/dig/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 数据协查历史意见表格数据
export function postdataassociationexamineform (params) {
  let url = '/digprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 数据协查审批
export function postdataassociationdata (instanceId) {
  let url = '/digprocess/v1/diginfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 数据协查表单数据
export function gedataassociationtnum (surverletter, assitletter, number) {
  let url = '/v1/digno/next?letterType1=' + surverletter + '&letterType2=' + assitletter + '&preType='
  return get(requestPrefix + '/bpm' + url)
}// 获取完整数据协查函件编号
export function dataassociationdelete (params) {
  let url = '/digprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除
export function downloadReceipt (receiptnumber) {
  let url = '/digprocess/v1/receipt/generate?receiptNo=' + receiptnumber
  return get(requestPrefix + '/bpm' + url)
}// 签收单模板下载

// // /舆情分析
export function getlyricnum () {
  let url = '/v1/no/next?processName=poa'
  return get(requestPrefix + '/bpm' + url)
}// 获取number
export function getInfoId () {
  let url = '/infoId/new'
  return get(requestPrefix + '/bpm' + url)
}// 获取infoid
export function lyriclaunch (params) {
  let url = '/poaprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 舆情分析发起
export function lyricsave (params) {
  let url = '/poaprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 舆情分析保存
export function lyrictablelist (params) {
  let url = '/poaprocess/v1/poalist'
  return post(requestPrefix + '/bpm' + url, params)
}// 舆情分析列表
export function lyricdelete (params) {
  let url = '/poaprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除
export function lyrichistoryopiniondata (instanceId) {
  let url = '/historyopinion/poa/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

export function postlyricdata (instanceId) {
  let url = '/poaprocess/v1/poainfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 舆情分析表单数据
export function lyricexamine (params) {
  let url = '/poaprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 舆情分析examine
//  export function lyrichistoryopiniondata(instanceId) {
//  let url = "/historyopinion/poa/" + instanceId;
//  return get(requestPrefix +"/bpm" + url)
//  }// 舆情分析历史意见表格数据

export function specialWorklaunch (params) {
  let url = '/spwprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 专项工作发起
export function specialWorksave (params) {
  let url = '/spwprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 专项工作保存
export function specialWorkexamine (params) {
  let url = '/spwprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 专项工作通过
export function getspecialWorknum (role) {
  let url = '/v1/no/next?processName=spw&role=' + role
  return get(requestPrefix + '/bpm' + url)
}// 专项工作编号
export function specialWorktablelist (params) {
  let url = '/spwprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 专项工作列表
export function getperformer (roleCode) {
  let url = '/uaa/uums/getRoleUsers?roleCode=' + roleCode
  return get(requestPrefix + url)
}// 专项工作执行人
export function specialWorkdelete (params) {
  let url = '/spwprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 专项工作删除
export function postspecialWorkdata (instanceId) {
  let url = '/spwprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 专项工作表单
export function specialWorkhistoryopiniondata (instanceId) {
  let url = '/historyopinion/spw/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

// 异常行为统计
export function postAbnormalBehavelist (params) {
  let url = '/history/abnorbehav/punish'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
// 账户统计
export function postAbnormalAccountlist (params) {
  let url = '/history/abnorbehav/account'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
// 自律监管统计会员
export function postSelfregulatoryMemberlist (params) {
  let url = '/history/slsprocess/member'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
// 自律监管统计账户
export function postSelfregulatoryAccountlist (params) {
  let url = '/history/slsprocess/account'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据

// 临时计算
export function temporaryCalculationlaunch (params) {
  let url = '/tpcprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 临时计算发起
export function gettemporaryCalculationnum (role) {
  let url = '/v1/no/next?processName=tpc&role=' + role
  return get(requestPrefix + '/bpm' + url)
}// 临时计算编号
export function temporaryCalculationlist (params) {
  let url = '/tpcprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function temporaryCalculationdelete (params) {
  let url = '/tpcprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 临时计算删除
export function temporaryCalculationsave (params) {
  let url = '/tpcprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 临时计算保存
export function temporaryCalculationdata (instanceId) {
  let url = '/tpcprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 临时计算表单
export function temporaryCalculationexamine (params) {
  let url = '/tpcprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 临时计算通过
export function temporaryCalculationhistoryopiniondata (instanceId) {
  let url = '/historyopinion/tpc/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

// 权限申请
export function accessRequestlaunch (params) {
  let url = '/rfpprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 权限申请发起
export function getAccessRequestnnum () {
  let url = '/v1/no/next?processName=rfp'
  return get(requestPrefix + '/bpm' + url)
}// 权限申请编号
export function AccessRequestlist (params) {
  let url = '/rfpprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function AccessRequestdelete (params) {
  let url = '/rfpprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 权限申请删除
export function AccessRequestsave (params) {
  let url = '/rfpprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 权限申请保存
export function AccessRequestdata (instanceId) {
  let url = '/rfpprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 权限申请表单
export function AccessRequestexamine (params) {
  let url = '/rfpprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 权限申请通过
export function AccessRequesthistoryopiniondata (instanceId) {
  let url = '/historyopinion/rfp/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

// 需求管理
export function demandManagementlaunch (params) {
  let url = '/dmgprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 需求管理发起
export function demandManagementnnum () {
  let url = '/v1/no/next?processName=dmg'
  return get(requestPrefix + '/bpm' + url)
}// 需求管理编号
export function demandManagementlist (params) {
  let url = '/dmgprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function demandManagementdelete (params) {
  let url = '/dmgprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 需求管理删除
export function demandManagementsave (params) {
  let url = '/dmgprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 需求管理保存
export function demandManagementdata (instanceId) {
  let url = '/dmgprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 需求管理表单
export function demandManagementexamine (params) {
  let url = '/dmgprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 需求管理通过
export function demandManagementhistoryopiniondata (instanceId) {
  let url = '/historyopinion/dmg/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

export function getperson (params) {
  let url = '/v1/user/approve'
  return post(requestPrefix + '/bpm' + url, params)
}// 获取分配人员

export function reqPersonTreeData (params) {
  let url = '/v2/user/approve'
  return post(requestPrefix + '/bpm' + url, params)
} // 获取分配人员 v2版本

export function createperson (createperson) {
  let url = '/history/slsprocess/createrlist?proposer=' + createperson
  return get(requestPrefix + '/bpm' + url)
}// 创建人员模糊匹配
export function sendletterperson (sendPerson) {
  let url = '/history/slsprocess/senderlist?sendPerson=' + sendPerson
  return get(requestPrefix + '/bpm' + url)
}// 发函人模糊匹配
export function letterNumber (warningNo) {
  let url = '/history/slsprocess/letternolist?letterNo=' + warningNo
  return get(requestPrefix + '/bpm' + url)
}// 发函人模糊匹配
export function departmentname (salePart, index) {
  return get(requestPrefix + '/admin/v1/participators/fuzzy?level=salePart&fuzzyChars=' + salePart + '&pageIndex=' + index + '&pageRows=20')
}// 营业部名称模糊匹配
export function membername (salePart, index) {
  return get(requestPrefix + '/admin/v1/participators/fuzzy?level=member&fuzzyChars=' + salePart + '&pageIndex=' + index + '&pageRows=20')
}// 会员名称模糊匹配

// 借阅
export function letterBorrowlaunch (params) {
  let url = '/ltbprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 借阅发起
export function letterBorrowlist (params) {
  let url = '/ltbprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function letterBorrowdelete (params) {
  let url = '/ltbprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 借阅删除
// export function letterBorrowdelete(params) {
// let url='/ltbprocess/v1/delete '
// return post(requestPrefix + "/bpm"+ url,params)
//  }// 借阅表单列表
export function letterBorrowsave (params) {
  let url = '/ltbprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 借阅保存
export function letterBorrowdata (instanceId) {
  let url = '/ltbprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 函件借阅表单
export function getGroup (userName) {
  let url = '/admin/admin/v1/getUsersResource?userName=' + userName
  return get(requestPrefix + url)
}// 获取所属组
export function letterBorrowexamine (params) {
  let url = '/ltbprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 函件借阅通过
export function letterBorrowhistoryopiniondata (instanceId) {
  let url = '/historyopinion/ltb/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据
// 函件传阅
export function ltlProcessList (params) { // 传阅列表数据
  let url = '/ltlprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}
export function getLetterLendData (instanceId) { // 函件传阅表单
  let url = '/ltlprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}
export function letterLendSave (params) { // 传阅保存
  let url = '/ltlprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}
export function letterLendLaunch (params) { // 传阅发起
  let url = '/ltlprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}
export function letterLendExamine (params) { // 传阅提交
  let url = '/ltlprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}
export function letterLendDelete (params) { // 传阅删除
  let url = '/ltlprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}
export function batchLtbProcess (params) { // 批量借阅
  let url = '/ltbprocess/v1/launch/batch'
  return post(requestPrefix + '/bpm' + url, params)
}
export function batchLtlProcess (params) { // 批量传阅
  let url = '/ltlprocess/v1/launch/batch'
  return post(requestPrefix + '/bpm' + url, params)
}
// 监察任务首页
// 待办
export function topPageTodolist (params) {
  let url = '/homepage/todolist'
  return post(requestPrefix + '/bpm' + url, params)
}

export function topPagedelete (processName, params) {
  let url = '/' + processName + '/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 首页删除

// 在办
export function topPageDoinglist (params) {
  let url = '/homepage/havedonelist'
  return post(requestPrefix + '/bpm' + url, params)
}

// 已办
export function topPageDonelist (params) {
  let url = '/homepage/finishlist'
  return post(requestPrefix + '/bpm' + url, params)
}

export function getReceiptName () {
  let url = '/v1/no/next?processName=receipt'
  return get(requestPrefix + '/bpm' + url)
}

// 市场分析
export function ReportNum (processName, lastProcessName) {
  let url = '/v1/no/next?processName=' + processName + '&lastProcessName=' + lastProcessName
  return get(requestPrefix + '/bpm' + url)
}

export function marketAnalysisleaderform (params) {
  let url = '/mkaprocess/v1/launch/leader'
  return post(requestPrefix + '/bpm' + url, params)
}// 组长发起
export function marketAnalysisgrouperform (params) {
  let url = '/mkaprocess/v1/launch/grouper'
  return post(requestPrefix + '/bpm' + url, params)
}// 组员发起
export function marketAnalysisexamine (params) {
  let url = '/mkaprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 通过
export function marketAnalysislist (params) {
  let url = '/mkaprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function marketAnalysisdelete (params) {
  let url = '/mkaprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除
export function marketAnalysissave (params) {
  let url = '/mkaprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function marketAnalysisdata (instanceId) {
  let url = '/mkaprocess/v1/mkainfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 表单
export function marketAnalysishistoryopiniondata (instanceId) {
  let url = '/historyopinion/mka/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据

// 日志审计
export function getlogAuditnum () {
  let url = '/v1/no/next?processName=lad'
  return get(requestPrefix + '/bpm' + url)
}

export function logAuditlaunch (params) {
  let url = '/ladprocess/v1/launch'
  return post(requestPrefix + '/bpm' + url, params)
}// 发起
export function logAuditsave (params) {
  let url = '/ladprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function logAudittablelist (params) {
  let url = '/ladprocess/v1/list'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function logAuditdelete (params) {
  let url = '/ladprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除
export function postlogAuditdata (instanceId) {
  let url = '/ladprocess/v1/info?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 表单
export function logAudithistoryopiniondata (instanceId) {
  let url = '/historyopinion/lad/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据
export function logAuditexamine (params) {
  let url = '/ladprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 通过
export function getLeader (group) {
  let url = '/admin/public/v1/getGroupLeader/multi?groupIdParam=' + group
  return get(requestPrefix + url)
}// 获取组长

// 线索报告
export function getClueReportnum () {
  let url = '/v1/no/next?processName=crp'
  return get(requestPrefix + '/bpm' + url)
}

export function getClueReportLetternum (processName, lastProcessName) {
  let url = '/v1/no/next?processName=' + processName + '&lastProcessName=' + lastProcessName
  return get(requestPrefix + '/bpm' + url)
}// 函件编号
export function realGroupClueReportlaunch (params) {
  let url = '/crpprocess/v1/launch/grouper/real'
  return post(requestPrefix + '/bpm' + url, params)
}// 实时组发起
export function historyGroupLeaderClueReportlaunch (params) {
  let url = '/crpprocess/v1/launch/leader/history'
  return post(requestPrefix + '/bpm' + url, params)
}// 历史组组长发起
export function historyGrouperClueReportlaunch (params) {
  let url = '/crpprocess/v1/launch/grouper/history'
  return post(requestPrefix + '/bpm' + url, params)
}// 历史组组员发起
export function ClueReportsave (params) {
  let url = '/crpprocess/v1/save'
  return post(requestPrefix + '/bpm' + url, params)
}// 保存
export function ClueReporttablelist (params) {
  let url = '/crpprocess/v1/crplist'
  return post(requestPrefix + '/bpm' + url, params)
}// 列表数据
export function ClueReportdelete (params) {
  let url = '/crpprocess/v1/delete'
  return post(requestPrefix + '/bpm' + url, params)
}// 删除
export function postClueReportdata (instanceId) {
  let url = '/crpprocess/v1/crpinfo?instanceId=' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// 表单
export function ClueReportexamine (params) {
  let url = '/crpprocess/v1/examine'
  return post(requestPrefix + '/bpm' + url, params)
}// 通过
export function ClueReporthistoryopiniondata (instanceId) {
  let url = '/historyopinion/crp/' + instanceId
  return get(requestPrefix + '/bpm' + url)
}// V历史意见表格数据
export function getMonitorGroupsInfo (TxtData) {
  let url = '/bpm/magprocess/v1/getMagRecs?monitorNo=' + TxtData
  return get(requestPrefix + url)
}// 获取账户组列表
export function getMonitorSecurityInfo (TxtData) {
  let url = '/bpm/mscprocess/v1/getMscRecs?monitorNo=' + TxtData
  return get(requestPrefix + url)
}// 获取监控证券列表
export function postReportInquirelist (params) {
  let url = '/history/crpprocess/report'
  return post(requestPrefix + '/bpm' + url, params)
}// 线索上报知识库按报告查询
export function postAccountInquirelist (params) {
  let url = '/history/crpprocess/account'
  return post(requestPrefix + '/bpm' + url, params)
}// 线索上报知识库按报告查询
export function clueReportdraftperson (drafter) {
  let url = '/history/crpprocess/drafter?drafter=' + drafter
  return get(requestPrefix + '/bpm' + url)
}// 线索上报知识库拟稿人员模糊匹配
export function clueReportsendletterperson (sendPerson) {
  let url = '/history/crpprocess/sendperson?sendPerson=' + sendPerson
  return get(requestPrefix + '/bpm' + url)
}// 线索上报知识库发函人模糊匹配
export function clueReportletterNumberMethod (letterNo) {
  let url = '/history/crpprocess/letternolist?letterNo=' + letterNo
  return get(requestPrefix + '/bpm' + url)
}

// 通过processName查询activityName数组
export function getActivityNameByProcessName (processName) {
  let url = `/v1/process/activityname?processName=${processName}`
  return get(requestPrefix + '/bpm' + url)
}

// 调取资料-历史信息
export function getObtainedInfo (params) {
  return post(`${requestPrefix}/bpm/obdprocess/v1/supervise/history`, JSON.stringify(params))
}

// 调取资料-生成函件
export function obdprocessGenerateLetter (params) {
  return post(`${requestPrefix}/bpm/obdprocess/v1/letter/generate`, JSON.stringify(params))
}

// 数据协查-线索报告关联table信息
export function getDigProcessCrphistoryInfo (params) {
  return post(`${requestPrefix}/bpm/digprocess/v1/crphistory/list`, JSON.stringify(params))
}

// 数据协查-线索报告关联table信息-是否关联开关
export function postDigprocessConnect (params) {
  return post(`${requestPrefix}/bpm/digprocess/v1/crp/connect`, JSON.stringify(params))
}

// 判断是否有权限进行新建
export function getCreateAuthority (processName) {
  return get(`${requestPrefix}/bpm/v1/process/authority?processName=${processName}`)
}

// 函件借阅表单页面表格数据获取
export function getletterBorrowTableData (params) {
  return get(`${requestPrefix}/bpm/v1/borrowletters/infos`, params)
}

// 根据infoId或者instanceId获取当前流程状态
export function getProcessStatusById (id) {
  return get(`${requestPrefix}/bpm/v1/processstatus/byid?processId=${id}`)
}

// 意见审核表格信息
export function getHistoryOpinions (instanceId) {
  return get(`${requestPrefix}/bpm/v2/historyopinion/${instanceId}`)
}
// 公共上传接口
export function uploadFileCommon (infoId, fileLoc) {
  return `${requestPrefix}/zuul/bpm/v1/attachment/upload?infoId=${infoId}&fileLoc=${fileLoc}&access_token=${getAccessToken()}`
}
// 自律监管重构-table列表
export function reqSlsProcessTableData (params) {
  return post(`${requestPrefix}/bpm/slsprocess/v1/list`, JSON.stringify(params))
}
// 自律监管重构-lanch发起
export function slsProcessLanch (params) {
  return post(`${requestPrefix}/bpm/slsprocess/v1/launch`, JSON.stringify(params))
}
// 自律监管重构-examine提交
export function slsProcessExamine (params) {
  return post(`${requestPrefix}/bpm/slsprocess/v1/examine`, JSON.stringify(params))
}
// 自律监管重构-save保存
export function slsProcessSave (params) {
  return post(`${requestPrefix}/bpm/slsprocess/v1/save`, JSON.stringify(params))
}
// 修改自律监管和调取资料的生成函件
export function getModifyFileUrlById (id) {
  return `${requestPrefix}/bpm/v1/attachment/modify?id=${id}`
}
// 流程首页图表1
export function getChart1 () {
  return post(`${requestPrefix}/bpm/v1/gztj/todayhavedone/proportion`, JSON.stringify({}))
}
// 流程首页图表2
export function getChart2 () {
  return post(`${requestPrefix}/bpm/v1/gztj/processcount/tendays`, JSON.stringify({}))
}

// 流程首页图表3
export function getChart3 () {
  return post(`${requestPrefix}/bpm/v1/gztj/average/processtime/tendays`, JSON.stringify({}))
}

// 流程首页图表4
export function getChart4 (params) {
  return get(`${requestPrefix}/alarm/warning/v1/get-alarm-trend?alarmDateStart=${params}`)
}
