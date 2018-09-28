<template>
  <div class="replayLetterFormPage">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='comfirmCommitInfo'></select-person-component>
    <FormCard1
      ref="formCard1"
      v-if="formCard1Show"
      :loadingProps.sync="loading"
      :disabled="formCard1Disabled"
      :formCard1.sync="formCard1"
      :tableData.sync="formCard1TableData"
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
      @getFormCard1TableData="getFormCard1TableData"
    ></FormCard1>
    <FormCard2
      ref="formCard2"
      v-if="formCard2Show"
      :loadingProps.sync="loading"
      :disabled="formCard2Disabled"
      :formCard2.sync="formCard2"
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
      @updateLetterNo="createLetterNo"
    ></FormCard2>
    <FormCard3
      ref="formCard3"
      v-if="formCard2Show"
      :loadingProps.sync="loading"
      :disabled="formCard2Disabled"
      :formCard3.sync="formCard3"
      :isLanchRpc = isLanchRpc
      @createClueReportInfoId="createClueReportInfoId"
    ></FormCard3>
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
  import MinxinVue from '../../MixIn'
  import MixinAuthority from '../../MixinAuthority'
  import {formAuthority} from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import FormCard2 from './component/FormCard2'
  import FormCard3 from './component/FormCard3'
  import {clueTypeOptions} from './component/constants'
  import {
    postreplyletterprocessform,
    getfilelist,
    ispermitload,
    deletefile,
    getletterrecordtable,
    getreplyletterform,
    getnum,
    submitreplyletter,
    replysaveprocessform,
    getClueReportnum,
    ClueReportsave,
    getInfoId,
    getUserRoles
  } from '@/service/superviseTask'
  import {dateformat} from '@/utils/dateTimeFormat'
  export default {
    components: {
      FormCard1,
      FormCard2,
      FormCard3
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
      suggestShow() {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data() {
      return {
        clueTypeOptions,
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterlist',
          label: '联合监管'
        }, {
          router: '',
          label: '联合监管复函表单'
        }],
        formCard1: {
          keyword: '',
          stockCode: [],
          letterType: '联合监管',
          letterName: '', // 函件名称
          letterNo: '', // 函件编号
          fromDept: ['本所', '上市公司监管一部'], // 来函单位
          contackPerson: '', // 联系人
          letterDate: '', // 来函日期
          letterWay: '电子生成', // 来函方式code
          matter: ['公司定期报告类', '利润分配'], // 来函事项
          instruction: '', // 来函说明
          fileList: []
        },
        formCard2: {
          nullStockCode: 1,
          stockCode: [],
          letterType: ['联合监管', '联合监管复函'], // 函件类型
          letterNo: '', // 函件编号
          letterName: '', // 函件名称
          letterMatter: '', // 函件事项
          target: ['本所', '上市公司监管一部'], // 发送对象
          respWay: '电话告知', // 发送方式
          drafter: '', // 创建人
          sendDate: '', // 发送时间
          fileList: [] // 附件
        },
        formCard3: {
          isRpc: '0',
          clueNo: '',
          clueName: '',
          clueBranch: '1',
          needReport: '1',
          clueType: [],
          clueDesc: '',
          clueReportInfoId: '' // 线索报告infoId
        },
        formCard1TableData: [],
        showUploadButton: true, // 显示上传按钮权限
        createType: '1', // 预警转入和实时监控分析转入为‘0’
        alarmId: '', // 预警转入id
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        lastLetterType2: '', // 用来记录上一次的函件类型2，调用生成函件编号接口
        clueProcess: '', // 发起线索报告流程参数
        isLanchRpc: false // 是否发起线索报告
      }
    },
    methods: {
      updateApproveFlag(val) {
        this.approveFlag = val
      },
      handleInputSuggestion(val) {
        this.suggestionForm = val
      },
      updateStepsDescription(val) {
        this.stepsDescription = val
      },
      createClueReportInfoId() {
        !this.formCard3.clueReportInfoId && this.getClueReportInfoId()
        !this.formCard3.clueNo && this.getClueNo()
        !String(this.clueProcess) && this.getClueProcess()
      },
      getClueReportInfoId() {
        getInfoId().then((resp) => {
          this.formCard3.clueReportInfoId = resp
        })
      },
      getClueNo() {
        getClueReportnum().then((resp) => {
          this.formCard3.clueNo = resp
        })
      },
      getClueProcess() {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          if (resp[0].rolename.indexOf('实时') >= 0) {
            this.clueProcess = 0
          }
          if (resp[0].rolename.indexOf('线索') >= 0 && resp[0].rolename.indexOf('组员') >= 0) {
            this.clueProcess = 3
          }
          if (resp[0].rolename.indexOf('线索') >= 0 && resp[0].rolename.indexOf('组长') >= 0) {
            this.clueProcess = 2
          }
        })
      },
      saveClueReportInfo() {
        let clueTypeText = clueTypeOptions.filter(v => {
          return this.formCard3.clueType.indexOf(v) > -1
        })
        let params = {
          'crpMain': {
            'infoId': this.formCard3.clueReportInfoId,
            'extend1': this.formCard3.clueNo,
            'security': this.formCard2.stockCode.join(';'),
            'clueName': this.formCard3.clueName,
            'clueDesc': this.formCard3.clueDesc,
            'needReport': this.formCard3.needReport,
            'clueBranch': this.formCard3.clueBranch,
            'clueType': this.formCard3.clueType.join(','),
            'clueTypeText': clueTypeText.join(','),
            'sourceType': '0',
            'sourceTypeText': '联合监管',
            'source': this.formCard1.letterNo,
            'letterSecurity': '',
            'letterType': '',
            'letterNo': '',
            'letterName': '',
            'fkDepartment': '',
            'sendDepartment': '',
            'sendWay': '',
            'note': '',
            'sendPerson': '',
            'sendDate': '',
            'createFrom': 'ngsp_uns_check_flow',
            'fromInfoId': this.infoId,
            'fromTitle': this.formCard1.letterNo,
            'processStatus': this.clueProcess,
            'comment': ''
          },
          'accountinfo': [],
          'accountGroup': [],
          'monitorSecurity': [],
          'instanceId': '',
          'taskId': '',
          'toWhom': '',
          'approve': 'true',
          'operate': 'new'
        }
        ClueReportsave(JSON.stringify(params)).then(() => {
          this.isLanchRpc = true
          this.$message.success('线索报告保存成功')
        })
      },
      handleSave() {
        if (!this.isLanchRpc && String(this.handleStatus) === '2' && String(this.formCard3.isRpc) === '1') {
          this.saveClueReportInfo()
        }
        let params = this.getCommonParams()
        replysaveprocessform(JSON.stringify(params)).then(() => {
          this.opearteParam = ''
          this.$message.success('保存成功')
        })
      },
      validateForms() {
        let flag1 = true, flag2 = true, flag3 = true
        if (this.$refs.formCard1) {
          flag1 = this.$refs.formCard1.validateFormCard()
        }
        if (this.$refs.formCard2) {
          flag2 = this.$refs.formCard2.validateFormCard()
        }
        if (this.$refs.formCard3) {
          flag3 = this.$refs.formCard3.validateFormCard()
        }
        return flag1 && flag2 && flag3
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
            this.selectData.dialogFormVisble = true
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
        return {
          unsCheckReceive: {
            infoId: this.infoId,
            letterName: this.formCard1.letterName,
            letterNo: this.formCard1.letterNo,
            fromDept: this.formCard1.fromDept[0] + ' ' + this.formCard1.fromDept[1],
            contackPerson: this.formCard1.contackPerson,
            letterDate: this.formCard1.letterDate,
            letterWay: this.formCard1.letterWay,
            letterWayText: this.formCard1.letterWay, // label
            letterType: this.formCard1.letterType,
            matter: this.formCard1.matter[0] + ' ' + this.formCard1.matter[1],
            security: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(','),
            instruction: this.formCard1.instruction,
            // attachmentId: '',
            isRpc: this.formCard3.isRpc,
            infoIdRpc: this.formCard3.clueReportInfoId,
            clueTypeBig: this.formCard3.clueNo,
            // clueTypeSmall: '',
            processStatus: this.processStatus,
            comment: this.suggestionForm,
            extend2: this.createType
          },
          unsCheckResp: {
            infoId: this.infoId,
            security: this.formCard2.nullStockCode ? '' : this.formCard2.stockCode.join(','),
            letterType: this.formCard2.letterType[0] + ' ' + this.formCard2.letterType[1],
            letterNo: this.formCard2.letterNo,
            letterName: this.formCard2.letterName,
            target: this.formCard2.target[0] + ' ' + this.formCard2.target[1],
            respWay: this.formCard2.respWay,
            // attachmentId: '',
            drafter: this.formCard2.drafter,
            sendDate: this.formCard2.sendDate,
            // respPerson: '',
            // respDate: '',
            extend1: this.formCard2.letterMatter
          },
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId,
          toWhom: selectPerson || '',
          keyword: this.formCard1.keyword,
          operate: this.opearteParam
        }
      },
      comfirmCommitInfo (selectPerson) {
        this.commitLoading = true
        if (!this.isLanchRpc && String(this.handleStatus) === '2' && String(this.formCard3.isRpc) === '1') {
          this.saveClueReportInfo()
        }
        let params = this.getCommonParams(selectPerson)
        if (String(this.processStatus) === '0') {
          postreplyletterprocessform(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          submitreplyletter(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          this.formCard1.fileList = []
          this.formCard2.fileList = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'uns_check_LetterInfo_attachment') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId})
            }
            if (item.fileLocation === 'uns_check_checkInfo_attachment') {
              this.formCard2.fileList.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        getreplyletterform(this.instanceId).then((resp) => {
          this.loading = false
          const {unsCheckReceive, unsCheckResp} = resp
          this.infoId = resp.infoId
          this.processStatus = unsCheckReceive.processStatus
          this.createType = unsCheckReceive.extend2
          let stockCode = unsCheckReceive.security ? unsCheckReceive.security.split(';') : []
          this.formCard1 = {
            keyword: resp.keyword,
            letterNo: unsCheckReceive.letterNo,
            letterName: unsCheckReceive.letterName,
            stockCode: stockCode,
            letterType: unsCheckReceive.letterType,
            fromDept: unsCheckReceive.fromDept ? [unsCheckReceive.fromDept.split(' ')[0], unsCheckReceive.fromDept.split(' ')[1]] : this.formCard1.fromDept,
            contackPerson: unsCheckReceive.contackPerson || this.formCard1.contackPerson,
            letterDate: unsCheckReceive.letterDate || this.formCard1.letterDate,
            matter: unsCheckReceive.matter ? [unsCheckReceive.matter.split(' ')[0], unsCheckReceive.matter.split(' ')[1]] : this.formCard1.matter,
            letterWay: unsCheckReceive.letterWay || this.formCard1.letterWay,
            instruction: unsCheckReceive.instruction || this.formCard1.instruction,
            fileList: []
          }
          // 线索报告相关
          this.formCard3.isRpc = unsCheckReceive.isRpc || this.formCard3.isRpc
          this.formCard3.clueNo = unsCheckReceive.clueTypeBig || this.formCard3.clueNo
          this.formCard3.clueReportInfoId = unsCheckReceive.infoIdRpc || this.formCard3.clueReportInfoId
          if (unsCheckReceive.isRpc === '1' && unsCheckReceive.infoIdRpc) { // 如果为1，代表已发起线索报告
            this.isLanchRpc = true
          }
          this.suggestionForm = unsCheckReceive.comment // 意见
          // formCard2
          if (unsCheckResp) {
            this.formCard2 = {
              letterType: unsCheckResp.letterType ? [unsCheckResp.letterType.split(' ')[0], unsCheckResp.letterType.split(' ')[1]] : this.formCard2.letterType,
              letterNo: unsCheckResp.letterNo,
              letterName: unsCheckResp.letterName || unsCheckReceive.letterName,
              target: unsCheckResp.target ? [unsCheckResp.target.split(' ')[0], unsCheckResp.target.split(' ')[1]] : this.formCard2.target,
              respWay: unsCheckResp.respWay || this.formCard2.respWay,
              drafter: unsCheckResp.drafter || this.formCard2.drafter,
              sendDate: unsCheckResp.sendDate || this.formCard2.sendDate,
              letterMatter: unsCheckResp.extend1 || this.formCard2.letterMatter,
              stockCode: unsCheckResp.security ? unsCheckResp.security.split(';') : unsCheckReceive.security ? unsCheckReceive.security.split(';') : [],
              nullStockCode: unsCheckResp.security ? 0 : unsCheckReceive.security ? 0 : 1,
              fileList: []
            }
          }
          // 获取附件信息
          this.getFileList()
          // getFormCard1TableData
          let stockCodeList = stockCode.map(v => {
            return v.split(' ')[0]
          })
          this.getFormCard1TableData(stockCodeList.join(','))
        })
      },
      getFormCard1TableData(security) {
        this.loading = true
        getletterrecordtable(security).then((resp) => {
          this.loading = false
          this.formCard1TableData = resp.history
        })
      },
      createLetterNo () {
        // 每次调用该接口，需要上传上一次的函件类型2和当前的函件类型2
        getnum(this.lastLetterType2, this.formCard2.letterType[1]).then((resp) => {
          this.formCard2.letterNo = resp
          this.lastLetterType2 = this.formCard2.letterType[1]
          this.formCard2.drafter = this.gfnGetRealName()
          this.formCard2.sendDate = dateformat(new Date())
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.reqActivityNameByProcessName(() => {
          if (this.handleStatus === undefined) {
            this.opearteParam = 'new'
            this.createInfoId()
          }
          if (this.instanceId) {
            this.getFormInfos()
          }
          if (String(this.processStatus === '2')) { // 拟稿节点，生成函件编号
            this.createLetterNo()
          }
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  .replayLetterFormPage {

  }
</style>
