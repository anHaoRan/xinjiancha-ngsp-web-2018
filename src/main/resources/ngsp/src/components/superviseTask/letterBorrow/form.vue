<template>
  <div class="letterBorrowFormPage">
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
      :defaultPropsDisabledTime="defaultPropsDisabledTime"
    ></FormCard1>
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
  import {
    letterBorrowdata,
    letterBorrowsave,
    letterBorrowlaunch,
    letterBorrowexamine,
    getletterBorrowTableData
  } from '@/service/superviseTask'
  import {dateformat} from '@/utils/dateTimeFormat'
  export default {
    components: {
      FormCard1
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
          router: '/letterBorrowTablelist',
          label: '函件借阅'
        }, {
          router: '',
          label: '函件借阅表单'
        }],
        formCard1: {
          borrower: '',
          borrowDays: '1',
          borrowDate: [new Date(dateformat(new Date()) + ' 00:00:00'), new Date(dateformat(new Date()) + ' 00:00:00')],
          reason: ''
        },
        formCard1TableData: [],
        opearteParam: '', // 是否为‘new'
        approveFlag: 'true',
        suggestionForm: '',
        borrowPersonCode: '', // 传参使用
        isSameGroup: '', // 传参使用
        fromInstanceId: '' // 从其他流程转入的instanceId
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
      handleSave() {
        let params = this.getCommonParams()
        letterBorrowsave(JSON.stringify(params)).then(() => {
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
          this.$confirm('确定提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.comfirmCommitInfo()
          }).catch(() => {})
        }
      },
      dealNewInfoId() {
        this.formCard1TableData.forEach(v => {
          v.infoId = this.infoId
        })
      },
      getCommonParams (selectPerson) {
        this.dealNewInfoId()
        return {
          ltbMain: {
            infoId: this.infoId,
            borrower: this.formCard1.borrower,
            borrowDays: this.formCard1.borrowDays,
            borrowDateStart: dateformat(this.formCard1.borrowDate[0]) + ' 00:00:00',
            borrowDateEnd: dateformat(this.formCard1.borrowDate[1]) + ' 23:59:59',
            reason: this.formCard1.reason,
            processStatus: this.processStatus,
            comment: this.suggestionForm,
            isSameGroup: this.isSameGroup,
            borrowFrom: this.fromInstanceId,
            extend1: this.borrowPersonCode || this.gfnGetUsername()
          },
          ltbLetters: this.formCard1TableData,
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId
          // toWhom: selectPerson || '',
          // operate: this.opearteParam
        }
      },
      comfirmCommitInfo (selectPerson) {
        this.commitLoading = true
        let params = this.getCommonParams(selectPerson)
        if (String(this.processStatus) === '0') {
          letterBorrowlaunch(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          letterBorrowexamine(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      getFormInfos () {
        this.loading = true
        letterBorrowdata(this.instanceId).then((resp) => {
          this.loading = false
          const {ltbMain} = resp
          this.infoId = resp.infoId
          this.processStatus = ltbMain.processStatus
          this.formCard1 = {
            borrower: ltbMain.borrower,
            borrowDays: ltbMain.borrowDays,
            reason: ltbMain.reason,
            borrowDate: [ltbMain.borrowDateStart, ltbMain.borrowDateEnd]
          }
          this.suggestionForm = ltbMain.comment
          this.formCard1TableData = resp.ltbLetters
          this.borrowPersonCode = ltbMain.extend1 || this.gfnGetUsername()
          this.isSameGroup = ltbMain.isSameGroup || ''
          this.fromInstanceId = this.fromInstanceId || resp.ltbMain.borrowFrom
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        const {fromInstanceId} = this.$route.query
        if (fromInstanceId) { // 从其他流程转入
          this.fromInstanceId = fromInstanceId
          let params = {instanceId: fromInstanceId}
          getletterBorrowTableData(params).then(resp => {
            this.formCard1TableData = resp
          })
        }

        this.reqActivityNameByProcessName(() => {
          if (this.handleStatus === undefined) {
            this.opearteParam = 'new'
            this.createInfoId()
          }
          if (this.instanceId) {
            this.getFormInfos()
          } else {
            this.formCard1.borrower = this.gfnGetRealName()
          }
        })
      })
    }
  }
</script>

<style lang="less" scoped>
</style>
