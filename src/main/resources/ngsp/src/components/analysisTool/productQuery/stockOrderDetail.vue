<template>
  <!--申报详情-->
  <div class="stock-order-detail">
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
            @click="stockOrderQueryRes">查询
        </el-button>
      </div>
      <el-form
          :inline="true"
          ref="stockOrderDetailForm"
          :model="stockOrderDetailForm"
          :rules="stockOrderDetailRules"
          label-width="150px">
        <el-row>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码：" required>
              <el-input
                  v-model="stockCode"
                  placeholder="请输入证券代码"
                  size="small"
                  class="el-form-input"
                  @change="resetPagenation"
                  style="width:260px"
                  disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="买卖状态：" required>
              <el-checkbox-group v-model="stockOrderDetailForm.buyOrSell" :min=1>
                <el-checkbox label="B">买</el-checkbox>
                <el-checkbox label="S">卖</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="申报价格：">
            <el-input
                size="small"
                v-model.number="stockOrderDetailForm.priceStart"
                @change="checkPriceStart"
                class="el-form-input"
                style="width:115px"/>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="stockOrderDetailForm.priceEnd"
                @change="checkPriceEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="申报数量：">
            <el-input
                size="small"
                v-model.number="stockOrderDetailForm.countStart"
                @change="checkCountStart"
                class="el-form-input"
                style="width:115px"/>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="stockOrderDetailForm.countEnd"
                @change="checkCountEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="订单状态：" required>
            <el-checkbox-group v-model="stockOrderDetailForm.orderStatus" :min=1>
              <el-checkbox label="M">成交</el-checkbox>
              <el-checkbox label="O">未成交</el-checkbox>
              <el-checkbox label="W">撤单</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="参与者层级：" required>
            <participant-level-val ref="participantLeavel" @getParticipantLevelVal="participantLevelChange"/>
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

        <el-col :xl="10" :lg="10" :md="14" :sm="24">
          <el-form-item label="参与者代码：" prop="invacctnos">
            <div
                v-if="stockOrderDetailForm.participantLevelVal==='account'||stockOrderDetailForm.participantLevelVal==='uniteCode'">
              <el-input
                  v-model="stockOrderDetailForm.invacctnos"
                  placeholder="请输入参与者代码"
                  @change="handleChangeInvacctnos"
                  class="el-form-input"
                  style="width: 200px"
                  size="small">
              </el-input>
              <text-upload @getTxtCon="getTxtData"
                           :uploadOption="uploadOption"
                           style="display: inline;"/>
              <down-template-file :fileType="stockOrderDetailForm.participantLevelVal"
                                  v-if="stockOrderDetailForm.participantLevelVal==='account'"
                                  style="display: inline-block;"/>
            </div>
            <div v-else>
              <select-lazy-multiple
                  :selectParams="selectParams"
                  @getSelectRes="getSelectRes"
                  @getSelectName="getSelectName"/>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card v-if="queryResult" class="el-card-table">
      <div slot="header">
        <span>查询结果</span>
        <el-button size="small" type="primary" @click="saveLocation">导出</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          :fit=true
          size="small"
          tooltip-effect="dark"
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            resizable
            v-for="item in tableOptions"
            :prop="item.field"
            :label="item.label"
            :key="item.field"
            :width="item.width"
            :align="item.align"
            :sort-method="item.sortMethod"
            :sortable="item.sortable == null ? false : item.sortable"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
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
  import { transactionSelect, linkNo, getStockOrderDetail } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        stockCode: '',
        stockOrderDetailForm: {
          buyOrSell: ['B', 'S'],
          orderStatus: ['M', 'O', 'W'],
          participantLevelVal: 'account',
          invacctnos: '',
          selectStockCode: false,
          selectStockCodeVal: [],
          selectStockCodeName: [],
          priceStart: '',
          priceEnd: '',
          countStart: '',
          countEnd: '',
          orderVal: [],
          creditVal: []
        },
        stockOrderDetailRules: {},
        tableData: [],
        queryResLoad: false,
        queryResult: false,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0,
        uploadOption: {
          name: '上传',
          size: 'small'
        },
        selectParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        },
        requestParams: {},
        tableOptions: [
          {label: '申报编号', field: 'ordrno', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrno')},
          {label: '申报日期', field: 'trandat', width: '120', align: 'left', sortable: true},
          {label: '申报时间', field: 'trantim', width: '120', align: 'left', sortable: true},
          {label: '参与者代码', field: 'accountid', width: '120', align: 'left', sortable: true},
          {label: '参与者名称', field: 'investor_account_name', width: '120', align: 'left', sortable: true},
          {label: '一码通账户', field: 'ymt_account_id', width: '120', align: 'left', sortable: true},
          {label: '方向', field: 'ordrbuycod', width: '120', align: 'left', sortable: true},
          {label: '申报价格', field: 'ordrexeprc', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '申报数量', field: 'orderqty', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'orderqty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
          {label: '未成交量', field: 'ordrqty', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
          {label: '订单状态', field: 'trntpyid', width: '120', align: 'left', sortable: true},
          {label: '营业部名称', field: 'branch_name', width: '120', align: 'left', sortable: true},
          {label: '券商名称', field: 'member_name', width: '120', align: 'left', sortable: true},
          {label: '订单类型', field: 'ordrtypcod', width: '120', align: 'left', sortable: true},
          {label: '信用类型', field: 'credittag', width: '120', align: 'left', sortable: true},
          {label: 'PBU代码', field: 'pbuoscod', width: '120', align: 'left', sortable: true},
          {label: '撤单时间', field: 'can_tim', width: '120', align: 'left', sortable: true}
        ]
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
      // stockCode改变重置页码
      resetPagenation () {
        this.currentPage = 1
        this.pageSize = 10
      },
      // 导出功能
      saveLocation () {
        let params = this.requestParams
        params['tableColumns'] = [
          {
            sheetName: '产品查询-申报详情',
            fileColumns: this.tableOptions
          }
        ]
        params['type'] = 'declareDetail'
        params['fileType'] = 'excel'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      },
      // 获取证券代码
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      handleChangeInvacctnos (val) {
        this.fnValidateAccountCode(this.stockOrderDetailForm.participantLevelVal, val, '参代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。')
      },
      // 获取上传结果
      getTxtData (TxtData) {
        this.stockOrderDetailForm.invacctnos = TxtData.join(',')
      },
      resetAll () {
        this.stockOrderDetailForm.participantLevelVal = 'account'
        this.stockOrderDetailForm.invacctnos = ''
        this.selectParams = {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        }
        this.stockOrderDetailForm.selectStockCodeVal = []
        this.stockOrderDetailForm.priceStart = ''
        this.stockOrderDetailForm.priceEnd = ''
        this.stockOrderDetailForm.countStart = ''
        this.stockOrderDetailForm.countEnd = ''
        this.stockOrderDetailForm.buyOrSell = ['B', 'S']
        this.stockOrderDetailForm.orderStatus = ['M', 'O', 'W']
        this.clearAll()
      },
      stockOrderQueryRes () {
        if (this.stockOrderDetailForm.invacctnos && !this.gfnStockCodeReg(this.stockOrderDetailForm.invacctnos) && this.stockOrderDetailForm.participantLevelVal === 'account') {
          this.$message.warning('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
          return
        }
        this.tableData = []
        this.queryResult = true
        this.queryResLoad = true
        this.currentPage = 1
        this.getData()
      },
      getData () {
        this.requestParams = {
          stockValue: this.commonData.stockCode,
          stockCode: this.commonData.stockCode.split(' ')[0],
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          orderState: this.stockOrderDetailForm.orderStatus.join(','),
          saleState: this.stockOrderDetailForm.buyOrSell.join(','),
          actorKind: this.stockOrderDetailForm.participantLevelVal,
          creditType: this.stockOrderDetailForm.creditVal.join(','),
          orderType: this.stockOrderDetailForm.orderVal.join(','),
          actorKindCode: this.stockOrderDetailForm.invacctnos,
          pageIndex: this.currentPage,
          pageRows: this.pageSize,
          numberStart: this.stockOrderDetailForm.countStart,
          numberEnd: this.stockOrderDetailForm.countEnd,
          priceStart: this.stockOrderDetailForm.priceStart,
          priceEnd: this.stockOrderDetailForm.priceEnd
        }
        switch (this.stockOrderDetailForm.participantLevelVal) {
          case 'account':
          case 'uniteCode':
            this.requestParams.actorKindCode = this.stockOrderDetailForm.invacctnos
            break
          case 'salePart':
          case 'member':
          case 'pbu':
            let storeCodeArr = this.stockOrderDetailForm.selectStockCodeVal
            this.requestParams.actorKindCode = storeCodeArr.join(',')
            break
        }
        getStockOrderDetail(this.requestParams).then((resp) => {
          this.queryResLoad = false
          this.tableData = resp.bizData.metaData
          this.resultNum = resp.bizData.rows - 0
        })
      },
      participantLevelChange (val) {
        this.stockOrderDetailForm.participantLevelVal = val
        this.selectParams.particLevelType = val
        this.stockOrderDetailForm.invacctnos = ''
      },
      getSelectRes (checkBoxValue) {
        this.stockOrderDetailForm.selectStockCodeVal = checkBoxValue
      },
      getSelectName (val) {
        this.stockOrderDetailForm.selectStockCodeName = val
      },
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.stockOrderDetailForm.priceEnd, false, true, '申报价格格式错误，请重新输入')
        this.stockOrderDetailForm.priceStart = startNum
        this.stockOrderDetailForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.stockOrderDetailForm.priceStart, value, false, true, '申报价格格式错误，请重新输入')
        this.stockOrderDetailForm.priceStart = startNum
        this.stockOrderDetailForm.priceEnd = endNum
      },
      checkCountStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.stockOrderDetailForm.countEnd, true, false, '申报数量格式错误，请重新输入')
        this.stockOrderDetailForm.countStart = startNum
        this.stockOrderDetailForm.countEnd = endNum
      },
      checkCountEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.stockOrderDetailForm.countStart, value, true, false, '申报数量格式错误，请重新输入')
        this.stockOrderDetailForm.countStart = startNum
        this.stockOrderDetailForm.countEnd = endNum
      },
      orderChange (val) {
        this.stockOrderDetailForm.orderVal = val
      },
      creditChange (val) {
        this.stockOrderDetailForm.creditVal = val
      },
      handleSizeChange (size) {
        this.pageSize = size
        this.currentPage = 1
        this.getData()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
        this.getData()
      }
    },
    mounted () {
    }
  }
</script>

<style lang='less'>
  .stock-order-detail {
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .el-form {
      .el-form-item__content {
        display: inline-flex;
      }
    }
  }
</style>
