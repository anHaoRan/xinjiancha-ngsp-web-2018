<template>
    <div class="product-query">
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
                            <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes"
                                                  style="display: inline-block;" ref="selectLazyMultiple">
                            </select-lazy-multiple>
                            <text-upload @getTxtCon="fnGetStockTypeUploadCon"
                                         style="display: inline-block;"></text-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :lg="7" :md="12" :sm="24">
                        <el-form-item label="统计方式：">
                            <el-select
                                    size="small"
                                    v-model="statisticsWay"
                                    @change="handleStatisticWayChange">
                                <el-option
                                        v-for="item in statisticsWayOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
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
                产品查询：
                <el-button size="small" type="info" @click="saveLocation" v-if="tableData.length!==0">导出</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    size="small"
                    height="550"
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
                layout="total"
                :total="resultNum">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
  import SelectLazyMultiple from '../../common/SelectLazyMultiple'
  import TextUpload from '../../common/textUpload'
  import moment from 'moment'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import { getProductQueryRes } from '../../../service/analysisTool/fixedIncomeQuery'

  export default {
    //  name: "product-query",
    components: {
      TextUpload, SelectLazyMultiple
    },
    data () {
      return {
        // 证券代码子组件所需值
        selectParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        // 证券代码值
        stockCode: '',
        // 日期
        dateVal: [],
        // 统计方式
        statisticsWay: '1',
        statisticsWayOptions: [
          {value: '1', label: '分日列示'},
          {value: '2', label: '多日合计'}
        ],
        // 查询结果展示与否
        isShowRes: false,
        // 表格
        tableData: [],
        queryResLoad: false,
        resultNum:0,
        tableOptions: [
          {field: 'sec_code', label: '证券代码', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
          {field: 'instrument_short_name', label: '证券名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
          {field: 'baccountid', label: '买方账户', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'baccountid')},
          {field: 'b_investor_acct_name', label: '买方账户名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'b_investor_acct_name')},
          {field: 'b_pbuid', label: '买方PBU', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'b_pbuid')},
          {field: 'b_branch_name', label: '买方营业部名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'b_branch_name')},
          {field: 'b_volume', label: '买入数量', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_volume'), formatter: this.gfnElColFormatDecThou0,format: '#,##0'},
          {field: 'b_mktval', label: '买入金额', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'), formatter: this.gfnElColFormatDecThou3,format: '#,##0.000'},
          {field: 'b_avg_price', label: '买入均价', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'), formatter: this.gfnElColFormatDecThou3,format: '#,##0.000'},
          {field: 'b_avg_volume', label: '占总股本比重', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_volume'), formatter: this.gfnElColFormatDec3,format: '0.000'},
          {field: 'saccountid', label: '卖方账户', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'saccountid')},
          {field: 's_investor_acct_name', label: '卖方账户名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 's_investor_acct_name')},
          {field: 's_pbuid', label: '卖方PBU', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 's_pbuid')},
          {field: 's_branch_name', label: '卖方营业部名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 's_branch_name')},
          {field: 'flag', label: '是否大小非', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'flag')},
          {field: 's_volume', label: '卖出数量', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_volume'), formatter: this.gfnElColFormatDecThou0,format: '#,##0'},
          {field: 's_mktval', label: '卖出金额', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'), formatter: this.gfnElColFormatDecThou3,format: '#,##0.000'},
          {field: 's_avg_price', label: '卖出均价', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'), formatter: this.gfnElColFormatDecThou3,format: '#,##0.000'},
          {field: 's_avg_volume', label: '占总股本比重', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_volume'), formatter: this.gfnElColFormatDec3,format: '0.000'}
        ],
        // 查询参数
        requestParams: {}
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
        this.requestParams = {
          stockCode: this.stockCode,
          flag: this.statisticsWay,
          dateStart: this.dateVal[0],
          dateEnd: this.dateVal[1]
        }
        this.isShowRes = true
        this.queryResLoad = true
        getProductQueryRes(this.requestParams).then(resp => {
          this.changeTableOption(this.statisticsWay)
          this.tableData = resp.bizData.metaData
          this.resultNum = resp.bizData.rows-0
          this.queryResLoad = false
        })
      },
      // 切换表格列设置
      changeTableOption (val) {
        switch (val) {
          case '1':
            if (this.tableOptions[0].field !== 'trade_date') {
              this.tableOptions.unshift({
                field: 'trade_date',
                label: '日期',
                align: 'left',
                sortable: true,
                sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
              })
            }
            break
          case '2':
            if (this.tableOptions[0].field === 'trade_date') {
              this.tableOptions.splice(0, 1)
            }
            break
        }
      },
      // 证券代码下拉val获取
      fnGetSelectRes (val) {
        this.stockCode = val.join(',')
      },
      // 证券代码获取txt文件内容
      fnGetStockTypeUploadCon (res) {
        this.selectParams.query = res.join(',')
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res.join(','))
      },
      // 统计方式change事件
      handleStatisticWayChange () {
      },
      // 导出为本地文件
      saveLocation () {
        let params = {...this.requestParams}
        params['tableColumns'] = [
          {
            sheetName: '固定收益平台-产品查询',
            fileColumns: this.tableOptions
          }
        ]
        params['type'] = 'product'
        params['fileType'] = 'excel'
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
      }
    }
  }
</script>

<style lang="less" scoped>
    .product-query {
        .el-card__body {
            padding: 10px 0 0 0
        }
    }
</style>
