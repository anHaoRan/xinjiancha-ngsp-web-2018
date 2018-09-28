<template>
  <el-card class="letterBorrowFormCard1">
    <div slot="header">
      借阅信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="12" :md="24" :sm="24">
        <el-form-item :label="`${labelTextPre}人：`" prop="borrower">
          {{formCard1.borrower}}
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="isLetterLendFlow">
        <el-form-item label="传阅对象：" prop="lendTarget">
          <selector-dealer :disabled="disabled" class="custom-width" ref="selectorDealer" @node-click="handleLendTargetChange" :selectPerson="formCard1.lendTarget"></selector-dealer>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="24" :md="24" :sm="24">
        <el-form-item :label="`${labelTextPre}时间：`" prop="borrowDate">
          <s-date-picker
            :disabled="disabled"
            :value="formCard1.borrowDate"
            :isRange="true"
            :propsDownDisabledTime="defaultPropsDisabledTime"
            @change="handleSdatePickerDateRangeChange"
          ></s-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item :label="`${labelTextPre}天数：`" prop="borrowDays">
          {{formCard1.borrowDays}}
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item :label="`${labelTextPre}理由：`" prop="reason">
          <el-input style="width:78%" :disabled="disabled" v-model="formCard1.reason" type="textarea" size="small" placeholder="输入内容在200字以内" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col>
      <h4>{{this.labelTextPre}}函件</h4>
      <margin-table
        class="self-table-css"
        v-loading="loading"
        :columns="columns"
        :height="200"
        :isPageination="false"
        :data="{
          data: tableData
        }"
      >
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="60px"
          align="center"
          label="序号">
        </el-table-column>
      </margin-table>
    </el-col>
  </el-card>
</template>
<script>
  import moment from 'moment'
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
        columns: [{label: '函件编号', field: 'letterNo'}, {label: '证券代码及简称', field: 'security'}, {label: '函件名称', field: 'letterName'}, {label: '案件结论', field: 'conclusion'}],
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
      formCard1: {
        type: Object,
        default() {
          return {}
        }
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      defaultPropsDisabledTime: {
        type: [Date, String, Number],
        default: Date.now()
      }
    },
    watch: {
      'formCard1.borrowDate': {
        handler(newValue) {
          if (!newValue) {
            this.formCard1.borrowDays = ''
            return
          }
          if (!newValue[0] || !newValue[1]) {
            this.formCard1.borrowDays = ''
          } else {
            let start = new Date(moment(newValue[0]).format('YYYY-MM-DD')).getTime()
            let end = new Date(moment(newValue[1]).format('YYYY-MM-DD')).getTime()
            this.formCard1.borrowDays = Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1
          }
        },
        deep: true
      }
    },
    methods: {
      handleSdatePickerDateRangeChange(val) {
        this.formCard1.borrowDate = val
      },
      handleLendTargetChange(code, name) {
        this.formCard1.lendTarget = name
        this.formCard1.lendTargetId = code
      },
      validateFormCard() {
        let flag = true
        this.$refs['formCard1'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .letterBorrowFormCard1 {
    .custom-width {
      width: 350px;
    }
  }
</style>