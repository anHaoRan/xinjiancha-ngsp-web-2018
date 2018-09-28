<!--舆情分析表单重构-->
<template>
  <div class="lyricFormPage">
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
      :infoId="infoId"
      :showUploadButton="showUploadButton"
      :defaultLimitFileType="defaultLimitFileType"
      @getFileList="getFileList"
      @deleteFile="deleteFile"
      @downloadFile="downloadFile"
    ></FormCard1>
    <FormCard2
      ref="formCard2"
      v-if="formCard2Show"
      :disabled="formCard2Disabled"
      :formCard2.sync="formCard2"
      :infoId="infoId"
      :loading="loading"
      :isLanchRpc = isLanchRpc
      @createClueReportInfoId="createClueReportInfoId">
    </FormCard2>
    <suggestion-textarea-component
      ref='suggestFormRef'
      :disabled="suggestDisabled"
      :show="suggestShow"
      :steps="steps"
      :propsComment="suggestionForm"
      :showFinishRadio="showFinishRadio"
      @updateApproveFlag="updateApproveFlag"
      @handleInputSuggestion="handleInputSuggestion"
      @handleFinishFlagChange="handleFinishFlagChange"
      @updateStepsDescription="updateStepsDescription"></suggestion-textarea-component>
    <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit"
                         @goBack="goBack" :loading="commitLoading"></bottom-button-group>
    <el-dialog
      title="选择执行任务小组"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showSelectRoleDialog"
      left
      width="700px">
      <el-form>
        <el-form-item label="执行任务小组：">
          <el-select v-model="role" placeholder="请选择" size="small" style="width:70%">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="comfirmCommitInfo()">确 定</el-button>
        <el-button type="primary" size="small" @click="handleCancelSelectRole()">取 消</el-button>
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
  import { roleOptions, clueTypeOptions } from './component/constants'
  import {
    getlyricnum,
    getfilelist,
    getInfoId,
    getClueReportnum,
    getUserRoles,
    ClueReportsave,
    postlyricdata,
    lyriclaunch,
    lyricexamine,
    lyricsave
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
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
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
        if ((String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']) && !this.isLanchRpc) { // disabled状态并且未发起formCard2信息，此时不显示formCard2
          return false
        } else {
          return formAuthority[this.processStatus]['formCard2']['show']
        }
      },
      suggestShow () {
        return formAuthority[this.processStatus]['suggestForm']['show']
      },
      showFinishRadio() {
        return String(this.handleStatus) === '2' && String(this.processStatus) === '1' // 判断中节点
      }
    },
    data () {
      return {
        roleOptions,
        clueTypeOptions,
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/lyricTablelist',
          label: '舆情分析'
        }, {
          router: '',
          label: '舆情分析表单'
        }],
        formCard1: {
          stockCode: [],
          nullStockCode: 0,
          lyricNo: '',
          title: '',
          sourceFrom: ['证券行业三大报', '中国证券报'],
          sourceTime: '',
          mainText: '',
          sourceType: '0',
          featureDesc: '',
          isImportant: '0',
          keyword: '',
          fileList: []
        },
        formCard2: {
          modifyInfo: '',
          suggestion: '',
          isRpc: '0',
          clueNo: '',
          clueName: '',
          clueBranch: '1',
          needReport: '1',
          clueType: [],
          clueDesc: '',
          clueReportInfoId: '' // 线索报告infoId
        },
        showUploadButton: true, // 显示上传按钮权限
        opearteParam: '', // 是否为‘new'
        createType: '1', // 1-手工创建 0-信息化导入
        finishFlag: 'false', // 判断中节点直接办结与否
        role: '', // 执行小组角色，判断中节点提交前选择
        showSelectRoleDialog: false,
        approveFlag: 'true',
        suggestionForm: '',
        clueProcess: '', // 发起线索报告流程参数
        isLanchRpc: false // 是否发起线索报告
      }
    },
    methods: {
      handleFinishFlagChange(val) {
        this.finishFlag = val
      },
      handleCancelSelectRole() {
        this.role = ''
        this.showSelectRoleDialog = false
      },
      createClueReportInfoId() {
        !this.formCard2.clueReportInfoId && this.getClueReportInfoId()
        !this.formCard2.clueNo && this.getClueNo()
        !String(this.clueProcess) && this.getClueProcess()
      },
      getClueReportInfoId() {
        getInfoId().then((resp) => {
          this.formCard2.clueReportInfoId = resp
        })
      },
      getClueNo() {
        getClueReportnum().then((resp) => {
          this.formCard2.clueNo = resp
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
          return this.formCard2.clueType.indexOf(v) > -1
        })
        let params = {
          'crpMain': {
            'infoId': this.formCard2.clueReportInfoId,
            'extend1': this.formCard2.clueNo,
            'security': this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(';'),
            'clueName': this.formCard2.clueName,
            'clueDesc': this.formCard2.clueDesc,
            'needReport': this.formCard2.needReport,
            'clueBranch': this.formCard2.clueBranch,
            'clueType': this.formCard2.clueType.join(','),
            'clueTypeText': clueTypeText.join(','),
            'sourceType': '1',
            'sourceTypeText': '舆情分析',
            'source': this.formCard1.lyricNo,
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
            'fromTitle': this.formCard1.lyricNo,
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
      handleSave () {
        if (!this.isLanchRpc && String(this.handleStatus) === '2' && String(this.formCard2.isRpc) === '1') {
          this.saveClueReportInfo()
        }
        let params = this.getCommonParams()
        lyricsave(params).then(() => {
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
          if (String(this.processStatus) === '1' && this.finishFlag === 'false') { // 判断中节点未直接归档
            this.showSelectRoleDialog = true
            return
          } else if (String(this.processStatus) === '1' && this.finishFlag === 'true') { // 判断中节点直接归档
            this.$confirm('确定直接归档？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.comfirmCommitInfo()
            }).catch(() => {})
            return
          }
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
      dealInfos (array) {
        array.forEach(v => {
          v.infoId = this.infoId
        })
        return array
      },
      getCommonParams (selectPerson) {
        let params = {
          poaMain: {
            infoId: this.infoId,
            extend2: this.formCard1.lyricNo,
            title: this.formCard1.title,
            sourceFrom: this.formCard1.sourceFrom.join(' '),
            sourceTime: this.formCard1.sourceTime,
            mainText: this.formCard1.mainText,
            sourceType: this.formCard1.sourceType,
            featureDesc: this.formCard1.featureDesc,
            isImportant: this.formCard1.isImportant,
            security: this.formCard1.nullStockCode ? '' : this.formCard1.stockCode.join(';'),
            createType: this.createType,
            processStatus: this.processStatus,
            comment: this.suggestionForm
          },
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId || '',
          toWhom: selectPerson || '',
          keyword: this.formCard1.keyword,
          role: this.role, // 执行小组（判断中节点提交前选出）
          finish: this.finishFlag, // 判断中节点直接办结
          operate: this.opearteParam // 从新建按钮进去第一次保存为’new‘，其他为空
        }
        if (this.formCard2Show) {
          let formCard2 = {
            modifyInfo: this.formCard2.modifyInfo,
            suggestion: this.formCard2.suggestion,
            isCrp: this.formCard2.isRpc,
            infoIdCrp: this.formCard2.clueReportInfoId,
            extend3: this.formCard2.clueNo,
          }
          params.poaMain = {...params.poaMain, ...formCard2}
        }
        return JSON.stringify(params)
      },
      comfirmCommitInfo (selectPerson) {
        this.commitLoading = true
        if (!this.isLanchRpc && String(this.handleStatus) === '2' && String(this.formCard2.isRpc) === '1') {
          this.saveClueReportInfo()
        }
        let params = this.getCommonParams(selectPerson)
        if (String(this.processStatus) === '0') {
          lyriclaunch(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          lyricexamine(params).then((resp) => {
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
            if (item.fileLocation === 'poa_BasicInfo_attachment') {
              this.formCard1.fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
        })
      },
      getFormInfos () {
        this.loading = true
        postlyricdata(this.instanceId).then((resp) => {
          this.loading = false
          const {poaMain} = resp
          this.processStatus = poaMain.processStatus // proceStatus：这里返回的字段名称和其他流程不同
          this.infoId = resp.infoId
          let stockCode = poaMain.security ? poaMain.security.split(';') : []
          this.formCard1 = {
            stockCode: stockCode,
            nullStockCode: !poaMain.security ? 1 : 0,
            lyricNo: poaMain.extend2 || this.formCard1.lyricNo,
            title: poaMain.title,
            sourceFrom: poaMain.sourceFrom.split(' '),
            sourceTime: poaMain.sourceTime,
            mainText: poaMain.mainText,
            sourceType: poaMain.sourceType,
            featureDesc: poaMain.featureDesc,
            isImportant: poaMain.isImportant,
            keyword: resp.keyword,
            fileList: []
          }
          this.suggestionForm = poaMain.comment
          // 线索报告相关
          this.formCard2.modifyInfo = poaMain.modifyInfo || this.formCard2.modifyInfo
          this.formCard2.suggestion = poaMain.suggestion || this.formCard2.suggestion
          this.formCard2.isRpc = poaMain.isCrp || this.formCard2.isRpc
          this.formCard2.clueNo = poaMain.extend3 || this.formCard2.clueNo
          this.formCard2.clueReportInfoId = resp.infoIdRpc || this.formCard2.clueReportInfoId
          if (poaMain.isCrp === '1' && resp.infoIdRpc) { // 如果为1，代表已发起线索报告
            this.isLanchRpc = true
          }
          // 获取附件信息
          this.getFileList()
        })
      },
      getLyricNo () {
        getlyricnum().then((resp) => {
          this.formCard1.lyricNo = resp
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.reqActivityNameByProcessName(() => {
          if (this.handleStatus === undefined) {
            this.opearteParam = 'new'
            this.createInfoId()
            this.getLyricNo()
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
  .lyricFormPage {

  }
</style>
