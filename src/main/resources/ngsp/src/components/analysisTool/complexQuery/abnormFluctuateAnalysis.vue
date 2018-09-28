<!--异常波动分析-->
<template>
  <div class="abnormFluctuateAnalysis">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="query-area-card">
      <div slot="header">
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
        <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
      </div>
      <el-row>
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
          <el-form-item prop="targetDate" label="目标日期">
            <el-date-picker
              prop="targetDate"
              v-model="searchForm.targetDate"
              type="date"
              placeholder="请选择目标日期"
              :picker-option="pickerOption"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="targetDate" label="计算维度">
            <el-checkbox-group v-model="calcDimenCheckedList">
              <el-checkbox v-for="(item,index) in calcDimenOptions" :key="index" :label="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="secCodes" label="证券代码" :rules="[{
            required: true, message: '请输入证券代码'
          }]">
            <stock-code-query-and-upload-component ref="stockCodesListRef"
                                                   @getStockCode="getStockCode"></stock-code-query-and-upload-component>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="el-card-tabs">
      <div slot="header">
        <el-button size="small" type="primary" @click="gotoEquityConcentrationAnalysis()">股权集中度分析</el-button>
        <el-dropdown @command="handleExportData" style="float: right;">
          <el-button type="primary" size="small">
            导出 <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL</el-dropdown-item>
            <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>导出CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <tab-table-pagination-component
        :loading="loading"
        :tabPanes="tabPanes"
        :activeName="activeName"
        :tableDatas="tableDatas"
        :tableColumns="tableColumns"
        :paginations="paginations"
        @handleRowClick="handleRowClick"
        @handlePaginationChange="handlePaginationChange"
        @updateActiveName="updateActiveName">
      </tab-table-pagination-component>
    </el-card>
  </div>
</template>
<script>
  import moment from 'moment'
  import { dateStringAddSeparator } from '@/utils/dateTimeFormat'
  import { selfValidateMethod } from './componentsTool/common/validate'
  import { tableColumns } from './componentsTool/abnormFluctuateAnalysis/abnormAnalysisTableColumns'
  import Breadcrumb from '@/components/common/Breadcrumb'
  import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
  import StockCodeQueryAndUploadComponent from './componentsTool/common/StockCodeQueryAndUploadComponent'
  import { getRelativeTradeDate } from '@/service/common/commonFunc'
  import {
    postAbnormFluctuateAnalysis,
    postEquityConcentrationAnalysis,
    exportAbnormFluctuateAnalysis
  } from '@/service/analysisTool/complexQuery'

  export default {
    components: {
      Breadcrumb,
      tabTablePaginationComponent,
      StockCodeQueryAndUploadComponent,
      StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
    },
    data () {
      let paginations = []
      for (let i = 0; i < 3; i++) {
        paginations.push({
          currentPage: 1,
          pageSizeNumber: 10
        })
      }
      return {
        statisticCaliber: [
          {
            title: '异常波动分析',
            content: [
              `1、 该应用只统计2009年11月23日之后的A股数据。`,
              `2、 统计期间3个月、6个月分别为90个交易日、180个交易日。`,
              `3、 期初为统计期间第一个交易日，期末为统计期间最后一个交易日。`,
              `4、 期间振幅 = (期间最高价格 - 期间最低价格) / 期间最低价格。`,
              `5、 期间振幅较大盘振幅偏离值 = 统计证券的期间振幅 - 上证指数的期间振幅。`,
              `6、 期间涨跌幅 = 期间每日涨跌幅之和。`,
              `7、 涨跌幅较大盘涨跌幅偏离值 = 统计证券的期间涨跌幅 - 上证指数的期间涨跌幅。`,
              `8、 股本变化比例 = (统计期末流通股本 –统计期初流通股本) /  统计期初流通股本。`,
              `9、 市场成交量：取行情的成交数量。`,
              `10、 市场成交额：取行情的成交金额。`,
              `11、 换手率 = 市场成交量 / 总股本`,
              `12、 平均换手率 = 统计期间每日换手率的平均值。`,
              `13、 期间平均换手率较上期平均换手率放大倍数 = (期间平均换手率 - 期初日期之前期平均换手率) / 期初日期之前期日平均换手率。（例如5个交易日，前期则是期初日之前五个交易日。）`,
              `14、 按营业部、基金营业部、地区统计的买入(卖出) 量，均不含大宗交易，且使用交易路径1（按实际使用PBU的机构统计，基金租用不还原）汇总。`,
              `15、 最大买入(卖出)地区名称：证券买入(卖出)成交数量最大的省市名称。`,
              `16、 买(卖)最大地区占比：最大省市买(卖)量 / 市场成交量（行情的成交数量）。`,
              `17、 买入(卖出)基金家数：发生证券买入(卖出)基金营业部个数。`,
              `18、 买入(卖出)最大家基金买入量：基金营业部中，买入(卖出)该证券的最大成交数量。`,
              `19、 是否存在大宗交易：证券统计期间是否有大宗交易成交数量。`,
              `20、 买入(卖出)居前20营业部：证券买入(卖出)成交数量前20的营业部(统计含基金营业部)。`,
              `21、 大股东：持股数量（含非流通股）大于等于该证券当日总股本5%的持股账户。`,
              `22、 持股单一账户（剔除大股东）：统计某证券持股单一账户时，如账户当日股票及基金流通股持仓中，余额大于等于100的证券有且只有该统计证券，且该统计证券持股数量大于10000，则认为该账户为此统计证券的持股单一账户（持股单一账户不包含大股东）。可直接使用JCB_V_Acct_Hold_One_Sec（持股单一账户表）判定`,
              `23、 持股比例：账户流通股持有数量之和 / 证券的流通股本（若因为股票暂停上市等原因无法获取当日流通股本，则取最近交易日流通股本）。`,
              `24、 持股居前200名股东（剔除大股东）：持有流通股数量大于等于10000的前200名股东（不包含大股东）。`,
              `25、 持股变动比例 = 期末持股比例 - 期初持股比例。`,
              `26、 托管居前20席位占流通股本托管变动比例（剔除大股东）：托管居前20席位按PBU统计（不包含大股东账户）。`
            ]
          }
        ],
        tableColumns,
        loading: false,
        defaultTradeDate: '',
        tableDatas: {},
        breadcrumbItems: [{
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '综合查询'
        }, {
          router: '/abnormFluctuateAnalysis',
          label: '异常波动分析'
        }],
        searchForm: {
          targetDate: moment(new Date(), 'YYYYMMDD').format('YYYY-MM-DD'), // 20170810
          secCodes: '' // 600075
        },
        searchedFormData: {
          targetDate: moment(new Date(), 'YYYYMMDD').format('YYYY-MM-DD'), // 20170810
          secCodes: '' // 600075
        },
        calcDimenCheckedList: [0, 1, 2, 3, 4, 5], // 计算维度选择列表
        calcDimenOptions: ['1个交易日', '3个交易日', '5个交易日', '20个交易日', '3个月', '6个月'], // 计算维度枚举值
        pickerOption: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        currentngspUid: '', // 用来记录上一次返回的ngspUid
        tabPanes: [{label: '总览'}, {label: '交易情况'}, {label: '持有情况'}],
        activeName: '0',
        paginations: paginations
      }
    },
    watch: {
      calcDimenCheckedList (newValue) {
        this.changeTableColumns(newValue, this.activeName)
      },
      activeName (newValue) {
        this.changeTableColumns(this.calcDimenCheckedList, newValue)
      }
    },
    methods: {
      getStockCode (data) {
        this.searchForm.secCodes = data
        // this.$refs['searchForm'].validateField('secCodes')
      },
      updateActiveName (activeName) {
        this.activeName = activeName
      },
      handlePaginationChange (paginations) {
        this.paginations = paginations
        this.reqTableData(0)
      },
      changeTableColumns (calcDimenCheckedList, activeName) {
        let labelArray = calcDimenCheckedList.map(v => {
          return this.calcDimenOptions[v]
        })
        this.tableColumns[activeName].forEach((v, i) => {
          /* 前三项为固定显示项目，不做处理 */
          if (i > 2) {
            /* table的列名是否有字段包含在计算维度所选项的label名称 */
            let filterItem = labelArray.filter(l => {
              return v.label.indexOf(l) > -1
            })
            if (filterItem.length) {
              v.show = true
            } else {
              v.show = false
            }
          }
        })
        this.tableColumns[0][3].show = true // tab1 第三、四列固定展示
        this.tableColumns[0][4].show = true
      },
      handleExportData (type) {
        if (!this.currentngspUid) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0, // 判断是否是新查询,1是新查询，0是分页或导出
          ngspUid: this.currentngspUid, // this.currentngspUid,
          // tabIndex: 'tab' + (this.activeName + 1),
          tableColumns: {
            tab1: this.tableColumns[0],
            tab2: this.tableColumns[1],
            tab3: this.tableColumns[2]
          }
        }
        if (type === 'csv') { // 只能导出当前tab下的csv文件
          params.tabIndex = 'tab' + (+this.activeName + 1)
        }
        exportAbnormFluctuateAnalysis(params)
      },
      handleTabClick () {
        // this.reqTableData(1)
      },
      gotoEquityConcentrationAnalysis (secCode) {
        let propsQuery = secCode ? {query: {secCode: secCode}} : {}
        this.$router.push({...propsQuery, path: '/equityConcentrationAnalysis'})
      },
      formatTagetDate (date) {
        return date.replace(/-/g, '')
      },
      extendParams (params) {
        params.pageIndex = this.paginations.map(v => {
          return v.currentPage
        }).join(',')
        params.pageRows = this.paginations.map(v => {
          return v.pageSizeNumber
        }).join(',')
      },
      reqTableData (type) {
        /* 当analysisType=0 时，表示查询异常波动分析总览数据。
         当analysisType=1 时，表示查询异常波动分析交易情况数据。
         当analysisType=2时，表示查询异常波动分析持有情况数据。
         */
        let params = {
          targetDate: type === 1 ? this.searchForm.targetDate ? this.searchForm.targetDate : this.defaultTradeDate : this.searchedFormData.targetDate ? this.searchedFormData.targetDate : this.defaultTradeDate, // 目标日期
          secCodes: type === 1 ? this.searchForm.secCodes : this.searchedFormData.secCodes, // 证券代码集合
          analysisType: this.activeName, // 当前选中的tab
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
        }
        /* 处理pageIndex，pageRows */
        this.extendParams(params)
        this.loading = true
        /* 处理status=500的情况 */
        /* setTimeout(() => {
         this.loading = false
         }, 5000) */
        postAbnormFluctuateAnalysis(params).then(resp => {
          this.loading = false
          if (resp) {
            this.currentngspUid = resp['tab1']['ngsp_uid'] || ''
            /* 性能优化，只展示前1000条数据 */
            this.tableDatas = resp
          } else {
            this.currentngspUid = ''
            this.tableDatas = []
          }
        })
      },
      handleRowClick (row) {
        if (row.sec_code) {
          this.gotoEquityConcentrationAnalysis(row.sec_code)
        }
      },
      handleClear () {
        this.searchForm = {
          targetDate: this.defaultTradeDate,
          secCodes: ''
        }
        this.$refs['stockCodesListRef'].clearStockCodes()
      },
      handleQuery () {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            if (selfValidateMethod({stocks: this.searchForm.secCodes})) { /* 批量校验证券代码格式 */
              this.searchedFormData = JSON.parse(JSON.stringify(this.searchForm))
              this.paginations.forEach(v => {
                v.currentPage = 1
              })
              this.reqTableData(1)
            }
          }
        })
      }
    },
    mounted () {
      /* 缺省为T-1个交易日 */
      getRelativeTradeDate(-1).then(resp => {
        this.defaultTradeDate = dateStringAddSeparator(resp)
        this.searchForm.targetDate = this.defaultTradeDate
        // this.reqTableData(1)
      })
    }
  }
</script>
<style lang="less" scoped>
  .abnormFluctuateAnalysis {
    .el-card {
      width: 100%;
      .el-form {
        width: 100%;
      }
    }
    .el-card-tabs {
      .el-button {
        float: left !important;
      }
    }
  }
</style>
