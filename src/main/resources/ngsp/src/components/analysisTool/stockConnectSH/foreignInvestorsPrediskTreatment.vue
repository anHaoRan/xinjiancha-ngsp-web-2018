<!-- 境外投资者持股比例盘前处理 -->
<template>
  <div class="foreign-investors-predisk-treatment">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-form ref='foreignInvestorsPrediskTreatment' :inline="true" :model='formData' :rules='rules' label-width='100px'>
        <el-form-item label='比例门限>=' prop='fiLimit'>
          <div style="display: inline-block">
            <el-input
              size="small"
              @change="fiLimitChange"
              v-model="formData.fiLimit"></el-input>
          </div>%
        </el-form-item>
        <el-form-item label='日期：' prop='queryDate'>
          <el-date-picker
            v-model="formData.queryDate"
            type="date"
            placefiLimiter="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            :picker-options="beginPickerData"
            size="small"
            style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button size="small" type="primary" @click="handleData(1)">数据处理</el-button>
          <el-button size="small" type="primary" @click="handleData(2)">文件管理</el-button>
          <!--<el-button size="small" type="primary" @click="handleData(3)">QFII盘前操作确认</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
    <div v-show="isShowRes">
      <s-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @getPageination="getPageination">
        <el-dropdown @command="handleDownload" v-if="tableData.data.length" slot="elCardHeader">
          <el-button type="info" size="small">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exl">
              <i class="el-icon-document"></i>导出为EXCEL
            </el-dropdown-item>
            <el-dropdown-item command="csv">
              <i class="el-icon-tickets"></i>导出为CSV
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </s-table>
    </div>
    <el-dialog
      :visible.sync="showDialog"
      title="文件管理"
      width="15%">
      <div v-if="userActionType == 1" style="text-align: center">
        <p style="margin-bottom: 20px;">数据处理成功！</p>
        <div style="text-align: right">
          <el-button size="small" type="primary" @click="showDialog = false">确定</el-button>
        </div>
      </div>
      <div v-if="userActionType == 2" style="text-align: center">
        <div style="margin-bottom: 20px; text-align: center">
          <el-button size="small" type="primary" @click="produceFile" v-if="productBtnStatus">文件生成</el-button>
          <el-button size="small" type="primary" disabled v-else>文件生成中</el-button>
        </div>
        <div style="text-align: center">
          <el-button size="small" type="primary" :disabled="produceFileData.length < 1" @click="downloadFile">文件下载</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    postPrediskTreatment,
    exportPrediskTreatment,
    prediskTreatmentHandleData,
    prediskTreatmentCreatFile,
    prediskTreatmentDownloadFile} from '../../../service/analysisTool/stockConnectSH'
  import {getRelativeTradeDate} from '@/service/common/commonFunc'

  export default {
    name: 'foreign-investors-predisk-treatment',
    components: {
      STable: () => import('@/components/base/STable')
    },
    data() {
      let validateHold = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入'))
        } else {
          if (Number(value) || value === '0.00000') {
            return callback()
          } else {
            return callback('请输入数字')
          }
        }
      }
      return {
        produceFileData: [],
        productBtnStatus: true, // 文件生成按钮是否可点击
        userActionType: 0, // 1: 数据处理； 2: 文件管理；3: QFII盘前操作确认
        showDialog: false,
        isShowRes: false,
        queryData: {},
        formData: {
          queryDate: '',
          fiLimit: '0.00000'
        },
        rules: {
          queryDate: [
            {required: true, message: '请选择'}
          ],
          fiLimit: [
            {required: true, validator: validateHold}
          ]
        },
        loading: false,
        columns: [
          {
            label: '证券代码',
            field: 'instrument_id',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券简称',
            field: 'instrument_chn_short_name',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '境外投资者累计持股数量',
            field: 'position_amount',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '境外投资者累计持股比例',
            field: 'percent',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'percent'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          },
          {
            label: '香港沪港通账户累计持股数量',
            field: 'position_amount_hk',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount_hk'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '香港沪港通账户累计持股比例',
            field: 'percent_hk',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'percent_hk'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          }
        ],
        tableData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        beginPickerData: {
          disabledDate: (time) => {
            return time.getTime() >= new Date().getTime()
          }
        }
      }
    },
    methods: {
      handleDownload(type) { // 查询下载
        let params = {
          queryDate: this.queryData.queryDate,
          fiLimit: this.queryData.fiLimit,
          type: 'fiDealBefore',
          fileType: type,
          tableColumns: [{
            sheetName: '境外投资者持股比例盘前处理',
            fileColumns: this.columns
          }]
        }
        exportPrediskTreatment(params)
      },
      downloadFile() { // zip下载
        prediskTreatmentDownloadFile(this.produceFileData[0], this.produceFileData[1])
      },
      produceFile() { // 生成文件
        let params = {
          p_trandat: this.formData.queryDate,
          queryDate: this.formData.queryDate,
          fiLimit: this.formData.fiLimit
        }
        if (this.productBtnStatus) {
          prediskTreatmentCreatFile(params).then((resp) => {
            if (resp) {
              this.produceFileData = resp.split(',')
              this.productBtnStatus = true
            }
          })
        }
        this.productBtnStatus = false
      },
      handleData(type) { // 数据处理、文件管理按钮
        this.produceFileData = []
        this.userActionType = type
        let params = {
          p_trandat: this.formData.queryDate,
          fiLimit: this.formData.fiLimit
        }
        if (type == 1) {
          prediskTreatmentHandleData(params).then((resp) => {
            if (resp === 'true') {
              this.showDialog = true
            }
          })
          this.$message.info('数据处理中，请稍等~')
        } else {
          this.showDialog = true
        }
      },
      colFormatDec5(cellValue) {
        return Number(cellValue) === 0 ? 0 : this.gfnFormatDecimal(cellValue, 5)
      },
      fiLimitChange(val) {
        if (Number(val)) {
          if (val.slice(0, 1) === '-') {
            this.formData.fiLimit = this.colFormatDec5(val.slice(1))
          } else {
            this.formData.fiLimit = this.colFormatDec5(val)
          }
        }
      },
      handleSearch() {
        this.$refs['foreignInvestorsPrediskTreatment'].validate((valid) => {
          if (valid) {
            this.isShowRes = true
            this.queryData = JSON.parse(JSON.stringify(this.formData))
            this.tableData.pageIndex = 1
            this.reqTableData()
          }
        })
      },
      reqTableData() {
        let params = {
          queryDate: this.queryData.queryDate, // 测试 20131120-20131122
          fiLimit: this.queryData.fiLimit,
          pageIndex: this.tableData.pageIndex,
          pageRows: this.tableData.pageRows
        }
        this.loading = true
        postPrediskTreatment(params).then((resp) => {
          if (resp) {
            this.loading = false
            this.tableData.data = resp.bizData.metaData
            this.tableData.total = resp.bizData.totalRows
          }
        })
      },
      getPageination(pageination) {
        this.tableData.pageIndex = pageination.currentPage
        this.tableData.pageRows = pageination.pageSizeNumber
        this.reqTableData()
      }
    },
    mounted() {
      getRelativeTradeDate(-1).then(resp => {
        this.formData.queryDate = resp
      })
    }
  }
</script>

<style lang="less" scoped>
  .foreign-investors-predisk-treatment {

  }
</style>
