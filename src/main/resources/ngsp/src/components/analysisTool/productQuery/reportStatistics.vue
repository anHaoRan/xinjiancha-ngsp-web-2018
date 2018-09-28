<template>
  <!--申报统计-->
  <div class="report-statistics">
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button
            type="text"
            size="small"
            style="float:right;"
            @click="resetAll">清空
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="reportStatisticsConditionQueryRes">条件查询
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="reportStatisticsQueryRes">查询
        </el-button>
      </div>
      <el-form
          :inline="true"
          label-width="150px"
          ref="reportStatisticsForm"
          :model="reportStatisticsForm"
          :rules="reportStatisticsRules">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="证券代码：" required>
            <el-input
                disabled
                size="small"
                style="width:260px"
                v-model="stockCode"
                class="el-form-input"
                placeholder="请输入证券代码"
                @change="resetPagenation">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="订单类型：">
            <order-or-credit-type
                :type="'order'"
                @getOrderOrCreditTypeVal="orderChange"
                ref="order"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="信用类型：">
            <order-or-credit-type
                :type="'credit'"
                @getOrderOrCreditTypeVal="creditChange"
                ref="credit"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="申报价格：">
            <el-input
                size="small"
                v-model.number="reportStatisticsForm.priceStart"
                @change="checkPriceStart"
                class="el-form-input"
                style="width:115px"/>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="reportStatisticsForm.priceEnd"
                @change="checkPriceEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="申报数量：">
            <el-input
                size="small"
                v-model.number="reportStatisticsForm.countStart"
                @change="checkCountStart"
                class="el-form-input"
                style="width:115px"/>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="reportStatisticsForm.countEnd"
                @change="checkCountEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>

        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="排序类型：" required>
            <el-select size="small" v-model="reportStatisticsForm.sortType" style="width: 260px;">
              <el-option
                  v-for="item in sortTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="参与者层级：" required>
            <participant-level-val ref="participantLeavel" @getParticipantLevelVal="participantLevelChange"/>
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="24" :sm="24">
          <el-form-item label="参与者代码：" prop="invacctnos">
            <div
                v-if="reportStatisticsForm.participantLevelVal==='account'||reportStatisticsForm.participantLevelVal==='uniteCode'">
              <el-input
                  v-model="reportStatisticsForm.invacctnos"
                  placeholder="请输入参与者代码"
                  @change="handleChangeInvacctnos"
                  class="el-form-input"
                  style="width: 200px"
                  size="small">
              </el-input>
              <text-upload @getTxtCon="getTxtData"
                           :uploadOption="uploadOption"
                           style="display: inline;"/>
              <down-template-file :fileType="reportStatisticsForm.participantLevelVal"
                                  v-if="reportStatisticsForm.participantLevelVal==='account'"
                                  style="display: inline-block;"/>
            </div>
            <div v-else>
              <select-lazy-multiple :selectParams="selectParams" @getSelectRes="getSelectRes"></select-lazy-multiple>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24">
          <el-form-item label="前" prop="topN" :inline-message="true">
            <el-input
                size="small"
                v-model.number="reportStatisticsForm.topN"
                class="top-number"
                @change="checkTopN">
            </el-input>
            名
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="24" :sm="24" v-if="reportStatisticsForm.participantLevelVal==='account'">
          <el-form-item label="营业部代码：">
            <select-lazy-multiple
                ref="salepartCode"
                :selectParams="salePartParams"
                @getSelectRes="getSalePartRes"/>
          </el-form-item>
        </el-col>

      </el-form>
    </el-card>
    <el-card v-if="queryResult">
      <div slot="header">
        <span>查询结果</span>
        <el-button size="small" type="info" @click="saveMainTableFile">导出</el-button>
      </div>
      <div v-if="UniteMain" class="queryTitle">一码通母表</div>
      <el-table
          :data="mainTableData"
          border
          v-loading="mainQueryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center" v-if="UniteMain">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getRadio(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
            v-for="item in mainTableOption"
            :key="item.field"
            :prop="item.field"
            :label="item.label"
            :sortable="item.sortable == null ? false : item.sortable"
            :sort-method="item.sortMethod"
            :align="item.align"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNum">
        </el-pagination>
      </el-col>
      <div v-if="showSubTable">
        <div :span="24" style="margin-top: 30px;" class="queryTitle">
          一码通子表
          <el-button size="small" type="info" @click="saveSubTableFile" style="float: right;margin-right: 20px;">导出
          </el-button>
        </div>
        <el-table
            :data="subTableData"
            border
            v-loading="subQueryResLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
              v-for="item in subTableOption"
              :key="item.field"
              :prop="item.field"
              :label="item.label"
              :sortable="item.sortable == null ? false : item.sortable"
              :sort-method="item.sortMethod"
              :align="item.align"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { transactionSelect, linkNo, getReportStatistics, getConditionReportStatistics } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    components: {},
    mixins: [MinxinVue],
    msg: '申报统计',
    data () {
      return {
        stockCode: '',
        reportStatisticsForm: {
          participantLevelVal: 'account',
          selectStockCodeVal: [],
          priceStart: '',
          priceEnd: '',
          countStart: '',
          countEnd: '',
          orderVal: [],
          creditVal: [],
          invacctnos: '',
          storeCode: [],
          sortType: 'B',
          topN: '50'
        },
        reportStatisticsRules: {
          topN: [this.checkTopNNum(1000), {required: true,trigger: 'blur',message:'前N名不能为空'}]
        },
        sortTypeOptions: [
          {
            value: 'B',
            label: '买入'
          },
          {
            value: 'S',
            label: '卖出'
          }
        ],
        queryResult: false,
        uploadOption: {name: '上传', size: 'small'},
        selectParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        },
        salePartParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'salePart'
        },
        conditionQuery: {
          account: [
            {field: 'invacctno', label: '参与者代码', align: 'left', width: '120', sortable: true},
            {field: 'invacctname', label: '参与者名称', align: 'left', width: '120', sortable: true},
            {field: 'pbuoscod', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'b_ordr_qty', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_trd_qty', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_trd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_untrd_qty', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_untrd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_cancle_qty', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancle_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_qty_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'b_cancle_qty_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancle_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 's_ordr_qty', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_trd_qty', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_trd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_untrd_qty', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_untrd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_cancle_qty', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancle_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_qty_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 's_cancle_qty_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancle_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'b_ordr_count', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_cancle_count', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_cancle_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_count', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_cancle_count', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_cancle_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_avgprice', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_avgprice'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 's_ordr_avgprice', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_avgprice'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ],
          uniteCode: [
            {field: 'invacctno', label: '一码通账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname', label: '一码通名称', align: 'left', width: '120', sortable: true},
            {field: 'b_ordr_qty', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_trd_qty', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_trd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_untrd_qty', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_untrd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_cancle_qty', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancle_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_qty_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'b_cancle_qty_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancle_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 's_ordr_qty', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_trd_qty', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_trd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_untrd_qty', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_untrd_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_cancle_qty', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancle_qty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_qty_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 's_cancle_qty_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancle_qty_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'b_ordr_count', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_cancle_count', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_cancle_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_count', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 's_ordr_cancle_count', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_cancle_count'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'b_ordr_avgprice', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_avgprice'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 's_ordr_avgprice', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_ordr_avgprice'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ],
          subTable: [
            {field: 'invacctno', label: '买方账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname', label: '账户名称', align: 'left', width: '120', sortable: true},
            {field: 'pbu_id', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_b', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_b', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_b', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_b_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_b_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_b', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_b', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_b', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 'ordqty_s', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_s', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_s', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_s', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_s_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_s_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_s', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_s')},
            {field: 'delnum_s', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_s')},
            {field: 'avg_price_s', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ]
        },
        quickQuery: {
          account: [
            {field: 'invacctno_b', label: '买方账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_b', label: '账户名称', align: 'left', width: '120', sortable: true},
            {field: 'pbu_id_b', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname_b', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_b', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'trdqty_b', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'no_trdqty_b', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'delqty_b', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'ordqty_b_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_b_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_b', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'delnum_b', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'avg_price_b', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 'invacctno_s', label: '卖方账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_s', label: '账户名称', align: 'left', width: '120', sortable: true},
            {field: 'pbu_id_s', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname_s', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_s', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'trdqty_s', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'no_trdqty_s', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'delqty_s', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'ordqty_s_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_s_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_s', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'delnum_s', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
            {field: 'avg_price_s', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ],
          salePartAndOther: [
            {field: 'invacctno_b', label: '买方参与者', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_b', label: '参与者名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_b', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_b', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_b', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_b', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_b_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_b_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_b', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_b', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_b', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 'invacctno_s', label: '卖方参与者', align: 'right', width: '120', sortable: true},
            {field: 'invacctname_s', label: '参与者名称', align: 'right', width: '120', sortable: true},
            {field: 'ordqty_s', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_s', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_s', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_s', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_s_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_s_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_s', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_s', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_s', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ],
          uniteCode: [
            {field: 'invacctno_b', label: '买方一码通账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_b', label: '买方一码通名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_b', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_b', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_b', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_b', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_b_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_b_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_b', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_b', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_b', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 'invacctno_s', label: '卖方一码通账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_s', label: '卖方一码通名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_s', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_s', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_s', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_s', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_s_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_s_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_s', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_s', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_s', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ],
          subTable: [
            {field: 'invacctno_b', label: '买方账户', align: 'left', width: '120', sortable: true},
            {field: 'invacctname_b', label: '账户名称', align: 'left', width: '120', sortable: true},
            {field: 'pbu_id_b', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname_b', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_b', label: '申报买入数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_b', label: '买入成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_b', label: '买入未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_b', label: '买入撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_b_rio', label: '申报买入数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_b_rio', label: '买入撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_b_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_b', label: '申报买入次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delnum_b', label: '买入撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_b'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'avg_price_b', label: '买方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
            {field: 'invacctno_s', label: '卖方账户', align: 'right', width: '120', sortable: true},
            {field: 'invacctname_s', label: '账户名称', align: 'left', width: '120', sortable: true},
            {field: 'pbu_id_s', label: 'PBU代码', align: 'left', width: '120', sortable: true},
            {field: 'brnname_s', label: '营业部名称', align: 'left', width: '120', sortable: true},
            {field: 'ordqty_s', label: '申报卖出数量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'trdqty_s', label: '卖出成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'no_trdqty_s', label: '卖出未成交量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'no_trdqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'delqty_s', label: '卖出撤单量', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s'), formatter: this.gfnElColFormatDec3, format: '#,##0'},
            {field: 'ordqty_s_rio', label: '申报卖出数量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'delqty_s_rio', label: '卖出撤单量占市场比例', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delqty_s_rio'), formatter: this.gfnElColFormatDec3, format: '0.000'},
            {field: 'ordnum_s', label: '申报卖出次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordnum_s')},
            {field: 'delnum_s', label: '卖出撤单次数', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'delnum_s')},
            {field: 'avg_price_s', label: '卖方申报均价', align: 'right', width: '120', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'avg_price_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
          ]
        },
        mainTableData: [],
        mainTableOption: [],
        mainQueryResLoad: false,
        showSubTable: false,
        subTableData: [],
        subTableOption: [],
        subQueryResLoad: false,
        currentPage: 1,
        pageSizes: [1000],
        pageSize: 1000,
        resultNum: 0,
        currentRow: null,
        isCondition: false,
        requestParams: {},
        requestSubParams: {},
        UniteMain: false,
        radio: '',
      }
    },
    props: ['commonData'],
    watch: {
      'selectParams.particLevelType': function () {
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
      }
    },
    methods: {
      resetPagenation () {
        this.currentPage = 1
        this.pageSize = 1000
      },
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      // 获取上传结果
      getTxtData (TxtData) {
        this.reportStatisticsForm.invacctnos = TxtData.join(',')
      },
      handleChangeInvacctnos (val) {
        this.fnValidateAccountCode(this.reportStatisticsForm.participantLevelVal, val, '参代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。')
      },
      // 清空
      resetAll () {
        this.reportStatisticsForm.invacctnos = ''
        this.reportStatisticsForm.selectStockCodeVal = []
        this.reportStatisticsForm.priceStart = ''
        this.reportStatisticsForm.priceEnd = ''
        this.reportStatisticsForm.countStart = ''
        this.reportStatisticsForm.countEnd = ''
        this.reportStatisticsForm.participantLevelVal = 'account'
        this.reportStatisticsForm.sortType = 'B'
        this.reportStatisticsForm.topN = '50'
        this.reportStatisticsForm.storeCode = []
        this.clearAll()
        if (this.reportStatisticsForm.participantLevelVal === 'account') {
          this.$refs.salepartCode.resetAll()
        }

      },
      // 改变条件查询表格列
      changeConditionQueryTableColumns () {
        this.UniteMain = false
        switch (this.reportStatisticsForm.participantLevelVal) {
          case 'account':
            this.mainTableOption = this.conditionQuery.account
            break
          case 'uniteCode':
            this.UniteMain = true
            this.mainTableOption = this.conditionQuery.uniteCode
            this.subTableOption = this.conditionQuery.subTable
            break
          case 'salePart':
          case 'member':
          case 'pbu':
            let uniteCodeOption = this.conditionQuery.account.concat()
            uniteCodeOption.splice(2, 2)
            this.mainTableOption = uniteCodeOption
            this.requestParams.invacctno = this.reportStatisticsForm.selectStockCodeVal.join(',')
            break
        }
      },
      // 改变快速查询
      changeQuickQueryTableColunms () {
        this.UniteMain = false
        switch (this.reportStatisticsForm.participantLevelVal) {
          case 'account':
            this.mainTableOption = this.quickQuery.account
            break
          case 'uniteCode':
            this.UniteMain = true
            this.mainTableOption = this.quickQuery.uniteCode
            this.subTableOption = this.quickQuery.subTable
            break
          case 'salePart':
          case 'member':
          case 'pbu':
            this.mainTableOption = this.quickQuery.salePartAndOther
            break
        }
      },
      // 快速查询
      reportStatisticsQueryRes () {
        this.queryResult = true
        this.mainQueryResLoad = true
        this.isCondition = false
        this.showSubTable = false
        this.requestParams = {
          dateStart: this.commonData.dateTimeStart.split(' ')[0],
          dateEnd: this.commonData.dateTimeEnd.split(' ')[0],
          timeStart: this.commonData.dateTimeStart.split(' ')[1],
          timeEnd: this.commonData.dateTimeEnd.split(' ')[1],
          securityId: this.commonData.stockCode.split(' ')[0],
          topN: this.reportStatisticsForm.topN,
          actorKind: this.reportStatisticsForm.participantLevelVal,
          tableLevel: 'maintable'
        }
        this.radio = ''
        this.changeQuickQueryTableColunms()
        getConditionReportStatistics(this.requestParams).then((resp) => {
          this.mainQueryResLoad = false
          this.mainTableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows - 0
        })
      },
      // 条件查询
      reportStatisticsConditionQueryRes () {
        if (this.reportStatisticsForm.invacctnos && !this.gfnStockCodeReg(this.reportStatisticsForm.invacctnos) && this.reportStatisticsForm.participantLevelVal === 'account') {
          this.$message.warning('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
          return
        }
        this.showSubTable = false
        this.queryResult = true
        this.mainQueryResLoad = true
        this.isCondition = true
        this.requestParams = {
          dateStart: this.commonData.dateTimeStart.split(' ')[0],
          dateEnd: this.commonData.dateTimeEnd.split(' ')[0],
          timeStart: this.commonData.dateTimeStart.split(' ')[1],
          timeEnd: this.commonData.dateTimeEnd.split(' ')[1],
          securityId: this.commonData.stockCode.split(' ')[0],
          topN: this.reportStatisticsForm.topN,
          sortType: this.reportStatisticsForm.sortType,
          actorKind: this.reportStatisticsForm.participantLevelVal,
          tableLevel: 'maintable',
          ordrtypcod: this.reportStatisticsForm.orderVal.join(','),
          credittag: this.reportStatisticsForm.creditVal.join(','),
          invacctno: this.reportStatisticsForm.invacctnos,
          brnid: this.reportStatisticsForm.storeCode.join(','),
          ordrqtyBegin: this.reportStatisticsForm.countStart,
          ordrqtyEnd: this.reportStatisticsForm.countEnd,
          ordrexeprcBegin: this.reportStatisticsForm.priceStart,
          ordrexeprcEnd: this.reportStatisticsForm.priceEnd
        }
        this.radio = ''
        this.changeConditionQueryTableColumns()
        getReportStatistics(this.requestParams).then((resp) => {
          this.mainQueryResLoad = false
          this.mainTableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows - 0
        })
      },

      participantLevelSelectOptions () {
        transactionSelect('particiLevel', 'statis').then((resp) => {
          this.participantLevelOptions = resp
        })
      },
      getSelectRes (checkBoxValue) {
        this.reportStatisticsForm.selectStockCodeVal = checkBoxValue
      },
      getSalePartRes (checkBoxValue) {
        this.reportStatisticsForm.storeCode = checkBoxValue
      },

      participantLevelChange (val) {
        this.selectParams.particLevelType = val
        this.reportStatisticsForm.participantLevelVal = val
        this.reportStatisticsForm.invacctnos = ''
      },
      // 订单类型
      orderChange (val) {
        this.reportStatisticsForm.orderVal = val
      },
      // 信用类型
      creditChange (val) {
        this.reportStatisticsForm.creditVal = val
      },
      // 价格输入验证
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.reportStatisticsForm.priceEnd, false, true, '申报价格格式错误，请重新输入')
        this.reportStatisticsForm.priceStart = startNum
        this.reportStatisticsForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.reportStatisticsForm.priceStart, value, false, true, '申报价格格式错误，请重新输入')
        this.reportStatisticsForm.priceStart = startNum
        this.reportStatisticsForm.priceEnd = endNum
      },
      checkCountStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.reportStatisticsForm.countEnd, true, false, '申报数量格式错误，请重新输入')
        this.reportStatisticsForm.countStart = startNum
        this.reportStatisticsForm.countEnd = endNum
      },
      checkCountEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.reportStatisticsForm.countStart, value, true, false, '申报数量格式错误，请重新输入')
        this.reportStatisticsForm.countStart = startNum
        this.reportStatisticsForm.countEnd = endNum
      },
      // 前N名输入验证
      checkTopN () {

      },
      selectStockCodeChange () {

      },
      handleSizeChange (size) {
        this.pageSize = size
        this.currentPage = 1
        this.stockOrderQueryRes()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
        this.stockOrderQueryRes()
      },
      getRadio (val) {
        this.showSubTable = true
        this.subQueryResLoad = true
        this.requestSubParams = this.requestParams
        this.requestSubParams.tableLevel = 'subtable'
        if (this.isCondition) {
          this.requestSubParams['maintableId'] = val.invacctno
        } else {
          this.requestSubParams['maintableIdB'] = val.invacctno_b
          this.requestSubParams['maintableIdS'] = val.invacctno_s
        }
        getConditionReportStatistics(this.requestSubParams).then((resp) => {
          this.subQueryResLoad = false
          this.subTableData = resp.bizData.metaData
        })
      },
      saveMainTableFile () {
        let params = this.requestParams
        params['tableColumns'] = [
          {
            sheetName: '产品查询-申报统计',
            fileColumns: this.mainTableOption
          }
        ]
        if (this.isCondition) {
          params['type'] = 'orderTotal'
        } else {
          params['type'] = 'orderTotalQuick'
        }
        params['fileType'] = 'excel'
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      },
      saveSubTableFile () {
        let params = this.requestSubParams
        params['tableColumns'] = [
          {
            sheetName: '产品查询-申报统计一码通子表',
            fileColumns: this.subTableOption
          }
        ]
        if (this.isCondition) {
          params['type'] = 'orderTotal'
        } else {
          params['type'] = 'orderTotalQuick'
        }
        params['fileType'] = 'excel'
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      }
    },
    mounted () {}
  }
</script>

<style lang='less'>
  .report-statistics {
    .el-radio__label {
      display: none;
    }
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .el-card__body {
      margin-top: 20px;
    }
    .el-select {
      width: 100%;
    }
    .el-table {
      margin-bottom: 20px;
      &:nth-child(2) {
        margin-top: 20px;
      }
    }

    .top-number {
      padding: 2px;
      width: 60px;
      padding-top: 0;
      position: relative;
      right: 7px;
    }
  }
</style>
