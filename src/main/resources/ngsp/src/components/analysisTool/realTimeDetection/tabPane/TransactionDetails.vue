<template>
  <div class="transactionDetails">
    <el-form :inline="true" :model="selectParams" label-width="100px" :rules="rules">
      <el-card style="overflow: visible">
        <el-row :gutter="20">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="平台类型">
              <el-select v-model="selectParams.platform" placeholder="请选择" size="mini" @change="changePlatformType">
                <el-option
                  v-for="item in platformTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="订单类型">
              <down-more-select v-model="selectParams.order" @input="orderType"
                                :optionData="orderTypeOption" :disabled="selectParams.platform != '1'"
                                ref="cancelorder"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者层级">
              <el-select v-model="selectParams.participantLevel" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in participantOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="成交数量">
              <div style="display: flex">
                <el-input type="text" v-model="selectParams.countStart" size="mini" placeholder="上限>0"
                          style="width: 120px">
                  {{selectParams.countStart}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="selectParams.countEnd" size="mini" placeholder="下限>0"
                          style="width: 120px">
                  {{selectParams.countEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="买卖状态">
              <el-select v-model="selectParams.saleState" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in buyStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="交易类型" v-show="isShow">
              <el-select v-model="selectParams.transaction" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in detailTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者代码" prop="invacctnos">
              <div style="display: flex;" v-if="selectParams.participantLevel == 'account'">
                <el-input type="text" v-model="selectParams.invacctnos" size="mini" class="txtInput" clearable>
                </el-input>
                <text-upload @getTxtCon="getTxtData"></text-upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="成交价格">
              <div style="display: flex">
                <el-input type="text" v-model="selectParams.priceStart" size="mini" placeholder="上限≥0"
                          style="width: 120px">
                  {{selectParams.priceStart}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="selectParams.priceEnd" size="mini" placeholder="上限≥0"
                          style="width: 120px">
                  {{selectParams.priceEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="信用类型">
              <down-more-select v-model="selectParams.credit" @input="creditType"
                                :optionData="creditTypeOption" :disabled="selectParams.platform != '1'"
                                ref="cancelcredit"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="账户组">
              <down-more-select v-model="selectParams.accountGroup"
                                :optionData="accountGroupOption" ref="cancelaccountGroup"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <div style="margin-left: 20px;">
                <el-button type="primary" size="small" @click="queryTableData">查询</el-button>
                <el-button type="info" size="small" @click="emptyTableData">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row class="tableTitle" style="margin-top: -30px">
      <el-col :span="12" style="padding-left: 20px">时间段统计</el-col>
      <el-col :span="12">
        <el-button type="info" size="mini" style="float: right;margin-right: 20px" @click="fnexportTimeTable">导出
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <margin-table :isPageination="false" :height="200" @current-change="handleCurrentChange"
                      :columns="timeAccountColumns" :data="{data:timeAccountData}"/>
      </el-col>
    </el-row>
    <el-row class="tableTitle">
      <el-col :span="24">
        <el-button type="info" size="mini" style="float: right;margin-right: 20px" @click="fnexportDetailTable">导出
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <margin-table @current-change="handleCurrentChange"
                      @getPageination="getPageination"
                      :pageSizes="[10,50,100,200,400]"
                      :columns="analysicAccountColumns"
                      :cellClassName="cellClassName"
                      :rowClassName="tableRowClassName"
                      :data="analysicAccountData"/>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import DownMoreSelect from '../../../common/downMoreSelect'
  import TextUpload from '../../../common/textUpload'
  import {postDealDetailData} from '@/service/analysisTool/realTimeDetection/index'
  import {
    getDealTypeData,
    getPlatformTypeData
  } from '../../../../service/analysisTool/realTimeMonitorAnalysisToll/index'
  import MinxinVue from '../Mixin'

  export default {
    name: 'report-statistics',
    components: {
      DownMoreSelect,
      TextUpload,
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [MinxinVue],
    data() {
      return {
        orderTypeOption: [], // 传递给子组件的订单类型数据
        creditTypeOption: [], //  传递给子组件的账户类型数据
        accountGroupOption: [
          {value: '选中账户', label: '选中账户'},
          {value: '待分析账户', label: '待分析账户'},
          {value: '待监控账户', label: '待监控账户'}], // 传递给子组件的账户组数据
        selectParams: {
          order: '', // 订单类型
          credit: '', //  信用类型
          participantLevel: 'account', // 参与者层级
          platform: '1', // 平台类型
          transaction: 'X', //  交易类型
          saleState: 'B,S', //  买卖状态
          invacctnos: '', //  参与者代码
          countStart: '', //  成交数量
          countEnd: '',
          priceStart: '', //  成交价格
          priceEnd: '',
          accountGroup: '' // 账户组
        },
        rules: {
          invacctnos: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确参与者代码',
            trigger: 'blur'
          }]
        },
        platformTypeOptions: [{value: 'ALL', label: '全部'}], //  平台类型下拉数据
        participantOptions: [
          {
            value: 'account',
            label: '账号'
          },
          {
            value: 'salePart',
            label: '营业部',
            disabled: true
          },
          {
            value: 'uniteCode',
            label: '一码通',
            disabled: true
          },
          {
            value: 'pbu',
            label: 'PBU',
            disabled: true
          },
          {
            value: 'member',
            label: '券商',
            disabled: true
          }
        ], // 参与者层级下拉数据
        detailTypeOptions: [{value: 'ALL', label: '全部'}], //  交易类型下拉数据
        buyStatusOptions: [
          {
            value: 'B,S',
            label: '全部'
          },
          {
            value: 'B',
            label: '买入'
          },
          {
            value: 'S',
            label: '卖出'
          }
        ],
        timeAccountData: [], //  时间段统计表格数据
        timeAccountColumns: [
          {label: '项目', field: 'project', align: 'center', width: '4%'},
          {label: '起始日期', field: 'datestart', align: 'center', width: '5%'},
          {label: '起始成交时间', field: 'timestart', align: 'center', width: '5%'},
          {label: '截止日期', field: 'dateend', align: 'center', width: '5%'},
          {label: '截止时间', field: 'timeend', align: 'center', width: '5%'},
          {label: '对倒数量', field: 'backnum', align: 'center', width: '5%'},
          {label: '对倒金额', field: 'backamount', align: 'center', width: '5%'},
          {label: '对倒均价', field: 'backavgprice', align: 'center', width: '5%'},
          {label: '买申报数量', field: 'declare_b', align: 'center', width: '5%'},
          {label: '买申报金额', field: 'ordrexeprc_b', align: 'center', width: '5%'},
          {label: '买申报均价', field: 'avgprice_b', align: 'center', width: '5%'},
          {label: '买成交数量', field: 'trdqty_b', align: 'center', width: '5%'},
          {label: '买成交金额', field: 'tradmtchprc_b', align: 'center', width: '5%'},
          {label: '买成交均价', field: 'trdaveprice_b', align: 'center', width: '5%'},
          {label: '卖申报数量', field: 'declare_s', align: 'center', width: '5%'},
          {label: '卖申报金额', field: 'ordrexeprc_s', align: 'center', width: '5%'},
          {label: '卖申报均价', field: 'avgprice_s', align: 'center', width: '5%'},
          {label: '卖成交数量', field: 'trdqty_s', align: 'center', width: '5%'},
          {label: '卖成交金额', field: 'tradmtchprc_s', align: 'center', width: '5%'},
          {label: '卖成交均价', field: 'trdaveprice_s', align: 'center', width: '5%'}
        ],
        analysicAccountData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }, //   分析表格数据
        analysicAccountColumns: [
          {label: '成交编号', field: 'tranidno', align: 'center', width: '5%'},
          {label: '成交日期', field: 'trandat', align: 'center', width: '5%'},
          {label: '成交时间', field: 'trantim', align: 'center', width: '5%'},
          {label: '成交数量', field: 'trdqty', align: 'center', width: '5%'},
          {label: '成交价格', field: 'tradmtchprc', align: 'center', width: '5%'},
          {
            label: '买方账户',
            field: 'invacctno_b',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhk')
          },
          {
            label: '买方账户名称',
            field: 'b_accountname',
            align: 'left',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rqmc')
          },
          {label: '买方一码通账户', field: 'b_ymt_account_id', align: 'left', width: '5%'},
          {
            label: '买方PBU',
            field: 'pbuid_b',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mqhq')
          },
          {
            label: '买方营业部名称',
            field: 'brnid_b',
            align: 'left',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rzpc')
          },
          {label: '买方券商名称', field: 'member_id_b', align: 'left', width: '5%'},
          {label: '卖方账户', field: 'invacctno_s', align: 'center', width: '5%'},
          {label: '卖方账户名称', field: 's_accountname', align: 'left', width: '5%'},
          {label: '卖方一码通账户', field: 's_ymt_account_id', align: 'center', width: '5%'},
          {label: '卖方PBU', field: 'pbuid_s', align: 'center', width: '5%'},
          {label: '卖方营业部名称', field: 'brnid_s', align: 'left', width: '5%'},
          {label: '卖方券商名称', field: 'member_id_s', align: 'left', width: '5%'},
          {label: '平台类型', field: 'platformtype', align: 'center', width: '5%'},
          {label: '交易类型', field: 'trdtyp', align: 'center', width: '5%'},
          {label: '买方订单类型', field: 'ordrtypcod_b', align: 'center', width: '5%'},
          {label: '卖方订单类型', field: 'ordrtypcod_s', align: 'center', width: '5%'},
          {label: '买方信用类型', field: 'credittag_b', align: 'center', width: '5%'},
          {label: '卖方信用类型', field: 'credittag_s', align: 'center', width: '5%'},
          {label: '买方申报价格', field: 'ordrexeprc_b', align: 'center', width: '5%'},
          {label: '卖方申报价格', field: 'ordrexeprc_s', align: 'center', width: '5%'},
          {label: '买方申报数量', field: 'declare_b', align: 'center', width: '5%'},
          {label: '卖方申报数量', field: 'declare_s', align: 'center', width: '5%'}
        ],
        isShow: true,
        dealTypePrams: 1,
        pagingParams: {}, //  分页查询参数
        cellClassName: this.fnCellClassName,
        // 高亮行所需参数
        participantCodeArr: []
      }
    },
    mounted() {
      //  获取平台类型数据
      this.getPlatform()
      this.getDealType()
      this.getOrderType()
      this.getCreditType()
      this.queryTableData()
    },
    methods: {
      fnexportTimeTable() {
        let params = {}
        for (let k in this.selectParams) {
          params[k] = this.selectParams[k]
        }
        params.tableLevel = 'maintable'
        params.stockCode = this.routerParams.isinCode
        params.dateTimeStart = this.routerParams.dateTimeValue[0]
        params.dateTimeEnd = this.routerParams.dateTimeValue[1]
        params.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        params['tableColumns'] = this.timeAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/bargaindetail/countTable-export', JSON.stringify(params))
      },
      fnexportDetailTable() {
        let params = {}
        for (let k in this.selectParams) {
          params[k] = this.selectParams[k]
        }
        params.tableLevel = 'maintable'
        params.stockCode = this.routerParams.isinCode
        params.dateTimeStart = this.routerParams.dateTimeValue[0]
        params.dateTimeEnd = this.routerParams.dateTimeValue[1]
        params.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        params['tableColumns'] = this.analysicAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/bargaindetail/export', JSON.stringify(params))
      },
      //  获取平台类型数据
      getPlatform() {
        getPlatformTypeData('platform').then(resp => {
          resp.forEach((el) => {
            this.platformTypeOptions.push({value: el.value, label: el.text})
          })
        })
      },
      //  获取交易类型
      getDealType() {
        this.detailTypeOptions = [{value: 'ALL', label: '全部'}]
        getDealTypeData('transaction', this.dealTypePrams).then((resp) => {
          resp.forEach((el) => {
            this.detailTypeOptions.push({value: el.value, label: el.text})
          })
        })
      },
      //  平台类型切换
      changePlatformType(val) {
        if (val == '1') {
          this.isShow = true
          this.dealTypePrams = 1
          this.selectParams.transaction = 'X'
        } else if (val == '2') {
          this.isShow = true
          this.dealTypePrams = 2
          this.selectParams.transaction = 'ALL'
        } else {
          this.isShow = false
        }
        this.getDealType()
      },
      //  获取订单类型
      getOrderType() {
        getPlatformTypeData('order').then(resp => {
          resp.forEach((el) => {
            this.orderTypeOption.push({value: el.value, label: el.text})
          })
        })
      },
      //  获取信用类型
      getCreditType() {
        getPlatformTypeData('credit').then(resp => {
          resp.forEach((el) => {
            this.creditTypeOption.push({value: el.value, label: el.text})
          })
        })
      },
      tableRowClassName({row}) {
        let index = this.routerParams.monitorAccount.findIndex(item => {
          return item == row.invacctno_b
        })
        if (index != -1) {
          return 'tableColor'
        }
        return ''
      },
      handleCurrentChange(val) {
      },
      orderType(val) {
        this.selectParams.order = val.join(',')
      },
      creditType(val) {
        this.selectParams.credit = val.join(',')
      },
      getTxtData(val) {
        this.selectParams.invacctnos = val.join(',')
      },
      getPageination(pageinationVal) {
        this.analysicAccountData.pageRows = pageinationVal.pageSizeNumber
        this.analysicAccountData.pageIndex = pageinationVal.currentPage
        this.getTableData()
      },
      //  表格数据请求
      getTableData(params = this.pagingParams) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        params.pageRows = this.analysicAccountData.pageRows
        params.pageIndex = this.analysicAccountData.pageIndex
        postDealDetailData(params).then(resp => {
          loading.close()
          let res = resp
          this.analysicAccountData.data = res.queryResult.bizData.metaData
          this.analysicAccountData.total = Number(res.queryResult.bizData.totalRows)
          this.timeAccountData = res.totalList
        }, () => {
          loading.close()
        })
      },
      //  查询
      queryTableData() {
        let reg1 = (this.selectParams.countStart && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.countStart)))
        let reg2 = (this.selectParams.countEnd && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.countEnd)))
        let reg3 = (this.selectParams.priceStart && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.priceStart)))
        let reg4 = (this.selectParams.priceEnd && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.priceEnd)))
        if (reg1 || reg2 || reg3 || reg4) {
          this.$message.warning('输入值不能为负,最多3位小数')
          return
        }
        // 高亮行参数切换
        this.highLightChangeParam()

        this.pagingParams = {}
        for (let k in this.selectParams) {
          this.pagingParams[k] = this.selectParams[k]
        }
        this.pagingParams.tableLevel = 'maintable'
        this.pagingParams.stockCode = this.routerParams.isinCode
        this.pagingParams.dateTimeStart = this.routerParams.dateTimeValue[0]
        this.pagingParams.dateTimeEnd = this.routerParams.dateTimeValue[1]
        this.pagingParams.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        this.analysicAccountData = {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
        this.getTableData()
      },
      //  清空
      emptyTableData() {
        for (let k in this.selectParams) {
          this.selectParams[k] = ''
        }
        this.selectParams.participantLevel = 'account'
        this.selectParams.platform = '1'
        this.selectParams.transaction = 'X'
        this.selectParams.saleState = 'B,S'
        this.$refs.cancelorder.cancel()
        this.$refs.cancelcredit.cancel()
        this.$refs.cancelaccountGroup.cancel()
      },
      // 高亮行
      fnCellClassName({row, column}) {
        for (let i = 0; i < this.participantCodeArr.length; i++) {
          if ($.trim(row[this.key1]) == this.participantCodeArr[i]) {
            switch (column.property) {
              case 'invacctno_b':
              case 'b_accountname':
              case 'b_ymt_account_id':
              case 'pbuid_b':
              case 'brnid_b':
              case 'member_id_b':
                return 'highLightBg';
                // eslint-disable-next-line
                break;
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
                return 'highLightBg';
                // eslint-disable-next-line
                break;
            }
          }
        }
        return ''
      },
      highLightChangeParam() {
        switch (this.selectParams.participantLevel) {
          case 'account':
            this.participantCodeArr = this.selectParams.invacctnos.split(',');
            this.key1 = 'invacctno_b'
            this.key2 = 'invacctno_s'
            break
          case 'salePart':
            this.participantCodeArr = this.selectParams.selectStockCodeName
            this.key1 = 'brnid_b'
            this.key2 = 'brnid_s'
            break
          case 'pbu':
            this.participantCodeArr = this.selectParams.selectStockCodeVal
            this.key1 = 'pbuid_b'
            this.key2 = 'pbuid_s'
            break;
          case 'member':
            this.participantCodeArr = this.selectParams.selectStockCodeName
            this.key1 = 'member_id_b'
            this.key2 = 'member_id_s'
            break
        }
      }
    }
  }
</script>

<style lang="less">
  .transactionDetails .import-btn {
    position: relative;
    top: -33px;
    left: 60px;
    float: right
  }

  .transactionDetails .tableColor {
    background-color: #3d507a !important;
  }

  .transactionDetails .txtInput {
    .el-input__inner {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .transactionDetails .el-table tr td.highLightBg {
    background: green !important;
    color: #fff;
  }

  .transactionDetails .tableTitle {
    padding: 8px 0px;
    line-height: 30px;
    font-size: 16px;
    color: #fff;
  }
</style>
