<template>
    <div class="clueFormPage">
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
                :accountInfosProps.sync="accountInfos"
                :accountGroupProps.sync="accountGroup"
                :monitorSecurityProps.sync="monitorSecurity"
                :formCard1.sync="formCard1"
                :infoId="infoId"
                :showUploadButton="showUploadButton"
                :defaultLimitFileType="defaultLimitFileType"
                :fromInfoId="fromInfoId"
                :fromTitle="fromTitle"
                @getFileList="getFileList"
                @deleteFile="deleteFile"
                @downloadFile="downloadFile"
                @updateAccountInfos="updateAccountInfos"
                @updateMonitorSecurityInfo="updateMonitorSecurityInfo"
                @updateMonitorGroupsInfo="updateMonitorGroupsInfo"
                @updateStockCodeToForm2="updateStockCodeToForm2"
        ></FormCard1>
        <FormCard2
                ref="formCard2"
                v-if="formCard2Show && formCard1.needReport === '1'"
                :disabled="formCard2Disabled"
                :formCard2.sync="formCard2"
                :infoId="infoId"
                :loading="loading"
                :showUploadButton="showUploadButton"
                :defaultLimitFileType="defaultLimitFileType"
                @handleLetterTypChange="handleLetterTypChange"
                @getFileList="getFileList"
                @deleteFile="deleteFile"
                @downloadFile="downloadFile">
        </FormCard2>
        <suggestion-textarea-component
                ref='suggestFormRef'
                :disabled="suggestDisabled"
                :show="suggestShow"
                :steps="steps"
                :propsComment="suggestionForm"
                @updateApproveFlag="updateApproveFlag"
                @handleInputSuggestion="handleInputSuggestion"
                @updateStepsDescription="updateStepsDescription"></suggestion-textarea-component>
        <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit"
                             @goBack="goBack" :loading="commitLoading"></bottom-button-group>
        <el-dialog
          title=""
          :visible.sync="showSendToLeaderDialog"
          center
          width="700px">
            <div class="button-group" style="text-align:center">
                <el-button @click="commitToLeaderOrDraft('true')" type="primary" style="margin-right: 20px">
                    提交到所领导审批
                </el-button>
                <el-button @click="commitToLeaderOrDraft('false')" type="info">
                    提交到拟稿人确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import { formAuthority } from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import FormCard2 from './component/FormCard2'
  import { card2Columns, card3Columns } from './component/constants'
  import {
    getClueReportnum,
    realGroupClueReportlaunch,
    ClueReportsave,
    historyGroupLeaderClueReportlaunch,
    historyGrouperClueReportlaunch,
    postClueReportdata,
    getClueReportLetternum,
    ClueReporthistoryopiniondata,
    ClueReportexamine,
    getfilelist,
    getaccountinfo,
    getMonitorSecurityInfo,
    getMonitorGroupsInfo,
    getUserRoles
  } from '@/service/superviseTask'
  import { dateformat } from '@/utils/dateTimeFormat'

  export default {
    components: {
      FormCard1,
      FormCard2
    },
    mixins: [MinxinVue, MixinAuthority],
    computed: {
      formCard1Disabled () {
        if (String(this.handleStatus) === '-3') {
          return false
        } else {
          return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
        }
      },
      formCard2Disabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']
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
      suggestShow () {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data () {
      return {
        loading: false,
        loading1: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/clueReportTablelist',
          label: '线索报告'
        }, {
          router: '',
          label: '线索报告表单'
        }],
        formCard1: {
          clueName: '',
          clueNo: '',
          stockCode: [],
          nullStockCode: 0,
          clueDesc: '',
          needReport: '1',
          clueBranch: '1',
          clueType: [],
          clueTypeText: [],
          fileList: [],
          fileList1: [],
          sourceType: '0',
          sourceTypeText: '联合监管',
          source: '',
          keyword: ''
        },
        formCard2: {
          stockCode: [],
          nullStockCode: 0,
          letterType: ['异动报告', '异动报告'],
          letterNo: '',
          letterName: '',
          fkDepartment: '0',
          sendDepartment: ['本所', '市场监察部'],
          sendWay: [],
          fileList: [],
          note: '',
          sendPerson: '',
          sendDate: ''
        },
        showUploadButton: true, // 显示上传按钮权限
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        lastLetterType2: '',
        accountInfos: [],
        monitorSecurity: [],
        accountGroup: [],
        sendToLeader: '',
        showSendToLeaderDialog: false,
        fromInfoId: '',
        fromTitle: ''
      }
    },
    methods: {
      updateAccountInfos(val) {
        this.accountInfos = val
      },
      updateMonitorSecurityInfo(val) {
        this.monitorSecurity = val
      },
      updateMonitorGroupsInfo(val) {
        this.accountGroup = val
      },
      handleSave () {
        let params = this.getCommonParams()
        ClueReportsave(params).then(() => {
          this.opearteParam = ''
          this.$message.success('保存成功')
        })
      },
      validateForms () {
        let flag1 = true, flag2 = true
        if (this.$refs.formCard1) {
          flag1 = this.$refs.formCard1.validateFormCard()
        }
        if (this.$refs.formCard2) {
          flag2 = this.$refs.formCard2.validateFormCard()
        }
        return flag1 && flag2
      },
      commitToLeaderOrDraft(flag) {
        this.sendToLeader = flag
        if (flag === 'false') {
          this.comfirmCommitInfo()
        } else {
          // 选人
          this.selectData.dialogFormVisble = true
        }
        this.showSendToLeaderDialog = false
      },
      handleCommit () {
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
          if (String(this.processStatus) === '6') { // 选择发送给领导审批还是拟稿人
            this.showSendToLeaderDialog = true
            return
          }
          // 拟稿确认节点(8)选择本部门存档或者在创建节点，复核节点，所领导审批和发函节点（0, 4, 7, 9）不需要选人组件
          let noSelectPersonArray = ['0', '4', '7', '9']
          if ((String(this.processStatus) === '8' && this.formCard2.sendWay.indexOf('0') > -1) || noSelectPersonArray.indexOf(String(this.processStatus)) > -1) {
            this.$confirm('确定提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.comfirmCommitInfo()
            }).catch(() => {})
          } else {
            // 弹出选人组件
            this.selectData.dialogFormVisble = true
          }
        }
      },
      dealInfos (array) {
        array.forEach(v => {
          v.infoId = this.infoId
        })
        return array
      },
      getCommonParams (selectPerson) {
        let params = {
          crpMain: {
            infoId: this.infoId,
            extend1: this.formCard1.clueNo,
            security: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(';'),
            clueName: this.formCard1.clueName,
            clueDesc: this.formCard1.clueDesc,
            needReport: this.formCard1.needReport,
            clueBranch: this.formCard1.clueBranch,
            clueType: this.formCard1.clueType.join(','),
            clueTypeText: this.formCard1.clueTypeText.join(','),
            sourceType: this.formCard1.sourceType,
            sourceTypeText: this.formCard1.sourceTypeText,
            source: this.formCard1.source,
            processStatus: this.processStatus,
            comment: this.suggestionForm
          },
          accountinfo: this.dealInfos(this.accountInfos),
          accountGroup: this.accountGroup,
          monitorSecurity: this.monitorSecurity,
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId || '',
          toWhom: selectPerson || '',
          keyword: this.formCard1.keyword,
          sendToLeader: this.sendToLeader,
          operate: this.opearteParam // 从新建按钮进去第一次保存为’new‘，其他为空
        }
        if (this.formCard2Show) {
          let ngspLetter = {
            letterSecurity: this.formCard2.nullStockCode ? '' : this.formCard2.stockCode.join(';'),
            letterType: this.formCard2.letterType[0] + ' ' + this.formCard2.letterType[1],
            letterNo: this.formCard2.letterNo,
            letterName: this.formCard2.letterName,
            fkDepartment: this.formCard2.fkDepartment,
            sendDepartment: this.formCard2.sendDepartment[0] + ' ' + this.formCard2.sendDepartment[1],
            sendWay: this.formCard2.sendWay.join(','),
            note: this.formCard2.note,
            sendPerson: this.gfnGetRealName(),
            sendDate: dateformat(new Date())
          }
          params.crpMain = {...params.crpMain, ...ngspLetter}
        }
        // if (String(this.processStatus) === '3') {
        //   params.needreply = this.formCard5.needreply
        // }
        return JSON.stringify(params)
      },
      comfirmCommitInfo (selectPerson) {
        this.commitLoading = true
        let params = this.getCommonParams(selectPerson)
        if (String(this.handleStatus) === '-1') {
          realGroupClueReportlaunch(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else if (String(this.handleStatus) === '-2') {
          historyGrouperClueReportlaunch(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else if (String(this.handleStatus) === '-3') {
          historyGroupLeaderClueReportlaunch(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else if (String(this.handleStatus) === '2') {
          if (this.taskId === '0') {
            if (String(this.processStatus) === '0') {
              realGroupClueReportlaunch(params).then((resp) => {
                this.goBack()
                this.callbackMessage(resp)
              })
            }
            if (String(this.processStatus) === '2') {
              historyGroupLeaderClueReportlaunch(params).then((resp) => {
                this.goBack()
                this.callbackMessage(resp)
              })
            }
            if (String(this.processStatus) === '3') {
              historyGrouperClueReportlaunch(params).then((resp) => {
                this.goBack()
                this.callbackMessage(resp)
              })
            }
          } else {
            ClueReportexamine(params).then((resp) => {
              this.goBack()
              this.callbackMessage(resp)
            })
          }
        }
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          this.formCard1.fileList = []
          this.formCard1.fileList1 = []
          this.formCard2.fileList = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'clueMeetingSummary') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'lad_basicInfo_attachment') {
              this.formCard1.fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'lad_letter_attachment') {
              this.formCard2.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        postClueReportdata(this.instanceId).then((resp) => {
          this.loading = false
          resp = JSON.parse(resp)
          console.log(resp)
          const {crpMain} = resp
          this.processStatus = crpMain.processStatus // proceStatus：这里返回的字段名称和其他流程不同
          this.infoId = resp.infoId
          let stockCode = crpMain.security ? crpMain.security.split(';') : []
          let stockCode2 = crpMain.letterSecurity ? crpMain.letterSecurity.split(';') : []
          this.formCard1 = {
            clueName: crpMain.clueName,
            clueNo: crpMain.extend1,
            stockCode: stockCode,
            nullStockCode: !crpMain.security ? 1 : 0,
            clueDesc: crpMain.clueDesc,
            needReport: crpMain.needReport,
            clueBranch: crpMain.clueBranch,
            clueType: crpMain.clueType.split(','),
            clueTypeText: [],
            fileList: [],
            fileList1: [],
            sourceType: crpMain.sourceType,
            sourceTypeText: '',
            source: crpMain.source,
            keyword: resp.keyword
          }
          this.suggestionForm = crpMain.comment
          this.accountInfos = resp.accountinfo || []
          this.accountGroup = resp.accountGroup || []
          this.monitorSecurity = resp.monitorSecurity || []
          this.fromTitle = crpMain.fromTitle
          this.fromInfoId = resp.fromInfoId
          /*letter 信息*/
          this.formCard2 = {
            stockCode: stockCode2,
            nullStockCode: !crpMain.letterSecurity ? 1 : 0,
            letterType: crpMain.letterType ? crpMain.letterType.split(' ') : this.formCard2.letterType,
            letterNo: crpMain.letterNo || this.formCard2.letterNo,
            letterName: crpMain.letterName || this.formCard2.letterName,
            fkDepartment: crpMain.fkDepartment || this.formCard2.fkDepartment,
            sendDepartment: crpMain.sendDepartment ? crpMain.sendDepartment.split(' ') : this.formCard2.sendDepartment,
            sendWay: crpMain.sendWay ? crpMain.sendWay.split(',') : this.formCard2.sendWay,
            fileList: [],
            note: crpMain.note,
            sendPerson: crpMain.sendPerson || this.formCard2.sendPerson,
            sendDate: crpMain.sendDate || this.formCard2.sendDate
          }
          if (this.formCard1.stockCode.length && !this.formCard2.stockCode.length) {
            this.updateStockCodeToForm2()
          }
          if (!this.formCard2.letterNo) {
            this.createLetterNo()
          }
          // 获取附件信息
          this.getFileList()
        })
      },
      // 获取线索报告编号
      getClueNo () {
        getClueReportnum().then((resp) => {
          this.formCard1.clueNo = resp
        })
      },
      handleLetterTypChange() {
        this.createLetterNo()
      },
      createLetterNo () {
        // 每次调用该接口，需要上传上一次的函件类型2和当前的函件类型2
        getClueReportLetternum(this.formCard2.letterType[1], this.lastLetterType2).then((resp) => {
          this.formCard2.letterNo = resp
          this.lastLetterType2 = this.formCard2.letterType[1]
          this.formCard2.sendPerson = this.gfnGetRealName()
          this.formCard2.sendDate = dateformat(new Date())
        })
      },
      updateStockCodeToForm2() {
        this.formCard2.stockCode = this.formCard1.stockCode
        this.formCard2.nullStockCode = this.formCard1.nullStockCode
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.reqActivityNameByProcessName(() => {
          let username = this.gfnGetUsername()
          getUserRoles(username).then((resp) => {
            resp.forEach(item => {
              if (item.rolename.indexOf('线索') > -1 && item.rolename.indexOf('组长') > -1) { // 线索组组长
                this.handleStatus = '-3'
              } else if (item.rolename.indexOf('线索') > -1 && item.rolename.indexOf('组员') > -1) { // 线索组组员
                this.handleStatus = '-2'
              } else if (item.rolename.indexOf('实时') > -1) { // 实时组发起
                this.handleStatus = '-1'
              }
              switch (this.handleStatus) {
                case '-1':
                  this.processStatus = 0
                  break
                case '-2':
                  this.processStatus = 3
                  this.createLetterNo()
                  break
                case '-3':
                  this.processStatus = 2
                  break
              }
              // 当processStatus变化，更新activityName
              this.reqActivityNameByProcessName()
              if (this.handleStatus === undefined || this.handleStatus === '-1' || this.handleStatus === '-2' || this.handleStatus === '-3') {
                this.opearteParam = 'new'
                this.createInfoId()
                this.getClueNo()
              }
              if (this.instanceId) {
                this.getFormInfos()
              }
            })
          })
        })
      })
    }
  }
</script>

<style lang="less" scoped>
    .clueFormPage {

    }
</style>
