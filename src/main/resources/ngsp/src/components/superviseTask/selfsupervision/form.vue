<template>
  <div class="selfSupervisionFormPage">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <show-warning-detail-button
      :alarmId="alarmId"
      :showWarningDetailButton="!!alarmId"
    ></show-warning-detail-button>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='comfirmCommitInfo'></select-person-component>
    <FormCard1
      ref="formCard1"
      v-if="formCard1Show"
      :loadingProps.sync="loading"
      :disabled="formCard1Disabled"
      :tableDataProps.sync="slsAccountinfos"
      :formCard1.sync="formCard1"
      :infoId="infoId"
      :createType="createType"
      :isWarningReturnInto="isWarningReturnInto"
      :showUploadButton="showUploadButton"
      :defaultLimitFileType="defaultLimitFileType"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
      @updateRegulatoryHistorysAndObtainenInfo="updateRegulatoryHistorysAndObtainenInfo"
      @updateTableInvestigationInfo="updateTableInvestigationInfo"
    ></FormCard1>
    <FormCard2
      v-if="formCard2Show"
      :loading.sync="loading"
      :columns="card2Columns"
      :disabled="formCard2Disabled"
      :tableData="ngspRegulatoryHistorys"
      :processStatus="processStatus"
      :handleStatus="handleStatus"
      :showAnalyResult="true"
      :analyResultProps.sync="analyResult"
      @updateAnalyResult="updateAnalyResult"
    ></FormCard2>
    <FormCard3
      v-if="formCard3Show"
      :loading.sync="loading"
      :columns="card3Columns"
      :disabled="formCard3Disabled"
      :tableData="obtainedTableInfo"
    ></FormCard3>
    <FormCard4
      ref="formCard4"
      v-if="formCard4Show"
      :infoId="infoId"
      :loading="loading"
      :showUploadButton="showUploadButton"
      :disabled="formCard4Disabled"
      :formCard4.sync="formCard4"
      :canExportTableInfo="canExportTableInfo"
      :pauseTableData.sync="slsPauseTrades"
      :limitTableData.sync="slsRestrictTrades"
      :defaultLimitFileType="defaultLimitFileType"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
      @updateLimitTimeToTable="updateLimitTimeToTable"
    ></FormCard4>
    <!--v-if="formCard5Show"-->
    <FormCard5
      ref="formCard5"
      v-if="formCard5Show"
      :disabled="formCard5Disabled"
      :formCard5.sync="formCard5"
      :infoId="infoId"
      :loading="loading"
      :loading1="loading1"
      :showUploadButton="showUploadButton"
      :defaultLimitFileType="defaultLimitFileType"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
      @generateLetter="generateLetter"
    ></FormCard5>
    <suggestion-textarea-component
      ref='suggestFormRef'
      :disabled="suggestDisabled"
      :show="suggestShow"
      :steps="steps"
      :propsComment="suggestionForm"
      @updateApproveFlag="updateApproveFlag"
      @handleInputSuggestion="handleInputSuggestion"
      @updateStepsDescription="updateStepsDescription"></suggestion-textarea-component>
    <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit" @goBack="goBack" :loading="commitLoading"></bottom-button-group>
  </div>
</template>
<script>
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import {formAuthority} from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import FormCard2 from '../superviseTaskComponent/NgspRegulatoryHistorysTable'
  import FormCard3 from '../superviseTaskComponent/ObtainedTable'
  import FormCard4 from './component/FormCard4'
  import FormCard5 from './component/FormCard5'
  import ShowWarningDetailButton from '../superviseTaskComponent/ShowWarningDetailButton'
  import {card2Columns, card3Columns} from './component/constants'
  import {
    slsProcessLanch,
    slsProcessExamine,
    slsProcessSave,
    getcheckform, // 表单信息
    getObtainedInfo,
    getfilelist,
    ispermitload,
    deletefile,
    postgenerateletter,
    getnumber,
    getdisplaywarninfo,
    gethistoryinfo,
    getanalyresult,
    getsuspendtable // 盘中暂停或限制交易
  } from '@/service/superviseTask'
  import {dateformat} from '@/utils/dateTimeFormat'
  export default {
    components: {
      FormCard1,
      FormCard2,
      FormCard3,
      FormCard4,
      FormCard5,
      ShowWarningDetailButton
    },
    mixins: [MinxinVue, MixinAuthority],
    computed: {
      formCard1Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
      },
      formCard2Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']
      },
      formCard3Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard3']['disabled']
      },
      formCard4Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard4']['disabled']
      },
      formCard5Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard5']['disabled']
      },
      suggestDisabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['suggestForm']['disabled']
      },
      formCard1Show() {
        return formAuthority[this.processStatus]['formCard1']['show']
      },
      formCard2Show() {
        return formAuthority[this.processStatus]['formCard2']['show']
      },
      formCard3Show() {
        return formAuthority[this.processStatus]['formCard3']['show']
      },
      formCard4Show() {
        return formAuthority[this.processStatus]['formCard4']['show']
      },
      formCard5Show() {
        return formAuthority[this.processStatus]['formCard5']['show']
      },
      suggestShow() {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data() {
      return {
        card2Columns,
        card3Columns,
        loading: false,
        loading1: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/selfregulation',
          label: '自律监管'
        }, {
          router: '',
          label: '自律监管表单'
        }],
        formCard1: {
          title: '无-集合竞价虚假申报',
          invesNo: '',
          stockCode: [],
          fileList: [],
          nullStockCode: 1,
          investigation: '集合竞价虚假申报',
          abnormalBehav: '拉升虚拟开盘价',
          logs: ''
        },
        formCard4: {
          keyword: '',
          obtainType: '0',
          differentClassify: '',
          transactionLimit: '', // 限制期限
          superviseScheme: [],
          assistScheme: [],
          investorMark: false,
          fileList: []
        },
        formCard5: {
          letterType: ['自律监管措施函', '市场监察警示函—0105'],
          letterName: '',
          needreply: '0',
          msgtarget: [],
          shortmsg: '上交所今日向你单位发送{title},请登录会员专区-市场监察专栏查收.',
          letterNo: '',
          fileList: [], // 发函附件
          fileList1: [], // 回函附件
          lettersent: '', // 发函人
          sentdate: '' // 发函日期
        },
        canExportTableInfo: false,
        slsAccountinfos: [], // 预警账户信息table
        obtainedTableInfo: [], // 历史监控信息table
        ngspRegulatoryHistorys: [], // history
        slsPauseTrades: [], // 盘中暂停表
        slsRestrictTrades: [], // 限制交易表
        showUploadButton: true, // 显示上传按钮权限
        createType: '1', // 预警转入和实时监控分析转入为‘0’
        alarmId: '', // 预警转入id
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        isWarningReturnInto: false, // 预警转入
        analyResult: [] // 分析结果
      }
    },
    methods: {
      handleSave() {
        let params = this.getCommonParams()
        slsProcessSave(params).then(() => {
          this.opearteParam = ''
          this.$message.success('保存成功')
          this.canExportTableInfo = true
        })
      },
      validateForms() {
        let flag1 = true, flag2 = true, flag3 = true
        if (this.$refs.formCard1) {
          flag1 = this.$refs.formCard1.validateFormCard()
        }
        if (this.$refs.formCard4) {
          flag2 = this.$refs.formCard4.validateFormCard()
        }
        if (this.$refs.formCard5) {
          flag3 = this.$refs.formCard5.validateFormCard()
        }
        return flag1 && flag2 && flag3
      },
      handleCommit() {
        if (!this.validateForms()) {
          return
        }
        if (!this.slsAccountinfos.length) {
          this.$message.error('账户信息不能为空')
          return
        }
        if (this.approveFlag === 'false') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.comfirmCommitInfo()
          }).catch(() => {})
        } else {
          if (this.showSelectPersonArray.indexOf(Number(this.processStatus)) > -1) {
            if (String(this.processStatus) === '3' && String(this.formCard5.needreply) === '0') { // 待发函节点，选择不需要回函
              this.$confirm('确定提交？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.comfirmCommitInfo()
              }).catch(() => {})
            } else if (String(this.processStatus) === '1' && String(this.formCard4.obtainType) === '0') { // 审核节点，选择标准化监管
              this.reqActivityNameByProcessName(() => {
                this.selectData.dialogFormVisble = true
              }, +this.processStatus + 2)
            } else {
              this.selectData.dialogFormVisble = true
            }
          } else {
            this.$confirm('确定提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.comfirmCommitInfo()
            }).catch(() => {})
          }
        }
      },
      updateAnalyResult(val) {
        this.analyResult = val
      },
      updateApproveFlag(val) {
        this.approveFlag = val
      },
      handleInputSuggestion(val) {
        this.suggestionForm = val
      },
      updateStepsDescription(val) {
        this.stepsDescription = val
      },
      dealInfos(array) {
        array.forEach(v => {
          v.infoId = this.infoId
        })
        return array
      },
      getCommonParams (selectPerson) {
        let params = {
          slsMain: {
            infoId: this.infoId,
            title: this.formCard1.title,
            warningNo: this.formCard1.invesNo,
            securityid: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(','),
            investigation: this.formCard1.investigation,
            abnormalBehav: this.formCard1.abnormalBehav,
            logs: this.formCard1.logs,
            letterDesc: this.formCard1.letterDesc,
            analyseResult: this.analyResult.join(','),
            proceStatus: this.processStatus,
            superviseScheme: this.formCard4.superviseScheme.join(','),
            assistScheme: this.formCard4.assistScheme.join(','),
            investorMark: this.formCard4.investorMark ? '1' : '0',
            createType: this.createType,
            superviseStandard: this.formCard4.obtainType,
            transactionLimit: this.formCard4.transactionLimit,
            instructions: this.formCard4.instructions,
            comment: this.suggestionForm,
            extend1: this.formCard4.differentClassify,
            extend2: this.alarmId
          },
          slsAccountinfos: this.dealInfos(this.slsAccountinfos),
          ngspRegulatoryHistorys: this.ngspRegulatoryHistorys,
          slsPauseTrades: [],
          slsRestrictTrades: [],
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId,
          toWhom: selectPerson || '',
          keyword: this.formCard4.keyword,
          operate: this.opearteParam
        }
        if (this.formCard5Show) {
          params.ngspLetter = {
            infoId: this.infoId,
            letterType1: this.formCard5.letterType[0],
            letterType2: this.formCard5.letterType[1],
            needreply: this.formCard5.needreply,
            shortmsg: this.formCard5.shortmsg,
            msgtarget: this.formCard5.msgtarget.join(','),
            lettersent: this.gfnGetRealName(),
            sentdate: dateformat(new Date())
          }
        }
        if (this.formCard4.obtainType !== '2' && (this.formCard4.superviseScheme.indexOf('2') > -1 || this.formCard4.superviseScheme.indexOf('3') > -1)) {
          params.slsPauseTrades = this.dealInfos(this.slsPauseTrades)

        }
        if (this.formCard4.obtainType === '2' && this.formCard4.superviseScheme.indexOf('4') > -1) {
          params.slsRestrictTrades = this.dealInfos(this.slsRestrictTrades)
        }
        if (String(this.processStatus) === '3') {
          params.needreply = this.formCard5.needreply
        }
        return params
      },
      comfirmCommitInfo (selectPerson) {
        let params = this.getCommonParams(selectPerson)
        this.commitLoading = true
        if (String(this.processStatus) === '3') { // 发函节点提示语
          this.$store.commit('setFullLoadingText', '正在向信息公司推送函件，请耐心等待...')
          this.$store.commit('setFullLoading', true)
        }
        if (String(this.processStatus) === '0') {
          slsProcessLanch(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          slsProcessExamine(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
            this.$store.commit('setFullLoading', false)
            this.$store.commit('setFullLoadingText', '数据加载中，请耐心等待...')
          })
        }
      },
      generateLetter() {
        let params = this.getCommonParams()
        this.loading1 = true
        postgenerateletter(JSON.stringify(params)).then(() => {
          this.loading1 = false
          this.getFileList()
        })
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          this.formCard1.fileList = []
          this.formCard4.fileList = []
          this.formCard5.fileList = []
          this.formCard5.fileList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'sls_first_attachment') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'sls_second_attachment') {
              this.formCard4.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'sls_letter_send') {
              this.formCard5.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'sls_letter_resp') {
              this.formCard5.fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        getcheckform(this.instanceId).then((resp) => {
          this.loading = false
          const {slsMain, ngspBpmLetter} = resp
          this.processStatus = slsMain.proceStatus // proceStatus：这里返回的字段名称和其他流程不同
          this.infoId = resp.infoId
          this.alarmId = slsMain.extend2
          let stockCode = slsMain.securityid ? slsMain.securityid.split(',') : []
          this.formCard1 = {
            title: slsMain.title,
            invesNo: slsMain.warningNo,
            nullStockCode: !slsMain.securityid ? 1 : 0,
            stockCode: stockCode,
            abnormalBehav: slsMain.abnormalBehav,
            investigation: slsMain.investigation,
            logs: slsMain.logs,
            letterDesc: slsMain.letterDesc,
            fileList: []
          }
          this.createType = slsMain.createType ? slsMain.createType : this.createType
          this.analyResult = slsMain.analyseResult ? slsMain.analyseResult.split(',') : []
          this.suggestionForm = slsMain.comment
          this.slsAccountinfos = resp.slsAccountinfos || []
          this.ngspRegulatoryHistorys = resp.ngspRegulatoryHistorys || []
          this.slsPauseTrades = resp.slsPauseTrades || []
          this.slsRestrictTrades = resp.slsRestrictTrades || []
          let onewords = resp.slsAccountinfos.map(item => {
            return item.oneword
          })
          this.formCard4 = {
            keyword: resp.keyword,
            obtainType: slsMain.superviseStandard,
            differentClassify: slsMain.extend1,
            superviseScheme: slsMain.superviseScheme.split(','),
            assistScheme: slsMain.assistScheme.split(','),
            investorMark: String(slsMain.investorMark) === '1',
            transactionLimit: slsMain.transactionLimit,
            fileList: []
          }
          if (ngspBpmLetter) {
            this.formCard5 = {
              letterType: ngspBpmLetter.letterType1 ? [ngspBpmLetter.letterType1, ngspBpmLetter.letterType2] : this.formCard5.letterType,
              letterNo: ngspBpmLetter.letterNo ? ngspBpmLetter.letterNo : this.formCard5.letterNo,
              letterName: ngspBpmLetter.letterName ? ngspBpmLetter.letterNo : this.formCard5.letterName,
              needreply: ngspBpmLetter.needreply ? String(ngspBpmLetter.needreply) : this.formCard5.needreply,
              shortmsg: ngspBpmLetter.shortmsg ? ngspBpmLetter.shortmsg : this.formCard5.shortmsg,
              msgtarget: ngspBpmLetter.msgtarget ? ngspBpmLetter.msgtarget.split(',') : this.formCard5.msgtarget,
              lettersent: ngspBpmLetter.lettersent ? ngspBpmLetter.lettersent : this.formCard5.lettersent,
              sentdate: ngspBpmLetter.sentdate ? ngspBpmLetter.sentdate : this.formCard5.sentdate,
              fileList: [],
              fileList1: []
            }
          }
          // 获取附件信息
          this.getFileList()
          // 获取form3信息
          this.getObtainedInfo(onewords)
          // 获取盘中暂停信息和限制交易表
          if (resp.slsAccountinfos.length) {
            let noHasPause = resp.slsPauseTrades && resp.slsPauseTrades.length === 0
            let noHasRestrict = resp.slsRestrictTrades && resp.slsRestrictTrades.length === 0
            this.updateRegulatoryHistorysAndObtainenInfo(resp.slsAccountinfos, !noHasPause, !noHasRestrict)
          }
          // 可以导出报表
          this.canExportTableInfo = true
        })
      },
      updateLimitTimeToTable(val) {
        this.slsRestrictTrades.forEach(v => {
          v.restrictTime = val
        })
      },
      updateTableInvestigationInfo() {
        this.slsPauseTrades.forEach(v => {
          v.abnormalBehav1 = this.formCard1.investigation
          v.abnormalBehav2 = this.formCard1.abnormalBehav
        })
        this.slsRestrictTrades.forEach(v => {
          v.punishReason = this.formCard1.investigation
        })
      },
      updateRegulatoryHistorysAndObtainenInfo(accountList, hasResPouse, hasRestrict) {
        this.slsAccountinfos = accountList
        let onewords = accountList.map(v => {
          return v.oneword
        })
        this.loading = true
        gethistoryinfo(onewords.join(',')).then((resp) => {
          this.loading = false
          this.ngspRegulatoryHistorys = resp.regularotyHistorys || []
        })
        // 获取盘中或持续或限制交易table信息
        this.getPouseInfo(accountList, hasResPouse, hasRestrict)
        // 获取分析结果
        this.getAnalyResult(onewords[0])
        // 调取资料历史信息
        this.getObtainedInfo(onewords)
      },
      getPouseInfo(accountList, hasResPouse, hasRestrict) {
        let accountList1 = JSON.parse(JSON.stringify(accountList))
        let accountList2 = JSON.parse(JSON.stringify(accountList))
        // 标准化和差异化的盘中或持续勾选
        if (!hasResPouse) {
          accountList1.forEach(item => {
            item.stocktype = item.variety
            item.pauseDate = dateformat(new Date())
            item.accountName = item.accountPeople || item.accountName
            let stockCodes = this.formCard1.stockCode.map(v => {
              return v.split(' ')[0]
            })
            item.member = item.member ? item.member.trim() : ''
            item.involveStock = stockCodes.join(',')
            item.abnormalBehav1 = this.formCard1.investigation
            item.abnormalBehav2 = this.formCard1.abnormalBehav
            item.recoverDate = dateformat(new Date(new Date().getTime() + 24 * 3600 * 1000))
          })
          this.slsPauseTrades = accountList1
        }
        if (!hasRestrict) {
          // 限制交易勾选
          accountList2.forEach(item => {
            item.punishTime = dateformat(new Date())
            item.accountUser = item.accountPeople || item.accountUser || item.accountName
            item.accountName = item.accountCode
            item.stockTrader = item.stocktrader || item.stockTrader || item.member
            item.stockTrader = item.stockTrader ? item.stockTrader.trim() : ''
            item.restrictTime = this.formCard4.transactionLimit
            item.processPerson = this.gfnGetRealName()
            let stockCodes = this.formCard1.stockCode.map(v => {
              return v.split(' ')[0]
            })
            item.accountCode = stockCodes.join(',')
            item.restrictTime = item.restrictTime || this.formCard4.transactionLimit
            item.punishReason = item.punishReason || this.formCard1.investigation
          })
          this.slsRestrictTrades = accountList2
        }
      },
      getAnalyResult(onewords) {
        getanalyresult(this.infoId, onewords).then((resp) => {
          this.analyResult = resp[0]
        })
      },
      getObtainedInfo(onewords) {
        let params = {
          oneword: onewords,
          infoId: this.infoId
        }
        this.loading = true
        getObtainedInfo(params).then(resp => {
          this.loading = false
          this.obtainedTableInfo = resp || []
        })
      },
      getInvesNo () {
        getnumber(this.createType).then((resp) => {
          this.formCard1.invesNo = resp
        })
      },
      openWarnPage () {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      },
      warnTurnInto () {
        getdisplaywarninfo(this.alarmId).then((resp) => {
          let wBasic = resp.wBasicList.bizData.metaData
          let wAcctList = resp.wAcctList.bizData.metaData
          if (wBasic.length) {
            this.formCard1.stockCode = wBasic.map(v => {
              return v.securities_code + ' ' + v.securities_name
            })
            this.formCard1.title = wBasic[0].title
            this.formCard1.logs = wBasic[0].log_record
            this.formCard1.letterDesc = wBasic[0].alarm_remark
          }
          let invacctnos = wAcctList.map(v => {
            return v.invacctno
          })
          this.$refs['formCard1'].updateAccountInfoByAccounts(invacctnos)
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.reqActivityNameByProcessName(() => {
          const {params, alarmId} = this.$route.query
          if (params) {
            let paramsInfo = JSON.parse(params)
            if (String(paramsInfo.createType) === '2') {
              if (paramsInfo.stockCode) {
                this.formCard1.stockCode.push(paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName)
                this.formCard1.title = (paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName) + '-' + this.formCard1.investigation
              }  else {
                this.formCard1.nullStockCode = 1
                this.formCard1.title = '无-' + this.formCard1.investigation
              }
              // 带入选中的账户
              this.createType = '0'
              this.$refs['formCard1'].updateAccountInfoByAccounts(paramsInfo.accountCode.split(','))
            }
          } else if (alarmId) {
            this.isWarningReturnInto = true
            this.createType = '0'
            // 从预警列表进入
            this.alarmId = alarmId
            this.warnTurnInto()
          }
          if (this.handleStatus === undefined) {
            this.opearteParam = 'new'
            this.getInvesNo()
            this.createInfoId()
          }
          if (this.instanceId) {
            this.getFormInfos()
          }
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  .selfSupervisionFormPage {

  }
</style>
