<template>
  <el-card class="surveyFormCard1">
    <div slot="header">来函信息</div>
    <el-form :model="formCard1" ref="formCard1" label-width="100px" :rules="rules" :inline="true">
      <el-row>
        <el-col :span="8">
          <el-form-item label="来函名称：" prop="letterName">
            <el-input class="custom-width" :disabled="disabled" v-model="formCard1.letterName" @change="changeLetterName" :maxlength="50" placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来函编号：" prop="letterNo">
            <el-input class="custom-width" :disabled="disabled" v-model="formCard1.letterNo" :maxlength="50" placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来函单位：" prop="fromDept">
            <el-cascader class="custom-width" v-model="formCard1.fromDept" :options="deptOptions" :disabled="disabled" size="small"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人：" prop="contackPerson">
            <el-input class="custom-width" :disabled="disabled" v-model="formCard1.contackPerson" :maxlength="50" placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来函日期：" prop="letterDate">
            <el-date-picker
              class="custom-width"
              v-model="formCard1.letterDate"
              type="date"
              :disabled="disabled"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来函方式：" prop="letterWay">
            <el-select v-model="formCard1.letterWay" @change="changeInstruction" class="custom-width" :disabled="disabled" placeholder="" size="small">
              <el-option v-for="item in wayOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="来函类别：" prop="letterType">
            <el-input class="custom-width" :disabled="disabled" v-model="formCard1.letterType" :maxlength="50" placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证券代码：" required>
            <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode" size="small"></stock-code-query>
          </el-form-item>
          <el-form-item>
            <el-radio :disabled="disabled" v-model="formCard1.nullStockCode" :label="1" style="margin-top: 8px" @change="handleStockChange">无证券代码</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来函说明：" prop="instruction">
            <el-input
              class="custom-width"
              :disabled="disabled"
              v-model="formCard1.instruction"
              type="textarea"
              placeholder="输入内容在50字以内"
              size="small"
              :maxLength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="搜索关键字：" prop="keyword">
            <el-input
              class="custom-width"
              :disabled="disabled"
              v-model="formCard1.keyword"
              placeholder="输入内容在50字以内"
              size="small"
              :maxLength="50"></el-input>
              注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="来函附件：" prop="filelist">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :disabled="disabled"
              :file-list="formCard1.fileList"
              :action=uploadBasicUrl
              :on-preview="handlePreview"
              :on-success="getFileList"
              :on-remove="deleteFile"
              style="display:inline-block">
              <el-button :disabled="disabled" type="text" size="small" style="display:inline">上传</el-button>
            </el-upload>
          </div>
          <div v-else>
            <span v-for="item in formCard1.fileList" :key="item.fileId" style="display: block;">{{item.name}}</span>
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <ClueAssoiciateTable :securityProps=commonData.stockCode :infoIdProps="infoId" :propsDisabled="disabled"></ClueAssoiciateTable>
  </el-card>
</template>
<script>
  import moment from 'moment'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import ClueAssoiciateTable from '../components/ClueAssoiciateTable'
  import {deptOptions, wayOptions} from '../component/constants'
  import {uploadFileCommon} from '@/service/superviseTask'
  export default {
    components: {StockCodeQuery, ClueAssoiciateTable},
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
      infoId: {
        type: String,
        default: ''
      }
    },
    watch: {
      formCard1: {
        handler(newValue) {
          this.commonData.stockCode = newValue.stockCode
          this.formCard1.nullStockCode = newValue.stockCode.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
      },
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'dig_LetterInfo_attachment')
      }
    },
    data() {
      this.formCard1.letterDate = moment().format('YYYY-MM-DD')
      let validateStockCode = (rule, value, callback) => {
        if (this.formCard1.nullStockCode) {
          callback()
        }
        if (!this.formCard1.nullStockCode && !value.length) {
          callback(new Error('请选择证券代码'))
        }
        callback()
      }
      let validateInstruction = (rule, value, callback) => {
        if (this.formCard1.letterWay === '0' || this.formCard1.letterWay === '3') {
          if (!this.formCard1.instruction) {
            callback(new Error('请输入来函说明'))
          }
        }
        callback()
      }
      return {
        deptOptions,
        wayOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'dig_LetterInfo_attachment'),
        rules: {
          letterName: [
            {required: true, message: '请输入来函名称'}
          ],
          letterNo: [
            {required: true, message: '请输入来函编号'}
          ],
          fromDept: [
            {required: true, message: '请输入来函单位'}
          ],
          letterDate: [
            {required: true, message: '请输入来函日期'}
          ],
          letterWay: [
            {required: true, message: '请输入来函方式'}
          ],
          letterType: [
            {required: true, message: '请输入来函类别'}
          ],
          stockCode: [
            {validator: validateStockCode}
          ],
          instruction: [
            // {required: true, message: '请输入来函说明'}
            {validator: validateInstruction}
          ]
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
      changeLetterName(val) {
        this.$emit('card1ChangCard3Name', val)
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        this.formCard1.nullStockCode = stockCodeData.length ? 0 : 1
        this.$emit('card1ChangCard3', stockCodeData)
      },
      handleStockChange(newValue) {
        this.formCard1.stockCode = []
        this.commonData.stockCode = []
        this.$emit('card1ChangCard3', this.formCard1.stockCode)
      },
      changeInstruction(val) {
        for (let item in this.wayOptions) {
          if (item.value === val) {
            this.formCard1.letterWayText = item.label
          }
        }
      },
      getFileList() {
        this.$emit('getFileList')
      },
      deleteFile (file) {
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
      width: 280px;
    }
  }
</style>
