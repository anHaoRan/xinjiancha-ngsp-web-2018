<template>
  <el-card class="surveyFormCard3">
    <div slot="header">
      关联线索报告
    </div>
    <el-form :model="formCard3" ref="formCard3" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="是否关联线索报告：" prop="isRpc">
          <el-radio-group :disabled="disabled || isLanchRpc" v-model="formCard3.isRpc" @change="handleRadioChange">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-show="String(formCard3.isRpc) === '1' && isLanchRpc">
        <el-form-item label="线索编号：" prop="clueNo">
          <a @click="goToClubFlow" class="link-common-css">{{formCard3.clueNo}}</a>
        </el-form-item>
      </el-col>
      <el-col v-show="String(formCard3.isRpc) === '1' && !isLanchRpc">
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索编号：" prop="clueNo">
            {{formCard3.clueNo}}
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索名称：" prop="clueName">
            <el-input size="small" class="custom-width" v-model="formCard3.clueName" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索分类：" prop="clueBranch">
            <el-radio-group v-model="formCard3.clueBranch">
              <el-radio :label="'0'">关注类</el-radio>
              <el-radio :label="'1'">调查类</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="是否线索上报：" prop="needReport">
            <el-radio-group v-model="formCard3.needReport">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="线索类型：" prop="clueType">
            <el-checkbox-group v-model="formCard3.clueType">
              <el-checkbox v-for="(item, index) in clueTypeOptions" :key="index" :label="String(index)">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="线索描述：" prop="clueDesc">
            <el-input style="width:78%" v-model="formCard3.clueDesc" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
  import {clueTypeOptions} from '../component/constants'
  export default {
    props: {
      formCard3: {
        type: Object,
        default() {
          return {}
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
      isLanchRpc: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        clueTypeOptions,
        rules: {
          clueNo: {
            required: true, message: '请输入线索编号'
          },
          clueName: {
            required: true, message: '请输入线索名称'
          },
          clueBranch: {
            required: true, message: '请选择线索分类'
          },
          needReport: {
            required: true, message: '请选择是否线索报告'
          },
          clueType: {
            required: true, message: '请选择线索类型'
          }
        }
      }
    },
    methods: {
      validateFormCard() {
        let flag = true
        if (String(this.formCard3.isRpc) === '1' && !this.isLanchRpc) {
          this.$refs['formCard3'].validate((valid) => {
            flag = valid
          })
        }
        return flag
      },
      goToClubFlow() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.formCard3.clueReportInfoId}&isNewTab=true`)
      },
      handleRadioChange(val) {
        if (val === '1') {
          this.$emit('createClueReportInfoId')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .surveyFormCard3 {
    .custom-width {
      width: 350px;
    }
  }
</style>
