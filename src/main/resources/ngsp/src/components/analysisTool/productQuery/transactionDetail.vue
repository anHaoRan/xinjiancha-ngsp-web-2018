<template>
  <!--成交详情-->
  <div class="transaction-detail">
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text"
                   size="small"
                   style="float:right;"
                   @click="resetAll">清空
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="getQueyResult">查询
        </el-button>
      </div>
      <el-form :inline="true"
               label-width="150px"
               ref="transactionDetailForm"
               :model="transactionDetailForm"
               :rules="transactionDetailRules">
        <el-row>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码：" required>
              <el-input
                  v-model="stockCode"
                  placeholder="请输入证券代码"
                  size="small"
                  disabled
                  class="el-form-input"
                  @change="resetPagenation"
                  style="width:260px">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="平台类型：" required>
              <el-select
                  v-model="transactionDetailForm.stationVal"
                  size="small"
                  @change="stationChange"
                  style="width:260px">
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
                  v-if="transactionDetailForm.stationVal==='1'||transactionDetailForm.stationVal==='2'">
            <el-form-item label="交易类型：" required>
              <el-select
                  v-model="transactionDetailForm.detailVal"
                  size="small"
                  style="width:260px">
                <el-option
                    v-for="item in detailOptions"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="买卖状态：" required>
            <el-checkbox-group
                v-model="transactionDetailForm.byOrSell"
                :min=1
                style="height: 40px;">
              <el-checkbox label="B">买</el-checkbox>
              <el-checkbox label="S">卖</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="成交价格：">
            <el-input
                size="small"
                v-model.number="transactionDetailForm.priceStart"
                @change="checkPriceStart"
                class="el-form-input"
                style="width:115px">
            </el-input>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="transactionDetailForm.priceEnd"
                @change="checkPriceEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="成交数量：">
            <el-input
                size="small"
                v-model="transactionDetailForm.countStart"
                @change="checkCountStart"
                style="width:115px"/>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model="transactionDetailForm.countEnd"
                @change="checkCountEnd"
                style="width:115px"/>
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
                :stationVal="transactionDetailForm.stationVal"
                @getOrderOrCreditTypeVal="orderChange"
                ref="order"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="信用类型：">
            <order-or-credit-type
                :type="'credit'"
                :stationVal="transactionDetailForm.stationVal"
                @getOrderOrCreditTypeVal="creditChange"
                ref="credit"/>
          </el-form-item>
        </el-col>

        <el-col :xl="10" :lg="10" :md="14" :sm="24">
          <el-form-item label="参与者代码：" prop="invacctnos">
            <div
                v-if="transactionDetailForm.participantLevelVal==='account'||transactionDetailForm.participantLevelVal==='uniteCode'">
              <el-input
                  v-model="transactionDetailForm.invacctnos"
                  @change="handleChangeInvacctnos"
                  placeholder="请输入参与者代码"
                  size="small"
                  class="el-form-input"
                  style="width: 260px"/>
              <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption"
                           style="display: inline;"/>
              <down-template-file :fileType="transactionDetailForm.participantLevelVal"
                                  v-if="transactionDetailForm.participantLevelVal==='account'"
                                  style="display: inline;"/>
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
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button size="small" type="primary" @click="saveLocation">导出</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          size="small"
          :fit=true
          :cell-class-name="fnCellClassName"
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
    </el-card>
  </div>
</template>

<script>
  import {
    getTransactionDetail,
    transactionSelect,
    detailSelect,
    linkNo
  } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        stockCode: '',
        transactionDetailForm: {
          stationVal: '1',
          detailVal: 'X',
          selectStockCodeVal: [],
          selectStockCodeName: [],
          selectCheckboxValue: [],
          byOrSell: ['B', 'S'],
          participantLevelVal: 'account',
          invacctnos: '',
          priceStart: '',
          priceEnd: '',
          countStart: '',
          countEnd: '',
          orderVal: [],
          creditVal: []
        },
        transactionDetailRules: {},
        queryResLoad: false,
        queryResult: false,
        stationOptions: [],
        detailOptions: [],
        selectStockCodeOptions: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0,
        tableData: [],
        tableOptions: [
          {label: '成交编号', field: 'tranidno', width: '120', align: 'left', sortable: true},
          {label: '成交日期', field: 'trandat', width: '120', align: 'left', sortable: true},
          {label: '成交时间', field: 'trantim', width: '120', align: 'left', sortable: true},
          {label: '成交数量', field: 'trdqty', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
          {label: '成交价格', field: 'tradmtchprc', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'tradmtchprc'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '买方账户', field: 'invacctno_b', width: '120', align: 'left', sortable: true},
          {label: '买方账户名称', field: 'b_accountname', width: '120', align: 'left', sortable: true},
          {label: '买方一码通账户', field: 'b_ymt_account_id', width: '130', align: 'left', sortable: true},
          {label: '买方PBU', field: 'pbuid_b', width: '120', align: 'left', sortable: true},
          {label: '买方营业部名称', field: 'brnid_b', width: '130', align: 'left', sortable: true},
          {label: '买方券商名称', field: 'member_id_b', width: '120', align: 'left', sortable: true},
          {label: '卖方账户', field: 'invacctno_s', width: '120', align: 'left', sortable: true},
          {label: '卖方账户名称', field: 's_accountname', width: '120', align: 'left', sortable: true},
          {label: '卖方一码通账户', field: 's_ymt_account_id', width: '130', align: 'left', sortable: true},
          {label: '卖方PBU', field: 'pbuid_s', width: '120', align: 'left', sortable: true},
          {label: '卖方营业部名称', field: 'brnid_s', width: '130', align: 'left', sortable: true},
          {label: '卖方券商名称', field: 'member_id_s', width: '120', align: 'left', sortable: true},
          {label: '平台类型', field: 'platformtype', width: '120', align: 'left', sortable: true},
          {label: '交易类型', field: 'trdtyp', width: '120', align: 'left', sortable: true},
          {label: '买方订单类型', field: 'ordrtypcod_b', width: '120', align: 'left', sortable: true},
          {label: '卖方订单类型', field: 'ordrtypcod_s', width: '120', align: 'left', sortable: true},
          {label: '买方信用类型', field: 'credittag_b', width: '120', align: 'left', sortable: true},
          {label: '卖方信用类型', field: 'credittag_s', width: '120', align: 'left', sortable: true},
          {label: '买方申报价格', field: 'ordrexeprc_b', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc_b'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '卖方申报价格', field: 'ordrexeprc_s', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc_s'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '买方申报数量', field: 'declare_b', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'declare_b'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'},
          {label: '卖方申报数量', field: 'declare_s', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'declare_s'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'}
        ],
        uploadOption: {
          name: '上传',
          size: 'small'
        },
        requestParams: {},
        selectParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        },
        // 高亮行所需参数
        participantCodeArr: [],
        key1: '',
        key2: ''
      }
    },
    computed: {},
    props: ['commonData'],
    watch: {
      'selectParams.particLevelType': function () {
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
      }
    },
    methods: {
      // 获取父组件中stockCode
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      // 平台类型下拉项获取
      platformSelectOptions () {
        linkNo('platform').then((resp) => {
          this.stationOptions = resp
          const All = {
            value: 'ALL',
            text: '全部'
          }
          this.stationOptions.push(All)
        })
      },
      stationChange (val) {
        if (val === '1') {
          this.transactionSelectOptions()
        } else {
          this.transactionDetailForm.orderVal = ['ALL']
          this.transactionDetailForm.creditVal = ['ALL']
          if (val === '2') {
            this.transactionSelectOptions()
          } else {
            this.transactionDetailForm.detailVal = ''
          }
        }
      },
      // 交易类型下拉项获取
      transactionSelectOptions () {
        let stationVal = this.transactionDetailForm.stationVal
        detailSelect('transaction', stationVal).then((resp) => {
          this.detailOptions = [{value: 'ALL', text: '全部'}, ...resp]
          switch (stationVal) {
            case '1':
              this.transactionDetailForm.detailVal = 'X'
              break
            case'2':
              this.transactionDetailForm.detailVal = 'ALL'
              break
          }

        })
      },
      // 参与者代码-获取上传结果
      getTxtData (TxtData) {
        this.transactionDetailForm.invacctnos = TxtData.join(',')
      },
      // 参与者层级-获取营业部PBU券商下拉val
      getSelectRes (checkBoxValue) {
        this.transactionDetailForm.selectStockCodeVal = checkBoxValue
      },
      // 参与者层级-获取营业部PBU券商下拉label
      getSelectName (val) {
        this.transactionDetailForm.selectStockCodeName = val
      },
      // 获取参与者层级Val
      participantLevelChange (val) {
        this.transactionDetailForm.participantLevelVal = val
        this.selectParams.particLevelType = val
        this.transactionDetailForm.invacctnos = ''
      },
      handleChangeInvacctnos (val) {
        this.fnValidateAccountCode(this.transactionDetailForm.participantLevelVal, val, '参代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。')
      },
      // 成交价格，成交数量输入验证
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.transactionDetailForm.priceEnd, false, true, '成交价格格式错误，请重新输入')
        this.transactionDetailForm.priceStart = startNum
        this.transactionDetailForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.transactionDetailForm.priceStart, value, false, true, '成交价格格式错误，请重新输入')
        this.transactionDetailForm.priceStart = startNum
        this.transactionDetailForm.priceEnd = endNum
      },
      checkCountStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.transactionDetailForm.countEnd, true, false, '成交数量格式错误，请重新输入')
        this.transactionDetailForm.countStart = startNum
        this.transactionDetailForm.countEnd = endNum
      },
      checkCountEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.transactionDetailForm.countStart, value, true, false, '成交数量格式错误，请重新输入')
        this.transactionDetailForm.countStart = startNum
        this.transactionDetailForm.countEnd = endNum
      },
      // 获取订单类型val
      orderChange (val) {
        this.transactionDetailForm.orderVal = val
      },
      // 获取信用类型val
      creditChange (val) {
        this.transactionDetailForm.creditVal = val
      },
      // stockCode改变重置页码
      resetPagenation () {
        this.currentPage = 1
        this.pageSize = 10
      },
      // 查询结果接口
      getQueyResult () {
        if (this.transactionDetailForm.invacctnos && !this.gfnStockCodeReg(this.transactionDetailForm.invacctnos) && this.transactionDetailForm.participantLevelVal === 'account') {
          this.$message.warning('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
          return
        }
        // 高亮行参数切换
        this.highLightChangeParam()
        this.queryResLoad = true
        this.queryResult = true
        this.tableData = []
        this.currentPage = 1
        this.getData()
      },
      getData () {
        this.requestParams = {
          stockCode: this.commonData.stockCode,
          isincode: this.commonData.stockCode.split(' ')[0],
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          platform: this.transactionDetailForm.stationVal,
          transaction: this.transactionDetailForm.detailVal,
          participantLevel: this.transactionDetailForm.participantLevelVal,
          invacctnos: this.transactionDetailForm.invacctnos,
          priceStart: this.transactionDetailForm.priceStart,
          priceEnd: this.transactionDetailForm.priceEnd,
          countStart: this.transactionDetailForm.countStart,
          countEnd: this.transactionDetailForm.countEnd,
          order: this.transactionDetailForm.orderVal.join(','),
          credit: this.transactionDetailForm.creditVal.join(','),
          pageRows: this.pageSize,
          pageIndex: this.currentPage,
          saleState: this.transactionDetailForm.byOrSell.join(',')
        }
        switch (this.transactionDetailForm.participantLevelVal) {
          case 'account':
          case 'uniteCode':
            this.requestParams.invacctnos = this.transactionDetailForm.invacctnos
            break
          case 'salePart':
          case 'member':
          case 'pbu':
            let storeCodeArr = this.transactionDetailForm.selectStockCodeVal
            this.requestParams.invacctnos = storeCodeArr.join(',')
            break
        }
        getTransactionDetail(this.requestParams).then((resp) => {
          this.queryResLoad = false
          this.tableData = resp.bizData.metaData
          if (resp.bizData.metaData == null || resp.bizData.metaData.length === 0) {
            this.resultNum = 0
          } else {
            this.resultNum = this.tableData[0].totalnum - 0
          }
        })
      },
      // 导出接口
      saveLocation () {
        let params = this.requestParams
        params['tableColumns'] = [
          {
            sheetName: '产品查询-成交详情',
            fileColumns: this.tableOptions
          }
        ]
        params['type'] = 'bargaindetail'
        params['fileType'] = 'excel'
        delete params.pageRows
        delete params.pageIndex
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      },
      // 清空
      resetAll () {
        this.transactionDetailForm.participantLevelVal = 'account'
        this.transactionDetailForm.stationVal = '1'
        this.transactionDetailForm.detailVal = 'X'
        this.transactionDetailForm.invacctnos = ''
        this.transactionDetailForm.selectStockCodeVal = []
        this.transactionDetailForm.priceStart = ''
        this.transactionDetailForm.priceEnd = ''
        this.transactionDetailForm.countStart = ''
        this.transactionDetailForm.countEnd = ''
        this.transactionDetailForm.byOrSell = ['B', 'S']
        this.clearAll()
      },
      // 分页事件
      handleSizeChange (size) {
        this.currentPage = 1
        this.pageSize = size
        this.getData()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
        this.getData()
      },
      // 高亮行
      // eslint-disable-next-line
      fnCellClassName ({row, column}) {
        for (let i = 0; i < this.participantCodeArr.length; i++) {
          if ($.trim(row[this.key1]) == this.participantCodeArr[i]) {
            switch (column.property) {
              case 'invacctno_b':
              case 'b_accountname':
              case 'b_ymt_account_id':
              case 'pbuid_b':
              case 'brnid_b':
              case 'member_id_b':
                return 'highLightBg'
                // eslint-disable-next-line
                break
            }
          }
          if ($.trim(row[this.key2]) == this.participantCodeArr[i]) {
            switch (column.property) {
              case 'invacctno_s':
              case 's_accountname':
              case 's_ymt_account_id':
              case 'pbuid_s':
              case 'brnid_s':
              case 'member_id_s':
                return 'highLightBg'
                // eslint-disable-next-line
                break
            }
          }
        }
      },
      highLightChangeParam () {
        switch (this.transactionDetailForm.participantLevelVal) {
          case 'account':
            this.participantCodeArr = this.transactionDetailForm.invacctnos.split(',')
            this.key1 = 'invacctno_b'
            this.key2 = 'invacctno_s'
            break
          case 'uniteCode':
            this.participantCodeArr = this.transactionDetailForm.invacctnos.split(',')
            this.key1 = 'b_ymt_account_id'
            this.key2 = 's_ymt_account_id'
            break
          case 'salePart':
            this.participantCodeArr = this.transactionDetailForm.selectStockCodeName
            this.key1 = 'brnid_b'
            this.key2 = 'brnid_s'
            break
          case 'pbu':
            this.participantCodeArr = this.transactionDetailForm.selectStockCodeVal
            this.key1 = 'pbuid_b'
            this.key2 = 'pbuid_s'
            break
          case 'member':
            this.participantCodeArr = this.transactionDetailForm.selectStockCodeName
            this.key1 = 'member_id_b'
            this.key2 = 'member_id_s'
            break
        }
      }
    },
    created () {
      this.platformSelectOptions()
      this.transactionSelectOptions()
      this.stationChange()
    }
  }
</script>

<style lang='less'>
  .transaction-detail {
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .el-table {
      margin-bottom: 20px;
    }
    .el-form {
      .el-form-item__content {
        display: inline-flex;
      }
    }
  }

  .theme_dark .el-table tr td.highLightBg {
    background: green !important;
    color: #fff;
  }
</style>
