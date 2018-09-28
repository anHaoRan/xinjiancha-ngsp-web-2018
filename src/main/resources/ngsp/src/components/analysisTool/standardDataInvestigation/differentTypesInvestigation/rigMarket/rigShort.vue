<template>
  <div class="rigShortBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
      <el-form-item label="短线操纵：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择类别" clearable style="width:350px;"
                   @change="handleAnalysisRules">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择：" prop="chooseValue">
        <el-select class="chooseSelect" v-model="ruleForm.chooseValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <file-upload
        ref="upload"
        class="uploadBtn"
        :isShowSuccessMessage="true"
        :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
        @getTxtCon="setFileData"
        :limitFileType="['xls', 'xlsx']"
        :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
        :uploadParams="uploadParams"
        style="vertical-align: top;"></file-upload>
      <el-tag :type="uploadStatus"> {{ uploadText }}</el-tag>
      <el-button
        class="uploadBtn"
        @click="downloadExcelMould"
        size="small"
        type="primary"
        style="vertical-align: top;margin-left: 10px;">下载模板
      </el-button>
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
      <el-form-item label="成本计算方法：" prop="flag" label-width="128px"
                    v-if="ruleForm.typeValue !== 'short_period' && ruleForm.typeValue !== 'dddetail' &&
        ruleForm.typeValue !== 'profit_b_short' && ruleForm.typeValue !== '' && ruleForm.typeValue !== 'anacase'">
        <el-select class="chooseSelect" v-model="ruleForm.flag" placeholder="请选择" clearable>
          <el-option
            v-for="item in flagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="rigShort" :height="600" :columns="rigShortDataColumns" :data="rigShortData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'rig-short',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'anacase',
            label: '交易逐笔分析表'
          }, {
            value: 'statopen',
            label: '开盘阶段统计表'
          }, {
            value: 'ordfalse',
            label: '全日虚假申报情况表'
          }, {
            value: 'ztfalse',
            label: '涨停价虚假申报情况表'
          }, {
            value: 'tradinglt',
            label: '盘中拉抬情况表'
          }, {
            value: 'endlt',
            label: '尾市拉抬情况表'
          }, {
            value: 'zttrade',
            label: '封涨停情况表'
          }, {
            value: 'order_bs',
            label: '双向申报委比异常统计表'
          }, {
            value: 'short_period',
            label: '指定时段申报、撤单、成交、对倒情况表'
          }, {
            value: 'dddetail',
            label: '对倒明细表'
          }, {
            value: 'profit_b_short',
            label: '指定期间买入指定股票盈利情况表（混合型操纵）'
          }
        ],
        chooseOptions: [
          {
            value: '1',
            label: '股东代码'
          }, {
            value: '2',
            label: '身份证'
          }
        ],
        flagOptions: [],
        ruleForm: {
          typeValue: '',
          chooseValue: '',
          flag: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          flag: [
            {required: true, message: '请选择成本计算方法', trigger: 'change'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: []
            }
          ])
        },
        isDownload: true,
        uploadData: {},
        uploadText: '未上传',
        uploadStatus: 'danger',
        rigShortData: {data: []},
        rigShortDataColumns: [],
        showTable: false,
        loading: false,
        flowid: ''
      }
    },
    methods: {
      handleQueryData () {
        let params = {
          buszId: this.ruleForm.typeValue,
          uploadParam: this.uploadData,
          queryby: '2',
          acct_flag: this.ruleForm.chooseValue,
          flag: this.ruleForm.flag
        }
        this.rigShortData.data = []
        this.rigShortDataColumns = []
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.rigShortData.data = []
          this.rigShortDataColumns = []
          let colums = resp.ch_colnames
          Object.keys(colums).forEach((col) => {
            this.rigShortDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          })
          this.rigShortData.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.rigShortData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.rigShort.showOrHideLoading(flag)
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
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.uploadData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.uploadData = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      // 表格change事件
      handleAnalysisRules (val) { // eslint-disable-line
        // 切换上传文件解析字段
        switch (val) {
          case 'anacase':// 交易逐笔分析表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'from_time', 'to_date', 'to_time']
              }
            ])
            break
          case 'statopen': // 开盘阶段统计表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '前一交易日收盘价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['type_yc', 'para_x', 'para_y']
              }
            ])
            break
          case 'ordfalse':// 全日虚假申报情况表
          case 'ztfalse':// 涨停价虚假申报情况表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '起始时间前一笔市场成交价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['para_x', 'para_y']
              }
            ])
            break
          case 'tradinglt':// 盘中拉抬情况表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '拉抬前一笔市场成交价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['para_x', 'para_y']
              }
            ])
            break
          case 'endlt' :// 尾市拉抬情况表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '尾市前一笔市场成交价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['para_n', 'para_x', 'para_y']
              }
            ])
            break
          case 'short_period':// 指定时段申报、撤单、成交、对倒情况表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'trade_date', 'from_time', 'to_time']
              }
            ])
            break
          case 'profit_b_short':// 指定期间买入指定股票盈利情况表（混合型操纵）
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'holdto_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              }
            ])
            break
          case 'dddetail':// 对倒明细表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              }
            ])
            break
          case 'order_bs': // 双向申报委比异常统计表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '起始时间前一笔市场成交价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['para_n', 'para_x', 'para_y', 'para_z']
              }
            ])
            break
          case 'zttrade': // 封涨停情况表
            this.flagOptions = [{value: '1', label: '成本按先进先出法'}, {value: '2', label: '封涨停当日账户组最早涨停申报的前一笔市场成交价'}]
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['para_x']
              }
            ])
            break
        }
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () { // eslint-disable-line
        if (this.ruleForm.typeValue == '') {
          this.$message.warning('请选择短线操纵类别')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'anacase':// 交易逐笔分析表
            this.gfnDownloadTemplateFile({code: 'stddataqry.anacase'})
            break
          case 'statopen': // 开盘阶段统计表
            this.gfnDownloadTemplateFile({code: 'stddataqry.statopen'})
            break
          case 'ztfalse':// 涨停价虚假申报情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.ztfalse'})
            break
          case 'tradinglt':// 盘中拉抬情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.tradinglt'})
            break
          case 'ordfalse':// 全日虚假申报情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.ordfalse'})
            break
          case 'endlt' :// 尾市拉抬情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.endlt'})
            break
          case 'short_period':// 指定时段申报、撤单、成交、对倒情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.short_period'})
            break
          case 'profit_b_short':// 指定期间买入指定股票盈利情况表（混合型操纵）
            this.gfnDownloadTemplateFile({code: 'stddataqry.profit_b_short'})
            break
          case 'dddetail':// 对倒明细表
            this.gfnDownloadTemplateFile({code: 'stddataqry.dddetail'})
            break
          case 'order_bs':// 双向申报委比异常统计表
            this.gfnDownloadTemplateFile({code: 'stddataqry.order_bs'})
            break
          case 'zttrade':// 封涨停情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.zttrade'})
            break
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .rigShortBox {
    .el-form-item {
      display: inline-block;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .el-select {
      margin-right: 10px;
    }
    .rightBar {
      float: right;
    }
  }
</style>
