<template>
  <el-dialog class="batchOperationDialog"
             :title="`批量${labelTextPre}操作`"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="showDialog" width="60%" left>
    <el-form ref="ruleForm" :model="ruleForm" label-width="130px" :rules="rules">
      <el-form-item :label="`${labelTextPre}时间：`" prop="selectDateRange" :rules="[{
        required: true, validator: validateSelectDateRange
      }]">
        <s-date-picker
          :value="ruleForm.selectDateRange"
          :isRange="true"
          :propsDownDisabledTime="defaultPropsDisabledTime"
          @change="handleSdatePickerDateRangeChange"
        ></s-date-picker>
      </el-form-item>
      <el-form-item label="传阅对象：" prop="lendTarget" v-if="isBatchLetterLendFlow" :rules="[{
        required: isBatchLetterLendFlow, message: `请选择传阅对象`
      }]">
        <selector-dealer class="custom-width" ref="selectorDealer" @node-click="handleLendTargetChange" :selectPerson="ruleForm.lendTarget"></selector-dealer>
      </el-form-item>
      <el-form-item :label="`${labelTextPre}理由：`" prop="reason">
        <el-input style="width:78%" v-model="ruleForm.reason" type="textarea" size="small" placeholder="输入内容在200字以内" :maxlength="200"></el-input>
      </el-form-item>
    </el-form>
    <div class="button-group">
      <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
      <el-button size="small" type="info" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { batchLtbProcess, batchLtlProcess } from '@/service/superviseTask'
  export default {
    components: {
      MarginTable: () => import('@/components/base/MarginTable'),
      SDatePicker: () => import('@/components/base/SDatePicker'),
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    computed: {
      labelTextPre() {
        return this.isBatchLetterLendFlow ? '传阅' : '借阅'
      }
    },
    data() {
      return {
        showDialog: false,
        ruleForm: {
          selectDateRange: [],
          reason: '',
          lendTargetId: '',
          lendTarget: ''
        },
        rules: {
          reason: {
            required: true, message: `请输入${this.isBatchLetterLendFlow ? '传阅' : '借阅'}理由`
          }
        }
      }
    },
    props: {
      isBatchLetterLendFlow: {
        type: Boolean,
        default: false
      },
      defaultPropsDisabledTime: {
        type: [Date, String, Number],
        default: Date.now()
      },
      letterBorrowBatchSelectArray: {
        type: Array,
        default() {
          return []
        }
      },
      letterLendBatchSelectArray: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      validateSelectDateRange (rule, value, callback) {
        if (this.ruleForm.selectDateRange) {
          if (!this.ruleForm.selectDateRange[0] || !this.ruleForm.selectDateRange[1]) {
            callback(`请选择${this.isBatchLetterLendFlow ? '传阅' : '借阅'}时间`)
          }
        } else {
          callback(`请选择${this.isBatchLetterLendFlow ? '传阅' : '借阅'}时间`)
        }
        callback()
      },
      handleLendTargetChange(code, name) {
        this.ruleForm.lendTarget = name
        this.ruleForm.lendTargetId = code
      },
      handleSdatePickerDateRangeChange(val) {
        this.ruleForm.selectDateRange = val
        this.$refs['ruleForm'].validateField('selectDateRange')
      },
      handleConfirm() {
        this.$refs['ruleForm'].validate((valid) => {
          console.log(this.ruleForm)
          if (valid) {
            let params = {
              borrowDateStart: this.ruleForm.selectDateRange[0] + ' 00:00:00',
              borrowDateEnd: this.ruleForm.selectDateRange[1] + ' 23:59:59',
              reason: this.ruleForm.reason
            }
            if (this.isBatchLetterLendFlow) {
              // 批量传阅
              params.lendTargetId = this.ruleForm.lendTargetId
              params.lendTarget = this.ruleForm.lendTarget
              params.instanceIds = this.letterLendBatchSelectArray
              batchLtlProcess(JSON.stringify(params)).then(resp => {
                if (resp) {
                  this.$message.success('批量传阅操作成功')
                  this.showDialog = false
                }
              })
            } else {
              params.instanceIds = this.letterBorrowBatchSelectArray
              // 批量借阅
              batchLtbProcess(JSON.stringify(params)).then(resp => {
                if (resp) {
                  this.$message.success('批量借阅操作成功')
                  this.showDialog = false
                }
              })
            }
          }
        })
      },
      closeDialog () {
        this.showDialog = false
      },
      clearForm() {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm = {
          selectDateRange: [],
          reason: '',
          lendTargetId: '',
          lendTarget: ''
        }
        setTimeout(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .batchOperationDialog {
   .custom-width {
      width: 350px;
    }
    .button-group {
      text-align: right;
    }
  }
</style>