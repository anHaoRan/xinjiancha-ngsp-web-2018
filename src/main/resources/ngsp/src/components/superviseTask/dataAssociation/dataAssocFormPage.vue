<template>
  <div class="surveyFormPage">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component
      :currentProcessStatus="processStatus"
      :steps="steps"
      :description="stepsDescription">
    </steps-common-component>
    <FormCard1
      ref="formCard1"
      v-if="formCard1Show"
      :disabled="formCard1Disabled"
      :formCard1.sync="formCard1"
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      @card1ChangCard3="card1ChangCard3"
      @card1ChangCard3Name="card1ChangCard3Name"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"></FormCard1>
    <FormCard2
      ref="formCard2"
      v-if="formCard2Show"
      :disabled="formCard2Disabled || caculateIsOperate"
      :formCard2.sync="formCard2"
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"></FormCard2>
    <FormCard3
      ref="formCard3"
      v-if="formCard3Show"
      :disabled="formCard3Disabled"
      :formCard3.sync="formCard3"
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"></FormCard3>
    <suggestion-textarea-component
      ref='dataAssoc'
      :disabled="suggestDisabled"
      :show="suggestShow"
      :steps="steps"
      :propsComment="suggestionForm"
      :suggestionColumns="suggestionColumns"
      @updateApproveFlag="updateApproveFlag"
      @handleInputSuggestion="handleInputSuggestion"
      @updateStepsDescription="updateStepsDescription"></suggestion-textarea-component>
    <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit" @goBack="goBack"></bottom-button-group>
    <selectPersonComponent
      ref="selectPersonComponent"
      :selectData="selectData"
      @obdSelectPerson="confirmCommitInfo"
      v-if="selectData.dialogFormVisble"></selectPersonComponent>
  </div>
</template>
<script>
  import moment from 'moment'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import { formAuthority } from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import FormCard2 from './component/FormCard2'
  import FormCard3 from './component/FormCard3'
  import {dateformat} from '@/utils/dateTimeFormat'
  import {
    getfilelist,
    temporaryCalculationsave,
    postdataassociationdata,
    gedataassociationtnum,
    temporaryCalculationdata,
    postdataassociationsaveform,
    postdataassociationLunchForm,
    // postdataassociationleaderform,
    // postdataassociationgrouperform,
    postdataassociationexamineform
  } from '@/service/superviseTask'

  export default {
    components: {
      FormCard1,
      FormCard2,
      FormCard3
    },
    mixins: [MinxinVue, MixinAuthority],
    computed: {
      formCard1Disabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
      },
      formCard2Disabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']
      },
      formCard3Disabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard3']['disabled']
      },
      suggestDisabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['suggestForm']['disabled']
      },
      formCard1Show () {
        return formAuthority[this.processStatus]['formCard1']['show']
      },
      formCard2Show () {
        return formAuthority[this.processStatus]['formCard2']['show']
      },
      formCard3Show () {
        return formAuthority[this.processStatus]['formCard3']['show']
      },
      suggestShow () {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          }, {
            router: '/tablelist',
            label: '数据协查'
          }, {
            router: '',
            label: '数据协查表单'
          }
        ],
        formCard1: {
          keyword: '',
          letterName: '',
          letterNo: '',
          fromDept: ['本所', '发行上市部'],
          contackPerson: '',
          letterDate: '',
          letterWay: '4',
          letterWayText: '电子邮件',
          letterType: '数据协查',
          stockCode: [],
          nullStockCode: 1,
          instruction: '',
          filelist: []
        },
        formCard2: {
          infoIdTpc: '',
          isTpc: 0,
          taskNo: '',
          needDesc: '',
          checkStandard: '',
          deliverTime: '',
          filelist: [],
          showUrlLink: 0 // 0 只显示radio ，1 显示表单，2 显示链接
        },
        formCard3: {
          stockCode: [],
          nullStockCode: 1,
          letterType: ['协查报告', '协查报告'],
          letterNo: '',
          fileList: [],
          letterName: '',
          invesType: [],
          invesTypeOther: '',
          note: '',
          feedbackDept: ['本所', '上市公司监管一部'],
          feedbackWay: [],
          receiptNo: '',
          drafter: '',
          draftDate: ''
        },
        suggestionColumns: [{label: '流程状态', field: 'proceStatus'}, {label: '审核意见', field: 'comment'}, {label: '处理人', field: 'procePerson'}, {label: '审核日期', field: 'createTime'}],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_dig_flow', // 当前流程名称
          businessData: {}
        },
        infoIdTpc: '',
        // isopearte: '',
        approveFlag: 'true',
        caculateIsOperate: false // 默认 false，与 formCard2Disabled 一起控制表单2显示
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.reqActivityNameByProcessName(() => {
          // if (this.handleStatus == '-1' || this.handleStatus == '-2') {
          // this.isopearte = 'new'
          // }
          if (this.handleStatus == '-1' && this.processStatus == '0') {
            this.processStatus = 1
          }
        })
        if (this.taskId === undefined) {
          this.getnumber()
          this.createInfoId()
        }
        this.getAllData()
      })
    },
    methods: {
      getAllData () {
        if (this.instanceId) {
          postdataassociationdata(this.instanceId).then((resp) => { // eslint-disable-line
            this.infoId = resp.infoId
            this.infoIdTpc = resp.infoIdTpc // 保存的草稿后提交时使用
            this.processStatus = resp.digReceive.processStatus
            this.getFileList()
            if (this.infoIdTpc) {
              this.getFileList(this.infoIdTpc)
            }
            this.suggestionForm = resp.digReceive.comment // 意见
            // 表单1的
            let fromDept = resp.digReceive.fromDept
            this.formCard1 = {
              keyword: resp.keyword, // 关键字
              letterName: resp.digReceive.letterName, // 来函信息 - 来函名称
              letterNo: resp.digReceive.letterNo, // 来函信息 - 来函编号
              fromDept: [fromDept.split(' ')[0], fromDept.split(' ')[1]], // 来函信息 - 来函单位
              contackPerson: resp.digReceive.contackPerson, // 来函信息 - 联系人
              letterDate: resp.digReceive.letterDate, // 来函信息 - 来函日期
              letterWay: resp.digReceive.letterWay, // 来函信息 - 来函方式
              letterType: resp.digReceive.letterType, // 来函信息 - 来函类别
              stockCode: resp.digReceive.security !== '' ? resp.digReceive.security.split(';') : [], // 来函信息 - 证券代码 - 有代码
              nullStockCode: resp.digReceive.security === '' ? 1 : 0, // 来函信息 - 证券代码 - 无代码
              instruction: resp.digReceive.instruction, // 来函信息 - 来函说明
              fileList: []
            }
            this.$refs.formCard1.changeInstruction(this.formCard1.letterWay)
            // 表单2的
            if (resp.digReceive.isTpc === '1') {
              this.caculateIsOperate = true
              this.gettemporaryCalculationAllData(this.infoIdTpc)
            }
            // 表单3的
            let letterType = resp.digResp.letterType
            let feedbackDept = resp.digResp.feedbackDept
            this.formCard3 = {
              letterType: letterType !== '' ? [letterType.split(' ')[0], letterType.split(' ')[1]] : ['协查报告', '协查报告'], // 回函信息 - 函件类型
              letterNo: resp.digResp.letterNo === '' ? this.getnumber() : resp.digResp.letterNo, // 回函信息 - 函件编号
              note: resp.digResp.note === null ? '' : resp.digResp.note, // 回函信息 - 备注
              feedbackDept: feedbackDept !== '' ? [feedbackDept.split(' ')[0], feedbackDept.split(' ')[1]] : ['本所', '上市公司监管一部'], // 来函信息 - 反馈单位
              feedbackWay: resp.digResp.feedbackWay !== '' ? resp.digResp.feedbackWay.split(',') : [], // 回函信息 - 发函方式
              receiptNo: resp.digResp.receiptNo !== null ? resp.digResp.receiptNo : '', // 回函信息 - 签收单编号
              drafter: resp.digResp.drafter !== null ? resp.digResp.drafter : this.gfnGetRealName(), // 回函信息 - 拟稿人
              draftDate: resp.digResp.draftDate !== null ? resp.digResp.draftDate : moment().format('YYYY-MM-DD'), // 回函信息 - 完成日期
              fileList: [],
              letterName: '',
              stockCode: [],
              nullStockCode: 0,
              invesType: resp.digResp.invesType !== '' ? resp.digResp.invesType.split(',') : [], // 回函信息 - 协查类型
              invesTypeOther: resp.digResp.extend1
            }
            // 回函信息 - 函件名称
            if (resp.digResp.letterName !== null) {
              this.formCard3.letterName = resp.digResp.letterName
            } else if (resp.digReceive.letterName !== '') {
              this.formCard3.letterName = resp.digReceive.letterName
            } else {
              this.formCard3.letterName = ''
            }
            // 回函信息 - 证券代码
            if (resp.digResp.security !== '') {
              this.formCard3.stockCode = resp.digResp.security.split(';')
            } else if (resp.digReceive.security !== '') {
              this.formCard3.stockCode = resp.digReceive.security.split(';')
            } else {
              this.formCard3.stockCode = []
            }
            this.formCard3.nullStockCode = this.formCard3.stockCode.length ? 1 : 0 // 回函信息 - 证券代码
            if (this.formCard3Show === true) { // 表单不存在就不调
              setTimeout(() => { // eslint-disable-line
                this.$refs.formCard3.clearValidate3()
              }, 1000)
              this.$refs.formCard3.invesChange(this.formCard3.invesType)
              this.$refs.formCard3.backWayChange(this.formCard3.feedbackWay)
            }
          })
        }
      },
      // 获取临时计算表单
      gettemporaryCalculationAllData (val) {
        temporaryCalculationdata(val).then((resp) => {
          this.formCard2 = {
            infoIdTpc: this.infoIdTpc,
            isTpc: 1,
            taskNo: resp.tpcMain.taskNo,
            needDesc: resp.tpcMain.needDesc,
            checkStandard: resp.tpcMain.checkStandard,
            deliverTime: resp.tpcMain.deliverTime,
            filelist: [],
            showUrlLink: 2
          }
        })
      },
      getFileList (infoIdTpc) {
        getfilelist(infoIdTpc || this.infoId).then((resp) => {
          this.showUploadButton = resp.authority
          if (infoIdTpc) { // 临时计算
            this.formCard2.fileList = []
            resp.attachments.forEach(item => {
              if (item.fileLocation === 'tpc_first_attachment') {
                this.formCard2.fileList.push({'name': item.fileName, 'fileId': item.fileId})
              }
            })
          } else {
            this.formCard1.fileList = []
            this.formCard3.fileList = []
            resp.attachments.forEach(item => {
              if (item.fileLocation === 'dig_LetterInfo_attachment') {
                this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId})
              }
              if (item.fileLocation === 'dig_CheckInfo_attachment') {
                this.formCard3.fileList.push({'name': item.fileName, 'fileId': item.fileId})
              }
            })
          }
        })
      },
      updateApproveFlag (val) {
        this.approveFlag = val
      },
      handleInputSuggestion (val) {
        this.suggestionForm = val
      },
      updateStepsDescription (val) {
        this.stepsDescription = val
      },
      /* ************** 组长创建并分配没有表单2、3  ************** */
      // 临时计算 保存 只要调这个接口，临时计算就发起了，不能再操作了
      tempCaculateSave () {
        let params = {
          tpcMain: {
            'infoId': this.infoIdTpc || this.formCard2.infoIdTpc,
            'taskNo': this.formCard2.taskNo,
            'founder': this.gfnGetRealName(),
            'startTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'needDesc': this.formCard2.needDesc,
            'checkStandard': this.formCard2.checkStandard,
            'deliverTime': this.formCard2.deliverTime,
            'finishDate': '',
            'finishPerson': '',
            'resultInstrution': '',
            'createFrom': 'ngsp_dig_flow',
            'fromInfoId': this.infoId,
            'processStatus': '',
            'comment': ''
          },
          instanceId: '',
          taskId: '',
          toWhom: ''
          // approve: true,
          // operate: 'new'
        }
        temporaryCalculationsave(JSON.stringify(params)).then((resp) => {
          this.caculateIsOperate = true
          this.$message.success('临时计算保存成功')
        })
      },
      // 调用临时计算保存
      callTemporaryCalculationsave () {
        if (this.processStatus === 1 || this.processStatus === 2 || this.processStatus === 3) {
          if (this.formCard2.isTpc === 1 && this.formCard2.showUrlLink === 1) {
            let flag = this.$refs.formCard2.validateFormCard()
            if (flag) {
              this.tempCaculateSave()
            } else {
              return // eslint-disable-line
            }
          }
        }
      },
      // 保存
      handleSave () {
        this.callTemporaryCalculationsave()
        let params = this.getCommonParams()
        postdataassociationsaveform(JSON.stringify(params)).then(() => {
          // this.isopearte = ''
          this.$message.success('保存成功')
        })
      },
      // 提交
      handleCommit () {
        if (!this.validateForms()) {
          return
        }
        this.callTemporaryCalculationsave()
        if (this.approveFlag === 'false') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.confirmCommitInfo()
          }).catch(() => {})
        } else {
          if (this.showSelectPersonArray.indexOf(this.processStatus) > -1) {
            this.selectData.dialogFormVisble = true
          } else {
            this.$confirm('确定提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.confirmCommitInfo()
            }).catch(() => {})
          }
        }
      },
      // 确认提交
      confirmCommitInfo (selectPerson, fullname) {
        let params = this.getCommonParams()
        params.toWhom = selectPerson
        params = JSON.stringify(params)
        if (this.handleStatus == '-1' || this.handleStatus == '-2' || (this.handleStatus == '2' && this.taskId == '0')) {
          postdataassociationLunchForm(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          postdataassociationexamineform(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
        // if (this.handleStatus == '-2' || (this.handleStatus == '2' && this.taskId == '0')) {
        //   postdataassociationleaderform(params).then((resp) => {
        //     this.goBack()
        //   })
        // } else if (this.handleStatus == '-1') {
        //   postdataassociationgrouperform(params).then((resp) => {
        //     this.goBack()
        //   })
        // } else {
        //   postdataassociationexamineform(params).then((resp) => {
        //     this.goBack()
        //   })
        // }
      },
      validateForms () {
        let flag1 = true, flag2 = true, flag3 = true
        if (this.$refs.formCard1) {
          flag1 = this.$refs.formCard1.validateFormCard()
        }
        if (this.handleStatus == '-1' || this.handleStatus == '2') { // 2 处理
          if (this.$refs.formCard2) {
            flag2 = this.$refs.formCard2.validateFormCard()
          }
          if (this.$refs.formCard3) {
            flag3 = this.$refs.formCard3.validateFormCard()
          }
        }
        return flag1 && flag2 && flag3
      },
      // 非临时计算取参
      getCommonParams () {
        // 入参处理
        let feedbackWay = this.formCard3.feedbackWay
        let receiptNo = ''
        if (feedbackWay.indexOf('4') !== -1) {
          receiptNo = this.formCard3.receiptNo
        }
        let param = {
          digReceive: {
            'infoId': this.infoId,
            'letterName': this.formCard1.letterName,
            'letterNo': this.formCard1.letterNo,
            'fromDept': this.formCard1.fromDept[0] + ' ' + this.formCard1.fromDept[1],
            'contackPerson': this.formCard1.contackPerson,
            'letterDate': this.formCard1.letterDate || dateformat(new Date()),
            'letterWay': this.formCard1.letterWay,
            'letterWayText': this.formCard1.letterWayText,
            'letterType': this.formCard1.letterType,
            'security': this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(';'),
            'instruction': this.formCard1.instruction,
            'attachmentId': '',
            'isTpc': this.formCard2.isTpc,
            'infoIdTpc': this.infoIdTpc || this.formCard2.infoIdTpc,
            'clueTypeBig': '',
            'clueTypeSmall': '',
            'processStatus': this.processStatus,
            'comment': this.suggestionForm,
            'createType': '1'
          },
          instanceId: this.instanceId,
          taskId: this.taskId || '0',
          keyword: this.formCard1.keyword,
          // toWhom: '',
          // processWay: 'true',
          approve: this.approveFlag
          // operate: this.isopearte
        }
        if (this.handleStatus !== '-2' && this.formCard3Show === true) { // 分配没有这个参数 -2是分配，没显示的表单也不传
          param.digResp = {
            'infoId': this.infoId,
            'security': this.formCard3.nullStockCode ? '' : this.formCard3.stockCode.join(';'),
            'letterType': this.formCard3.letterType[0] + ' ' + this.formCard3.letterType[1],
            'letterNo': this.formCard3.letterNo,
            'letterName': this.formCard3.letterName,
            'invesType': this.formCard3.invesType.join(','),
            'extend1': this.formCard3.invesTypeOther,
            'matter': '',
            'feedbackDept': this.formCard3.feedbackDept[0] + ' ' + this.formCard3.feedbackDept[1],
            'feedbackWay': feedbackWay.join(','),
            'receiptNo': receiptNo,
            'drafter': this.formCard3.drafter,
            'draftDate': this.formCard3.draftDate,
            'respPerson': this.gfnGetRealName(),
            'respDate': dateformat(new Date()),
            'note': this.formCard3.note
          }
        }
        return param
      },
      // 取函件编号
      getnumber () {
        gedataassociationtnum(this.formCard3.letterType[0], this.formCard3.letterType[1]).then((resp) => {
          this.formCard3.letterNo = resp
        })
      },
      // 表单随表单1 变动
      card1ChangCard3 (val) {
        this.formCard3.stockCode = val
        this.formCard3.nullStockCode = val.length ? 0 : 1
      },
      card1ChangCard3Name (val) {
        this.formCard3.letterName = val
      }
    }
  }
</script>

<style lang="less" scoped></style>
