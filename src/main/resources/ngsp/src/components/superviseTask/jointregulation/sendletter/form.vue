<template>
  <div class="sendLetterFormPage">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <show-warning-detail-button
      :alarmId="alarmId"
      :showWarningDetailButton="showWarningDetailButton"
    ></show-warning-detail-button>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='comfirmCommitInfo'></select-person-component>
    <FormCard1
      ref="formCard1"
      v-if="formCard1Show"
      :loadingProps.sync="loading"
      :disabled="formCard1Disabled"
      :formCard1.sync="formCard1"
      :infoId="infoId"
      :createType="createType"
      :showUploadButton="showUploadButton"
      :defaultLimitFileType="defaultLimitFileType"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
    ></FormCard1>
    <suggestion-textarea-component
      ref='suggestFormRef'
      :disabled="suggestDisabled"
      :show="suggestShow"
      :steps="steps"
      :propsComment="suggestionForm"
      :showContinuousAttentionRadio="showContinuousAttentionRadio"
      :propsIsContinuousAttention="isContinuousAttention"
      @updateIsContinuousAttention="updateIsContinuousAttention"
      @updateApproveFlag="updateApproveFlag"
      @handleInputSuggestion="handleInputSuggestion"
      @updateStepsDescription="updateStepsDescription"></suggestion-textarea-component>
    <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit" @goBack="goBack" :loading="commitLoading"></bottom-button-group>
  </div>
</template>
<script>
  import MinxinVue from '../../MixIn'
  import MixinAuthority from '../../MixinAuthority'
  import {formAuthority} from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import ShowWarningDetailButton from '../../superviseTaskComponent/ShowWarningDetailButton'
  import {
    getsendletterform,
    postsendletterprocessform,
    postreviewletterprocessform,
    getsendletternum,
    getfilelist,
    ispermitload,
    deletefile,
    postsaveprocessform,
    getdisplaywarninfo
  } from '@/service/superviseTask'
  import {dateformat} from '@/utils/dateTimeFormat'
  export default {
    components: {
      FormCard1,
      ShowWarningDetailButton
    },
    mixins: [MinxinVue, MixinAuthority],
    computed: {
      formCard1Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
      },
      suggestDisabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['suggestForm']['disabled']
      },
      formCard1Show() {
        return formAuthority[this.processStatus]['formCard1']['show']
      },
      suggestShow() {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data() {
      return {
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterlist',
          label: '联合监管'
        }, {
          router: '',
          label: '联合监管发函表单'
        }],
        formCard1: {
          keyword: '',
          stockCode: [],
          nullStockCode: 1,
          letterType: ['联合监管', '联合监管发函'],
          letterName: '', // 函件名称
          letterNo: '', // 函件编号
          sentDept: ['本所', '上市公司监管一部'], // 发送对象
          sentWay: [], // 发送方式
          fileList: [], // 发函附件
          drafter: '', // 拟稿人
          finishDate: '' // 完成日期
        },
        showWarningDetailButton: false,
        showUploadButton: true, // 显示上传按钮权限
        createType: '1', // 预警转入和实时监控分析转入为‘0’
        alarmId: '', // 预警转入id
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        showContinuousAttentionRadio: false, // 是否显示持续关注radio
        isContinuousAttention: '1' // 是否持续关注字段（审核status=1节点显示）
      }
    },
    methods: {
      updateIsContinuousAttention(val) {
        this.isContinuousAttention = val
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
      handleSave() {
        let params = this.getCommonParams()
        postsaveprocessform(JSON.stringify(params)).then(() => {
          this.opearteParam = ''
          this.$message.success('保存成功')
        })
      },
      validateForms() {
        let flag1 = true
        if (this.$refs.formCard1) {
          flag1 = this.$refs.formCard1.validateFormCard()
        }
        return flag1
      },
      handleCommit() {
        if (!this.validateForms()) {
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
            if (String(this.processStatus) === '3' && this.formCard1.sentWay.indexOf('0') > -1) {
              this.$confirm('确定提交？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.comfirmCommitInfo()
              }).catch(() => {})
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
      getCommonParams (selectPerson) {
        let params = {
          unsSendMain: {
            infoId: this.infoId,
            securityId: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(','),
            stockName: '', // ????
            letterType1: this.formCard1.letterType[0],
            letterType2: this.formCard1.letterType[1],
            letterNo: this.formCard1.letterNo,
            letterName: this.formCard1.letterName,
            sentDept1: this.formCard1.sentDept[0],
            sentDept2: this.formCard1.sentDept[1],
            drafter: this.formCard1.drafter || this.gfnGetRealName(),
            finishDate: this.formCard1.finishDate || dateformat(new Date()),
            note: this.formCard1.note,
            sentWay: this.formCard1.sentWay.join(','),
            sentAttachId: '', // ??
            sentPerson: this.gfnGetRealName(), // ??
            sentDate: dateformat(new Date()), // ??
            processStatus: this.processStatus,
            comment: this.suggestionForm,
            createType: this.createType,
            extend1: this.alarmId
          },
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId,
          toWhom: selectPerson || '',
          keyword: this.formCard1.keyword,
          operate: this.opearteParam
        }
        if (this.showContinuousAttentionRadio) {
          params.unsSendMain.isContinuousAttention = this.isContinuousAttention
        }
        return params
      },
      comfirmCommitInfo (selectPerson) {
        let params = this.getCommonParams(selectPerson)
        this.commitLoading = true
        if (String(this.processStatus) === '0') {
          postsendletterprocessform(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          postreviewletterprocessform(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          this.formCard1.fileList = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'uns_send_LetterInfo_attachment') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        getsendletterform(this.instanceId).then((resp) => {
          this.loading = false
          const {unsSendMain} = resp
          this.infoId = resp.infoId
          this.processStatus = unsSendMain.processStatus
          this.alarmId = unsSendMain.extend1
          this.showWarningDetailButton = unsSendMain.createType !== '1'
          let stockCode = unsSendMain.securityId ? unsSendMain.securityId.split(',') : []
          this.formCard1 = {
            keyword: resp.keyword,
            letterNo: unsSendMain.letterNo,
            letterName: unsSendMain.letterName,
            nullStockCode: !unsSendMain.securityId ? 1 : 0,
            stockCode: stockCode,
            letterType: unsSendMain.letterType1 ? [unsSendMain.letterType1, unsSendMain.letterType2] : this.formCard1.letterType,
            sentDept: unsSendMain.sentDept1 ? [unsSendMain.sentDept1, unsSendMain.sentDept2] : this.formCard1.sentDept,
            sentWay: unsSendMain.sentWay ? unsSendMain.sentWay.split(',') : this.formCard1.sentWay,
            drafter: unsSendMain.drafter,
            finishDate: unsSendMain.finishDate,
            note: unsSendMain.note,
            fileList: []
          }
          this.suggestionForm = unsSendMain.comment // 意见
          this.isContinuousAttention = unsSendMain.isContinuousAttention // 是否持续关注
          // 获取附件信息
          this.getFileList()
        })
      },
      createLetterNo () {
        getsendletternum().then((resp) => {
          this.formCard1.letterNo = resp
          this.formCard1.drafter = this.gfnGetRealName()
          this.formCard1.finishDate = dateformat(new Date())
        })
      },
      warnTurnInto () {
        getdisplaywarninfo(this.alarmId).then((resp) => {
          let wBasic = resp.wBasicList.bizData.metaData
          if (wBasic.length) {
            this.formCard1.stockCode = wBasic.map(v => {
              return v.securities_code + ' ' + v.securities_name
            })
          }
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
              this.showWarningDetailButton = true
              if (paramsInfo.stockCode) {
                this.formCard1.stockCode.push(paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName)
              }  else {
                this.formCard1.nullStockCode = 1
              }
              this.createType = '0'
            }
          } else if (alarmId) {
            this.showWarningDetailButton = true
            this.createType = '0'
            // 从预警列表进入
            this.alarmId = alarmId
            // 获取数据
            this.warnTurnInto()
          }
          if (this.handleStatus === undefined) {
            this.opearteParam = 'new'
            this.createInfoId()
            this.createLetterNo()
          }
          if (this.instanceId) {
            this.getFormInfos()
          }
          if (String(this.processStatus) === '1') { // 审核节点显示持续关注字段
            this.showContinuousAttentionRadio = true
          }
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  .sendLetterFormPage {

  }
</style>
