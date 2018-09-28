<template>
  <div class="marketTypeBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small">
      <el-form-item label-width="80px" label="行情类：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择行情类" clearable style="width:300px;"
                   @change="changeUplParam">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="10px" prop="isUpload" class="noRuleMsg">
        <file-upload
          class="uploadBtn"
          ref="upload"
          :isShowSuccessMessage="true"
          :limitFileType="['xls', 'xlsx']"
          :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
          :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
          :uploadParams="uploadParams"
          @getTxtCon="setFileData"
        ></file-upload>
        <!--<span>（包含证券代码、开始结束日期）</span>-->
        <el-tag :type="uploadStatus" style="margin: 0 10px"> {{ uploadText }}</el-tag>
        <el-button size="small" class="uploadBtn" @click="downloadExcelMould" type="primary">下载模板</el-button>
      </el-form-item>
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')" :disabled="loading">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <!--查询表格-->
    <div v-show="showTable">
      <s-table ref="marketType" :height="600" :columns="marketTypeDataColumns" :data="marketTypeData"
               :isPageination="false"></s-table>
    </div>
    <el-row style="float: right;line-height: 40px;">{{tableTips}}</el-row>
  </div>
</template>
<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHisBigData } from '../../../../service/analysisTool/dataInvesBigData'

  export default {
    name: 'market-type',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'quotdaily',
            label: '指定股票指定期间逐日行情与大盘对照表'
          },
          {
            value: 'quotperiod',
            label: '指定股票指定期间行情与大盘对照表'
          }
        ],
        ruleForm: {
          typeValue: '',
          isUpload: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择行情类', trigger: 'change'}
          ],
          isUpload: [
            {required: true}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['sec_code', 'from_date', 'to_date'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        marketTypeData: {data: []},
        marketTypeDataColumns: [],
        showTable: false,
        loading: false,
        uploadText: '未上传',
        uploadStatus: 'danger',
        flowid: '',
        isDownload: true,
        tableTips: ''
      }
    },
    methods: {
      handleQueryData () {
        this.showTable = true
        this.loading = true
        this.showOrHideLoading(true)
        this.marketTypeData.data = []
        this.marketTypeDataColumns = []
        let params = {
          'buszId': this.ruleForm.typeValue,
          'queryby': '2',
          'uploadParam': this.ruleForm.isUpload
        }
        getDayTradeHisBigData(JSON.stringify(params)).then((resp) => {
          this.marketTypeData.data = []
          this.marketTypeDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.marketTypeDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.marketTypeData.data = resp.rows
          this.loading = false
          if (this.ruleForm.typeValue === 'quotdaily') {
            this.tableTips = '振幅=（最高价-最低价)/最低价'
          } else {
            this.tableTips = '流通换手率=成交量/流通股本'
          }
          // 导出
          this.flowid = resp.flowId
          if (this.marketTypeData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.marketType.showOrHideLoading(flag)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData()
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate()
        })
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.ruleForm.isUpload = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      changeUplParam (val) {
        this.resetForm('ruleForm')
        this.ruleForm.typeValue = val
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        if (this.ruleForm.typeValue == '') {
          this.$message.warning('请选择行情类')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'quotdaily':// 指定股票指定期间逐日行情与大盘对照表
            this.gfnDownloadTemplateFile({code: 'stddataqry.quotdaily'})
            break
          case 'quotperiod':// 指定股票指定期间行情与大盘对照表
            this.gfnDownloadTemplateFile({code: 'stddataqry.quotperiod'})
            break
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .marketTypeBox {
    .el-form-item, .uploadBtn {
      display: inline-block;
    }
    .rightBar {
      float: right;
    }

  }
</style>
