<template>
  <!--成交统计-->
  <div class="transaction-statistics">
    <!--查询条件-->
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
            type="info"
            size="small"
            style="float:right;"
            @click="reset">清空
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right;"
            @click="getConditionQueyResult"
            v-if="changeQueryCondition.singleDay">条件查询
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="getQuickQueyResult">查询
        </el-button>
      </div>

      <el-form
          :inline="true"
          label-width="150px"
          ref="transactionStatisticsForm"
          :model="transactionStatisticsForm"
          :rules="transactionStatisticsRules">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="证券代码：" required>
            <el-input
                v-model="stockCode"
                placeholder="请输入证券代码"
                size="small"
                disabled
                style="width:260px"
                class="el-form-input"
                @change="resetPagenation">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="平台类型：" required>
            <el-select
                v-model="transactionStatisticsForm.stationVal"
                size="small"
                class="stationSelect"
                @change="stationChange">
              <el-option
                  v-for="item in stationOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24"
                v-if="(transactionStatisticsForm.stationVal==='1'||transactionStatisticsForm.stationVal==='2')&&changeQueryCondition.singleDay">
          <el-form-item label="交易类型：" required>
            <el-select
                v-model="transactionStatisticsForm.detailVal"
                size="small">
              <el-option
                  v-for="item in detailOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="changeQueryCondition.singleDay">
          <el-form-item label="订单类型：">
            <order-or-credit-type
                :type="'order'"
                :stationVal="transactionStatisticsForm.stationVal"
                @getOrderOrCreditTypeVal="orderChange"
                ref="order"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="changeQueryCondition.singleDay">
          <el-form-item label="信用类型：">
            <order-or-credit-type
                :type="'credit'"
                :stationVal="transactionStatisticsForm.stationVal"
                @getOrderOrCreditTypeVal="creditChange"
                ref="credit"/>
          </el-form-item>
        </el-col>

        <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="changeQueryCondition.singleDay">
          <el-form-item label="排序类型：" required>
            <el-select v-model="transactionStatisticsForm.sortVal" size="small">
              <el-option
                  v-for="item in sortOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="参与者层级：" required>
            <participant-level-val ref="participantLeavel" :hasPbu="false" @getParticipantLevelVal="participantLevelChange"/>
          </el-form-item>
        </el-col>

        <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="changeQueryCondition.singleDay">
          <el-form-item label="成交价格：">
            <el-input
                size="small"
                v-model.number="transactionStatisticsForm.priceStart"
                @change="checkPriceStart"
                class="el-form-input"
                style="width:115px">
            </el-input>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="transactionStatisticsForm.priceEnd"
                @change="checkPriceEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>

        <el-col :xl="6" :lg="6" :md="12" :sm="24">
          <el-form-item label="前" prop="rank" :inline-message="true">
            <el-input
                size="small"
                v-model.number="transactionStatisticsForm.rank"
                class="top-number"
                @change="checkTopN">
            </el-input>
            名
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="24" :sm="24" v-if="changeQueryCondition.singleDay">
          <el-form-item label="参与者代码：" prop="invacctnos">
            <div
                v-if="transactionStatisticsForm.participantLevelVal==='account'||transactionStatisticsForm.participantLevelVal==='uniteCode'">
              <el-input
                  v-model="transactionStatisticsForm.invacctnos"
                  placeholder="请输入参与者代码"
                  @change="handleChangeInvacctnos"
                  class="el-form-input"
                  style="width: 200px"
                  size="small">
              </el-input>
              <text-upload
                  @getTxtCon="getTxtData"
                  :uploadOption="uploadOption"
                  style="display: inline;"/>
              <down-template-file
                  :fileType="transactionStatisticsForm.participantLevelVal"
                  v-if="transactionStatisticsForm.participantLevelVal==='account'"
                  style="display: inline-block;"/>
            </div>
            <div v-else>
              <select-lazy-multiple :selectParams="selectParams" @getSelectRes="getSelectRes"></select-lazy-multiple>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="24" :sm="24" v-if="changeQueryCondition.singleDay&&transactionStatisticsForm.participantLevelVal==='account'">
          <el-form-item label="营业部代码：">
            <select-lazy-multiple
                ref="salepartCode"
                :selectParams="salePartParams"
                @getSelectRes="getSalePartRes"/>
          </el-form-item>
        </el-col>

        <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="!changeQueryCondition.singleDay">
          <el-form-item label="统计方式：" required>
            <el-select
                v-model="transactionStatisticsForm.statisticWayVal"
                size="small"
                @change="statisticWayChange">
              <el-option
                  v-for="item in statisticWayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


      </el-form>


    </el-card>
    <!--查询结果-->
    <el-card v-if="queryResult" class="el-card-table">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button size="small" type="info" @click="saveMainTableFile">导出</el-button>
      </div>
      <div v-if="exceptMulUpDown">
        <!--快速查询结果-->
        <div v-if="UniteMain" class="queryTitle">一码通母表</div>
        <el-table
            v-if="QuickQuery"
            :data="tableData"
            border
            v-loading="quickQueryResLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column width="55" align="center" v-if="UniteMain">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getRadio"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
              v-for="item in QuickData"
              :key="item.field"
              :prop="item.field"
              :label="item.label"
              :sortable="item.sortable == null ? false : item.sortable"
              :sort-method="item.sortMethod"
              :align="item.align"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!--条件查询结果-->
        <!--包含单日和双日主表-->
        <el-table
            v-if="singleAndConditionQuery"
            :data="tableData"
            border
            v-loading="conditionQueryResLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column width="55" align="center" v-if="UniteMain">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getRadio"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
              v-for="item in singleDayConditionData"
              :key="item.field"
              :prop="item.field"
              :label="item.label"
              :sortable="item.sortable == null ? false : item.sortable"
              :sort-method="item.sortMethod"
              :align="item.align"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!--分页-->
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
        <!--一码通子表-->
        <!--包含单日和双日子表-->
        <div v-if="SubTable" class="queryTitle" style="margin-top: 60px;">一码通子表
          <el-button size="small" type="info" @click="saveSubTableFile" style="float: right;margin-right: 20px;">导出
          </el-button>
        </div>
        <el-table
            v-if="SubTable"
            :data="SubTableColumnData"
            border
            v-loading="conditionQuerySubResLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
              v-for="item in SubTableData"
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
      <!--多日统计-->
      <!--多日增减条件查询结果表格-->
      <div v-if="mulUpDown">
        <div class="queryTitle">增仓统计{{Main}}:</div>
        <el-table
            :data="upTableData"
            border
            v-loading="MainTableLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column width="55" align="center" v-if="mulUpDownUniteMain">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getMulUpRadio"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
              v-for="item in upTableOptions"
              :key="item.field"
              :prop="item.field"
              :label="item.label"
              :sortable="item.sortable == null ? false : item.sortable"
              :sort-method="item.sortMethod"
              :align="item.align"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <div class="queryTitle" style="margin-top: 20px;">减仓统计{{Main}}:</div>
        <el-table
            :data="downTableData"
            border
            v-loading="MainTableLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column width="55" align="center" v-if="mulUpDownUniteMain">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index+',1'" @change="getMulDownRadio"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
              v-for="item in downTableOptions"
              :key="item.field"
              :prop="item.field"
              :label="item.label"
              :sortable="item.sortable == null ? false : item.sortable"
              :sort-method="item.sortMethod"
              :align="item.align"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <div v-if="mulUpDownSubTable">

          <div class="queryTitle" style="margin-top: 40px;">增仓统计子表:
            <el-button size="small" type="info" @click="saveSubTableFile" style="margin-right: 20px;float: right;">
              导出
            </el-button>
          </div>
          <el-table
              :data="subUpTableData"
              border
              v-loading="subTableLoad"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)">
            <el-table-column
                v-for="item in subUpTableOptions"
                :key="item.field"
                :prop="item.field"
                :label="item.label"
                :sortable="item.sortable == null ? false : item.sortable"
                :sort-method="item.sortMethod"
                :align="item.align"
                show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="queryTitle" style="margin-top: 20px;">减仓统计子表:</div>
          <el-table
              :data="subDownTableData"
              border
              v-loading="subTableLoad"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)">
            <el-table-column
                v-for="item in subDownTableOptions"
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

      </div>

    </el-card>
  </div>
</template>

<script>
  import {
    linkNo,
    transactionSelect,
    detailSelect,
    getTransactionQuick,
    getTransactionCondition,
    getTransactionMultiDay
  } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    components: {
    },
    mixins: [MinxinVue],
    data () {

      return {
        stockCode: '',
        //  查询表单参数
        transactionStatisticsForm: {
          rank: '50',
          participantLevelVal: 'account',
          stationVal: '1',
          statisticWayVal: '1',
          // isShow: true,
          uploadStockCode: true,
          selectStockCode: false,
          isStoreCodeShow: true,
          detailVal: 'X',
          invacctnos: '',
          sortVal: 'buy',
          orderVal: [],
          creditVal: [],
          priceStart: '',
          priceEnd: '',
          storeCode: []
        },
        // 表单验证
        transactionStatisticsRules: {
          rank:[this.checkTopNNum(300), {required: true,trigger: 'blur',message:'前N名不能为空'}]
        },
        // 买or卖
        sortOptions: [
          {
            value: 'buy',
            label: '买入'
          },
          {
            value: 'sale',
            label: '卖出'
          }
        ],
        // 平台类型下拉内容
        stationOptions: [

        ],
        //  交易类型
        detailOptions: [],
        // 统计方式下拉内容
        statisticWayOptions: [
          {
            value: '1',
            label: '按日统计'
          },
          {
            value: '2',
            label: '多日合计'
          },
          {
            value: '3',
            label: '多日增减'
          }
        ],
        // 除多日增减外的表格显示
        exceptMulUpDown: false,
        // 多日增减的表格显示
        mulUpDown: false,
        // 多日增减一码通母表radio显示
        mulUniteMain: false,
        // 多日增减一码通子表组展示
        mulUpDownSubTable: false,
        // 多日增仓表
        upTableData: [],
        upTableOptions: [],
        MainTableLoad: false,
        // 多日减仓表
        downTableData: [],
        downTableOptions: [],
        // 多日增仓子表
        subUpTableData: [],
        subUpTableOptions: [],
        subTableLoad: false,
        // 多日减仓子表
        subDownTableData: [],
        subDownTableOptions: [],
        mulUpDownUniteMain: false,
        Main: '',
        // 查询结果表格数据
        tableData: [],
        // 子表查询结果数据
        SubTableData: [],
        conditionQuerySubResLoad: false,
        // 单选列显示隐藏
        UniteMain: false,
        // 单选
        radio: '',
        // 单日快速查询
        QuickQuery: false,
        QuickData: [],
        quickQueryResLoad: false,
        // 单日条件查询
        singleAndConditionQuery: false,
        singleDayConditionData: [],
        conditionQueryResLoad: false,
        // 一码通子表
        SubTable: false,
        SubTableColumnData: [],

        //  // 账号
        //  account: true,
        //  // 营业部
        //  salePart: false,
        //  //  券商
        //  member: false,
        //  // 一码通母表
        //  uniteCode: false,

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
        // 获取参与者层级
        ParticipantLevel: '',
        //  请求参数
        requestParams: {},
        requestSubParams: {},
        queryResult: false,
        currentPage: 1,
        pageSizes: [1000],
        pageSize: 1000,
        resultNum: 0
      }
    },
    props: ['commonData', 'changeQueryCondition'],
    watch: {
      'selectParams.particLevelType': function () {
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
      },
    },
    methods: {
      resetPagenation () {
        this.currentPage = 1
        this.pageSize = 1000
      },
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      // 清空触发事件
      reset () {
        if (!this.changeQueryCondition.singleDay) {
          this.transactionStatisticsForm.rank = '20'
        } else {
          this.transactionStatisticsForm.rank = '50'
        }
        if(this.changeQueryCondition.singleDay){
          this.$refs.order.clear()
          this.$refs.credit.clear()
          if(this.transactionStatisticsForm.participantLevelVal!=='account'){
            this.$refs.participantLeavel.clearAll()
            this.$refs.salepartCode.resetAll()
          }
        }else {
          this.$refs.participantLeavel.clearAll()
        }
        this.transactionStatisticsForm.participantLevelVal = 'account'
        this.transactionStatisticsForm.stationVal = '1'
        this.transactionStatisticsForm.statisticWayVal = '1'
        this.transactionStatisticsForm.detailVal = 'X'
        this.transactionStatisticsForm.invacctnos = ''
        this.transactionStatisticsForm.sortVal = 'buy'
        this.transactionStatisticsForm.orderVal = ['ALL']
        this.transactionStatisticsForm.creditVal = ['ALL']
        this.transactionStatisticsForm.priceStart = ''
        this.transactionStatisticsForm.priceEnd = ''
        this.transactionStatisticsForm.storeCode = []

      },
      // 获取上传结果
      getTxtData (TxtData) {
        this.transactionStatisticsForm.invacctnos = TxtData.join(',')
      },
      // 平台类型下拉内容获取
      platformSelectOptions () {
        linkNo('platform').then((resp) => {
          this.stationOptions = [...resp,{value:'ALL',text:'全部'}]
        })
      },
      // 交易类型下拉内容获取
      transactionSelectOptions () {
        let stationVal = this.transactionStatisticsForm.stationVal
        detailSelect('transaction', stationVal).then((resp) => {
          this.detailOptions = [...resp,{value:'ALL',text:'全部'}]
          switch (stationVal) {
            case '1':
              this.transactionStatisticsForm.detailVal = 'X'
              break
            case'2':
              this.transactionStatisticsForm.detailVal = 'ALL'
              break
          }
        })
      },
      // 平台类型change事件
      stationChange (val) {
        if (val == '1') {
          this.transactionSelectOptions()
        } else {
          this.transactionStatisticsForm.orderVal = ['ALL']
          this.transactionStatisticsForm.creditVal = ['ALL']
          if(val==='2'){
            this.transactionSelectOptions()
          }else{
            this.transactionStatisticsForm.detailVal = ''
          }
        }
      },
      getSelectRes (checkBoxValue) {
        this.transactionStatisticsForm.selectStockCodeVal = checkBoxValue
      },
      getSalePartRes (checkBoxValue) {
        this.transactionStatisticsForm.storeCode = checkBoxValue
      },
      // 参与者层级change事件
      participantLevelChange (val) {
        this.selectParams.particLevelType = val
        this.transactionStatisticsForm.participantLevelVal = val
        this.transactionStatisticsForm.invacctnos = ''
      },
      handleChangeInvacctnos (val) {
        this.fnValidateAccountCode(this.transactionStatisticsForm.participantLevelVal, val, '参代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。')
      },
      orderChange (val) {
        this.transactionStatisticsForm.orderVal = val
      },
      creditChange (val) {
        this.transactionStatisticsForm.creditVal = val
      },
      // 统计方式change事件
      statisticWayChange () {
        switch (this.transactionStatisticsForm.statisticWayVal) {
          case '1':
            this.transactionStatisticsForm.rank = '20'
            break
          case '2':
          case '3':
            this.transactionStatisticsForm.rank = '50'
            break
        }
      },
      // 价格输入验证
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.transactionStatisticsForm.priceEnd, false, true, '成交价格格式错误，请重新输入')
        this.transactionStatisticsForm.priceStart = startNum
        this.transactionStatisticsForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.transactionStatisticsForm.priceStart, value, false, true, '成交价格格式错误，请重新输入')
        this.transactionStatisticsForm.priceStart = startNum
        this.transactionStatisticsForm.priceEnd = endNum
      },
      // 前N名输入验证
      checkTopN () {

      },
      // 获取单选值,显示一码通子表
      getRadio (val) {
        this.requestSubParams = {...this.requestParams}
        this.SubTableData = []
        this.SubTable = true
        this.conditionQuerySubResLoad = true
        if (this.changeQueryCondition.singleDay) {
          if (this.singleAndConditionQuery) {
            this.requestSubParams.tableLevel = 'subtable'
            this.requestSubParams['uniteCode'] = this.tableData[val].aid
            this.SubTableData = this.SINGLEDAY_CONDITION.uniteCodeSub
            getTransactionCondition(this.requestSubParams).then((resp) => {
              this.conditionQuerySubResLoad = false
              this.SubTableColumnData = resp.bizData.metaData
            })
          } else if (this.QuickQuery) {
            this.requestSubParams.tableLevel = 'subtable'
            this.requestSubParams['uniteCode_b'] = this.tableData[val].iaid_b
            this.requestSubParams['uniteCode_s'] = this.tableData[val].iaid_s
            this.SubTableData = this.SINGLEDAY_QUICK.uniteCodeSub
            getTransactionQuick(this.requestSubParams).then((resp) => {
              this.conditionQuerySubResLoad = false
              this.SubTableColumnData = resp.bizData.metaData
            })
          }
        } else {
          this.requestSubParams.tableLevel = 'subtable'
          this.requestSubParams['uniteCode_b'] = this.tableData[val].accountid_b
          this.requestSubParams['uniteCode_s'] = this.tableData[val].accountid_s
          switch (this.transactionStatisticsForm.statisticWayVal) {
            case '1':
              this.SubTableData = this.MULTI_DAY_QUICK.oneDay.uniteCodeSub
              break
            case '2':
              this.SubTableData = this.MULTI_DAY_QUICK.manyDays.uniteCodeSub
              break
          }
          getTransactionMultiDay(this.requestSubParams).then((resp) => {
            this.conditionQuerySubResLoad = false
            this.SubTableColumnData = resp.result.bizData.metaData
          })
        }
      },
      getSubTableData (val) {
        this.mulUpDownSubTable = true
        this.subTableLoad = true
        this.requestSubParams = {...this.requestParams}
        this.requestSubParams.tableLevel = 'subtable'
        this.requestSubParams['uniteCode'] = this.upTableData[val].iaid
        this.subUpTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.uniteCodeSub.up
        this.subDownTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.uniteCodeSub.down
        getTransactionMultiDay(this.requestSubParams).then((resp) => {
          this.subTableLoad = false
          this.subUpTableData = resp.upResult.bizData.metaData
          this.subDownTableData = resp.downResult.bizData.metaData
        })
      },
      // 获取多日增减增仓一码通子表值
      getMulUpRadio (val) {
        this.subUpTableData = []
        this.subDownTableData = []
        this.getSubTableData(val)
      },
      // 获取多日增减减仓一码通子表值
      getMulDownRadio (value) {
        this.subUpTableData = []
        this.subDownTableData = []
        let val = value.split(',')[0]
        this.getSubTableData(val)
      },
      // 查询事件
      getQuickQueyResult () {
        this.queryResult = true
        // 初始化数据
        this.radio = ''
        this.SubTable = false
        this.QuickQuery = true
        this.singleAndConditionQuery = false
        this.requestParams = {}
        this.tableData = []
        this.mulUpDown = false
        this.exceptMulUpDown = false
        this.resultNum = 0
        // 单日查询
        if (this.changeQueryCondition.singleDay) {
          this.exceptMulUpDown = true
          this.quickQueryResLoad = true
          // 入参
          this.requestParams = {
            platformType: this.transactionStatisticsForm.stationVal,
            dateTimeStart: this.commonData.dateTimeStart,
            dateTimeEnd: this.commonData.dateTimeEnd,
            actorKind: this.transactionStatisticsForm.participantLevelVal,
            stockCode: this.commonData.stockCode.split(' ')[0],
            rank: this.transactionStatisticsForm.rank,
            tableLevel: 'maintable',
            sortType: this.transactionStatisticsForm.sortVal
          }
          switch (this.transactionStatisticsForm.participantLevelVal) {
            case 'account':
              this.QuickData = this.SINGLEDAY_QUICK.account
              this.UniteMain = false
              break
            case 'salePart':
              this.QuickData = this.SINGLEDAY_QUICK.salePartAndMember
              this.UniteMain = false
              break
            case 'member':
              this.QuickData = this.SINGLEDAY_QUICK.salePartAndMember
              this.UniteMain = false
              break
            case 'uniteCode':
              this.QuickData = this.SINGLEDAY_QUICK.uniteCodeMain
              this.UniteMain = true
              break
          }
          getTransactionQuick(this.requestParams).then((resp) => {
            this.quickQueryResLoad = false
            this.tableData = resp.bizData.metaData
            this.resultNum = resp.bizData.totalRows
          })
          // 多日查询
        } else {
          // 初始化数据
          this.radio = ''
          this.SubTable = false
          this.QuickQuery = true
          this.singleAndConditionQuery = false
          this.requestParams = {}
          this.tableData = []
          this.mulUpDownUniteMain = false
          this.resultNum = 0
          // 判断统计方式：(按日统计,多日统计,多日增减)
          this.requestParams = {
            platformType: this.transactionStatisticsForm.stationVal,
            dateTimeStart: this.commonData.dateTimeStart,
            dateTimeEnd: this.commonData.dateTimeEnd,
            actorKind: this.transactionStatisticsForm.participantLevelVal,
            stockCode: this.commonData.stockCode.split(' ')[0],
            rank: this.transactionStatisticsForm.rank,
            countMethod: this.transactionStatisticsForm.statisticWayVal,
            tableLevel: 'maintable'
          }
          // 按日统计1
          if (this.transactionStatisticsForm.statisticWayVal == '1') {
            this.quickQueryResLoad = true
            this.mulUpDown = false
            this.exceptMulUpDown = true
            // 判断参与者层级，渲染生成不同表格
            switch (this.transactionStatisticsForm.participantLevelVal) {
              case 'salePart':
              case 'member':
                this.QuickData = this.MULTI_DAY_QUICK.oneDay.salePartAndMember
                this.UniteMain = false
                break
              case 'account':
                this.QuickData = this.MULTI_DAY_QUICK.oneDay.account
                this.UniteMain = false
                break
              case 'uniteCode':
                this.QuickData = this.MULTI_DAY_QUICK.oneDay.uniteCodeMain
                this.UniteMain = true
                break
            }
            getTransactionMultiDay(this.requestParams).then((resp) => {
              this.quickQueryResLoad = false
              this.tableData = resp.result.bizData.metaData
              this.tableData.forEach(function (item, index) {
                if (item.accountid_b == '合计' || item.accountid_b == '小计') {
                  item.tradedate = ''
                }
              })
              this.resultNum = resp.result.bizData.totalRows
            })

            // 多日统计2
          } else if (this.transactionStatisticsForm.statisticWayVal == '2') {
            this.quickQueryResLoad = true
            this.mulUpDown = false
            this.exceptMulUpDown = true
            // 判断参与者层级，渲染生成不同表格
            switch (this.transactionStatisticsForm.participantLevelVal) {
              case 'salePart':
              case 'member':
                this.QuickData = this.MULTI_DAY_QUICK.manyDays.salePartAndMember
                this.UniteMain = false
                break
              case 'account':
                this.QuickData = this.MULTI_DAY_QUICK.manyDays.account
                this.UniteMain = false
                break
              case 'uniteCode':
                this.QuickData = this.MULTI_DAY_QUICK.manyDays.uniteCodeMain
                this.UniteMain = true
                break
            }
            getTransactionMultiDay(this.requestParams).then((resp) => {
              this.quickQueryResLoad = false
              this.tableData = resp.result.bizData.metaData
              this.resultNum = resp.result.bizData.totalRows
            })
            // 多日增减3
          } else if (this.transactionStatisticsForm.statisticWayVal == '3') {
            this.MainTableLoad = true
            this.mulUpDown = true
            this.exceptMulUpDown = false
            this.Main = ''
            this.mulUniteMain = false
            // 判断参与者层级，渲染生成不同表格
            switch (this.transactionStatisticsForm.participantLevelVal) {
              case 'salePart':
              case 'member':
                this.upTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.salePartAndMember.up
                this.downTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.salePartAndMember.down
                break
              case 'account':
                this.upTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.account.up
                this.downTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.account.down
                break
              case 'uniteCode':
                this.Main = '母表'
                this.mulUniteMain = true
                this.upTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.uniteCodeMain.up
                this.downTableOptions = this.MULTI_DAY_QUICK.manyDaysIncreaseAndDecrease.uniteCodeMain.down
                this.mulUpDownUniteMain = true
                break
            }
            getTransactionMultiDay(this.requestParams).then((resp) => {
              this.MainTableLoad = false
              this.upTableData = resp.upResult.bizData.metaData
              this.downTableData = resp.downResult.bizData.metaData
            })
          }
        }
      },
      // 条件查询事件
      getConditionQueyResult () {
        this.queryResult = true
        // 初始化数据
        this.radio = ''
        this.SubTable = false
        this.QuickQuery = false
        this.singleAndConditionQuery = true
        this.conditionQueryResLoad = true
        this.requestParams = {}
        this.tableData = []
        this.mulUpDown = false
        this.exceptMulUpDown = true
        this.resultNum = 0
        if (this.transactionStatisticsForm.invacctnos && !this.gfnStockCodeReg(this.transactionStatisticsForm.invacctnos) && this.transactionStatisticsForm.participantLevelVal === 'account') {
          this.$message.warning('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
          return
        }
        this.requestParams = {
          platformType: this.transactionStatisticsForm.stationVal,
          tradeType: this.transactionStatisticsForm.detailVal,
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          actorKind: this.transactionStatisticsForm.participantLevelVal,
          stockCode: this.commonData.stockCode.split(' ')[0],
          rank: this.transactionStatisticsForm.rank,
          tableLevel: 'maintable',
          sortType: this.transactionStatisticsForm.sortVal,
          priceStart: this.transactionStatisticsForm.priceStart,
          priceEnd: this.transactionStatisticsForm.priceEnd,
          orderType: this.transactionStatisticsForm.orderVal.join(','),
          creditType: this.transactionStatisticsForm.creditVal.join(','),
          actorKindCode: this.transactionStatisticsForm.invacctnos,
          salepartCode: ''
        }
        if (this.transactionStatisticsForm.participantLevelVal == 'salePart' || this.transactionStatisticsForm.participantLevelVal == 'member') {
          let storeCodeArr = this.transactionStatisticsForm.storeCode
          this.requestParams.actorKindCode = storeCodeArr.join(',')
          this.singleDayConditionData = this.SINGLEDAY_CONDITION.salePartAndMember
          this.UniteMain = false
        } else {
          //   // if (this.transactionStatisticsForm.invacctnos && !this.gfnStockCodeReg(this.transactionStatisticsForm.invacctnos)) {
          //   //   this.$message.error('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
          //     return
          //   }
          switch (this.transactionStatisticsForm.participantLevelVal) {
            case 'account':
              this.singleDayConditionData = this.SINGLEDAY_CONDITION.account
              this.requestParams.salepartCode = this.transactionStatisticsForm.storeCode.join(',')
              this.UniteMain = false
              break
            case 'uniteCode':
              this.singleDayConditionData = this.SINGLEDAY_CONDITION.uniteCodeMain
              this.UniteMain = true
              break
          }
        }
        getTransactionCondition(this.requestParams).then((resp) => {
          this.conditionQueryResLoad = false
          this.tableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows
        })
      },

      // 统计方式默认值改变
      defaultStatisticsWay () {
        this.transactionStatisticsForm.rank = '20'
      },

      // 参与者层级默认值改变及其联动变化
      defaultParticelLevel () {
        this.transactionStatisticsForm.uploadStockCode = false
        this.storeCodeOptions = []
        this.transactionStatisticsForm.invacctnos = ''
        this.transactionStatisticsForm.storeCode = []
        this.selectStockCodeOptions = []
      },
      saveMainTableFile () {
        let params = this.requestParams
        if (this.changeQueryCondition.singleDay) {
          if (this.singleAndConditionQuery) { // 单日条件
            params['type'] = 'bargainStatCondition'
            params['tableColumns'] = [
              {
                sheetName: '产品查询-成交统计单日条件查询',
                fileColumns: this.singleDayConditionData
              }
            ]
          } else if (this.QuickQuery) { // 单日快速
            params['type'] = 'bargainStatSingleDay'
            params['tableColumns'] = [
              {
                sheetName: '产品查询-成交统计单日查询',
                fileColumns: this.QuickData
              }
            ]
          }
        } else {
          params['type'] = 'bargainStatMultiDay'
          switch (this.transactionStatisticsForm.statisticWayVal) {
            case '1':
            case '2':
              params['tableColumns'] = [
                {
                  sheetName: '产品查询-成交统计多日查询',
                  fileColumns: this.QuickData
                }
              ]
              break
            case '3':
              params['tableColumns'] = [
                {
                  sheetName: '产品查询-成交统计多日增仓',
                  fileColumns: this.upTableOptions
                },
                {
                  sheetName: '产品查询-成交统计多日减仓',
                  fileColumns: this.downTableOptions
                }
              ]
              break
          }
        }
        params['fileType'] = 'excel'
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
        // console.log(JSON.stringify(params['tableColumns']))
        // setTimeout(() => {this.gfnExportFileWithForm('/regularqry/product/v1/export', params)}, 10000)

      },
      saveSubTableFile () {
        let params = this.requestSubParams
        if (this.changeQueryCondition.singleDay) {
          if (this.singleAndConditionQuery) { // 单日条件
            params['type'] = 'bargainStatCondition'
          } else if (this.QuickQuery) { // 单日快速
            params['type'] = 'bargainStatSingleDay'
          }
          params['tableColumns'] = [
            {
              sheetName: '产品查询-成交统计一码通单日查询',
              fileColumns: this.SubTableData
            }
          ]
          params['fileType'] = 'excel'
        } else {
          params['type'] = 'bargainStatMultiDay'
          params['fileType'] = 'excel'
          if (this.transactionStatisticsForm.statisticWayVal === '3') {
            params['tableColumns'] = [
              {
                sheetName: '产品查询-成交统计多日增仓子表',
                fileColumns: this.subUpTableOptions
              },
              {
                sheetName: '产品查询-成交统计多日减仓子表',
                fileColumns: this.subDownTableOptions
              }
            ]
          } else {
            params['tableColumns'] = [
              {
                sheetName: '产品查询-成交统计一码通多日查询',
                fileColumns: this.SubTableData
              }
            ]
          }
        }
        // this.gfnExportFile('/regularqry/product/v1/export', JSON.stringify(params))
        // setTimeout(() => {this.gfnExportFileWithForm('/regularqry/product/v1/export', params)}, 10000)
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      },
      // 分页每页条数设置事件
      handleSizeChange () {

      },
      // 切换页码事件
      handleCurrentChange () {

      }

    },
    mounted () {
      // 平台类型下拉内容获取
      this.platformSelectOptions()
      // 交易类型下拉内容获取
      this.transactionSelectOptions()
    }
  }
</script>

<style lang='less'>
  .transaction-statistics {
    .top-number {
      /*text-align: center;*/
    }
    .queryTitle {
      margin-bottom: 20px;
      margin-left: 20px;
      font-size: 16px;
    }
    .el-radio__label {
      display: none;
    }
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .el-card__body {
      margin-top: 20px;
    }
    .name {
      font-size: 14px;
      line-height: 32px;
    }
    .el-col {
      height: 32px;
      margin-bottom: 20px;
    }
    .el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
    .rank {
      margin-left: 9px;
      margin-right: 10px;
    }
    .middleText {
      text-align: center;
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
