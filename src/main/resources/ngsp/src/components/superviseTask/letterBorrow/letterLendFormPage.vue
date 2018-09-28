<template>
  <div class="letterLendFormPage">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='comfirmCommitInfo'></select-person-component>
    <FormCard1
      ref="formCard1"
      :isLetterLendFlow="true"
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
    <bottom-button-group @handleSave="handleSave" @handleCommit="handleCommit" @goBack="goBack"></bottom-button-group>
  </div>
</template>
<script>
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import {formAuthority} from './formAuthority'
  import FormCard1 from './component/FormCard1'
  import {
    getLetterLendData,
    letterLendSave,
    letterLendLaunch,
    letterLendExamine,
    getletterBorrowTableData
  } from '@/service/superviseTask'
  import {dateformat} from '@/utils/dateTimeFormat'
  export default {
    components: {
      FormCard1
    },
    mixins: [MinxinVue],
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
          label: '函件传阅'
        }, {
          router: '',
          label: '函件传阅表单'
        }],
        formCard1: {
          borrower: '',
          borrowerId: '',
          borrowDays: '1',
          borrowDate: [new Date(dateformat(new Date()) + ' 00:00:00'), new Date(dateformat(new Date()) + ' 00:00:00')],
          reason: '',
          lendTargetId: '',
          lendTarget: ''
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
        letterLendSave(JSON.stringify(params)).then(() => {
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
      getCommonParams () {
        this.dealNewInfoId()
        return {
          ltbLend: {
            infoId: this.infoId,
            borrower: this.formCard1.borrower,
            borrowerId: this.formCard1.borrowerId, // 传阅人id
            lendTargetId: this.formCard1.lendTargetId, // 传阅对象id
            lendTarget: this.formCard1.lendTarget,
            borrowDays: this.formCard1.borrowDays,
            borrowDateStart: dateformat(this.formCard1.borrowDate[0]) + ' 00:00:00',
            borrowDateEnd: dateformat(this.formCard1.borrowDate[1]) + ' 23:59:59',
            reason: this.formCard1.reason,
            processStatus: this.processStatus,
            comment: this.suggestionForm,
            borrowFrom: this.fromInstanceId,
            isSameGroup: this.isSameGroup,
          },
          ltbLetters: this.formCard1TableData,
          approve: this.approveFlag,
          taskId: this.taskId || '0',
          instanceId: this.instanceId
        }
      },
      comfirmCommitInfo () {
        let params = this.getCommonParams()
        if (String(this.processStatus) === '0') {
          letterLendLaunch(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          letterLendExamine(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      getFormInfos () {
        this.loading = true
        getLetterLendData(this.instanceId).then((resp) => {
          this.loading = false
          const {ltbLend} = resp
          this.infoId = resp.infoId
          this.processStatus = ltbLend.processStatus
          this.formCard1 = {
            borrower: ltbLend.borrower,
            borrowerId: ltbLend.borrowerId || this.gfnGetUsername(),
            lendTargetId: ltbLend.lendTargetId,
            lendTarget: ltbLend.lendTarget,
            borrowDays: ltbLend.borrowDays,
            reason: ltbLend.reason,
            borrowDate: [ltbLend.borrowDateStart.slice(0, 10), ltbLend.borrowDateEnd.slice(0, 10)]
          }
          this.suggestionForm = ltbLend.comment
          this.formCard1TableData = resp.ltbLetters || resp.ltlLetters
          this.fromInstanceId = this.fromInstanceId || resp.ltbLend.borrowFrom
          this.isSameGroup = resp.ltbLend.isSameGroup || ''
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
            this.formCard1.borrowerId = this.gfnGetUsername()
          }
        })
      })
    }
  }
</script>

<style lang="less" scoped>
</style>
