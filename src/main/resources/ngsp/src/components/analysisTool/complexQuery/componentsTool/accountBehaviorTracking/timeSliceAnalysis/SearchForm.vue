<!--时间片分析查询组件-->
<template>
  <div class="timeSliceAnalysisSearchForm">
    <el-form :inline="true" label-width="100px" :model="searchForm" :rules="rules" :ref='`trackingAccount${num}`'>
      <el-radio-group v-model="searchForm.isMultipleParams" v-if="showSelectRadioGroup">
        <el-radio :label="0">单股票查询</el-radio>
        <el-radio :label="1">多股票导入</el-radio>
      </el-radio-group>
      <el-row v-if="searchForm.isMultipleParams === 0" class="row-style">
        <el-col :xl="8" :lg="10" :md="12" :sm="12">
          <el-form-item label="日期时间范围">
            <el-date-picker
              @change="handleDatePickerChange"
              :picker-option="pickerOption"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.dateTimeRange"
              prop="dateTimeRange"
              type="datetimerange" range-separator="至"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xl="2" :lg="3" :md="6" :sm="6">
          <el-form-item label="" prop="isIncludeStartTime">
            <el-checkbox v-model="isIncludeStartTime">包含开始时间</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xl="2" :lg="3" :md="6" :sm="6">
          <el-form-item label="" prop="isIncludeEndTime">
            <el-checkbox v-model="isIncludeEndTime">包含结束时间</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="12">
          <el-form-item prop="secCode" label="证券代码" :rules="[{
            required: true, message: '请输入证券代码'
          }]">
            <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="searchForm.isMultipleParams === 1" class="row-style">
        <el-col :xl="4" :lg="5" :md="5" :sm="5">
          <file-upload
            @getTxtCon="getTxtCon"
            :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
            :uploadParams="uploadParams"
            :limitFileType="['xls', 'xlsx']"
            :isShowSuccessMessage="true"
          ></file-upload>
        </el-col>
        <el-col :xl="3" :lg="3" :md="3" :sm="3">
          <el-button size="small" type="primary" @click="getTemplateFile" style="margin-top:5px">模板下载</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import FileUpload from '@/components/common/UploadFileToServer'

  export default {
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      FileUpload
    },
    props: {
      num: {
        type: Number,
        default: 3
      },
      showSelectRadioGroup: {
        type: Boolean,
        default: true
      },
      defaultRelativeTradeDate: {
        type: String,
        default: ''
      },
      propsSearchForm: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      isIncludeStartTime: {
        get() {
          return this.searchForm.isIncludeStartTime
        },
        set(newValue) {
          this.searchForm.isIncludeStartTime = newValue
          this.propsSearchForm.isIncludeStartTime = newValue
          return newValue
        }
      },
      isIncludeEndTime: {
        get() {
          return this.searchForm.isIncludeEndTime
        },
        set(newValue) {
          this.searchForm.isIncludeEndTime = newValue
          this.propsSearchForm.isIncludeEndTime = newValue
          return newValue
        }
      }
    },
    data() {
      return {
        pickerOption: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        commonData: { // 证券代码
          disabled: false,
          stockCode: this.propsSearchForm.secCode || ''
        },
        searchForm: {
          defaultTradeDate: '',
          secCode: '',
          dateTimeRange: [],
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          isIncludeStartTime: true,
          isIncludeEndTime: true,
          isMultipleParams: 0,
          paramList: []
        },
        uploadParams: {
          parseRules: JSON.stringify(
            [{
              firstToSkip: 1, // 前置忽略项
              // delimiter: ',',
              verifies: ['STOCK_CODE_SH', 'DATE_YYYYMMDD', 'TIME_HHMMSS', 'ALL', 'DATE_YYYYMMDD', 'TIME_HHMMSS', 'ALL'],
              fields: ['secCode', 'startDate', 'startTime', 'isIncludeStartTime', 'endDate', 'endTime', 'isIncludeEndTime']
            }]
          )
        },
        rules: {}
      }
    },
    watch: {
      defaultRelativeTradeDate(newValue) {
        if (this.showSelectRadioGroup) {
          // 重置日期为初始日期
          this.searchForm.defaultTradeDate = newValue
          this.resetDateTimeRange()
        }
      },
      propsSearchForm: {
        handler() {
          this.setReplayFormParams() // 从成交回放模块进入该模块
        },
        deep: true
      }
    },
    methods: {
      getTemplateFile() {
        this.gfnDownloadTemplateFile({code: 'timeSliceAnalysis'})
      },
      setReplayFormParams() {
        this.searchForm = {...this.searchForm, ...this.propsSearchForm}
        this.searchForm.defaultTradeDate = this.defaultRelativeTradeDate
        this.searchForm.dateTimeRange = [(this.searchForm.startDate + this.searchForm.startTime), (this.searchForm.endDate + this.searchForm.endTime)]
        this.commonData.stockCode = this.propsSearchForm.secCode || ''
        this.searchForm.secCode = this.propsSearchForm.secCode || ''
      },
      getTxtCon(value) {
        if (value && value['Sheet0']) {
          this.searchForm.paramList = value['Sheet0']
        }
      },
      getStockCode(stockCodeData, type, code, stockSubType) {
        stockCodeData ? this.searchForm.secCode = stockCodeData.split(' ')[0] : this.searchForm.secCode = ''
        this.$refs[`trackingAccount${this.num}`].validateField('secCode')
      },
      handleDatePickerChange(newValue) {
        if (newValue) {
          this.searchForm.startDate = newValue[0].substr(0, 10)
          this.searchForm.endDate = newValue[1].substr(0, 10)
          this.searchForm.startTime = newValue[0].substr(11)
          this.searchForm.endTime = newValue[1].substr(11)
        } else {
          this.resetDateTimeRange()
        }
      },
      handleSearch() {
        if (this.searchForm.isMultipleParams && !this.searchForm.paramList.length) {
          this.$message.error('请先上传文件或上传文件无可用有效信息')
          return
        }
        this.$refs[`trackingAccount${this.num}`].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.searchForm))
            params.startTime = params.startTime.replace(/:/g, '')
            params.endTime = params.endTime.replace(/:/g, '')
            this.$store.commit(`storeForm${this.num}`, params)
          }
        })
      },
      handleClear() {
        this.commonData.stockCode = ''
        this.searchForm.secCode = ''
        this.resetDateTimeRange()
      },
      resetDateTimeRange() {
        this.searchForm.startDate = this.searchForm.defaultTradeDate
        this.searchForm.endDate = this.searchForm.defaultTradeDate
        this.searchForm.startTime = '09:00:00'
        this.searchForm.endTime = '15:00:00'
        this.searchForm.dateTimeRange = [(this.searchForm.defaultTradeDate + this.searchForm.startTime), (this.searchForm.defaultTradeDate + this.searchForm.endTime)]
      }
    },
    mounted() {
      if (!this.showSelectRadioGroup) { // 从成交回放模块进入设置初始值
        this.setReplayFormParams()
      }
    },
  }
</script>
<style lang="less" scoped>
  .timeSliceAnalysisSearchForm {
    padding: 15px;
    .row-style {
      margin-top: 25px;
    }
  }
</style>
