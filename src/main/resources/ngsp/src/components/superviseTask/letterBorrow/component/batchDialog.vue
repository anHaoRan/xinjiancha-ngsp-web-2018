<template>
  <el-dialog class="batchOperationDialog"
             :title="`批量${labelTextPre}操作`"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="showDialog" width="60%" left>
    <el-form ref="ruleForm" :model="ruleForm" label-width="130px">
      <el-form-item :label="`${labelTextPre}时间：`" prop="borrowDate">
        <s-date-picker
          :value="ruleForm.borrowDate"
          :isRange="true"
          :propsDownDisabledTime="defaultPropsDisabledTime"
          @change="handleSdatePickerDateRangeChange"
        ></s-date-picker>
      </el-form-item>
      <el-form-item label="传阅对象：" prop="lendTarget" v-if="isLetterLendFlow">
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
        return this.isLetterLendFlow ? '传阅' : '借阅'
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
          borrowDate: {
            required: true, message: `请选择${this.isLetterLendFlow ? '传阅' : '借阅'}时间`
          },
          lendTarget: {
            required: this.isLetterLendFlow, message: `请选择传阅对象`
          },
          reason: {
            required: true, message: `请输入${this.isLetterLendFlow ? '传阅' : '借阅'}理由`
          }
        }
      }
    },
    props: {
      isLetterLendFlow: {
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
      handleLendTargetChange(code, name) {
        this.ruleForm.lendTarget = name
        this.ruleForm.lendTargetId = code
      },
      handleSdatePickerDateRangeChange(val) {
        this.ruleForm.selectDateRange = val
      },
      handleConfirm() {
        let params = {
          borrowDateStart: this.ruleForm.selectDateRange[0] + ' 00:00:00',
          borrowDateEnd: this.ruleForm.selectDateRange[1] + ' 23:59:59',
          reason: this.ruleForm.reason
        }
        console.log(this.letterBorrowBatchSelectArray)
        debugger
        if (this.isLetterLendFlow) {
          // 批量传阅
          params.lendTargetId = this.ruleForm.lendTargetId
          params.lendTarget = this.ruleForm.lendTarget
          params.instanceIds = this.letterLendBatchSelectArray
            batchLtlProcess(JSON.stringify(params)).then(resp => {
            if (resp) {
              this.$message.success('批量传阅操作成功')
            }
          })
        } else {
          params.instanceIds = this.letterBorrowBatchSelectArray
          // 批量借阅
          batchLtbProcess(JSON.stringify(params)).then(resp => {
            if (resp) {
              this.$message.success('批量借阅操作成功')
            }
          })
        }
      },
      closeDialog () {
        this.showDialog = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .batchOperationDialog {
    .button-group {
      text-align: right;
    }
  }
</style>