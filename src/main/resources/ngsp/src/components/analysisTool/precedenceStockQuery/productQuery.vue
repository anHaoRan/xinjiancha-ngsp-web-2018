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
            <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
                <el-col :xl="8" :lg="8" :md="12" :sm="24">
                    <el-form-item label="证券代码：">
                        <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes"
                                              style="display: inline-block;" ref="selectLazyMultiple">
                        </select-lazy-multiple>
                        <text-upload @getTxtCon="fnGetStockTypeUploadCon" style="display: inline-block;"></text-upload>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :lg="8" :md="12" :sm="24">
                    <el-form-item label="统计方式：">
                        <el-select
                                size="small"
                                v-model="statisticsWay">
                            <el-option
                                    v-for="item in statisticsWayOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :lg="8" :md="12" :sm="24">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="dateVal"
                                type="daterange"
                                :unlink-panels="true"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                range-separator="至"
                                format="yyyy-MM-dd"
                                value-format="yyyyMMdd"
                                size="small">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-card class="el-card-table" v-if="isShowRes">
            <div slot="header">
                优先股产品查询：
                <el-button size="small" type="info" @click="saveLocation" v-if="!queryResLoad">导出</el-button>
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
        </el-card>
    </div>
</template>

<script>
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import { getPrecedenceProductData } from '../../../service/analysisTool/precedenceStockQuery'

  export default {
    name: 'product-query',
    props: [],
    components: {
      TextUpload: () => import('../../common/textUpload'),
      SelectLazyMultiple: () => import('../../common/SelectLazyMultiple')
    },
    mixin: [],
    data () {
      return {
        // 证券代码
        stockCode: '',
        stockName: '',
        // 日期
        dateVal: [],
        // 统计方式
        statisticsWay: '1',
        statisticsWayOptions: [
          {value: '1', label: '分日列示'},
          {value: '2', label: '多日合计'}
        ],
        // 证券代码子组件所需值
        selectParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        // 查询结果展示与否
        isShowRes: false,
        // 表格
        tableData: [],
        queryResLoad: false,
        tableOptions: [
          {field: 'sec_code', label: '证券代码', align: 'left'},
          {field: 'instrument_short_name', label: '证券名称', align: 'left'},
          {field: 'baccountid', label: '买方账户', align: 'left'},
          {field: 'b_investor_acct_name', label: '买方账户名称', align: 'left'},
          {field: 'b_pbuid', label: '买方PBU', align: 'left'},
          {field: 'b_branch_name', label: '买方营业部名称', align: 'left'},
          {field: 'b_volume', label: '买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0},
          {field: 'b_mktval', label: '买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'b_avg_price', label: '买入均价', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'b_avg_volume', label: '占总股本比重', align: 'right', formatter: this.gfnElColFormatDec3},
          {field: 'saccountid', label: '卖方账户', align: 'left'},
          {field: 's_investor_acct_name', label: '卖方账户名称', align: 'left'},
          {field: 's_pbuid', label: '卖方PBU', align: 'left'},
          {field: 's_branch_name', label: '卖方营业部名称', align: 'left'},
          {field: 'flag', label: '是否大小非', align: 'left'},
          {field: 's_volume', label: '卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0},
          {field: 's_mktval', label: '卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 's_avg_price', label: '卖出均价', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 's_avg_volume', label: '占总股本比重', align: 'right', formatter: this.gfnElColFormatDec3}
        ],
        // 查询参数
        requestParams: {}
      }
    },
    computed: {},
    watch: {},
    methods: {
      fnGetQueryRes () {
        if ($.isEmptyObject(this.dateVal)) {
          this.$message.warning('请选择日期')
          return
        }
        this.requestParams = {
          flag: this.statisticsWay,
          stockCode: this.stockCode,
          stockName: this.stockName,
          dateStart: this.dateVal[0],
          dateEnd: this.dateVal[1]
        }
        this.isShowRes = true
        this.queryResLoad = true
        this.tableData = []
        getPrecedenceProductData(this.requestParams).then(resp => {
          this.changeTableOption(this.statisticsWay)
          this.queryResLoad = false
          this.tableData = resp.bizData.metaData
        })
      },
      // 切换表格列设置
      changeTableOption (val) {
        switch (val) {
          case '1':
            if (this.tableOptions[0].field !== 'trade_date') {
              this.tableOptions.unshift({
                field: 'trade_date', label: '日期', align: 'left'
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
      fnGetSelectRes (val, label) {
        this.stockName = label.join(',')
        this.stockCode = val.join(',')
      },
      // 证券代码获取txt文件内容
      fnGetStockTypeUploadCon (res) {
        this.selectParams.query = res
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res)
      },
      saveLocation () {
        let params = this.requestParams
        params['tableColumns'] = [{
          'sheetName': '优先股产品查询',
          'fileColumns': this.tableOptions
        }]
        delete params.pageIndex
        delete params.pageRows
        params['type'] = 'product'
        params['fileType'] = 'excel'
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/regularqry/preferred-stock/v1/export', params)
      }
    },
    created () {

    },
    mounted () {
      // 获取当前交易日
      getCurTradeDate().then(resp => {
        this.dateVal = [resp, resp]
      })
    },
    beforeDestory () {

    }
  }
</script>

<style lang="less" scoped>
    .product-query {

    }
</style>
