<template>
  <div class="limit-query">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="info" @click="saveLocation" v-if="limitTableData.length!==0">导出</el-button>
        <el-button
            type="primary"
            size="small"
            style="float: right;"
            @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="日期：" :required="true">
            <el-date-picker
                v-model="dateVal"
                type="date"
                format="yyyyMMdd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                size="small">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <div v-if="isShowRes">
      <el-card class="el-card-table">
        <div slot="header">
          额度查询统计：

        </div>
        <el-table
            :data="limitTableData"
            border
            tooltip-effect="dark"
            size="small"
            highlight-current-row
            style="width: 100%"
            height="450px"
            v-loading="limitQueryResLoad"
            v-tableLoadMore="handleTableLoadMoreLimit"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
              v-for="column in limitTableOptions"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              min-width="130"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
              :align="column.align == null ? 'center' : column.align"
              :formatter="column.formatter">
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="el-card-table">
        <div slot="header">
          额度查询交易商统计：

        </div>
        <el-table
            :data="limitMemberTableData"
            border
            tooltip-effect="dark"
            size="small"
            height="450px"
            highlight-current-row
            style="width: 100%"
            v-loading="limitMemberQueryResLoad"
            v-tableLoadMore="handleTableLoadMoreLimitMember"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
              v-for="column in limitMemberTableOptions"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              min-width="130"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
              :align="column.align == null ? 'center' : column.align"
              :formatter="column.formatter">
          </el-table-column>
        </el-table>
      </el-card>
    </div>

  </div>
</template>

<script>
  import { getLimitQueryData } from '../../../service/analysisTool/stockConnectSH'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'limit-query',
    props: [],
    components: {},
    mixin: [],
    data () {
      return {
        dateVal: '',
        limitTableData: [],
        limitResLoad: false,
        limitTableOptions: [
          {field: 'trd_mktval_b', label: '成交买入金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval_b'), formatter: this.gfnElColFormatDecThou3},
          {field: 'trd_mktval_s', label: '成交卖出金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval_s'), formatter: this.gfnElColFormatDecThou3},
          {field: 'trd_mktval', label: '成交净额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval_b', label: '买入未成交金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval_b'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval_s', label: '卖出未成交金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval_s'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval', label: '未成交净额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval'), formatter: this.gfnElColFormatDecThou3},
          {field: 'ysyed', label: '已使用额度(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ysyed'), formatter: this.gfnElColFormatDecThou3},
          {field: 'syed', label: '剩余额度(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'syed'), formatter: this.gfnElColFormatDecThou3}
        ],
        limitCurrentPage: 1,
        limitQueryResLoad: false,
        limitMemberTableData: [],
        limitMemberQueryResLoad: false,
        limitMemberTableOptions: [
          {field: 'brnid', label: '交易商代码', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')},
          {field: 'branch_name', label: '交易商名称', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')},
          {field: 'trd_mktval_b', label: '成交买入金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval_b'), formatter: this.gfnElColFormatDecThou3},
          {field: 'trd_mktval_s', label: '成交卖出金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval_s'), formatter: this.gfnElColFormatDecThou3},
          {field: 'trd_mktval', label: '成交净额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trd_mktval'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval_b', label: '买入未成交金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval_b'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval_s', label: '卖出未成交金额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval_s'), formatter: this.gfnElColFormatDecThou3},
          {field: 'notrd_mktval', label: '未成交净额(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'notrd_mktval'), formatter: this.gfnElColFormatDecThou3},
          {field: 'ysyed', label: '已使用额度(亿元)', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ysyed'), formatter: this.gfnElColFormatDecThou3}
        ],
        limitMemberCurrentPage: 1,
        pageSize: 20,
        requestParams: {},
        isShowRes: false,
        isLimitLoadMore: true,
        isLimitMemberLoadMore: true
      }
    },
    computed: {},
    watch: {},
    methods: {
      fnGetQueryRes () {
        if (!this.dateVal) {
          this.$message.warning('日期不能为空')
          return
        }
        this.isShowRes = true
        this.limitTableData = []
        this.limitMemberTableData = []
        this.limitCurrentPage = 1
        this.limitMemberCurrentPage = 1
        this.getRes()
      },
      handleTableLoadMoreLimit () {
        if(this.isLimitLoadMore){
          this.limitCurrentPage += 1
          this.getRes('ilmitTable')
        }
      },
      handleTableLoadMoreLimitMember () {
        if(this.isLimitMemberLoadMore){
          this.limitMemberCurrentPage += 1
          this.getRes('limitMemberTable')
        }
      },
      getRes (tableType) {
        if (!tableType) {
          this.requestParams = {
            date: this.dateVal,
            pageIndex: this.limitCurrentPage,
            pageRows: this.pageSize
          }
          this.limitQueryResLoad = true
          this.limitMemberQueryResLoad = true
        } else {
          switch (tableType) {
            case 'ilmitTable':
              this.requestParams.pageIndex = this.limitCurrentPage
              this.limitQueryResLoad = true
              break
            case 'limitMemberTable':
              this.requestParams.pageIndex = this.limitMemberCurrentPage
              this.limitMemberQueryResLoad = true
              break
          }
        }
        this.getOneTableData(tableType)
      },
      getOneTableData (tableType) {
        if (!tableType) {
          getLimitQueryData(this.requestParams).then(resp => {
            this.limitTableData = resp.quotaStat.bizData.metaData
            this.limitMemberTableData = resp.quotaTradeStat.bizData.metaData
            this.limitQueryResLoad = false
            this.limitMemberQueryResLoad = false
          })
        } else {
          getLimitQueryData(this.requestParams).then(resp => {
            if (this.requestParams.pageIndex === 1) {
              switch (tableType) {
                case 'ilmitTable':
                  this.limitTableData = resp.quotaStat.bizData.metaData
                  this.limitQueryResLoad = false
                  break
                case 'limitMemberTable':
                  this.limitMemberTableData = resp.quotaTradeStat.bizData.metaData
                  this.limitMemberQueryResLoad = false
                  break
              }
            } else {
              switch (tableType) {
                case 'ilmitTable':
                  this.limitQueryResLoad = false
                  this.limitTableData = this.limitTableData.concat(resp.quotaStat.bizData.metaData)
                  if (this.limitTableData.length === resp.quotaStat.bizData.totalRows) {
                    this.$message.warning('额度查询统计结果加载完毕！')
                    this.isLimitLoadMore = false
                  }
                  break
                case 'limitMemberTable':
                  this.limitMemberQueryResLoad = false
                  this.limitMemberTableData = this.limitMemberTableData.concat(resp.quotaTradeStat.bizData.metaData)
                  if (this.limitMemberTableData.length === resp.quotaTradeStat.bizData.totalRows) {
                    this.$message.warning('额度查询交易商统计结果加载完毕！')
                    this.isLimitMemberLoadMore = false
                  }
                  break
              }
            }
          })
        }
      },
      saveLocation () {
        let params = {
          date: this.dateVal,
          type: 'hgtQuotaStat',
          fileType: 'excel',
          tableColumns: [{
            'sheetName': '沪港通查询额度查询',
            'fileColumns': this.limitTableOptions
          }, {
            'sheetName': '沪港通查询额度查询交易商统计',
            'fileColumns': this.limitMemberTableOptions
          }]
        }
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params)
      }
    },
    created () {

    },
    mounted () {
      getCurTradeDate().then(resp => {
        this.dateVal = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
      })
    },
    beforeDestory () {

    }
  }
</script>

<style lang="less" scoped>
  .limit-query {

  }
</style>
