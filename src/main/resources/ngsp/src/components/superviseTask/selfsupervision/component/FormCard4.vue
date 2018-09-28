<template>
  <el-card class="slsFormCard4">
    <div slot="header">
      处理方案
    </div>
    <el-form :model="formCard4" ref="formCard4" label-width="145px" :rules="rules" :inline="true">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="监管标准：" prop="obtainType">
          <el-radio-group :disabled="disabled" v-model="formCard4.obtainType" @change="handleObtainTypeChange">
            <el-radio v-for="(item, index) in obtainTypeOptions" :key="index" :label="String(index)">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard4.obtainType) === '1'">
        <el-form-item label="差异化分类：" prop="differentClassify">
          <el-radio-group :disabled="disabled" v-model="formCard4.differentClassify">
            <el-radio v-for="(item, index) in differentClassifyOptions" :key="index" :label="String(index)">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard4.obtainType) !== '2'">
        <el-form-item label="监管措施：" prop="superviseScheme">
          <el-checkbox-group v-model="formCard4.superviseScheme" :disabled="disabled">
            <el-checkbox v-for="(item, index) in superviseSchemeOptions1" :key="index" :label="String(index)">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard4.obtainType) === '2'">
        <el-form-item label="监管措施：" prop="superviseScheme">
          <el-checkbox-group v-model="formCard4.superviseScheme" :disabled="disabled">
            <el-form-item>
              <el-checkbox :label="'4'">{{superviseSchemeOptions2[0]}}</el-checkbox>
            </el-form-item>
            <el-form-item label="期限" label-width="120px" prop="transactionLimit" v-if="formCard4.superviseScheme.indexOf('4') > -1">
              <el-select style="width:250px" :disabled="disabled" v-model="formCard4.transactionLimit" placeholder="" size="small" @change="handleLimitTimeChange">
                <el-option
                  v-for="item in obtainLimitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-checkbox :label="'5'">{{superviseSchemeOptions2[1]}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard4.obtainType) !== '2'">
        <el-form-item label="辅助措施：" prop="assistScheme">
          <el-checkbox-group v-model="formCard4.assistScheme" :disabled="disabled">
            <el-checkbox v-for="(item, index) in assistSchemeOptions" :key="index" :label="String(index)">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="投资者标记：" prop="investorMark">
          <el-checkbox v-model="formCard4.investorMark">列为重点监控账户</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="上传附件：" prop="fileList">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl"
              :disabled="disabled"
              :uploadOption="uploadOption1"
              :limitFileType="defaultLimitFileType"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="formCard4.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="disabled"
              class="upload-demo"
              :file-list="formCard4.fileList"
              :action=uploadBasicUrl
              :on-preview="handlePreview"
              :on-success="getFileList"
              :on-remove="deleteFile"
              style="display:inline-block">
              <el-button
                :disabled="disabled"
                type="text"
                size="small"
                style="display:inline"
              >上传
              </el-button>
            </el-upload>-->
          </div>
          <div v-else>
            <span v-if="formCard4.fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard4.fileList"
                :key="item.fileId">
                {{item.name}}
              </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="搜索关键字：" prop="keyword">
          <el-input class="custom-width" size="small" :readonly="disabled" v-model="formCard4.keyword" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
    <el-col>
      <pause-table
        v-if="formCard4.obtainType !== '2' && (formCard4.superviseScheme.indexOf('2') > -1 || formCard4.superviseScheme.indexOf('3') > -1)"
        :loading="loading"
        :infoId="infoId"
        :canExportTableInfo="canExportTableInfo"
        :tableData.sync="pauseTableData"
        :disabled="disabled"
      ></pause-table>
      <limit-table
        v-if="formCard4.obtainType === '2' && formCard4.superviseScheme.indexOf('4') > -1"
        :loading="loading"
        :infoId="infoId"
        :canExportTableInfo="canExportTableInfo"
        :tableData.sync="limitTableData"
        :disabled="disabled"
      ></limit-table>
    </el-col>
  </el-card>
</template>
<script>
  import {uploadFileCommon} from '@/service/superviseTask'
  import PauseTable from './PauseTable'
  import LimitTable from './LimitTable'
  import textUpload from '@/components/common/textUpload'
  import {obtainLimitOptions, obtainTypeOptions, differentClassifyOptions, superviseSchemeOptions1, superviseSchemeOptions2, assistSchemeOptions, investorMarkOptions} from '../component/constants'
  export default {
    components: {PauseTable, LimitTable, textUpload},
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
      },
      showUploadButton: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      canExportTableInfo: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      pauseTableData: {
        type: Array,
        default() {
          return []
        }
      },
      limitTableData: {
        type: Array,
        default() {
          return []
        }
      },
      defaultLimitFileType: {
        type: Array,
        default: []
      }
    },
    watch: {
      infoId: {
        handler(newValue) {
          this.uploadBasicUrl = uploadFileCommon(newValue, 'sls_second_attachment') // infoId, fileLoc
        }
      },
      'formCard4.fileList': {
        handler() {
          this.validateFileList()
        },
        deep: true
      }
    },
    data() {
      return {
        obtainLimitOptions,
        obtainTypeOptions,
        differentClassifyOptions,
        superviseSchemeOptions1,
        superviseSchemeOptions2,
        assistSchemeOptions,
        investorMarkOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'sls_second_attachment'),
        rules: {
          obtainType: {
            required: true, message: '请选择监管标准'
          },
          differentClassify: {
            required: true, message: '请选择差异化分类'
          },
          superviseScheme: {
            required: true, message: '请选择监管措施'
          },
          transactionLimit: {
            required: true, message: '请选择期限'
          }
        },
        uploadOption1: {
          name: '上传',
          size: 'small',
          type: 'primary'
        }
      }
    },
    methods: {
      getFileList() {
        this.$emit('getFileList')
      },
      handleRemove (file) {
        this.$emit('deleteFile', file)
      },
      handlePreview (file) {
        let fileId = ''
        for (let item of this.formCard4.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      validateFormCard() {
        let flag = true
        this.$refs['formCard4'].validate((valid) => {
          flag = valid
        })
        return flag
      },
      validateFileList() {
        this.$refs['formCard4'].validateField('fileList')
      },
      handleObtainTypeChange(val) {
        this.formCard4.differentClassify = ''
        this.formCard4.transactionLimit = ''
        this.formCard4.superviseScheme = []
        this.formCard4.assistScheme = []
      },
      handleLimitTimeChange(val) {
        this.$emit('updateLimitTimeToTable', val)
      }
    }
  }
</script>
<style lang="less" scoped>
  .slsFormCard4 {
    .custom-width {
      width: 350px;
    }
  }
</style>
