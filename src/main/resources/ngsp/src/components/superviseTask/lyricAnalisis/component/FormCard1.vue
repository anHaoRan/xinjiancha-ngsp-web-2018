<template>
  <el-card class="lyricFormCard1">
    <div slot="header">
      舆情基本信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="150px" :rules="rules">
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="舆情编号：" prop="lyricNo">
          <el-input class="custom-width" disabled v-model="formCard1.lyricNo" placeholder="输入内容在50个字以内" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="舆情标题：" prop="title">
          <el-input class="custom-width" :readonly="disabled" v-model="formCard1.title" placeholder="输入内容在50个字以内" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="24" :md="24" :sm="24">
        <el-form-item label="舆情来源：" prop="sourceFrom">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="sourceFromOptions"
            v-model="formCard1.sourceFrom"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :md="12" :sm="24">
        <el-form-item label="发布时间：" prop="sourceTime">
          <el-date-picker
            class="custom-width"
            v-model="formCard1.sourceTime"
            type="date"
            :disabled="disabled"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="舆情正文：" prop="mainText">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard1.mainText" type="textarea" placeholder="输入内容在2000字以内" size="small" :maxLength="2000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="舆情类别：" prop="sourceType">
          <el-radio-group v-model="formCard1.sourceType" :disabled="disabled" @change="handleSourTypeChange">
            <el-radio :label="String(index)" v-for="(item, index) in sourceTypeOptions" :key="index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="String(formCard1.sourceType) === '0'">
        <el-form-item label="证券代码及简称：" style="float:left" required>
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
        </el-form-item>
        <el-form-item style="float:left" label-width="50px">
          <el-radio :disabled="disabled" v-model="formCard1.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="舆情特征描述：" prop="featureDesc">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard1.featureDesc" placeholder="" size="small">
            <el-option
              v-for="(item, index) in featureDescOptions"
              :key="String(index)"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="是否重点事件：" prop="isImportant">
          <el-radio-group v-model="formCard1.isImportant" :disabled="disabled">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="附件：" prop="fileList">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl"
              :disabled="disabled"
              :uploadOption="uploadOption"
              :noLimitFileType="true"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="formCard1.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
          </div>
          <div v-else>
            <span v-if="formCard1.fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard1.fileList"
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
          <el-input
            class="custom-width"
            :readonly="disabled"
            v-model="formCard1.keyword"
            placeholder="输入内容在50字以内"
            size="small"
            :maxLength="50"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import textUpload from '@/components/common/textUpload'
  import {sourceFromOptions, sourceTypeOptions, featureDescOptions} from '../component/constants'
  import {
    uploadFileCommon, getaccountinfo, getMonitorGroupsInfo, getMonitorSecurityInfo
  } from '@/service/superviseTask'
  export default {
    components: {StockCodeQuery, textUpload},
    props: {
      formCard1: {
        type: Object,
        default() {
          return {}
        }
      },
      showUploadButton: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loadingProps: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: [String, Number],
        default: ''
      }
    },
    watch: {
      'formCard1.stockCode': {
        handler(newValue) {
          this.commonData.stockCode = newValue
          this.formCard1.nullStockCode = newValue.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
        this.uploadOption.disabledflag = newValue
      },
      loadingProps(newValue) {
        this.loading = newValue
      },
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'poa_BasicInfo_attachment')
      }
    },
    data() {
      let validateStockCode = (rule, value, callback) => {
        if (this.formCard1.nullStockCode) {
          callback()
        }
        if (!this.formCard1.nullStockCode && !value.length) {
          callback(new Error('请选择证券代码'))
        }
        callback()
      }
      return {
        sourceFromOptions,
        sourceTypeOptions,
        featureDescOptions,
        loading: false,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'poa_BasicInfo_attachment'),
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        uploadOption: {
          name: '上传',
          size: 'small',
          type: 'primary'
        },
        rules: {
          lyricNo: {
            required: true, message: '请输入舆情编号'
          },
          title: {
            required: true, message: '请输入舆情标题'
          },
          stockCode: [
            {
              validator: validateStockCode
            }
          ],
          sourceFrom: {
            required: true, message: '请选择舆情来源'
          },
          sourceTime: {
            required: true, message: '请选择发布时间'
          },
          mainText: {
            required: true, message: '请输入舆情正文'
          },
          sourceType: {
            required: true, message: '请选择舆情类别'
          },
          featureDesc: {
            required: true, message: '请选择舆情特征描述'
          },
          isImportant: {
            required: true, message: '请选择是否重点事件'
          }
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        }
      }
    },
    methods: {
      handleSourTypeChange() {
        this.handleRadioChange()
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        this.formCard1.nullStockCode = stockCodeData.length ? 0 : 1
      },
      handleRadioChange() {
        this.formCard1.stockCode = []
        this.commonData.stockCode = []
      },
      getFileList() {
        this.$emit('getFileList')
      },
      handleRemove (file) {
        this.$emit('deleteFile', file)
      },
      handlePreview (file) {
        let fileId = ''
        for (let item of this.formCard1.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
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
  .lyricFormCard1 {
    padding-bottom: 20px;
    .custom-width {
      width: 350px;
    }
  }
</style>
