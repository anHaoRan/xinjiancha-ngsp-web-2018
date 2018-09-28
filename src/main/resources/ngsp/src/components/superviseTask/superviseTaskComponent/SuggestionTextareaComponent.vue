<template>
  <div class="suggestionTextareaComponent">
    <el-card style="margin-top: 20px;padding-bottom: 20px;" class="self-el-card">
      <div slot="header">
        您的意见
      </div>
      <el-form label-width="145px">
        <el-form-item label="是否通过：" v-if="showApproveRadio">
          <el-radio-group :disabled=disabled v-model="approveFlag" @change="handleRadioChange">
            <el-radio :label="'true'">是</el-radio>
            <el-radio :label="'false'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="持续关注股票：" v-if="showContinuousAttentionRadio">
          <el-radio-group :disabled=disabled v-model="isContinuousAttention" @change="handleIsContinuousAttention">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否归档：" v-if="showFinishRadio">
          <el-radio-group :disabled=disabled v-model="finishFlag" @change="handleFinishFlagChange">
            <el-radio :label="'true'">是</el-radio>
            <el-radio :label="'false'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :model="suggestionForm" ref="suggestionForm" :rules="rules" label-width="145px" v-if="show">
        <el-form-item label="意见或建议：" prop="suggestion">
          <el-input style="width:79%" :disabled=disabled v-model="suggestionForm.suggestion" :placeholder="`字符长度限制在${maxLength}以内`" :maxlength=maxLength
                    type="textarea" @input="handleInputSuggestion"></el-input>
        </el-form-item>
      </el-form>
      <margin-table
        v-loading = "loading"
        style="margin-top:10px;"
        v-if="suggestionTableData.length"
        :height="260"
        :isPageination="false"
        :columns="suggestionColumns"
        :data="{
          data: suggestionTableData
        }"
      >
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="50"
          label="序号">
        </el-table-column>
      </margin-table>
    </el-card>
  </div>
</template>
<script>
  import {getHistoryOpinions} from '@/service/superviseTask'
  import {
    tabletimeformat
  } from '@/utils/dateTimeFormat'
  import MarginTable from '@/components/base/MarginTable'
  export default {
    components: {
      MarginTable
    },
    computed: {
      showApproveRadio() {
        const {operate, processStatus} = this.$route.query
        const routeName = this.$route.name
        let flag = false
        if (processStatus) {
          if (operate && String(operate) !== '1') {
            flag = this.showApproveRadioOptions[routeName].indexOf(Number(processStatus)) > -1
          }
        } else {
          flag = this.showApproveRadioOptions[routeName].indexOf(Number(processStatus)) > -1
        }
        return flag
      }
    },
    data() {
      return {
        loading: false,
        approveFlag: 'true',
        isContinuousAttention: '1',
        finishFlag: 'false',
        suggestionForm: {
          suggestion: ''
        },
        rules: {
          suggestion: [{
            required: this.required, message: '请输入您的审核意见'
          }]
        },
        suggestionTableData: [],
        showApproveRadioOptions: {
          processform: [], // 自律监管
          surveyprocessform: [], // 调取资料
          selfSupervisionFormPage: [1], // 自律监管重构
          surveyFormPage: [1], // 调取资料重构
          sendLetterFormPage: [1, 2], // 联合发函重构
          replyLetterFormPage: [4, 5], // 联合复函重构
          dataAssocFormPage: [3, 4], // 数据协查（创建并分配）
          dataAssociationassign: [], // 数据协查（创建并分配）
          dataAssociationdraft: [], // 数据协查（创建并拟稿）
          creatprocess: [], // 联合监管发函
          departmentHeadAssign: [], // 联合监管复函
          temporaryCalculationForm: [], // 临时计算
          creatingSpecialWork: [], // 专项工作
          accessRequestForm: [], // 权限申请
          halfform: [5, 6], // 舆情分析（已重构）
          newBuiltSecurity: [], // 重点监控证券
          newBuiltAccountGroup: [], // 重点监控账户组
          marketAnalysisForm: [], // 市场分析
          letterBorrowForm: [1, 2], // 函件借阅
          letterLendFormPage: [1, 2], // 函件传阅
          logAuditForm: [], // 日志审计
          demandManagementForm: [], // 需求管理
          clueReportForm: [1, 5, 6, 7] // 线索报告
        }
      }
    },
    props: {
      maxLength: {
        type: Number,
        default: 200
      },
      disabled: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: true
      },
      required: {
        type: Boolean,
        default: false
      },
      suggestionColumns: {
        type: Array,
        default() {
          return [{label: '流程状态', field: 'proceStatus'}, {label: '审核意见', field: 'comment'}, {label: '处理人', field: 'procePerson'}, {label: '审核时间', field: 'createTime'}]
        }
      },
      steps: {
        type: Array,
        default() {
          return []
        }
      },
      showContinuousAttentionRadio: {
        type: Boolean,
        default: false
      },
      propsComment: {
        type: String,
        default: ''
      },
      showFinishRadio: {
        type: Boolean,
        default: false
      },
      propsIsContinuousAttention: {
        type: String,
        default: '1'
      }
    },
    watch: {
      propsComment(newValue) {
        this.suggestionForm.suggestion = newValue
      },
      propsIsContinuousAttention(newValue) {
        this.isContinuousAttention = newValue
      }
    },
    methods: {
      validateSuggestionForm() {
        this.$refs['suggestionForm'].validate((valid) => {
          return valid
        })
      },
      handleInputSuggestion() {
        this.$emit('handleInputSuggestion', this.suggestionForm.suggestion)
      },
      reqHistoryOpinions(instanceId) {
        this.loading = true
        getHistoryOpinions(instanceId).then(resp => {
          this.loading = false
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.suggestionTableData = resp.value
          this.$emit('updateStepsDescription', stepsDescription)
        })
      },
      handleRadioChange(val) {
        this.$emit('updateApproveFlag', val)
      },
      handleIsContinuousAttention(val) {
        this.$emit('updateIsContinuousAttention', val)
      },
      handleFinishFlagChange(val) {
        this.$emit('handleFinishFlagChange', val)
      }
    },
    mounted() {
      const {instanceId} = this.$route.query
      if (instanceId) {
        setTimeout(() => {
          this.reqHistoryOpinions(instanceId)
        }, 500)
      }
    }
  }
</script>
<style lang="less" scoped>
  .suggestionTextareaComponent {
    .self-el-card {
      padding: 10px 20px;
    }
  }
</style>
