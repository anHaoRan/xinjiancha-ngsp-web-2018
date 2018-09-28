<template>
  <div class="surveyFormPage">
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
      :tableDataProps.sync="obdAccountInfo"
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
    ></FormCard1>
    <FormCard2
      v-if="formCard2Show"
      :loading.sync="loading"
      :columns="card2Columns"
      :disabled="formCard2Disabled"
      :tableData="ngspRegulatoryHistorys"
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
      :disabled="formCard4Disabled"
      :formCard4.sync="formCard4"
    ></FormCard4>
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
      :suggestionColumns="suggestionColumns"
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
    getsurveycheckform,
    getObtainedInfo,
    getfilelist,
    ispermitload,
    deletefile,
    obdprocessGenerateLetter,
    getsurveynumber,
    getdisplaywarninfo,
    gethistoryinfo,
    postsaveobd,
    postsurveyapproveform, // examine
    postsurveyprocessform // launch
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
        loading1: false, // 生成函件
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/informationtable',
          label: '调取资料'
        }, {
          router: '',
          label: '调取资料表单'
        }],
        suggestionColumns: [{label: '流程状态', field: 'proceStatus'}, {label: '审核意见', field: 'comment'}, {label: '处理人', field: 'procePerson'}, {label: '审核时间', field: 'createTime'}],
        formCard1: {
          title: '无-调取资料',
          invesNo: '',
          stockCode: [],
          fileList: [],
          nullStockCode: 1,
          investigation: '调取资料',
          abnormalBehav: '固定收益平台交易异常',
          logs: ''
        },
        formCard4: {
          keyword: '',
          obtainType: '0',
          obtainLimit: '三个月',
          instructions: ''
        },
        formCard5: {
          letterType: ['稽核调查函', '市场监察协查函—0101'],
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
        obdAccountInfo: [], // 预警账户信息table
        obtainedTableInfo: [], // 历史监控信息table
        ngspRegulatoryHistorys: [], // history
        showUploadButton: true, // 显示上传按钮权限
        createType: '1', // 预警转入和实时监控分析转入为‘0’
        alarmId: '', // 预警转入id
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        isWarningReturnInto: false // 是否为预警转入
      }
    },
    methods: {
      handleSave() {
        let params = this.getCommonParams()
        postsaveobd(JSON.stringify(params)).then(() => {
          this.opearteParam = ''
          this.$message.success('保存成功')
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
        if (!this.obdAccountInfo.length) {
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
      updateApproveFlag(val) {
        this.approveFlag = val
      },
      handleInputSuggestion(val) {
        this.suggestionForm = val
      },
      updateStepsDescription(val) {
        this.stepsDescription = val
      },
      getCommonParams (selectPerson) {
        let params = {
          obdMain: {
            infoId: this.infoId,
            title: this.formCard1.title,
            invesNo: this.formCard1.invesNo,
            securityid: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(','),
            investigation: this.formCard1.investigation,
            abnormalBehav: this.formCard1.abnormalBehav,
            logs: this.formCard1.logs,
            letterDesc: this.formCard1.letterDesc,
            processStatus: this.processStatus,
            obtainType: this.formCard4.obtainType,
            obtainLimit: this.formCard4.obtainLimit,
            instructions: this.formCard4.instructions,
            comment: this.suggestionForm,
            extend1: this.createType,
            extend2: this.alarmId
          },
          accountInfos: this.obdAccountInfo,
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId,
          toWhom: selectPerson || '',
          keyword: this.formCard4.keyword,
          operate: this.opearteParam
        }
        if (this.formCard5Show) {
          params.letter = {
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
          postsurveyprocessform(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          postsurveyapproveform(JSON.stringify(params)).then((resp) => {
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
        obdprocessGenerateLetter(params).then(() => {
          this.loading1 = false
          this.getFileList()
        })
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          this.formCard1.fileList = []
          this.formCard5.fileList = []
          this.formCard5.fileList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'obd_BasicInfo_attachment') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'obd_letter_send') {
              this.formCard5.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'obd_returnLetter_attachment') {
              this.formCard5.fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        getsurveycheckform(this.instanceId).then((resp) => {
          this.loading = false
          const {obdMain, letter} = resp
          this.processStatus = obdMain.processStatus
          this.infoId = resp.infoId
          this.alarmId = obdMain.extend2
          let stockCode = obdMain.securityid ? obdMain.securityid.split(',') : []
          this.formCard1 = {
            title: obdMain.title,
            invesNo: obdMain.invesNo,
            nullStockCode: !obdMain.securityid ? 1 : 0,
            stockCode: stockCode,
            abnormalBehav: obdMain.abnormalBehav,
            investigation: obdMain.investigation,
            logs: obdMain.logs,
            letterDesc: obdMain.letterDesc,
            fileList: []
          }
          this.suggestionForm = obdMain.comment
          this.obdAccountInfo = resp.obdAccountinfos || []
          this.ngspRegulatoryHistorys = resp.ngspRegulatoryHistorys || []
          let onewords = resp.obdAccountinfos.map(item => {
            return item.oneword
          })
          this.formCard4 = {
            keyword: resp.keyword,
            obtainType: obdMain.obtainType,
            instructions: obdMain.instructions,
            obtainLimit: obdMain.obtainLimit
          }
          if (letter) {
            this.formCard5 = {
              letterType: letter.letterType1 ? [letter.letterType1, letter.letterType2] : this.formCard5.letterType,
              letterNo: letter.letterNo ? letter.letterNo : this.formCard5.letterNo,
              letterName: letter.letterName ? letter.letterNo : this.formCard5.letterName,
              needreply: letter.needreply ? String(letter.needreply) : this.formCard5.needreply,
              shortmsg: letter.shortmsg ? letter.shortmsg : this.formCard5.shortmsg,
              msgtarget: letter.msgtarget ? letter.msgtarget.split(',') : this.formCard5.msgtarget,
              lettersent: letter.lettersent ? letter.lettersent : this.formCard5.lettersent,
              sentdate: letter.sentdate ? letter.sentdate : this.formCard5.sentdate,
              fileList: [],
              fileList1: []
            }
          }
          // 获取附件信息
          this.getFileList()
          // 获取form3信息
          this.getObtainedInfo(onewords)
        })
      },
      updateRegulatoryHistorysAndObtainenInfo(accountList) {
        this.obdAccountInfo = accountList
        let onewords = accountList.map(v => {
          return v.oneword
        })
        this.loading = true
        gethistoryinfo(onewords.join(',')).then((resp) => {
          this.loading = false
          this.ngspRegulatoryHistorys = resp.regularotyHistorys || []
        })
        this.getObtainedInfo(onewords)
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
        getsurveynumber(this.createType).then((resp) => {
          this.formCard1.invesNo = resp
        })
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
                this.formCard1.title =  + '无-' + this.formCard1.investigation
              }
              // 带入选中的账户
              this.createType = '0'
              this.$refs['formCard1'].updateAccountInfoByAccounts(paramsInfo.accountCode.split(','))
            }
          } else if (alarmId) {
            this.createType = '0'
            this.isWarningReturnInto = true
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
  .surveyFormPage {

  }
</style>
