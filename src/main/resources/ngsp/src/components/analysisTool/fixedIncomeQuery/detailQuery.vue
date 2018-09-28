<template>
  <div class="detail-query">
    <el-card>
      <div slot="header">
        查询条件
        <el-button
            type="primary"
            size="small"
            @click="fnGetQueryRes">
          查询
        </el-button>
      </div>

      <el-form :inline="true" label-width="100px">
        <el-row>
          <el-col :xl="8" :lg="7" :md="12" :sm="24">
            <el-form-item label="证券代码：">
              <stock-code-query :commonData="commonData" @getStockCode="fnGetStockCode"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="7" :md="12" :sm="24">
            <el-form-item label="账户代码：">
              <el-input size="small" v-model="accountCode" class="el-form-input"/>
              <text-upload @getTxtCon="fnGetAccountGroupUploadCon"
                           style="display: inline-block;"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="10" :md="12" :sm="24">
            <el-form-item label="日期：">
              <el-date-picker
                  v-model="dateVal"
                  type="daterange"
                  :unlink-panels="true"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  format="yyyyMMdd"
                  value-format="yyyy-MM-dd"
                  size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="el-card-table" v-if="isShowRes">
      <div slot="header">
        成交明细查询：
        <el-button size="small" type="info" @click="saveLocation">导出</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          style="width: 100%"
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            v-for="column in tableOptions"
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
      <el-pagination
          max-width="100%"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultNum">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import TextUpload from '../../common/textUpload'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import { getDetailQueryRes } from '../../../service/analysisTool/fixedIncomeQuery'

  export default {
    //  name: "detail-query",
    components: {
      TextUpload, StockCodeQuery
    },
    data () {
      return {
        // 证券代码
        commonData: {
          stockCode: '',
          disabled: false
        },
        // 账户代码
        accountCode: '',
        // 日期
        dateVal: [],
        // 查询结果
        isShowRes: false,
        tableData: [],
        queryResLoad: false,
        tableOptions: [
          {
            field: 'trade_date',
            label: '成交日期',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
          },
          {
            field: 'trade_time',
            label: '成交时间',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_time')
          },
          {
            field: 'sec_code',
            label: '证券代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')
          },
          {
            field: 'instrument_short_name',
            label: '证券名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_short_name')
          },
          {
            field: 'baccountid',
            label: '买方账户',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'baccountid')
          },
          {
            field: 'account_name_b',
            label: '买方账户名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_name_b')
          },
          {
            field: 'pub_id_b',
            label: '买方PBU',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pub_id_b')
          },
          {
            field: 'branch_b',
            label: '买方营业部名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_b')
          },
          {
            field: 'saccountid',
            label: '卖方账户',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'saccountid')
          },
          {
            field: 'account_name_s',
            label: '卖方账户名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_name_s')
          },
          {
            field: 'pub_id_s',
            label: '卖方PBU',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pub_id_s')
          },
          {
            field: 'branch_s',
            label: '卖方营业部名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_s')
          },
          {
            field: 'tradmtchprc',
            label: '成交价格',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'tradmtchprc')
          },
          {
            field: 'mounts',
            label: '成交数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mounts')
          },
          {
            field: 'trdamt',
            label: '成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt')
          },
          {
            field: 'pld',
            label: '与收盘价偏离度（%）',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pld'),
            formatter: this.gfnElColFormatDec3
          }
        ],
        // 分页
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0
      }
    },
    mounted () {
      // 获取当前交易日
      getCurTradeDate().then(resp => {
        resp = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.dateVal = [resp, resp]
      })
    },
    methods: {
      // 查询
      fnGetQueryRes () {
        if ($.isEmptyObject(this.dateVal)) {
          this.$message.warning('请选择日期')
          return
        }
        this.currentPage = 1
        this.getRes()
      },
      getRes () {
        this.requestParams = {
          stockCode: this.commonData.stockCode.split(' ')[0],
          accountId: this.accountCode,
          dateStart: this.dateVal[0],
          dateEnd: this.dateVal[1],
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        this.isShowRes = true
        this.queryResLoad = true
        getDetailQueryRes(this.requestParams).then(resp => {
          this.tableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows - 0
          this.queryResLoad = false
        })
      },
      // 获取证券代码
      fnGetStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      // 获取文件上传内容
      fnGetAccountGroupUploadCon (res) {
        let uploadNum = res.length
        if (uploadNum > 1000) {
          this.$message.error(`最多可指定1000个账户,您上传的文件包含${uploadNum}个账户`)
          return
        }
        this.accountCode = res.join(',')
      },
      // 分页
      handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        this.getRes()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getRes()
      },
      // 导出文件
      saveLocation () {
        let params = {...this.requestParams}
        params['tableColumns'] = [
          {
            sheetName: '固定收益平台-成交明细查询',
            fileColumns: this.tableOptions
          }
        ]
        params['type'] = 'tradeDetail'
        params['fileType'] = 'excel'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
      }
    }
  }
</script>

<style lang="less" scoped>
  .detail-query {

  }
</style>
