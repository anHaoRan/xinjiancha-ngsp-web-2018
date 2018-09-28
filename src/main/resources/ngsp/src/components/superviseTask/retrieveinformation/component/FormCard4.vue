<template>
  <el-card class="surveyFormCard4">
    <div slot="header">
      处理方案
    </div>
    <el-form :model="formCard4" ref="formCard4" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="调取类别：" prop="obtainType">
          <el-radio-group :disabled="disabled" v-model="formCard4.obtainType">
            <el-radio :label="'0'">标准化</el-radio>
            <el-radio :label="'1'">非标准化</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="调取期限：" prop="obtainLimit">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard4.obtainLimit" placeholder="" size="small">
            <el-option
              v-for="item in obtainLimitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="补充说明：" prop="instructions">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard4.instructions" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="搜索关键字：" prop="keyword">
          <el-input class="custom-width" size="small" :readonly="disabled" v-model="formCard4.keyword" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
  import {obtainLimitOptions} from '../component/constants'
  export default {
    props: {
      formCard4: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        obtainLimitOptions,
        rules: {
          obtainType: {
            required: true, message: '请选择调取类别'
          }
        }
      }
    },
    methods: {
      validateFormCard() {
        let flag = true
        this.$refs['formCard4'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .surveyFormCard4 {
    .custom-width {
      width: 350px;
    }
  }
</style>
