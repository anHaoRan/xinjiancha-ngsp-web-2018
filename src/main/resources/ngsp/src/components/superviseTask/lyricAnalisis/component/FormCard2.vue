<template>
  <el-card class="lyricFormCard2">
    <div slot="header">
      处理信息
    </div>
    <el-form :model="formCard2" ref="formCard2" label-width="150px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="修改信息：" prop="modifyInfo">
          <el-input :disabled="disabled" style="width:78%" v-model="formCard2.modifyInfo" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="处理意见：" prop="suggestion">
          <el-input :disabled="disabled" style="width:78%" v-model="formCard2.suggestion" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="是否关联线索报告：" prop="isRpc">
          <el-radio-group :disabled="disabled || isLanchRpc" v-model="formCard2.isRpc" @change="handleRadioChange">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard2.isRpc) === '1' && isLanchRpc">
        <el-form-item label="线索编号：" prop="clueNo">
          <a @click="goToClubFlow" class="link-common-css">{{formCard2.clueNo}}</a>
        </el-form-item>
      </el-col>
      <el-col v-if="String(formCard2.isRpc) === '1' && !isLanchRpc">
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索编号：" prop="clueNo" :rules="[{
            required: isValidateClueForm, message: '请输入线索编号'
          }]">
            {{formCard2.clueNo}}
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索名称：" prop="clueName" :rules="[{
            required: isValidateClueForm, message: '请输入线索名称'
          }]">
            <el-input size="small" class="custom-width" v-model="formCard2.clueName" :maxlength="20" placeholder="输入内容在20字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="线索分类：" prop="clueBranch" :rules="[{
            required: isValidateClueForm, message: '请选择线索分类'
          }]">
            <el-radio-group v-model="formCard2.clueBranch">
              <el-radio :label="'0'">关注类</el-radio>
              <el-radio :label="'1'">调查类</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="24" :sm="24">
          <el-form-item label="是否线索上报：" prop="needReport" :rules="[{
            required: isValidateClueForm, message: '请选择是否线索报告'
          }]">
            <el-radio-group v-model="formCard2.needReport">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="线索类型：" prop="clueType" :rules="[{
            required: isValidateClueForm, message: '请选择线索类型'
          }]">
            <el-checkbox-group v-model="formCard2.clueType">
              <el-checkbox v-for="(item, index) in clueTypeOptions" :key="index" :label="String(index)">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="线索描述：" prop="clueDesc">
            <el-input style="width:78%" v-model="formCard2.clueDesc" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
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
      formCard2: {
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
    computed: {
      isValidateClueForm() {
        return String(this.formCard2.isRpc) === '1' && !this.isLanchRpc
      }
    },
    data() {
      return {
        clueTypeOptions,
        rules: {
          modifyInfo: {
            required: true, message: '请输入修改信息'
          },
          suggestion: {
            required: true, message: '请输入处理意见'
          },
          isRpc: {
            required: true, message: '请选择是否关联线索报告'
          }
        }
      }
    },
    methods: {
      validateFormCard() {
        let flag = true
        this.$refs['formCard2'].validate((valid) => {
          flag = valid
        })
        return flag
      },
      goToClubFlow() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.formCard2.clueReportInfoId}&isNewTab=true`)
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
  .lyricFormCard2 {
    .custom-width {
      width: 350px;
    }
  }
</style>
