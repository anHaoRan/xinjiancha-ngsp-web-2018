<template>
  <el-card class="surveyFormCard1">
    <div slot="header">
      来函信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="145px" :rules="rules">
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函名称：" prop="letterName">
          <el-input size="small" class="custom-width" v-model="formCard1.letterName" :readonly="disabled" placeholder="输入内容在50字以内" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函编号：" prop="letterNo">
          <el-input size="small" class="custom-width" v-model="formCard1.letterNo" :readonly="disabled" placeholder="输入内容在50字以内" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函单位：" prop="fromDept">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="fromDeptOptions"
            v-model="formCard1.fromDept"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="联系人：" prop="contackPerson">
          <el-input size="small" class="custom-width" v-model="formCard1.contackPerson" :readonly="disabled" placeholder="输入内容在50字以内" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函日期：" prop="letterDate">
          <el-date-picker
            :disabled="disabled"
            class="custom-width"
            v-model="formCard1.letterDate"
            type="date"
            placeholder="来函日期"
            value-format="yyyy-MM-dd"
            size="small">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函方式：" prop="letterWay">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard1.letterWay" placeholder="" size="small">
            <el-option
              v-for="item in letterWayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函类别：" prop="letterType">
          <el-input size="small" class="custom-width" v-model="formCard1.letterType" :readonly="disabled" placeholder="输入内容在50字以内" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="来函事项：" prop="matter">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="matterOptions"
            v-model="formCard1.matter"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="证券代码及简称：" class="stockCodeFormItem" required>
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="来函说明：" prop="instruction">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard1.instruction" type="textarea" size="small" placeholder="输入内容在50字以内" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="来函附件：" prop="fileList">
          <div v-if="showUploadButton">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl"
              :disabled="disabled"
              :uploadOption="uploadOption1"
              :noLimit="true"
              :limit="100"
              :propsFileList="formCard1.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="disabled"
              class="upload-demo"
              :file-list="formCard1.fileList"
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
          <el-input class="custom-width" size="small" :readonly="disabled" v-model="formCard1.keyword" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
    <el-col v-if="tableData.length">
      <div>相关股票来函记录</div>
      <margin-table
        v-loading="loading"
        :columns="columns"
        :height="200"
        :isPageination="false"
        :data="{
          data: tableData
        }"
        @handlerChange="handleSlotComponentEvent"
      >
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="60px"
          align="center"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
      </margin-table>
    </el-col>
  </el-card>
</template>
<script>
  import {fromDeptOptions, letterWayOptions, matterOptions, columns} from '../component/constants'
  import {uploadFileCommon} from '@/service/superviseTask'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import MarginTable from '@/components/base/MarginTable'
  import textUpload from '@/components/common/textUpload'
  export default {
    components: {StockCodeQuery, textUpload, MarginTable},
    props: {
      formCard1: {
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
      showUploadButton: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'uns_check_LetterInfo_attachment') // infoId, fileLoc
      },
      formCard1: {
        handler(newValue) {
          this.commonData.stockCode = newValue.stockCode
        },
        immediate: true,
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
        // this.uploadOption.disabledflag = newValue
      }
    },
    data() {
      return {
        columns,
        fromDeptOptions,
        letterWayOptions,
        matterOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'uns_check_LetterInfo_attachment'),
        rules: {
          letterName: {
            required: true, message: '请输入来函名称'
          },
          letterNo: {
            required: true, message: '请输入来函编号'
          },
          fromDept: {
            required: true, message: '请选择来函单位'
          },
          letterDate: {
            required: true, message: '请选择来函日期'
          },
          letterWay: {
            required: true, message: '请选择来函方式'
          },
          letterType: {
            required: true, message: '请选择来函类型'
          },
          matter: {
            required: true, message: '请选择来函事项'
          },
          stockCode: {
            required: true, message: '请输入证券代码'
          }
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
        uploadOption1: {
          name: '上传',
          size: 'small',
          type: 'primary'
        }
      }
    },
    methods: {
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          window.open(`#/replyLetterFormPage?taskId=''&instanceId=${scope.row.infoId}&operate=1&isNewTab=true`)
        }
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        // get table data
        let stockCode = this.formCard1.stockCode === '' ? '' : this.formCard1.stockCode.join(',')
        this.$emit('getFormCard1TableData', stockCode)
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
  .surveyFormCard1 {
    .custom-width {
      width: 350px;
    }
  }
</style>
