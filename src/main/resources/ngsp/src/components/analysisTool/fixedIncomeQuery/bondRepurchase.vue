<template>
  <div class="bond-repurchase">
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
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码：">
              <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes"
                                    style="display: inline-block;" ref="selectLazyMultiple">
              </select-lazy-multiple>
              <text-upload @getTxtCon="fnGetStockTypeUploadCon" style="display: inline-block;"></text-upload>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="账户代码：">
              <el-input size="small" v-model="accountCodeVal" class="el-form-input"></el-input>
              <text-upload @getTxtCon="fnGetAccountGroupUploadCon"
                           style="display: inline-block;"></text-upload>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="业务类型：">
              <select-all-multiple :selectStockCodeOptions="operationTypeOption" @getSelectRes="getOperationSelectVal"
                                   style="width: 300px"></select-all-multiple>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
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
        债券质押式协议回购：
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
    </el-card>
  </div>
</template>

<script>
import TextUpload from '../../common/textUpload'
import SelectLazyMultiple from '../../common/SelectLazyMultiple'
import moment from 'moment'
import {getCurTradeDate, getNolinkMetaData} from '../../../service/common/commonFunc'
import {getBondRepurRes} from '../../../service/analysisTool/fixedIncomeQuery'
import SelectAllMultiple from '../../common/SelectAllMultiple'
export default {
  //  name: "bond-repurchase",
  components: {
    TextUpload, SelectLazyMultiple, SelectAllMultiple
  },
  msg: '债券质押式回购',
  data() {
    return {
      dateVal: '',
      stockCode: '',
      accountCodeVal: '',
      // 业务类型下拉框
      operationType: '',
      operationTypeOption: [],
      // 证券代码子组件所需值
      selectParams: {
        query: '',
        loading: false,
        selectStockCodeVal: [],
        selectCheckboxValue: [],
        particLevelType: 'stockCode'
      },
      // 请求入参
      requestParams: {},
      // 查询结果
      isShowRes: false,
      tableData: [],
      queryResLoad: false,
      tableOptions: [
        {
          field: 'opertype',
          label: '业务类型',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'opertype')
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
          label: '证券简称',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_short_name')
        },
        {
          field: 'tradeid',
          label: '成交编号',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'tradeid')
        },
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
          field: 'mounts',
          label: '成交数量',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'mounts'),
          formatter: this.gfnElColFormatDecThou0
        },
        {
          field: 'tradmtchprc',
          label: '成交价格',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'tradmtchprc'),
          formatter: this.gfnElColFormatDecThou3
        },
        {
          field: 'assistant_instrument_id',
          label: '回购代码',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'assistant_instrument_id')
        },
        {
          field: 'baccountid',
          label: '买方股东代码',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'baccountid')
        },
        {
          field: 'account_name_b',
          label: '买方股东名称',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'account_name_b')
        },
        {
          field: 'branch_b',
          label: '买方会员营业部名称',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'branch_b')
        },
        {
          field: 'settl_date_b',
          label: '买方结算日期',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'settl_date_b')
        },
        {
          field: 'settlmat_b',
          label: '买方结算金额',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'settlmat_b'),
          formatter: this.gfnElColFormatDecThou3
        },
        {
          field: 'saccountid',
          label: '卖方股东代码',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'saccountid')
        },
        {
          field: 'account_name_s',
          label: '卖方股东名称',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'account_name_s')
        },
        {
          field: 'branch_s',
          label: '卖方会员营业部名称',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'branch_s')
        },
        {
          field: 'settl_date_s',
          label: '卖方结算日期',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'settl_date_s')
        }
      ]
    }
  },
  mounted() {
    // 获取当前交易日
    getCurTradeDate().then(resp => {
      resp = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
      this.dateVal = [resp, resp]
    })
    getNolinkMetaData('bondPledgeProtocolBuybackType').then(resp => {
      this.operationTypeOption = resp.map(function (item) {
        return {value: item.value, label: item.text}
      })
    })
  },
  methods: {
    // 获取查询结果
    fnGetQueryRes() {
      if ($.isEmptyObject(this.dateVal)) {
        this.$message.warning('请选择日期')
        return
      }
      this.requestParams = {
        startDate: this.dateVal[0],
        endDate: this.dateVal[1],
        accountArr: this.accountCodeVal,
        operType: this.operationType,
        isinCode: this.stockCode
      }
      this.isShowRes = true
      this.queryResLoad = true
      console.log(this.requestParams);
      getBondRepurRes(this.requestParams).then(resp => {
        this.tableData = resp.bizData.metaData
        this.queryResLoad = false
      })
    },
    // 业务类型下拉val获取
    getOperationSelectVal(val, val2) {
      this.operationType = val.join(',')
    },
    // 证券代码下拉val获取
    fnGetSelectRes(val) {
      this.stockCode = val.join(',')
    },
    // 证券代码获取txt文件内容
    fnGetStockTypeUploadCon(res) {
      this.selectParams.query = res.join(',')
      this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res.join(','))
    },
    fnGetAccountGroupUploadCon(res) {
      this.accountCodeVal = res.join(',')
    },
    saveLocation() {
      let params = {...this.requestParams}
      params['tableColumns'] =[
        {
          sheetName: '固定收益平台-债券质押式协议回购',
          fileColumns: this.tableOptions
        }
      ]
      params['type'] = 'bondPledge'
      params['fileType'] = 'excel'
      this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
    }

  }
}
</script>

<style lang="less" scoped>
  .bond-repurchase {
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
      display: none !important;
      content: '' !important;
    }
  }
</style>
