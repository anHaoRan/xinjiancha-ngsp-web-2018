<!-- 可疑对象分析 -->
<template>
  <div class="suspicious-target-analysis">
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <el-button size='small' type='info' @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form :inline='true' ref='suspiciousTargetProfit' :model='formData' :rules='rules' label-width='100px'>
        <el-col :xl='6' :lg='8' :md='10' :sm='10'>
          <el-form-item label='开始日期：' prop='startDate'>
            <el-date-picker
              v-model='formData.startDate'
              type='date'
              placeholder='请选择开始日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束日期：' prop='endDate'>
            <el-date-picker
              v-model='formData.endDate'
              type='date'
              placeholder='请选择结束日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='证券代码：' prop='secCode'>
            <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg='9' :md='10' :sm='10'>
          <el-form-item label='账户代码：' prop='acctIds'>
            <account-code
              ref="suspiciousAccountList"
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify({verifies: ['ACCOUNT_CODE']})
              }"
              @getTextareaCodeList="getAccountList"></account-code>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <export-btn @handleExportData="handleDownload"></export-btn>
      <el-col>
        <el-tabs v-model='activeMenuName' @tab-click='handleMenuTabClick'>
          <el-tab-pane
            v-for='(item, index) in tabsMenu' :key='index'
            :label='item' :name='String(index)'>
            <el-card>
              <tab-table-pagination-component
                class="inner_tab-list"
                v-if="activeMenuName == index"
                :loading='loading'
                :tabsType='`card`'
                :tabPanes='tabPanesList[activeMenuName]'
                :activeName='activeNames[activeMenuName]'
                :tableDatas='tableDatas[activeMenuName]'
                :tableColumns='columns[activeMenuName]'
                :paginations='paginations[activeMenuName]'
                :showPaginationList="[true, true, true, true, false, false, false, false, false, false]"
                @handlePaginationChange='handlePaginationChange'
                @updateActiveName='updateActiveName'>
                <div :slot="`tradeRateList${count}`" v-for="(item, count) in tradeRateList[index]">
                  <el-row style="margin-bottom: 10px;">
                    <el-col :xl="4" :lg="4" :md="4" :sm="4">
                      连续交易日数 <div style="display: inline-block; width: 120px"><el-input size="small" v-model="item.date"></el-input></div>天
                    </el-col>
                    <el-col :xl="3" :lg="3" :md="3" :sm="3">
                      占比 <div style="display: inline-block; width: 70px"><el-input  size="small" v-model="item.rate"></el-input></div>%
                    </el-col>
                    <el-col :xl="3" :lg="3" :md="3" :sm="3">
                      <el-button type="primary" size="small" @click="freshBtn(count, item.tab)">刷新</el-button>
                    </el-col>
                  </el-row>
                </div>
                <div :slot="`charts0`">
                  <div v-if="setChartsIndex == 9">
                    <common-echarts-component
                            :domId="`suspiciousTarget0`"
                            :defaultOption="chartsOption[0]"
                            :propsData="chartsData[index]"
                            :propsChartHeight="chartsData[index].length ? 1600 : 440"></common-echarts-component>
                  </div>  
                </div>
                <div :slot="`charts1`">
                  <div v-if="setChartsIndex == 10">
                    <common-echarts-component
                            :domId="`suspiciousTarget1`"
                            :defaultOption="chartsOption[1]"
                            :propsData="chartsData[index]"
                            :propsChartHeight="chartsData[index].length ? 500 : 440"></common-echarts-component>
                  </div>
                </div>
                <div :slot="`charts2`">
                  <div v-if="setChartsIndex == 11">
                    <common-echarts-component
                            :domId="`suspiciousTarget2`"
                            :defaultOption="chartsOption[2]"
                            :propsData="chartsData[index]"
                            :propsChartHeight="chartsData[index].length ? 500 : 440"></common-echarts-component>
                  </div>
                </div>
              </tab-table-pagination-component>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import {
    suspiciousObjBidPrice,
    exportSuspiciousObjBidPrice,
    suspiciousObjBig,
    exportSuspiciousObjBig,
    suspiciousObjTab8JJ,
    suspiciousObjTab9JJ,
    suspiciousObjTab8DZ,
    suspiciousObjTab9DZ,
  } from '@/service/analysisTool/complexQuery/index'
  import { columns } from './componentsTool/suspiciousTargetProfit/columns'
  import { chartsList } from './componentsTool/suspiciousTargetProfit/chartsList'
  import { selfValidateMethod } from './componentsTool/common/validate'
  import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
  import CommonEchartsComponent from './componentsTool/common/CommonEchartsComponent'

  export default {
    components: {
      Breadcrumb: () => import('../../common/Breadcrumb'),
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
      tabTablePaginationComponent,
      ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
      CommonEchartsComponent
    },
    data () {
      let paginations = [[], []]
      paginations.map(item => {
        for (let i = 0; i < 4; i++) {
          item.push({
            currentPage: 1,
            pageSizeNumber: 10
          })
        }
      })
      return {
        clickedTab2: false, // 是否点击“统计时包含大宗交易数据”tab, 每次点击查询后，第一次点击第二个tab时会发起请求
        setChartsIndex: '',
        chartsData: [
          [], []
        ],
        chartsOption: [chartsList[0], chartsList[1], chartsList[2]],
        loading: false,
        activeMenuName: '0',
        tabsMenu: ['仅统计竞价交易数据', '统计时包含大宗交易数据'],
        tableDatas: [
          {}, {}
        ],
        activeNames: ['0', '0'],
        tabPanesList: [
          [
            {label: '账户组每日交易持股分析'},
            {label: '组内账户阶段交易持股分析'},
            {label: '组内账户每日交易持股分析'},
            {label: '组内账户每日对倒明细'},
            {label: '持仓总体统计表'},
            {label: '交易总体统计表'},
            {label: '对倒总体统计表'},
            {label: '账户组连续N个交易日交易占比超过X%统计表', slotType: 'prepend', slotName: 'tradeRateList0'},
            {label: '账户组连续N个交易日对倒占比超过Y%统计表', slotType: 'prepend', slotName: 'tradeRateList1'},
            {label: '图：股价、持股、买卖占比、对倒占比', slotType: 'rewrite', slotName: 'charts0'},
            {label: '图：股价、持股', slotType: 'rewrite', slotName: 'charts1'},
            {label: '图：股价、交易占比', slotType: 'rewrite', slotName: 'charts2'}
          ],
          [
            {label: '账户组每日交易持股分析'},
            {label: '组内账户阶段交易持股分析'},
            {label: '组内账户每日交易持股分析'},
            {label: '组内账户每日对倒明细'},
            {label: '持仓总体统计表'},
            {label: '交易总体统计表'},
            {label: '对倒总体统计表'},
            {label: '账户组连续N个交易日交易占比超过X%统计表', slotType: 'prepend', slotName: 'tradeRateList0'},
            {label: '账户组连续N个交易日对倒占比超过Y%统计表', slotType: 'prepend', slotName: 'tradeRateList1'},
            {label: '图：股价、持股、买卖占比、对倒占比', slotType: 'rewrite', slotName: 'charts0'},
            {label: '图：股价、持股', slotType: 'rewrite', slotName: 'charts1'},
            {label: '图：股价、交易占比', slotType: 'rewrite', slotName: 'charts2'}
          ]
        ],
        currentngspUid: '', // 用来记录上一次返回的ngspUid, 虽然有2个tab但后台是一次查询了两个tab的数据，只返回当前tab的数据
        paginations: paginations,
        tradeRateList: [
          [
            {date: '20', rate: '30', tab: 'tab8'}, // 连续交易日, 交易占比
            {date: '20', rate: '30', tab: 'tab9'}
          ],
          [
            {date: '20', rate: '30', tab: 'tab8'}, // 连续交易日, 交易占比
            {date: '20', rate: '30', tab: 'tab9'}
          ]
        ],
        querytradeRate: [],
        queryData: {},
        formData: { // 查询参数
          startDate: '',
          endDate: '',
          secCode: '',
          acctIds: ''
        },
        columns: columns,
        rules: {
          startDate: [
            {required: true, message: '请选择日期'}
          ],
          endDate: [
            {required: true, message: '请选择日期'}
          ],
          secCode: [
            {required: true, message: '请输入证券代码'}
          ],
          acctIds: [
            {required: true, message: '请输入账户代码'}
          ]
        },
        commonData: { // 证券代码
          disabled: false,
          stockCode: ''
        },
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '数据综合查询'
          }, {
            router: '/suspiciousTargetAnalysis',
            label: '可疑对象分析'
          }]
      }
    },
    methods: {
      freshBtn(count, tab) {
        if (!this.formData.acctIds) return
        let activeName = this.activeMenuName
        let params = {
          ngspUid: this.currentngspUid // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        }
        let tradeTemp = this.tradeRateList[activeName][count]
        if (tradeTemp.rate > 100 || tradeTemp.rate < 0) {
          this.$message.error('占比只能为0-100之间的数')
          return
        }
        let patt = /^[0-9]*$/g
        if (!tradeTemp.date || !patt.test(tradeTemp.date) || tradeTemp.date.length > 10) {
          this.$message.error('连续交易日不得超过1000000000')
          return
        }

        if (count == 0) {
          params.tradeDateCnt = tradeTemp.date // 连续交易日
          params.tradeRate = tradeTemp.rate // 交易占比
        } else {
          params.tradeInterDateCnt = tradeTemp.date // 连续交易日
          params.tradeInterRate = tradeTemp.rate // 交易占比
        }
        this.loading = true
        let urls = [
          [suspiciousObjTab8JJ, suspiciousObjTab9JJ], [suspiciousObjTab8DZ, suspiciousObjTab9DZ]
        ]
        urls[activeName][count](params).then((resp) => {
          this.loading = false
          if (resp) {
           // resp = {
           //   "tab8": {
           //     "ngsp_uid": "8cae1e9f-a6f0-49b8-86c3-e9131eab5b93",
           //     "data": [
           //       {
           //         "trade_date": "2015-04-01 99:00:00",
           //         "max_trade_date": "2015-04-02 00:00:00",
           //         "sum_trade_vol": "13546",
           //         "sum_total_trade_vol": "1321",
           //         "sum_trade_ratio": "874854"
           //       }
           //     ]
           //   }
           // }
            this.$set(this.tableDatas[activeName][tab], 'data', resp[tab].data)
          } else {
            this.$set(this.tableDatas[activeName][tab], 'data', [])
          }
        })
      },
      handleMenuTabClick (op) {
        if (!this.formData.acctIds) return
        if (op.index == 1) {
          if (!this.clickedTab2) {
            this.reqTableData(0, '1')
            this.clickedTab2 = true
          }
        }
      },
      updateActiveName (activeName) {
        this.activeNames[this.activeMenuName] = activeName
        this.setChartsIndex = activeName
      },
      getStockCode (stockCodeData) {
        if (stockCodeData) {
          this.formData.secCode = stockCodeData.split(' ')[0]
        } else {
          this.formData.secCode = ''
        }
      },
      getAccountList (data) {
        this.formData.acctIds = data
      },
      clearForm () {
        this.$refs['suspiciousAccountList'].clearCodeList()
        this.commonData.stockCode = ''
        this.formData = {
          startDate: '',
          endDate: '',
          secCode: '',
          acctIds: ''
        }
      },
      handleSearch () {
        let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
        let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
        if (sDate > eDate + 60 * 60 * 1000) {
          this.$message.error('开始日期不得大于结束日期')
          return
        }
        this.$refs['suspiciousTargetProfit'].validate((valid) => {
          if (valid) {
            // 批量校验证券代码格式
            if (!selfValidateMethod({accounts: this.formData.acctIds})) {
              return
            }
            this.queryData = JSON.parse(JSON.stringify(this.formData))
            this.querytradeRate = JSON.parse(JSON.stringify(this.tradeRateList))
            this.paginations[this.activeMenuName].forEach(v => {
              v.currentPage = 1
            })
            this.reqTableData(1, '0')
            this.clickedTab2 = false
          }
        })
      },
      extendParams(params) {
        params.pageIndex = this.paginations[this.activeMenuName].map(v => {
          return v.currentPage
        }).join(',')
        params.pageRows = this.paginations[this.activeMenuName].map(v => {
          return v.pageSizeNumber
        }).join(',')
      },
      reqTableData (type, activeMenuName, pageMark) {
        if (type == 1) {
          this.activeMenuName = '0'
        }
        let params = {
          startDate: type ? this.formData.startDate : this.queryData.startDate,
          endDate: type ? this.formData.endDate : this.queryData.endDate,
          secCode: type ? this.formData.secCode : this.queryData.secCode,
          acctIds: type ? this.formData.acctIds : this.queryData.acctIds,
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
        }
        /* 处理pageIndex，pageRows */
        this.extendParams(params)
        params.startDate = moment(params.startDate).format('YYYY-MM-DD')
        params.endDate = moment(params.endDate).format('YYYY-MM-DD')
        let tradeTemp
        if (type) {
          tradeTemp = this.tradeRateList[activeMenuName]
        } else {
          tradeTemp = this.querytradeRate[activeMenuName]
        }
        params.tradeDateCnt = tradeTemp[0].date // 连续交易日
        params.tradeRate = tradeTemp[0].rate // 交易占比
        params.tradeInterDateCnt = tradeTemp[1].date // 连续交易日
        params.tradeInterRate = tradeTemp[1].rate // 交易占比
        this.loading = true
        let mapFun = [suspiciousObjBidPrice, suspiciousObjBig] // 两个接口共用同一个ngsp_uid
        mapFun[activeMenuName](params).then((resp) => {
          this.loading = false
          if (resp) {
            if (type == 1) this.currentngspUid = resp.tab1.ngsp_uid
            if (pageMark >= 0 || pageMark < 4) {
              this.$set(this.tableDatas[activeMenuName][`tab${+pageMark + 1}`], 'data', resp[`tab${+pageMark + 1}`].data)
            } else {
              this.tableDatas[activeMenuName] = resp
              let data10 = resp.tab10.data
              data10.map(item => {
                item.sell_vol_rate = Number(-item.sell_vol_rate)
                if (item.open_price < item.curr_price) {
                  item.mark = 1
                } else {
                  item.mark = -1
                }
              })
              this.chartsData[activeMenuName] = data10
            }
          } else {
            this.currentngspUid = ''
            this.tableDatas[activeMenuName] = {}
          }
        })
      },
      handlePaginationChange (paginations) {
        this.paginations[this.activeMenuName] = paginations
        this.reqTableData(0, this.activeMenuName, this.setChartsIndex)
      },
      handleDownload (type) { // 下载
        let activeI = this.activeMenuName
        if ((!this.tableDatas[activeI].tabl || !this.tableDatas[activeI].tabl.data.length) &&
            (!this.tableDatas[activeI].tab2 || !this.tableDatas[activeI].tab2.data.length) &&
            (!this.tableDatas[activeI].tab3 || !this.tableDatas[activeI].tab3.data.length) &&
            (!this.tableDatas[activeI].tab4 || !this.tableDatas[activeI].tab4.data.length) &&
            (!this.tableDatas[activeI].tab5 || !this.tableDatas[activeI].tab5.data.length) &&
            (!this.tableDatas[activeI].tab6 || !this.tableDatas[activeI].tab6.data.length) &&
            (!this.tableDatas[activeI].tab7 || !this.tableDatas[activeI].tab7.data.length) &&
            (!this.tableDatas[activeI].tab8 || !this.tableDatas[activeI].tab8.data.length) &&
            (!this.tableDatas[activeI].tab9 || !this.tableDatas[activeI].tab9.data.length)) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0,
          ngspUid: this.currentngspUid,
          tableColumns: {
            tab1: this.columns[activeI][0],
            tab2: this.columns[activeI][1],
            tab3: this.columns[activeI][2],
            tab4: this.columns[activeI][3],
            tab5: this.columns[activeI][4],
            tab6: this.columns[activeI][5],
            tab7: this.columns[activeI][6],
            tab8: this.columns[activeI][7],
            tab9: this.columns[activeI][8]
          }
        }
        let tradeTemp = this.querytradeRate[activeI]
        params.tradeDateCnt = tradeTemp[0].date // 连续交易日
        params.tradeRate = tradeTemp[0].rate // 交易占比
        params.tradeInterDateCnt = tradeTemp[1].date
        params.tradeInterRate = tradeTemp[1].rate
        if (activeI == 0) {
          this.$message.info(`导出'仅统计竞价交易数据'`)
        } else {
          this.$message.info(`导出'统计时包含大宗交易数据'`)
        }
        let mapFun = [exportSuspiciousObjBidPrice, exportSuspiciousObjBig]
        mapFun[activeI](params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .suspicious-target-analysis {
    .inner_tab-list{
      /deep/ .el-tabs__header {
        .el-tabs__nav-wrap {
          padding: 0;
        }
        .el-tabs__nav-scroll {
          padding-left: 0;
        }
        .el-tabs__nav {
          white-space: normal;
          .el-tabs__item {
            margin: 5px;
          }
        }
      }
    }
  }
</style>
