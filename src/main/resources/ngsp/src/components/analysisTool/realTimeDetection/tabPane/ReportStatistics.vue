<template>
  <div class="reportStatistics">
    <el-form :inline="true" :model="selectParams" label-width="100px" :rules="rules">
      <el-card style="overflow: visible">
        <el-row :gutter="20">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="订单类型">
              <down-more-select v-model="selectParams.ordrtypcod" @input="orderType"
                                :optionData="orderTypeOption" ref="cancelOrdrtypcod"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="申报价格">
              <div style="display: flex">
                <el-input type="text" v-model="selectParams.ordrexeprcBegin" size="mini" placeholder="上限≥0"
                          style="width: 120px">
                  {{selectParams.ordrexeprcBegin}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="selectParams.ordrexeprcEnd" size="mini" placeholder="下限≥0"
                          style="width: 120px">
                  {{selectParams.ordrexeprcEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者层级">
              <el-select v-model="selectParams.actorKind" placeholder="请选择" size="mini">
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
            <el-form-item label="账户组">
              <down-more-select v-model="selectParams.accountGroup"
                                :optionData="accountGroupOption" ref="cancelAccountGroup"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="信用类型">
              <down-more-select v-model="selectParams.credittag" @input="creditType"
                                :optionData="creditTypeOption" ref="cancelcredittag"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="申报数量">
              <div style="display: flex">
                <el-input type="text" v-model="selectParams.ordrqtyBegin" size="mini" placeholder="上限>0"
                          style="width: 120px">
                  {{selectParams.ordrqtyBegin}}
                </el-input>
                <span>至</span>
                <el-input type="text" v-model="selectParams.ordrqtyEnd" size="mini" placeholder="下限>0"
                          style="width: 120px">
                  {{selectParams.ordrqtyEnd}}
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者代码" prop="invacctno">
              <div style="display: flex;" v-if="selectParams.actorKind == 'account'">
                <el-input type="text" v-model="selectParams.invacctno" size="mini" class="txtInput" clearable>
                </el-input>
                <text-upload @getTxtCon="getTxtData"></text-upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <div style="display: flex;margin-left: 47px">
                前
                <el-input type="text" v-model="selectParams.topN" size="mini">
                  {{selectParams.topN}}
                </el-input>
                名
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="排序类型">
              <el-select v-model="selectParams.sortType" placeholder="请选择" size="mini">
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
            <el-form-item label="">
              <div style="margin-left: 30px">
                <el-button type="primary" size="small" @click="queryTableData">查询</el-button>
                <!--<el-button type="primary" size="small" @click="queryTableData">条件查询</el-button>-->
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
        <margin-table :isPageination="false" :height="200" :columns="timeAccountColumns"
                      @current-change="handleCurrentChange" :data="{data:timeAccountData}"/>
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
        <margin-table :isPageination="false" :columns="analysicAccountColumns" @current-change="handleCurrentChange"
                      :rowClassName="tableRowClassName" :data="{data:analysicAccountData}"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import DownMoreSelect from '../../../common/downMoreSelect'
  import TextUpload from '../../../common/textUpload'
  import {postDeclaredCountData} from '@/service/analysisTool/realTimeDetection/index'
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
        creditTypeOption: [], // 传递给子组件的信用类型数据
        accountGroupOption: [
          {value: '选中账户', label: '选中账户'},
          {value: '待分析账户', label: '待分析账户'},
          {value: '待监控账户', label: '待监控账户'}], // 传递给子组件的账户组数据
        selectParams: {
          ordrtypcod: '', //  订单类型
          credittag: '', // 信用类型
          actorKind: 'account', //  参与者层级
          sortType: 'B', // 排序类型
          invacctno: '', // 参与者代码
          ordrqtyBegin: '', //  申报开始数量
          ordrqtyEnd: '', //  申报结束数量
          ordrexeprcBegin: '', // 申报最高价
          ordrexeprcEnd: '', // 申报最低价
          topN: 50, //  前几名
          accountGroup: '' // 账户组
        },
        rules: {
          invacctno: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确参与者代码',
            trigger: 'blur'
          }]
        },
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
        ],
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
        timeAccountData: [], //  时间段统计表格数据
        timeAccountColumns: [
          {label: '项目', field: 'project', align: 'center', width: '6.5%'},
          {label: '前一日持仓', field: 'position_amount_old', align: 'center', width: '6.5%'},
          {label: '时间段', field: 'timeslot', align: 'center', width: '10%'},
          {label: '申报买入数量', field: 'b_ordr_qty', align: 'center', width: '6.5%'},
          {label: '买入成交量', field: 'b_trd_qty', align: 'center', width: '6.5%'},
          {label: '买入未成交量', field: 'b_untrd_qty', align: 'center', width: '6.5%'},
          {label: '买入撤单量', field: 'b_cancle_qty', align: 'center', width: '6.5%'},
          {label: '申报卖出数量', field: 's_ordr_qty', align: 'center', width: '6.5%'},
          {label: '卖出成交量', field: 's_trd_qty', align: 'center', width: '6.5%'},
          {label: '卖出未成交量', field: 's_untrd_qty', align: 'center', width: '6.5%'},
          {label: '卖出撤单量', field: 's_cancle_qty', align: 'center', width: '6.5%'}
        ],
        analysicAccountData: [], //   分析表格数据
        analysicAccountColumns: [
          {label: '序号', field: 'rn', align: 'center', width: '5%'},
          {label: '账户代码', field: 'invacctno', align: 'center', width: '5%'},
          {label: '账户名称', field: 'invacctname', align: 'center', width: '5%'},
          {label: 'PBU代码', field: 'pbuoscod', align: 'center', width: '5%'},
          {label: '营业部名称', field: 'brnname', align: 'center', width: '5%'},
          {
            label: '申报买入数量',
            field: 'b_ordr_qty',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty')
          },
          {
            label: '买入成交量',
            field: 'b_trd_qty',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trd_qty')
          },
          {label: '买入未成交量', field: 'b_untrd_qty', align: 'center', width: '6%'},
          {
            label: '买入撤单量',
            field: 'b_cancle_qty',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancle_qty')
          },
          {
            label: '申报买入数量占市场比例',
            field: 'b_ordr_qty_rio',
            align: 'center',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_ordr_qty_rio')
          },
          {label: '买入撤单量占市场比例', field: 'b_cancle_qty_rio', align: 'center', width: '8%'},
          {label: '申报卖出数量', field: 's_ordr_qty', align: 'center', width: '6%'},
          {label: '卖出成交量', field: 's_trd_qty', align: 'center', width: '5%'},
          {label: '卖出未成交量', field: 's_untrd_qty', align: 'center', width: '5%'},
          {label: '卖出撤单量', field: 's_cancle_qty', align: 'center', width: '5%'},
          {label: '申报卖出数量占市场比例', field: 's_ordr_qty_rio', align: 'center', width: '8%'},
          {label: '卖出撤单量占市场比例', field: 's_cancle_qty_rio', align: 'center', width: '8%'},
          {label: '申报买入次数', field: 'b_ordr_count', align: 'center', width: '5%'},
          {label: '买入撤单次数', field: 'b_ordr_cancle_count', align: 'center', width: '5%'},
          {label: '申报卖出次数', field: 's_ordr_count', align: 'center', width: '5%'},
          {label: '卖出撤单次数', field: 's_ordr_cancle_count', align: 'center', width: '5%'},
          {label: '买方申报均价', field: 'b_ordr_avgprice', align: 'center', width: '5%'},
          {label: '卖方申报均价', field: 's_ordr_avgprice', align: 'center', width: '5%'}
        ],
        routerParams: '' //  url参数
      }
    },
    mounted() {
      this.getOrderType()
      this.getCreditType()
      this.queryTableData()
    },
    methods: {
      handleCurrentChange(val) {
      },
      fnexportTimeTable() {
        let params = {}
        for (let k in this.selectParams) {
          params[k] = this.selectParams[k]
        }
        params.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        params.tableLevel = 'maintable'
        params.stockCode = this.routerParams.isinCode
        params.dateTimeStart = this.routerParams.dateTimeValue[0]
        params.dateTimeEnd = this.routerParams.dateTimeValue[1]
        params['tableColumns'] = this.timeAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/orderTotal/countTable-export', JSON.stringify(params))
      },
      fnexportDetailTable() {
        let params = {}
        for (let k in this.selectParams) {
          params[k] = this.selectParams[k]
        }
        params.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        params.tableLevel = 'maintable'
        params.stockCode = this.routerParams.isinCode
        params.dateTimeStart = this.routerParams.dateTimeValue[0]
        params.dateTimeEnd = this.routerParams.dateTimeValue[1]
        params['tableColumns'] = this.analysicAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/orderTotal/export', JSON.stringify(params))
      },
      tableRowClassName({row}) {
        let index = this.routerParams.monitorAccount.findIndex(item => {
          return item == row.invacctno
        })
        if (index != -1) {
          return 'tableColor'
        }
        return ''
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
      //  订单类型
      orderType(val) {
        this.selectParams.ordrtypcod = val.join(',')
      },
      //  信用类型
      creditType(val) {
        this.selectParams.credittag = val.join(',')
      },
      // accountGroup(val) {
      //   this.selectParams.accountGroup = this.getAccountGroup(val)
      // },
      getTxtData(val) {
        this.selectParams.invacctno = val.join(',')
      },
      queryTable() {
        let params = {}
        params.stockCode = this.routerParams.isinCode
        params.actorKind = this.selectParams.actorKind
        params.sortType = this.selectParams.sortType
        params.topN = this.selectParams.topN
        params.dateTimeStart = this.routerParams.dateTimeValue[0]
        params.dateTimeEnd = this.routerParams.dateTimeValue[1]
        params.tableLevel = 'maintable'
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        postDeclaredCountData(params).then(resp => {
          loading.close()
          let res = resp
          this.analysicAccountData = res.queryResult.bizData.metaData
          this.timeAccountData = res.qrTotal
        }, () => {
          loading.close()
        })
      },
      //  条件查询
      queryTableData() {
        let reg1 = (this.selectParams.ordrqtyBegin && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.ordrqtyBegin)))
        let reg2 = (this.selectParams.ordrqtyEnd && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.ordrqtyEnd)))
        let reg3 = (this.selectParams.ordrexeprcBegin && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.ordrexeprcBegin)))
        let reg4 = (this.selectParams.ordrexeprcEnd && !(/^\d+(\.\d{1,3})?$/.test(this.selectParams.ordrexeprcEnd)))
        if (reg1 || reg2 || reg3 || reg4) {
          this.$message.warning('输入值不能为负,最多3位小数')
          return
        }
        if (this.selectParams.topN > 1000) {
          this.$message.warning('前N名最大查询值为1000,请输入正确数值')
          this.selectParams.topN = 50
        } else {
          let params = {}
          for (let k in this.selectParams) {
            params[k] = this.selectParams[k]
          }
          params.accountGroup = this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
          params.tableLevel = 'maintable'
          params.stockCode = this.routerParams.isinCode
          params.dateTimeStart = this.routerParams.dateTimeValue[0]
          params.dateTimeEnd = this.routerParams.dateTimeValue[1]
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,0.7)'
          })
          postDeclaredCountData(params).then(resp => {
            loading.close()
            let res = resp
            this.analysicAccountData = res.queryResult.bizData.metaData
            this.timeAccountData = res.qrTotal
          }, () => {
            loading.close()
          })
        }
      },
      //  清空
      emptyTableData() {
        for (let k in this.selectParams) {
          this.selectParams[k] = ''
        }
        this.selectParams.actorKind = 'account'
        this.selectParams.sortType = 'B'
        this.selectParams.topN = 50
        this.$refs.cancelOrdrtypcod.cancel()
        this.$refs.cancelAccountGroup.cancel()
        this.$refs.cancelcredittag.cancel()
      }
    }
  }
</script>

<style lang="less">
  .reportStatistics .import-btn {
    position: relative;
    top: -33px;
    left: 60px;
    float: right
  }

  .reportStatistics .txtInput {
    .el-input__inner {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .reportStatistics .tableColor {
    background-color: #3d507a !important;
  }

  .reportStatistics .tableTitle {
    padding: 8px 0px;
    line-height: 30px;
    font-size: 16px;
    color: #fff;
  }
</style>
