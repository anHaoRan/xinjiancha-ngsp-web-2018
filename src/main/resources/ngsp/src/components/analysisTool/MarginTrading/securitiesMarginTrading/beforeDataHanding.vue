<template>
  <div class="stockIndexDaily">
    <el-card>
      <el-row style="margin-top: 20px ">
        <el-col :span="4" style="margin-left: 20px;">
          <span class="icon">*</span>
          比例门限>=：
          <el-input v-model="present" size="small" style="display: inline-block;width: 100px"></el-input>
          %
        </el-col>
        <el-col :span="5" :offset="2">
          <el-col :span="4" class="name">
            <span class="icon">*</span>
            日期：
          </el-col>
          <el-col :span="12" class="name">
            <el-date-picker
              v-model="beginDate"
              type="date"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="6" style="float: right">
          <div style="float: right;margin-left: 20px;margin-right: 20px;">
            <el-button size="small" type="primary" @click="getDataQuery">查询</el-button>
            <el-button size="small" type="primary" @click="dataDetail">数据处理</el-button>
            <el-button size="small" type="primary" @click="fileManager" v-if="true">文件管理</el-button>
            <el-button size="small" type="info" @click="exportExcel" v-if="true">导出</el-button>
          </div>

        </el-col>
      </el-row>
    </el-card>
    <div v-if="showQueryRes">
      <el-card class="el-card-table">
        <div slot="header">
          融资
        </div>
        <el-table
          :data="finacingData"
          border
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          max-height="350"
          @row-dblclick="getFinacingDetailTable"
          @current-change="handleCurrentChange"
          style="width: 100%"
          :row-class-name="getRowBGColor"
          v-loading="queryResLoadRZ"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
            v-for="column in finacingColumns"
            :key=column.field
            :align=column.align
            :prop=column.field
            :label=column.label
            :min-width=column.minWidth
            :formatter="column.formatter"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod">
          </el-table-column>
        </el-table>
        <div style="text-align: right;margin:15px 20px 15px 0;">共 {{RZTotal}} 条</div>
      </el-card>
      <el-card class="el-card-table">
        <div slot="header">
          融券
        </div>
        <el-table
          :data="securitiesData"
          border
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          max-height="350"
          @row-dblclick="getLoansecDetailTable"
          @current-change="handleCurrentChange"
          style="width: 100%"
          :row-class-name="getRowBGColor"
          v-loading="queryResLoadRQ"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
            v-for="column in securitiesColumns"
            :key=column.field
            :align=column.align
            :prop=column.field
            :label=column.label
            :min-width=column.minWidth
            :formatter="column.formatter"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod">
          </el-table-column>
        </el-table>
        <div style="text-align: right;margin:15px 20px 15px 0;">共 {{RQTotal}} 条</div>
      </el-card>
    </div>
    <el-dialog
            :visible.sync="showDialog"
            title="文件管理"
            width="15%">
      <div style="text-align: center">
        <div style="margin-bottom: 20px; text-align: center">
          <el-button size="small" type="primary" @click="produceFile">文件生成</el-button>
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
    getBeforeSecurities,
    getBeforeFinacing,
    getBeforeSecuritiesDetail,
    getBeforeFinacingDetail,
    getDataDeal,
    createFile,
    saveFile
  } from '@/service/analysisTool/securitiesMarginTrading/index'
  import { getRelativeTradeDate } from '@/service/common/commonFunc'
  import momet from 'moment'

  export default {
    name: 'stock-index-daily',
    data () {
      return {
        present: '0.00000',
        beginDate: '',
        queryResLoadRZ: false,
        queryResLoadRQ: false,
        finacingData: [],
        finacingColumns: [
          {label: '证券代码', field: 'instrument_id', align: 'left', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')},
          {label: '证券简称', field: 'chn_name', align: 'left', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'chn_name')},
          {label: '融资余额', field: 'surplus', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'surplus'), formatter: this.formatterRes},
          {label: '信用账户持有市值', field: 'emktval', align: 'right', minWidth: '6.5%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'emktval'), formatter: this.formatterRes},
          {
            label: '融资余额(模拟)',
            field: 'lmitate_surplus',
            align: 'right',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lmitate_surplus'),
            formatter: this.formatterRes
          },
          {
            label: '融资余额和信用账户持有较小值',
            field: 'least_surplus_emktval',
            align: 'right',
            minWidth: '9%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'least_surplus_emktval'),
            formatter: this.formatterRes
          },
          {
            label: '融资监控指标',
            field: 'monitor_indic_radio',
            align: 'right',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'monitor_indic_radio'),
            formatter: this.formatterRes
          },
          {label: '流通股本', field: 'market_float', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_float'), formatter: this.formatterRes},
          {label: '流通市值(万元)', field: 'mktval', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'), formatter: this.formatterRes},
          {label: '股价', field: 'price', align: 'right', minWidth: '5%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'price'), formatter: this.formatterRes}
        ],
        securitiesData: [],
        securitiesColumns: [
          {label: '证券代码', field: 'instrument_id', align: 'left', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')},
          {label: '证券简称', field: 'chn_name', align: 'left', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'chn_name')},
          {label: '融券余量', field: 'surplus', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'surplus'), formatter: this.formatterRes},
          {label: '融券余额', field: 'balance', align: 'right', minWidth: '6.5%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'balance'), formatter: this.formatterRes},
          {
            label: '融券余量(模拟)',
            field: 'lmitate_surplus',
            align: 'right',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lmitate_surplus'),
            formatter: this.formatterRes
          },
          {label: '差值', field: 'diff', align: 'right', minWidth: '9%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'diff'), formatter: this.formatterRes},
          {
            label: '融券余量占流通市值比例',
            field: 'monitor_indic_radio',
            align: 'right',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'monitor_indic_radio'),
            formatter: this.formatterRes
          },
          {label: '流通股本', field: 'market_float', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_float'), formatter: this.formatterRes},
          {label: '流通市值(万元)', field: 'mktval', align: 'right', minWidth: '6%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'), formatter: this.formatterRes},
          {label: '股价', field: 'price', align: 'right', minWidth: '5%', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'price'), formatter: this.formatterRes}
        ],
        RZTotal: 0,
        RQTotal: 0,
        showQueryRes: false,
        produceFileData:[],
        showDialog:false
      }
    },
    mounted () {
      getRelativeTradeDate(-1).then(resp => {
        this.beginDate = momet(resp, 'YYYYMMDD').format('YYYY-MM-DD')
      })
    },
    methods: {
      formatterRes (row, column, val) {
        if (val == '' || val == '0') {
          return ''
        } else {
          return this.gfnElColFormatDecThou3(row, column, val)
        }
      },
      handleCurrentChange () {

      },
      exportExcel () {

      },
      checkPersent (val) {
        return /^([1-9]\d*|0)(\.\d{1,5})?$/.test(val)
      },
      getRowBGColor ({row}) {
        let str = ''
        switch (row.monitor_levle) {
          case 'red':
            str = 'red'
            break
          case 'blue':
            str = 'blue'
            break
          case 'yellow':
            str = 'yellow'
            break
          default:
            break
        }
        return str
      },
      //  查询
      getDataQuery () {
        if (this.beginDate == null || this.present == '') {
          this.$message.warning('输入参数不允许为空')
          return
        }
        if (!this.checkPersent(this.present)) {
          this.$message.error('比例门限格式错误，请重新输入')
          return
        }
        let paramsRZ = {
          pre_trandat: this.beginDate,
          limitPercent: this.present,
          type: 'RZ'
        }
        let paramsRQ = {
          pre_trandat: this.beginDate,
          limitPercent: this.present,
          type: 'RQ'
        }
        this.showQueryRes = true
        this.queryResLoadRZ = true
        this.queryResLoadRQ = true
        getBeforeFinacing(paramsRZ).then(resp => {
          this.queryResLoadRZ = false
          this.finacingData = resp.bizData.metaData
          this.RZTotal = this.finacingData.length - 1
        })
        getBeforeSecurities(paramsRQ).then(resp => {
          this.queryResLoadRQ = false
          this.securitiesData = resp.bizData.metaData
          this.RQTotal = this.securitiesData.length - 1
        })
      },
      //  数据处理
      dataDetail () {
        if (!this.beginDate) {
          this.$message.warning('请选择日期')
        } else {
          let params = {pre_trandat: this.beginDate}
          getDataDeal(params).then((resp) => {
            this.$message.success(resp)
          })
        }
      },
      //  文件管理
      fileManager () {
        this.showDialog = true
      },
      produceFile(){
        this.produceFileData = []
        let params = {
          pre_trandat:this.beginDate
        }
        // createFile(params).then(resp=>{
          // console.log(resp)
          // if(resp==='true'){
          //
          // }
        // })
      },
      downloadFile(){

      },
      getFinacingDetailTable (row) {
        this.toNewWindow(row, 'RZ')
      },
      getLoansecDetailTable (row) {
        this.toNewWindow(row, 'RQ')
      },
      toNewWindow (row, type) {
        if (row.instrument_id !== '合计') {
          this.type = type
          this.toNewOpen(`#/financeLoansecOpen/${this.type}/${this.beginDate}/${row.instrument_id}`, row.instrument_id)
        }
      },
      toNewOpen (url, id, height = 800, width = 1200) {
        switch (this.type) {
          case 'RZ':
            window.open(url, `finance_loansec_open_${this.type}_${id}`, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
            break
          case 'RQ':
            window.open(url, `finance_loansec_open_${this.type}_${id}`, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
        }
      }

    }
  }
</script>

<style lang="less">
  .stockIndexDaily {
    .name {
      height: 32px;
      line-height: 32px;
    }
    .block {
      margin-top: 5px;
    }
    .icon {
      color: red;
      position: relative;
      top: 2px;
    }
    .tableTitle {
      height: 30px;
      background-color: transparent;
      color: #fff;
      line-height: 30px;
      border-radius: 4px 4px 0px 0px;
      text-indent: 10px;
    }
    .blue {
      background: #18b2f2 !important;
    }
    .red {
      background: #ff402b !important;
    }
    .yellow {
      background: #ffcd36 !important;
    }
  }

</style>
