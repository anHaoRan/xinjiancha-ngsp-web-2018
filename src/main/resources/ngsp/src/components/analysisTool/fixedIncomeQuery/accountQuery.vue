<template>
  <div class="account-query">
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
            <el-form-item label="查询类别：">
              <el-select
                size="small"
                v-model="queryType"
                @change="handleQueryTypeChange">
                <el-option
                  v-for="item in queryTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item :label='linkageLabel+"："'>
              <el-input size="small" v-model="accountORUniteCodeVal" class="el-form-input"/>
              <text-upload @getTxtCon="fnGetAccountGroupUploadCon"
                           style="display: inline-block;"/>
            </el-form-item>
          </el-col>
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
          <el-col :xl="7" :md="12" :sm="24">
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
    <el-card class="el-card-table" v-if="isShowMainTable">
      <div slot="header">
        {{mainTableTitle}}
        <el-button size="small" type="info" @click="saveMainTableLocation">导出</el-button>
      </div>
      <el-table
        :data="mainTableData"
        ref="mainTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        height="550"
        v-tableLoadMore="handleMainTableLoadMore"
        v-loading="queryResMainLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center" v-if="isShowRadio">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.$index" @change="fnGetRadio(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in mainTableOptions"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="130"
          :align="column.align == null ? 'center' : column.align"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
      <el-pagination
          layout="total"
          :total="mainResultNum">
      </el-pagination>
    </el-card>
    <el-card class="el-card-table" v-if="isShowSubTable">
      <div slot="header">
        一码通账户查询子表：
        <el-button size="small" type="info" @click="saveSubTableLocation">导出</el-button>
      </div>
      <el-table
        :data="subTableData"
        ref="subTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        v-loading="queryResSubLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="column in subTableOptions"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod"
          :align="column.align == null ? 'center' : column.align"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
      <el-pagination
          layout="total"
          :total="subResultNum">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import TextUpload from '../../common/textUpload'
import SelectLazyMultiple from '../../common/SelectLazyMultiple'
import moment from 'moment'
import {getCurTradeDate} from '../../../service/common/commonFunc'
import {getAccountQueryRes} from '../../../service/analysisTool/fixedIncomeQuery'

export default {
  //  name: "account-query",
  components: {
    TextUpload, SelectLazyMultiple
  },
  data() {
    return {
      dateVal: [],
      queryType: 'account',
      queryTypeOptions: [
        {value: 'account', label: '账户'},
        {value: 'uniteCode', label: '一码通'}
      ],
      // 账户或一码通联动label
      linkageLabel: '账户',
      // 账户或一码通value
      accountORUniteCodeVal: '',
      // 证券代码
      stockCode: '',
      // 证券代码子组件所需值
      selectParams: {
        query: '',
        loading: false,
        selectStockCodeVal: [],
        selectCheckboxValue: [],
        particLevelType: 'stockCode'
      },
      // 统计方式
      statisticsWay: '1',
      statisticsWayOptions: [
        {value: '1', label: '分日列示'},
        {value: '2', label: '多日合计'}
      ],
      // 查询结果（主表）
      isShowMainTable: false,
      // 表格标题
      mainTableTitle: '',
      queryResMainLoad: false,
      // 主表数据
      mainTableData: [],
      mainTableOptions: [],
      radio: '',
      isShowRadio: false,
      // 查询结果（子表）
      isShowSubTable: false,
      subTableData: [],
      subTableOptions: [],
      queryResSubLoad: false,
      mainResultNum:0,
      subResultNum:0,
      // 表格列设置
      tableColOptions: {
        account: {
          oneDay: [
            {field: 'trade_date', label: '日期', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trade_date')},
            {field: 'accountid', label: '账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountid')},
            {field: 'investor_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')},
            {field: 'operunit', label: 'PBU', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'operunit')},
            {field: 'branch_name', label: '营业部名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')},
            {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
            {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
            {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
            {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
            {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
            {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
            {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
            {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
            {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
            {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
            {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
            {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
            {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
            {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
            {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
          ],
          manyDay: [
            {field: 'accountid', label: '账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountid')},
            {field: 'investor_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')},
            {field: 'operunit', label: 'PBU', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'operunit')},
            {field: 'branch_name', label: '营业部名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')},
            {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
            {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
            {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
            {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
            {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
            {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
            {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
            {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
            {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
            {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
            {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
            {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
            {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
            {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
            {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
          ]
        },
        uniteCode: {
          main: {
            oneDay: [
              {field: 'trade_date', label: '日期', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trade_date')},
              {field: 'ymt_account_id', label: '一码通账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_account_id')},
              {field: 'ymt_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_account_name')},
              {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
              {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
              {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
              {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
              {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
              {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
              {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
              {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
              {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
              {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
              {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
              {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
              {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
              {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
              {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
            ],
            manyDay: [
              {field: 'ymt_account_id', label: '一码通账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_account_id')},
              {field: 'ymt_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_account_name')},
              {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
              {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
              {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
              {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
              {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
              {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
              {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
              {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
              {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
              {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
              {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
              {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
              {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
              {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
              {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
            ]
          },
          sub: {
            oneDay: [
              {field: 'trade_date', label: '日期', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trade_date')},
              {field: 'accountid', label: '账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountid')},
              {field: 'investor_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')},
              {field: 'operunit', label: 'PBU', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'operunit')},
              {field: 'branch_name', label: '营业部名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')},
              {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
              {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
              {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
              {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
              {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
              {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
              {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
              {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
              {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
              {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
              {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
              {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
              {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
              {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
              {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
            ],
            manyDay: [
              {field: 'accountid', label: '账户', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountid')},
              {field: 'investor_account_name', label: '账户名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')},
              {field: 'operunit', label: 'PBU', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'operunit')},
              {field: 'branch_name', label: '营业部名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')},
              {field: 'sec_code', label: '证券代码', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_code')},
              {field: 'instrument_short_name', label: '证券名称', align: 'left',sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_short_name')},
              {field: 'gd_amount_b', label: '固定收益买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_b')},
              {field: 'gd_price_b', label: '固定收益买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_b')},
              {field: 'gd_amount_s', label: '固定收益卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_amount_s')},
              {field: 'gd_price_s', label: '固定收益卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'gd_price_s')},
              {field: 'jj_trdqty_b', label: '竞价买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_b')},
              {field: 'jj_trdamt_b', label: '竞价买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_b')},
              {field: 'jj_trdqty_s', label: '竞价卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdqty_s')},
              {field: 'jj_trdamt_s', label: '竞价卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jj_trdamt_s')},
              {field: 'hj_trdqty_b', label: '合计买入数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_b')},
              {field: 'hj_trdamt_b', label: '合计买入金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_b')},
              {field: 'hj_trdqty_s', label: '合计卖出数量', align: 'right', formatter: this.gfnElColFormatDecThou0,format: '#,##0',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdqty_s')},
              {field: 'hj_trdamt_s', label: '合计卖出金额', align: 'right', formatter: this.gfnElColFormatDecThou3,format: '#,##0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hj_trdamt_s')},
              {field: 'total_shares', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDec3,format: '0.000',sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')}
            ]
          }
        }
      },
      // 主表分页
      tableIndex: 1,
      tableRows: 20,
      isLoadMore: true,

      // 主表请求参数
      mainRequestParams: {},
      // 子表请求参数
      subRequestParams: {}
    }
  },
  mounted() {
    // 获取当前交易日
    getCurTradeDate().then(resp => {
      resp = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
      this.dateVal = [resp, resp]
    })
  },
  methods: {
    // 获取查询结果
    fnGetQueryRes() {
      if ($.isEmptyObject(this.dateVal)) {
        this.$message.warning('请选择日期')
        return
      }
      this.tableIndex = 1
      this.radio = ''
      this.isShowMainTable = true
      this.isShowSubTable = false
      this.fnChangeQueryTypeMethods('账户查询：', '一码通账户查询母表：', 'mainTableTitle')
      this.getRes()
    },
    getRes() {
      this.mainRequestParams = {
        startDate: this.dateVal[0],
        endDate: this.dateVal[1],
        acctType: this.queryType,
        creditType: this.statisticsWay,
        isinCode: this.stockCode,
        accountArr: this.accountORUniteCodeVal,
        pageIndex: this.tableIndex,
        pageRows: this.tableRows
      }
      this.queryResMainLoad = true
      getAccountQueryRes(this.mainRequestParams).then(resp => {
        let res = resp.bizData.metaData
        // 如果当前表格为第一页，则将返回结果直接赋值给表格data
        if (this.tableIndex === 1) {
          this.mainTableData = res
          this.isLoadMore = true
        } else {
          // 如果非表格第一页，将返回结果拼接到表格数据后面
          this.mainTableData = this.mainTableData.concat(res)
          // 如果表格data数组长度与结果总条数相同，则说明数据已加载完毕，表格再次下拉到底不触发请求
          if (this.mainTableData.length === resp.bizData.totalRows) {
            this.isLoadMore = false
          }
        }
        this.mainResultNum = resp.bizData.totalRows-0
        this.fnMethodsChange(this.queryType, this.statisticsWay, 'mainTable')
        this.queryResMainLoad = false
      })
    },
    // 获取子表值
    fnGetRadio(row) {
      this.isShowSubTable = true
      this.queryResSubLoad = true
      this.subRequestParams = {
        startDate: this.dateVal[0],
        endDate: this.dateVal[1],
        acctType: 'account',
        creditType: this.statisticsWay,
        isinCode: row.sec_code,
        accountArr: this.accountORUniteCodeVal
      }
      this.subRequestParams['ymtAccountId'] = row.ymt_account_id
      getAccountQueryRes(this.subRequestParams).then(resp => {
        this.fnMethodsChange(this.queryType, this.statisticsWay, 'subTable')
        this.subTableData = resp.bizData.metaData
        this.subResultNum = resp.bizData.totalRows
        this.queryResSubLoad = false
      })
      // 接口返回数据后选择相对应的列展示结果
    },

    // 查询类别change事件
    handleQueryTypeChange() {
      this.accountORUniteCodeVal = ''
      this.fnChangeQueryTypeMethods('账户', '一码通', 'linkageLabel')
      //  初始化表格当前页
      this.tableIndex = 1
    },
    // 统计方式change事件
    handleStatisticWayChange() {
      this.tableIndex = 1
    },
    // 封装的查询类别判断
    fnChangeQueryTypeMethods(account, uniteCode, value) {
      switch (this.queryType) {
        case 'account':
          this.fnJudgement(account, value)
          break
        case 'uniteCode':
          this.fnJudgement(uniteCode, value)
          break
      }
    },
    // 判断入参
    fnJudgement(type, value) {
      if (value === 'linkageLabel') {
        this.linkageLabel = type
      } else if (value === 'mainTableTitle') {
        this.mainTableTitle = type
      }
    },
    // 主表表格懒加载
    handleMainTableLoadMore() {
      if (this.isLoadMore) {
        this.tableIndex += 1
        this.getRes()
      }
    },
    // 表格列设置切换
    fnMethodsChange(queryTypeVal, statisticsWayVal, tableType) {
      switch (queryTypeVal) {
        case 'account':
          this.isShowRadio = false
          switch (statisticsWayVal) {
            case '1':
              this.mainTableOptions = this.tableColOptions.account.oneDay
              break
            case '2':
              this.mainTableOptions = this.tableColOptions.account.manyDay
              break
          }

          break
        case 'uniteCode':
          this.isShowRadio = true
          switch (statisticsWayVal) {
            case '1':
              switch (tableType) {
                case 'mainTable':
                  this.mainTableOptions = this.tableColOptions.uniteCode.main.oneDay

                  break
                case 'subTable':
                  this.subTableOptions = this.tableColOptions.uniteCode.sub.oneDay

                  break
              }
              break
            case '2':
              switch (tableType) {
                case 'mainTable':
                  this.mainTableOptions = this.tableColOptions.uniteCode.main.manyDay

                  break
                case 'subTable':
                  this.subTableOptions = this.tableColOptions.uniteCode.sub.manyDay

                  break
              }
              break
          }
          break
      }
    },

    // 获取文件上传内容
    fnGetAccountGroupUploadCon(res) {
      let uploadNum = res.length
      if (uploadNum > 1000) {
        this.$message.error(`最多可指定1000个账户,您上传的文件包含${uploadNum}个账户`)
        return
      }
      this.accountORUniteCodeVal = res.join(',')
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
    // 主表导出
    saveMainTableLocation() {
      let params = {...this.mainRequestParams}
      params['tableColumns'] = [
        {
          sheetName: '固定收益平台-账户查询母表',
          fileColumns: this.mainTableOptions
        }
      ]
      params['type'] = 'account'
      params['fileType'] = 'excel'
      delete params.pageIndex
      delete params.pageRows
      this.$message.info('正在导出，请稍等~')
      this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
    },
    // 子表导出
    saveSubTableLocation() {
      let params = {...this.subRequestParams}
      params['tableColumns'] = [
        {
          sheetName: '固定收益平台-账户查询子表',
          fileColumns: this.subTableOptions
        }
      ]
      params['type'] = 'account'
      params['fileType'] = 'excel'
      this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
    }
  }
}
</script>

<style lang="less">
  .account-query {
    .radio {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
