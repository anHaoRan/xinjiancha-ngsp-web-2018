<template>
  <div class="reportDetail">
    <el-form :inline="true" :model="formParams" :rules="rules">
      <el-card style="overflow: visible">
        <el-row :gutter="20">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者层级">
              <el-select v-model="formParams.participantValue" placeholder="请选择" size="mini">
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
            <el-form-item label="订单类型">
              <down-more-select v-model="formParams.orderType" ref="downMoreSelect"
                                :optionData="orderTypeOption"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="排序类型">
              <el-select v-model="formParams.sortType" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in sortTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="信用类型">
              <down-more-select v-model="formParams.creditType" ref="downMoreSelect1"
                                :optionData="creditTypeOption"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者代码" v-if="formParams.participantValue == 'account'" prop="participantCode">
              <div style="display: flex;">
                <el-input type="text" v-model="formParams.participantCode" size="mini" class="txtInput"
                          clearable></el-input>
                <text-upload @getTxtCon="getTxtData"></text-upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="申报价格">
              <div style="display: flex">
                <el-input type="text" v-model="formParams.declarePriceStart" size="mini" placeholder="上限>0"
                          style="width: 120px">
                  {{formParams.declarePriceStart}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="formParams.declarePriceEnd" size="mini" placeholder="下限>0"
                          style="width: 120px">
                  {{formParams.declarePriceEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="申报数量">
              <div style="display: flex">
                <el-input type="text" v-model="formParams.declareCountStart" size="mini" placeholder="上限>0"
                          style="width: 120px">
                  {{formParams.declareCountStart}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="formParams.declareCountEnd" size="mini" placeholder="下限>0"
                          style="width: 120px">
                  {{formParams.declareCountEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <div style="display: flex;margin-left: 35px">
                前
                <el-input type="number" v-model="formParams.number" size="mini">
                </el-input>
                名
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <div style="margin-left: 40px">
                <el-button type="primary" size="small" @click="ajaxDeclaredetail">查询</el-button>
                <el-button type="info" size="small" @click="fnEmptySelectParams">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row class="tableTitle" style="margin-top: -30px">
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
                      :rowClassName="tableRowClassName"
                      :data="analysicAccountData"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import DownMoreSelect from '../../../common/downMoreSelect'
  import TextUpload from '../../../common/textUpload'
  import {declaredetail} from '@/service/analysisTool/realTimeDetection/index'
  import {
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
        //  orderTypeOption: ['选中账户', '待分析账户', '待监控账户'], // 传递给子组件的账户组数据
        formParams: {
          orderType: [], // 订单类型
          creditType: [], //  信用类型
          participantValue: 'account', // 参与者层级
          sortType: 'B,S', // 排序类型
          participantCode: '', // 参与者代码
          declareCountStart: '', // 申报数量
          declareCountEnd: '',
          declarePriceStart: '', // 申报价格
          declarePriceEnd: '',
          number: 50, //  前几名
          brnid: '' //  营业部id
        },
        rules: {
          participantCode: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确参与者代码',
            trigger: 'blur'
          }]
        },
        participantOptions: [
          {
            value: 'account',
            label: '账号',
            disabled: false
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
        ],
        sortTypeOptions: [
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
        analysicAccountData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }, //   分析表格数据
        analysicAccountColumns: [
          {label: '申报编号', field: 'ordrno', align: 'left', width: '5%'},
          {label: '申报日期', field: 'trandat', align: 'left', width: '5%'},
          {label: '申报时间', field: 'trantim', align: 'left', width: '5%'},
          {label: '参与者代码', field: 'accountid', align: 'left', width: '6%'},
          {label: '参与者名称', field: 'investor_account_name', align: 'left', width: '6%'},
          {
            label: '一码通账户',
            field: 'ymt_account_id',
            align: 'left',
            width: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ymt_account_id')
          },
          {
            label: '方向',
            field: 'ordrbuycod',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrbuycod')
          },
          {label: '申报价格', field: 'ordrexeprc', align: 'right', width: '5%'},
          {
            label: '申报数量',
            field: 'orderqty',
            align: 'right',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'orderqty')
          },
          {
            label: '未成交量',
            field: 'ordrqty',
            align: 'right',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty')
          },
          {label: '订单状态', field: 'trntpyid', align: 'center', width: '5%'},
          {label: '营业部名称', field: 'branch_name', align: 'left', width: '6%'},
          {label: '券商名称', field: 'member_name', align: 'left', width: '5%'},
          {label: '订单类型', field: 'ordrtypcod', align: 'center', width: '5%'},
          {label: '信用类型', field: 'credittag', align: 'center', width: '5%'},
          {label: 'PBU代码', field: 'pbuoscod', align: 'left', width: '5'},
          {label: '撤单时间', field: 'can_tim', align: 'left', width: '5%'}
        ]
      }
    },
    watch: {},
    methods: {
      fnexportDetailTable() {
        let params = {}
        params = {
          stockCode: this.routerParams.isinCode,
          dateTimeStart: this.routerParams.dateTimeValue[0],
          dateTimeEnd: this.routerParams.dateTimeValue[1],
          actorKind: this.formParams.participantValue,
          actorKindCode: this.formParams.participantCode,
          brnid: this.formParams.brnid,
          saleState: this.formParams.sortType,
          priceStart: this.formParams.declarePriceStart,
          priceEnd: this.formParams.declarePriceEnd,
          numberStart: this.formParams.declareCountStart,
          numberEnd: this.formParams.declareCountEnd,
          orderType: this.formParams.orderType.join(','),
          creditType: this.formParams.creditType.join(','),
          rank: this.formParams.number,
          pageIndex: this.analysicAccountData.pageIndex,
          pageRows: this.analysicAccountData.pageRows,
          orderState: 'M,O,W'
        }
        params['tableColumns'] = this.analysicAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/declaredetail-export', JSON.stringify(params))
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
      ajaxDeclaredetail(flag) {
        let reg1 = (this.formParams.declarePriceStart && !(/^\d+(\.\d{1,3})?$/.test(this.formParams.declarePriceStart)))
        let reg2 = (this.formParams.declarePriceEnd && !(/^\d+(\.\d{1,3})?$/.test(this.formParams.declarePriceEnd)))
        let reg3 = (this.formParams.declareCountStart && !(/^\d+(\.\d{1,3})?$/.test(this.formParams.declareCountStart)))
        let reg4 = (this.formParams.declareCountEnd && !(/^\d+(\.\d{1,3})?$/.test(this.formParams.declareCountEnd)))
        if (reg1 || reg2 || reg3 || reg4) {
          this.$message.warning('输入值不能为负,最多3位小数')
          return
        }
        if (this.formParams.number > 1000) {
          this.$message.warning('前N名最大查询值为1000,请输入正确数值')
          this.formParams.number = 50
        } else {
          let param = {
            stockCode: this.routerParams.isinCode,
            dateTimeStart: this.routerParams.dateTimeValue[0],
            dateTimeEnd: this.routerParams.dateTimeValue[1],
            actorKind: this.formParams.participantValue,
            actorKindCode: this.formParams.participantCode,
            brnid: this.formParams.brnid,
            saleState: this.formParams.sortType,
            priceStart: this.formParams.declarePriceStart,
            priceEnd: this.formParams.declarePriceEnd,
            numberStart: this.formParams.declareCountStart,
            numberEnd: this.formParams.declareCountEnd,
            orderType: this.formParams.orderType.join(','),
            creditType: this.formParams.creditType.join(','),
            rank: this.formParams.number,
            pageIndex: flag ? this.analysicAccountData.pageIndex : 1,
            pageRows: flag ? this.analysicAccountData.pageRows : 10,
            orderState: 'M,O,W'
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,0.7)'
          })
          declaredetail(param).then((res) => {
            loading.close()
            this.analysicAccountData.total = Number(res.bizData.rows)
            this.analysicAccountData.data = res.bizData.metaData
          }, () => {
            loading.close()
          })
        }
      },
      tableRowClassName({row}) {
        let index = this.routerParams.monitorAccount.findIndex(item => {
          return item == row.accountid
        })
        if (index != -1) {
          return 'tableColor'
        }
        return ''
      },
      handleCurrentChange(val) {
      },
      getTxtData(val) {
        this.formParams.participantCode = val.join(',')
      },
      //  分页方法
      getPageination(pageinationVal) {
        this.analysicAccountData.pageRows = pageinationVal.pageSizeNumber
        this.analysicAccountData.pageIndex = pageinationVal.currentPage
        this.ajaxDeclaredetail(true)
      },
      fnEmptySelectParams() {
        this.formParams.orderType = []
        this.formParams.creditType = []
        this.formParams.participantValue = 'account'
        this.formParams.sortType = 'B'
        this.formParams.participantCode = ''
        this.formParams.declareCountStart = ''
        this.formParams.declareCountEnd = ''
        this.formParams.declarePriceStart = ''
        this.formParams.declarePriceEnd = ''
        this.formParams.number = 50
        this.formParams.accountGroup = []
        this.formParams.brnid = ''
        this.$refs.downMoreSelect.cancel()
        this.$refs.downMoreSelect1.cancel()
      }
    },
    created() {
      this.getOrderType()
      this.getCreditType()
      this.ajaxDeclaredetail()
    },
    mounted() {
    }
  }
</script>

<style lang="less">
  .reportDetail {
    .tableColor {
      background-color: #3d507a !important;
    }
    .import-btn {
      position: relative;
      top: -33px;
      left: 60px;
      float: right
    }
    .txtInput {
      .el-input__inner {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .businessDepart {
      .el-form-item__content {
        min-width: 500px;
      }
    }
    .tableTitle {
      padding: 8px 0px;
      line-height: 30px;
      font-size: 16px;
      color: #fff;
    }
  }
</style>
