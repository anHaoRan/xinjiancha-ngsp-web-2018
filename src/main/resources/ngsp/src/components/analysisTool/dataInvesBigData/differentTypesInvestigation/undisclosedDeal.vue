<template>
  <div class="undisclosedDealBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="80px">
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
        <el-button type="text" :disabled="loading" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table
        ref="undisclosedDeal"
        :columns="columns"
        :data="tableData"
        :isPageination="false">
        <el-tabs slot="tableHeader" v-model="activeName" @tab-click="changeTable">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.key"
            :label="item.label"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
      </s-table>
      <el-row style="float: right;margin-top: 10px">
        <el-col>{{tableTips}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHisBigData } from '../../../../service/analysisTool/dataInvesBigData'

  export default {
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        chooseOptions: [
          {value: '2', label: '身份证'},
          {value: '1', label: '股东代码'}
        ],
        ruleForm: {
          chooseValue: ''
        },
        rules: {
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ]
        },
        uploadExcelData: {},
        uploadText: '未上传',
        uploadStatus: 'danger',
        activeName: 'tablepan1',
        tableData: {},
        columns: [],
        tabList: [
          {label: '趋同交易总体情况表', name: 'tablepan1'},
          {label: '趋同交易股票明细表', name: 'tablepan2'},
          {label: '趋同交易明细表', name: 'tablepan3'},
          {label: '趋同交易盈利情况表', name: 'tablepan4'}
        ],
        table: {
          theadList1: [],
          theadList2: [],
          theadList3: [],
          theadList4: [],
          data1: {data: []},
          data2: {data: []},
          data3: {data: []},
          data4: {data: []}
        },
        showTable: false,
        loading: false,
        flowid: '',
        isDownload: true,
        tableTips: '金额单位：万元；股票数量：万股；占比单位：%',
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: []
            }
          ])
        }
      }
    },
    methods: {
      handleQueryData () {
        let params = {
          acct_flag: this.ruleForm.chooseValue,
          buszId: 'qt_trade',
          queryby: '2',
          uploadParam: this.uploadExcelData
        }
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        this.table = {
          theadList1: [],
          theadList2: [],
          theadList3: [],
          theadList4: [],
          data1: {data: []},
          data2: {data: []},
          data3: {data: []},
          data4: {data: []}
        }
        getDayTradeHisBigData(JSON.stringify(params)).then(resp => {
          let colums0 = resp.ch_colnames[0]
          let colums1 = resp.ch_colnames[1]
          let colums2 = resp.ch_colnames[2]
          let colums3 = resp.ch_colnames[3]
          Object.keys(colums0).forEach((col) => {
            this.table.theadList1.push({label: colums0[col], field: col, align: 'center', width: '120'})
          })
          Object.keys(colums1).forEach((col) => {
            this.table.theadList2.push({label: colums1[col], field: col, align: 'center', width: '120'})
          })
          Object.keys(colums2).forEach((col) => {
            this.table.theadList3.push({label: colums2[col], field: col, align: 'center', width: '120'})
          })
          Object.keys(colums3).forEach((col) => {
            this.table.theadList4.push({label: colums3[col], field: col, align: 'center', width: '120'})
          })
          this.table.data1.data = resp.rows[0]
          this.table.data2.data = resp.rows[1]
          this.table.data3.data = resp.rows[2]
          this.table.data4.data = resp.rows[3]
          // 默认展示第一个表格
          this.columns = this.table.theadList1
          this.tableData = this.table.data1
          this.flowid = resp.flowId
          if (this.tableData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.loading = false
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.undisclosedDeal.showOrHideLoading(flag)
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
      changeTable (tab) {
        switch (tab.name) {
          case 'tablepan1':
            this.tableTips = '金额单位：万元；股票数量：万股；占比单位：%'
            this.columns = this.table.theadList1
            this.tableData = this.table.data1
            break
          case 'tablepan2':
            this.tableTips = '金额单位：万元；股票数量：万股'
            this.columns = this.table.theadList2
            this.tableData = this.table.data2
            break
          case 'tablepan3':
            this.tableTips = '金额单位：元；股票数量：股'
            this.columns = this.table.theadList3
            this.tableData = this.table.data3
            break
          case 'tablepan4':
            this.tableTips = '金额单位：元；股票数量：股'
            this.columns = this.table.theadList4
            this.tableData = this.table.data4
            break
        }
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.uploadExcelData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.uploadExcelData = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        this.gfnDownloadTemplateFile({code: 'stddataqry.qt_trade'})
      }
    },
    mounted () {
      this.uploadParams.parseRules = JSON.stringify([
        {
          firstToSkip: 1, // 前置忽略项
          fields: ['acct_id', 'acct_id_std', 'from_date', 'to_date', 'holdto_date', 'para_m', 'para_n']
        },
        {
          firstToSkip: 1, // 前置忽略项
          fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
        }
      ])
    }
  }
</script>

<style scoped lang="less">
  .undisclosedDealBox {
    .el-table_body {

    }
    .el-form-item {
      display: inline-block;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .rightBar {
      float: right;
    }
    .chooseSelect {
      width: 120px;
    }
    .el-card {
      min-height: auto;
    }
  }
</style>
