<template>
  <div class="product-query">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-form style="margin-top: 20px;margin-left: 20px;">
      <el-row>
        <!--证券代码公共组件-->
        <el-col :span="6">
          <el-col :span="6" class="name"><span class="mustInput name">*</span>证券代码：</el-col>
          <el-col :span="13">
            <stock-code-query :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
          </el-col>
          <!--双人双密功能-->
          <el-col :span="4" :offset="1">
            <el-button
                type="primary"
                size="small"
                @click="dialogFormVisble=true">
              双人双密
            </el-button>
            <!--双人双密弹出框-->
            <el-dialog
                title="双人双密"
                :visible.sync="dialogFormVisble"
                center
                width="550px">
              <el-form :model='towPTowPVal' :label-width="formLabelWidth">
                <el-form-item label="本机用户密码：">
                  <el-input type="password" size="small" v-model="towPTowPVal.password1"
                            auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="第二用户名称：">
                  <el-input v-model="towPTowPVal.username2" size="small"
                            auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="第二用户密码：">
                  <el-input type="password" v-model="towPTowPVal.password2" size="small"
                            auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
                <el-button type="text" size="small" @click="cancleVeryfy">取 消</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-col>
        <!--时间选择-->
        <el-col :span="6" :offset="3">
          <el-col :span="3" class="name"><span class="mustInput name">*</span>时间：</el-col>
          <el-col :span="6">
            <el-date-picker v-model="commonDatePickerVal"
                            type="datetimerange"
                            :picker-options="commonDatePickerOptions"
                            :default-time="['09:00:00','17:00:00']"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            size="small"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="changeQueryDateCondition">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="1" :offset="8">
          <el-button type="primary" size="small" @click="showTabs">
            确定
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--双人双密验证成功后展示内容-->
    <div v-show="showTabsCon">
      <!--tab标签页-->
      <el-card style="margin-top:20px;" class="product-query-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="stockCodeTypeName+'基本资料'" name="stockBasicInfoQuery">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'成交详情'" name="transactionDetail">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'申报详情'" name="stockOrderDetail">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'申报统计'" name="reportStatistics">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'成交统计'" name="transactionStatistics">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'持股集中度'" name="stockHoldDegree" v-if="stockCodeTypeName=='股票'">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'持有统计'" name="holdStatistics">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'股权结构'" name="equityStructure">
          </el-tab-pane>

          <el-tab-pane :label="stockCodeTypeName+'申购详情'" v-if="stockCodeTypeName=='基金'" name="subscribeDetail">
          </el-tab-pane>
          <el-tab-pane :label="stockCodeTypeName+'赎回详情'" v-if="stockCodeTypeName=='基金'" name="redemptionDetail">
          </el-tab-pane>
          <el-tab-pane :label="stockCodeTypeName+'申购统计'" v-if="stockCodeTypeName=='基金'" name="subscribeStatics">
          </el-tab-pane>
          <el-tab-pane :label="stockCodeTypeName+'赎回统计'" v-if="stockCodeTypeName=='基金'" name="redemptionStatics">
          </el-tab-pane>

        </el-tabs>
      </el-card>
      <!--tab标签页对应的页面组件-->
      <stock-basic-info-query :commonData="commonData"
                              v-show="'stockBasicInfoQuery'== test.path"
                              ref="getBasicInfoStock">

      </stock-basic-info-query>
      <hold-statistics :commonData="commonData"
                       v-show="'holdStatistics'== test.path "
                       ref="getHoldStatisticsStock">
      </hold-statistics>

      <stock-hold-degree :commonData="commonData"
                         v-if="'stockHoldDegree'== test.path"
                         ref="drawLineAgain">
      </stock-hold-degree>

      <transaction-detail :commonData="commonData"
                          v-show="'transactionDetail'== test.path "
                          ref="getTransactionDetailStock">
      </transaction-detail>

      <transaction-statistics :changeQueryCondition="queryCondition"
                              :commonData="commonData"
                              v-show="'transactionStatistics'== test.path"
                              ref="getTransactionStatisticsStock">
      </transaction-statistics>

      <stock-order-detail :commonData="commonData"
                          v-show="'stockOrderDetail'== test.path "
                          ref="getOrderDetailStock">
      </stock-order-detail>

      <report-statistics :commonData="commonData"
                         v-show="'reportStatistics'== test.path "
                         ref="getReportStatisticsStock">
      </report-statistics>

      <equity-structure :commonData="commonData"
                        v-show="'equityStructure'==test.path"
                        ref="getEquityStructureStock">
      </equity-structure>

      <subscribe-detail :commonData="commonData"
                        v-show="'subscribeDetail'==test.path"
                        ref="getSubscribeDetailStock">
      </subscribe-detail>
      <redemption-detail :commonData="commonData"
                         v-show="'redemptionDetail'==test.path"
                         ref="getRedemptionDetailStock">
      </redemption-detail>
      <subscribe-statics :commonData="commonData"
                         v-show="'subscribeStatics'==test.path"
                         ref="getSubscribeStaticsStock">
      </subscribe-statics>
      <redemption-statics :commonData="commonData"
                          v-show="'redemptionStatics'==test.path"
                          ref="getRedemptionStaticsStock">
      </redemption-statics>
    </div>

  </div>
</template>

<script>
  import { linkNo,transactionSelect } from '../../service/analysisTool/productQuery'
  // 面包屑
  import breadcrumb from '../../components/common/Breadcrumb'
  // 股票代码公共组件
  import StockCodeQuery from '../common/StockCodeQuery'
  // tab标签页对应页面组件
  // 基本资料
  import StockBasicInfoQuery from '../../components/analysisTool/productQuery/stockBasicInfoQuery'
  // 持股统计
  import HoldStatistics from '../../components/analysisTool/productQuery/holdStatisticsQuery'
  // 持股集中度
  import StockHoldDegree from './productQuery/holdDegree'
  // 成交详情
  import TransactionDetail from '../../components/analysisTool/productQuery/transactionDetail'
  // 成交统计
  import TransactionStatistics from '../../components/analysisTool/productQuery/transactionStatistics'
  // 申报详情
  import StockOrderDetail from '../../components/analysisTool/productQuery/stockOrderDetail'
  // 申报统计
  import ReportStatistics from './productQuery/reportStatistics'
  // 股权结构
  import EquityStructure from './productQuery/equityStructure'
  // 申购详情
  import SubscribeDetail from './productQuery/subscribeDetail'
  // 赎回详情
  import RedemptionDetail from './productQuery/redemptionDetail'
  // 申购统计
  import SubscribeStatics from './productQuery/subscribeStatics'
  // 赎回统计
  import RedemptionStatics from './productQuery/redemptionStatics'
  // 页面所需接口
  import { twoPersonTwoPsw, stockQuery } from '../../service/analysisTool/productQuery'
  import { getCurTradeDate } from '../../service/common/commonFunc'
  import { encryptByDES } from '../../utils/api'
  // 时间格式化插件
  import moment from 'moment'

  export default {
    components: {
      breadcrumb,
      StockBasicInfoQuery,
      HoldStatistics,
      StockOrderDetail,
      TransactionDetail,
      StockHoldDegree,
      ReportStatistics,
      TransactionStatistics,
      StockCodeQuery,
      EquityStructure,
      SubscribeDetail,
      RedemptionDetail,
      SubscribeStatics,
      RedemptionStatics
    },
    computed: {
      stockCodeType () {
        let stockCodeType = ''
        if (this.commonData.stockCodtTypeMoment === 'EQU') {
          stockCodeType = 'equ'
        }
        if (this.commonData.stockCodtTypeMoment === 'BON' && this.commonData.stockSubType === 'OBD') {
          stockCodeType = 'obd'
        }
        if (this.commonData.stockCodtTypeMoment === 'BON' && this.commonData.stockSubType === 'CRP') {
          stockCodeType = 'crp'
        }
        if (this.commonData.stockCodtTypeMoment === 'BON' && this.commonData.stockSubType === 'ORP') {
          stockCodeType = 'orp'
        }
        if (this.commonData.stockCodtTypeMoment === 'FUN' && (this.commonData.stockSubType === 'CEF' || this.commonData.stockSubType === 'OEF')) {
          stockCodeType = 'fun'
        }
        if (this.commonData.stockCodtTypeMoment === 'FUN' && (this.commonData.stockSubType === 'EBS' || this.commonData.stockSubType === 'ECR')) {
          stockCodeType = 'etf'
        }
        this.commonData.stockCodeType = stockCodeType
        return stockCodeType
      }
    },
    data () {
      return {
        // 面包屑
        breadcrumbItems: [
          {
            router: '/productQuery',
            label: '分析工具'
          }, {
            router: '/productQuery',
            label: '常规查询'
          }, {
            router: '/productQuery',
            label: '产品查询'
          }
        ],
        // 时间输入框绑定值
        commonDatePickerVal: [],
        // 时间范围选择
        commonDatePickerOptions: {
          shortcuts: [
            {
              text: '今日',
              onClick (picker) {
                const end = moment(new Date()).format('YYYY-MM-DD')
                const start = moment(new Date()).format('YYYY-MM-DD')
                picker.$emit('pick', [`${start} 09:00:00`, `${end} 17:00:00`])
              }
            },
            {
              text: '前5分钟',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 300 * 1000)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '前1周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '前2周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '前1个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '前2个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '前3个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        // 当前标签页
        activeName: 'stockBasicInfoQuery',
        // 双人双密弹出框
        dialogFormVisble: false,
        // tab页内容
        showTabsCon: false,
        //  showTabsCon: true,// // // // // // /
        // 基金证券类型下的基金赎回、申购详情和统计
        showFuntabs: false,
        // 双人双密参数
        towPTowPVal: {
          password1: '',
          username2: '',
          password2: ''
        },
        formLabelWidth: '120px',
        // 默认面包屑最后一级
        test: {
          name: '基本资料',
          path: 'stockBasicInfoQuery'
        },
        // 父传子的值
        commonData: {
          stockCode: '',
          // stockCode: '500001 白云机场',
          stockCodeType: '',
          // stockCodeType: 'fun',
          stockCodtTypeMoment:'',
          // stockCodtTypeMoment: 'FUN',
          stockSubType: '',
          // stockSubType: 'OEF',
          dateTimeStart: '',
          dateTimeEnd: '',
          disabled: true
        },
        stockCodeTypeMoment: '',
        // 代码类型（股票、基金、债券）
        stockCodeTypeName: '',
        // 单日/多日
        queryCondition: {
          singleDay: true
        }
      }
    },
    methods: {
      // 从股票代码公共组件中获取到的股票代码的值以及类型
      getStockCode (stockCodeData, stockCodeType, shortCode, stockSubType) {
        this.commonData.stockCode = stockCodeData
        this.commonData.stockCodtTypeMoment = stockCodeType
        this.commonData.stockSubType = stockSubType
      },
      // 双人双密验证
      veryfy () {
        var userPsw = encryptByDES(this.towPTowPVal.password1)
        var selfPsw = encryptByDES(this.towPTowPVal.password2)
        // 验证请求参数
        const doublePsw = {
          password1: userPsw,
          password2: selfPsw,
          username2: this.towPTowPVal.username2
        }
        let currentUser = this.gfnGetUsername()
        if (doublePsw.username2 === currentUser) {
          this.$message.error('当前用户名称与第二用户名称重复，请重新输入')
          return
        }
        // 去除输入内容前后空格并验证是否为空
        if (this.towPTowPVal.password1.trim() == '' || this.towPTowPVal.username2.trim() == '' || this.towPTowPVal.password2.trim() == '') {
          this.$message({
            showClose: true,
            message: '密码或用户名不能为空',
            duration: 1000,
            type: 'error'
          })
        } else {
          // 发送验证请求
          twoPersonTwoPsw(doublePsw).then((resp) => {
            // 请求通过
            if (resp) {
              this.commonData.disabled = false
              this.dialogFormVisble = false
              this.towPTowPVal.password1 = ''
              this.towPTowPVal.username2 = ''
              this.towPTowPVal.password2 = ''
            } else { // 请求失败
              this.$message({
                showClose: true,
                message: '用户/密码输入错误或用户被停用',
                duration: 1000,
                type: 'error'
              })
              this.dialogFormVisble = true
            }
          })
        }
      },
      // 取消双人双密后弹出框内容清空
      cancleVeryfy () {
        this.towPTowPVal.password1 = ''
        this.towPTowPVal.username2 = ''
        this.towPTowPVal.password2 = ''
        this.dialogFormVisble = false
      },
      // 点击确定按钮触发事件
      showTabs () {
        // 判别代码类型
        switch (this.stockCodeType) {
          case 'equ' :
            this.stockCodeTypeName = '股票'
            this.showFuntabs = false
            break
          case 'obd':
            this.stockCodeTypeName = '债券'
            this.showFuntabs = false
            break
          case 'fun':
            this.stockCodeTypeName = '基金'
            this.showFuntabs = true
            break
          case 'crp':
            this.stockCodeTypeName = '质押式回购'
            this.showFuntabs = true
            break
          case 'orp':
            this.stockCodeTypeName = '买断式回购'
            this.showFuntabs = true
            break
          case 'etf':
            this.stockCodeTypeName = 'ETF'
            this.showFuntabs = true
            break
        }
        // 股票代码和时间空值判断
        if (this.commonData.stockCode == '' || ($.isEmptyObject(this.commonDatePickerVal))) {
          this.$message({
            showClose: true,
            message: '证券代码、时间不能为空或输入有误！',
            duration: 1000,
            type: 'error'
          })
        } else {
          this.commonData.dateTimeStart = moment(this.commonDatePickerVal[0]).format('YYYY-MM-DD HH:mm:ss')
          this.commonData.dateTimeEnd = moment(this.commonDatePickerVal[1]).format('YYYY-MM-DD HH:mm:ss')
          if (this.commonData.dateTimeStart === this.commonData.dateTimeEnd) {
            this.$message.error('开始时间与结束时间不能相同')
            return
          }
          // 单双日判断
          let start = this.commonData.dateTimeStart.split(' ')[0]
          let end = this.commonData.dateTimeEnd.split(' ')[0]
          start = moment(start, 'YYYY-MM-DD').format('YYYYMMDD')
          end = moment(end, 'YYYY-MM-DD').format('YYYYMMDD')
          if (start == end) {
            this.queryCondition.singleDay = true
            this.$refs.getTransactionStatisticsStock.defaultParticelLevel()
          } else {
            this.$refs.getTransactionStatisticsStock.defaultStatisticsWay()
            // 日期基本校验
            if ((start - 0) < (end - 0)) {
              this.queryCondition.singleDay = false
            } else if ((start - 0) > (end - 0)) {
              this.$message({
                showClose: true,
                message: '起始日期不能大于结束日期',
                duration: 1500,
                type: 'error'
              })
              return
            }
          }
          this.$refs.getBasicInfoStock.getStockCode()
          this.$refs.getHoldStatisticsStock.getStockCode()
          this.$refs.getTransactionDetailStock.getStockCode()
          this.$refs.getTransactionStatisticsStock.getStockCode()
          this.$refs.getOrderDetailStock.getStockCode()
          this.$refs.getReportStatisticsStock.getStockCode()
          this.$refs.getEquityStructureStock.getStockCode()
          this.$refs.getSubscribeDetailStock.getStockCode()
          let params = this.commonData.dateTimeEnd.split(' ')[0]
          this.$refs.getSubscribeDetailStock.getTreeRes(params)
          this.$refs.getRedemptionDetailStock.getStockCode()
          this.$refs.getRedemptionDetailStock.getTreeRes(params)
          this.$refs.getSubscribeStaticsStock.getStockCode()
          this.$refs.getRedemptionStaticsStock.getStockCode()

          this.showTabsCon = true
          this.commonData.disabled = true
          // 股票代码更新后持股集中度重绘
          if (this.activeName == 'stockHoldDegree') {
            this.$refs.drawLineAgain.getChartsOption()
          }
        }
      },
      // 输入日期变化触发
      changeQueryDateCondition (val) {
        // let [dateStart, timeStart] = val[0].split(' '),
        // [dateEnd, timeEnd] = val[1].split(' ')
        // if (timeStart === '00:00:00') {
        //   this.commonDatePickerVal[0] = dateStart + ' 09:00:00'
        // }
        // if (timeEnd === '00:00:00') {
        //   let nowDate = moment(new Date()).format('YYYY-MM-DD')
        //   if (nowDate === dateEnd) {
        //     this.commonDatePickerVal[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
        //   } else {
        //     this.commonDatePickerVal[1] = dateEnd + ' 17:00:00'
        //   }
        // }
      },
      // 切换tab页触发
      handleClick (tab, event) {
        var tabArr = [
          {
            name: '持有统计',
            path: 'tab-holdStatistics'
          },
          {
            name: '持股集中度',
            path: 'tab-stockHoldDegree'
          },
          {
            name: '成交详情',
            path: 'tab-transactionDetail'
          },
          {
            name: '成交统计',
            path: 'tab-transactionStatistics'
          },
          {
            name: '申报详情',
            path: 'tab-stockOrderDetail'
          },
          {
            name: '申报统计',
            path: 'tab-reportStatistics'
          },
          {
            name: '股权结构',
            path: 'tab-equityStructure'
          },
          {
            name: '基本资料',
            path: 'tab-stockBasicInfoQuery'
          },

          {
            name: '申购详情',
            path: 'tab-subscribeDetail'
          },
          {
            name: '赎回详情',
            path: 'tab-redemptionDetail'
          },
          {
            name: '申购统计',
            path: 'tab-subscribeStatics'
          },
          {
            name: '赎回统计',
            path: 'tab-redemptionStatics'
          }
        ]
        for (let i = 0; i < tabArr.length; i++) {
          if (event.target.id == tabArr[i].path) {
            this.test.path = tabArr[i].path.split('-')[1]
            this.test.name = this.stockCodeType + tabArr[i].name
          }
        }
      }

    },
    created(){
      linkNo('order').then((resp) => {
        this.$store.commit('getOrderOptions',resp)
      })
      linkNo('credit').then((resp) => {
        this.$store.commit('getCreditOptions',resp)
      })
      transactionSelect('particiLevel', 'statis').then((resp) => {
        this.$store.commit('getParticipantLevelOptions',resp)
      })
    },
    mounted () {
      if (this.$route.params.stockCode) {
        let stockCode = this.$route.params.stockCode
        stockQuery(stockCode, '', 1, 10).then(resp => {
          if (resp.length === 0) {
            this.$message.warning('未查到该证券代码')
            return
          }
          let targetRes = resp[0]
          this.commonData.stockCode = `${targetRes.security_id} ${targetRes.security_chn_short_name}`
          this.commonData.stockCodtTypeMoment = targetRes.security_type_code
        }).then(() => {
          this.showTabs()
        })
      }
      this.stockCodeOptions = this.stockCodeList
      //  删除面包屑最后一级，动态添加
      //  this.breadcrumbItems.pop();
      // 从后台获取当前交易日期
      getCurTradeDate().then(resp => {
        let date = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.commonDatePickerVal = [date + ' 09:00:00', date + ' 17:00:00']
      })
    }
  }
</script>

<style lang="less">
  .product-query {

    span.el-range-separator {
      color: #7b8fb9;
    }
    .name {
      line-height: 32px;
    }
    .el-dialog {
      .el-dialog__body {
        padding-bottom: 0;
        padding-right: 35px;
      }

    }
  }

</style>
