<template>
  <div class='shareholder'>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        <el-button type='info' size='mini' @click='exportMiddleForm'
                   v-if='activeName === "first"'>
          导出
        </el-button>
        <el-button type='primary' size='mini' @click='refreshForm' v-if='activeName === "first"'>
          {{refreshText}}
        </el-button>
      </div>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='盘中减持监控' name='first'>
          <el-table
            v-if='activeName === "first"'
            :data='deduceData'
            border
            tooltip-effect='dark'
            max-height="480"
            size='small'
            highlight-current-row
            @sort-change='deduceSortChange'
            @current-change='handleCurrentChange'
            style='width: 100%'>
            <el-table-column
              v-for='column in sessionColumns'
              :key=column.field
              :align=column.align
              :prop=column.field
              header-align="center"
              :label=column.label
              :sortable=column.sortable
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='pzSizeChange'
              @current-change='pzCurrentChange'
              :current-page='currentPage4'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='10'
              layout='total,sizes,prev,pager,next,jumper'
              :total='pageTotal1'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label='历史减持查询' name='second'>
          <el-card style='margin-top: 0px'>
            <div class='headWrap'>
              <div class='date'>
                <el-row>
                  <el-col :span='4' style='text-align: center'>
                    <span style='color:red;position:relative;top:2px'>*</span>
                    <span>日期 </span>
                  </el-col>
                  <el-col :span='8'>
                    <el-date-picker
                      v-model='beginDate'
                      type='date'
                      placeholder='请选择开始日期'
                      value-format='yyyy-MM-dd'
                      @change='getstartDate'
                      :picker-options='startpickerOption'
                      size='mini'
                      style='width:100%'>
                    </el-date-picker>
                  </el-col>
                  <el-col :span='2' style='text-align: center'>至</el-col>
                  <el-col :span='8' class='spacing'>
                    <el-date-picker
                      v-model='endDate'
                      type='date'
                      placeholder='请选择结束日期'
                      value-format='yyyy-MM-dd'
                      @change='getendDate'
                      :picker-options='endpickerOption'
                      size='mini'
                      style='width:100%'>
                    </el-date-picker>
                  </el-col>
                </el-row>
              </div>
              <div class='inquire'>
                <el-button type='primary' size='mini' @click='getData'>查询</el-button>
                <el-button type='info' size='mini' @click='clearInfo' style='padding: 6.5px 14px'>清空</el-button>
              </div>
            </div>
          </el-card>
          <el-card>
            <div slot='header' class='clearfix'>
              总计
              <i :class='className' @click='toggleClass' style='font-size: 24px'></i>
              <el-button type='info' size='mini' @click='exportTotalForm' style='padding: 6.5px 14px'>导出</el-button>
            </div>
            <el-table
              v-show='changeChart'
              v-if='activeName === "second"'
              :data='totalData'
              border
              max-height="480"
              tooltip-effect='dark'
              size='small'
              highlight-current-row
              @current-change='handleCurrentChange'
              style='width: 100%'>
              <el-table-column
                v-for='column in totalColumns'
                :key='column.field'
                :align='column.align'
                :prop='column.field'
                header-align="center"
                :label='column.label'
                :sortable='column.sortable'
                :min-width='column.minWidth'>
              </el-table-column>
            </el-table>
            <div v-show='!changeChart' class='tableCharts'>
              <el-tabs v-model='activeName1' type='card' @tab-click='toggleChart' style='top: 45px;'>
                <el-tab-pane label='大股东' name='third'>
                </el-tab-pane>
                <el-tab-pane label='董监高' name='four'>
                </el-tab-pane>
              </el-tabs>
              <div style='margin-top: 15px'>
                <el-row>
                  <el-col :span='24' v-show='isshow'>
                    <div id='bigHolder' style='height: 300px;width: 1660px;'></div>
                  </el-col>
                  <el-col :span='24' v-show='!isshow'>
                    <div id='manager' style='height: 300px;width: 1660px;'></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
          <el-card>
            <div slot='header' class='clearfix'>
              明细列表
              <el-button
                type='primary'
                size='mini'
                style='float: none; margin-left: 15px;'
                @click='dialogFormVisble=true'>
                双人双密
              </el-button>
              <el-button type='info' size='mini' @click='exportDetailForm' style='padding: 6.5px 14px' v-if="isShow">
                导出
              </el-button>
            </div>
            <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                                :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
            <div v-if="isShow">
              <div style='padding: 10px;'>
                <el-row>
                  <el-col :span='5'>
                    账户属性
                    <el-select v-model='accountType' size='mini' @change='toggleAccount'>
                      <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='4'>
                    <fuzzy-stock-code :stockCodeData='stockCodeData' @getStockCode='getStockCode'
                                      style='display: inline-block;'></fuzzy-stock-code>
                    <el-button class='el-icon-search' @click='searchStockCode'></el-button>
                  </el-col>
                  <el-col :span='6'>
                    <fuzzy-ymt-code :ymtCodeData='ymtCodeData' @getYmtStockCode='getYmtStockCode'
                                    style='display: inline-block;'></fuzzy-ymt-code>
                    <el-button class='el-icon-search' @click='searchYmtCode'></el-button>
                  </el-col>
                </el-row>
              </div>
              <el-table
                v-if='activeName === "second"'
                :data='detailData'
                border
                max-height="480"
                tooltip-effect='dark'
                size='small'
                highlight-current-row
                @current-change='handleCurrentChange'
                @sort-change='detailSortChange'
                style='width: 100%'>
                <el-table-column
                  v-for='column in detailColumns'
                  :key='column.field'
                  :align='column.align'
                  :prop='column.field'
                  header-align="center"
                  :label='column.label'
                  :sortable='column.sortable'
                  :min-width='column.minWidth'>
                </el-table-column>
              </el-table>
              <div class='block'>
                <el-pagination
                  @size-change='detailSizeChange'
                  @current-change='detailCurrentChange'
                  :current-page='currentPage5'
                  :page-sizes='[10,20,50,100,200,400]'
                  :page-size='10'
                  layout='total,sizes,prev,pager,next,jumper'
                  :total='pageTotal2'
                >
                </el-pagination>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Upload from './upload'
  import echarts from 'echarts'
  import moment from 'moment';
  import {
    getDgbSubhold,
    getHistoryCount,
    getHistoryLine,
    postHistoryDetail
  } from '../../../../service/marketSupervise/index';
  import FuzzyStockCode from './fuzzyStockCode'
  import FuzzyYmtCode from './fuzzyYmtCode'
  import DoublePerDouPsw from '../../../common/DoublePerDouPsw'

  export default {
    components: {
      FuzzyStockCode,
      FuzzyYmtCode,
      Upload,
      DoublePerDouPsw
    },
    data() {
      return {
        dialogFormVisble: false,
        isShow: false,
        activeName: 'first',
        activeName1: 'third',
        deduceData: [],
        totalData: [],
        detailData: [],
        currentPage4: 1,
        pageTotal1: 0,
        pageTotal2: 0,
        currentPage5: 1,
        beginDate: '',
        endDate: '',
        sessionColumns: [
          {label: '账户属性', field: 'account_name', align: 'center', minWidth: '6.5%'},
          {label: '一码通代码', field: 'ymt_account_id', align: 'center', minWidth: '7.5%'},
          {label: '一码通名称', field: 'ymt_account_name', align: 'center', minWidth: '7.5%'},
          {label: '股票代码', field: 'instrument_id', align: 'center', minWidth: '6.5%'},
          {label: '股票名称', field: 'instrument_name', align: 'center', minWidth: '6.5%'},
          {label: '今日减持量', field: 'trdqty', align: 'right', minWidth: '7.5%', sortable: 'custom'},
          {label: '10日减持量', field: 'trdqty_10', align: 'right', minWidth: '7.5%', sortable: 'custom'},
          {label: '今日减持额/万元', field: 'mktval', align: 'right', minWidth: '7.5%', sortable: 'custom'},
          {label: '10日减持额/万元', field: 'mktval_10', align: 'right', minWidth: '7.5%', sortable: 'custom'}
        ],
        totalColumns: [
          {label: '账户属性', field: 'account_name', align: 'center', minWidth: '5%'},
          {label: '总账户数', field: 'ymt_num', align: 'right', minWidth: '6.5%'},
          {label: '减持账户数', field: 'sub_ymt_num', align: 'right', minWidth: '7.5%'},
          {label: '减持股票数(只)', field: 'stock_num', align: 'right', minWidth: '7.5%'},
          {label: '持有市值(万元)', field: 'hold_trdval', align: 'right', minWidth: '6.5%'},
          {label: '减持金额(万元)', field: 'sale_trdval', align: 'right', minWidth: '6.5%'},
          {label: '减持数量(股)', field: 'sale_trdqty', align: 'right', minWidth: '6.5%'},
          {label: '大宗减持金额(万元)', field: 'block_sell_trdval', align: 'right', minWidth: '8%'},
          {label: '减持前三股票及金额', field: 'top3_stock', align: 'center', minWidth: '10%'}
        ],
        detailColumns: [
          {label: '日期', field: 'trade_date', align: 'center', minWidth: '5%'},
          {label: '股票代码', field: 'instrument_id', align: 'center', minWidth: '6.5%'},
          {label: '股票名称', field: 'instrument_chn_short_name', align: 'center', minWidth: '6.5%'},
          {label: '一码通代码', field: 'ymt_account_id', align: 'center', minWidth: '7.5%'},
          {label: '一码通名称', field: 'ymt_account_name', align: 'center', minWidth: '7.5%'},
          {label: '持有股本(股)', field: 'hold_trdqty', align: 'center', minWidth: '6.5%', sortable: 'custom'},
          {label: '持有市值(万元)', field: 'hold_trdval', align: 'right', minWidth: '6.5%', sortable: 'custom'},
          {label: '卖数量(股)', field: 'sale_trdqty', align: 'right', minWidth: '6.5%', sortable: 'custom'},
          {label: '卖金额(万元)', field: 'sale_trdval', align: 'right', minWidth: '6.5%', sortable: 'custom'},
          {label: '大宗卖量(股)', field: 'block_sell_trdqty', align: 'right', minWidth: '7.5%', sortable: 'custom'},
          {label: '大宗卖金额(万元)', field: 'block_sell_trdval', align: 'right', minWidth: '9%', sortable: 'custom'},
          {label: '买数量(股)', field: 'buy_trdqty', align: 'right', minWidth: '6.5%', sortable: 'custom'},
          {label: '买金额(万元)', field: 'buy_trdval', align: 'right', minWidth: '6.5%', sortable: 'custom'},
          {label: '大宗买量(股)', field: 'block_buy_trdqty', align: 'right', minWidth: '7.5%', sortable: 'custom'},
          {label: '大宗买金额(万元)', field: 'block_buy_trdval', align: 'right', minWidth: '9%', sortable: 'custom'}
        ],
        className: 'fa fa-pie-chart',
        changeChart: true,
        refreshText: '刷新',
        options: [
          {value: '', label: '全部'},
          {value: '0', label: '大股东'},
          {value: '1', label: '董监高'}
        ],
        value1: '',
        value2: '',
        pzPageSize: '10',
        pzPageIndex: '',
        startDate: '',
        overDate: '',
        detailPageIndex: '',
        detailPageSize: '10',
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() > new Date(this.endDate).getTime();
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.beginDate).getTime() - 3600 * 1000 * 24 ||
              time.getTime() > Date.now();
          }
        },
        reduceMoney: [],
        reduceCount: [],
        holdValue: [],
        accountType: '',
        stockCode: '',
        ymtCode: '',
        stockCodeData: {
          stockCode: ''
        },
        ymtCodeData: {
          stockCode: ''
        },
        isshow: true,
        timer: null,
        timeInterval: 60 * 1000,
        detailOrderField: '',
        detailOrderType: '',
        deduceOrderField: '',
        deduceOrderType: ''
      }
    },
    mounted() {
      this.getSubTableData()
    },
    methods: {
      isPass(val) {
        this.isShow = val
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      toggleChart() {
        if (this.activeName1 == 'third') {
          this.isshow = true
        } else {
          this.isshow = false
        }
      },
      toggleClass() {
        if (this.className == 'fa fa-table') {
          this.className = 'fa fa-pie-chart'
          this.changeChart = !this.changeChart
        } else {
          this.className = 'fa fa-table'
          this.changeChart = !this.changeChart
        }
      },
      // 盘中排序
      deduceSortChange(column) {
        this.deduceOrderField = column.prop
        if (!this.deduceOrderField) {
          this.deduceOrderField = ''
        }
        if (column.order == 'ascending') {
          this.deduceOrderType = 'asce'
        } else {
          this.deduceOrderType = 'desc'
        }
        this.getSubTableData()
      },
      // 历史明细排序
      detailSortChange(column) {
        this.detailOrderField = column.prop
        if (column.order == 'ascending') {
          this.detailOrderType = 'asce'
        } else {
          this.detailOrderType = 'desc'
        }
        this.historyTable()
      },
      // 选择账户属性
      toggleAccount(val) {
        this.accountType = val
        this.detailPageIndex = '1'
        this.historyTable()
      },
      // 从股票代码公共组件中获取到的股票代码的值以及类型
      getStockCode(val) {
        this.stockCode = val
      },
      getYmtStockCode(val) {
        this.ymtCode = val
      },
      // 模糊查询股票代码
      searchStockCode() {
        this.detailPageIndex = '1'
        this.historyTable()
      },
      // 模糊查询一码通
      searchYmtCode() {
        this.detailPageIndex = '1'
        this.historyTable()
      },
      handleClick(val) {
      },
      handleCurrentChange(val) {
      },
      // 历史明细分页间隔切换
      detailSizeChange(val) {
        this.detailPageSize = val
        this.historyTable()
      },

      // 历史明细当前页码
      detailCurrentChange(val) {
        this.detailPageIndex = val
        this.historyTable()
      },
      // 盘中分页间隔切换
      pzSizeChange(val) {
        this.pzPageSize = val
        this.getSubTableData()
      },
      // 盘中当前页码
      pzCurrentChange(val) {
        this.pzPageIndex = val
        this.getSubTableData()
      },
      getstartDate(val) {
        this.startDate = val
      },
      getendDate(val) {
        this.overDate = val
      },
      clearInfo() {
        this.beginDate = ''
        this.endDate = ''
      },
      // 导出盘中表格
      exportMiddleForm() {
        window.open('/ngsp/fluct/dgd-subhold/v1/export-realtime?orderField=' + this.deduceOrderField + '&orderType=' + this.deduceOrderType)
      },
      // 导出历史总计表格
      exportTotalForm() {
        if (!this.startDate || !this.overDate) {
          this.$message.warning('开始结束日期不能为空！')
        } else {
          window.open('/ngsp/fluct/dgd-subhold/v1/export-hisSum?startDate=' + this.startDate + '&endDate=' + this.overDate)
        }
      },
      // 导出历史明细表格
      exportDetailForm() {
        if (!this.startDate || !this.overDate) {
          this.$message.warning('开始结束日期不能为空！')
        } else {
          window.open('/ngsp/fluct/dgd-subhold/v1/export-hisdetail?startDate=' + this.startDate + '&endDate=' + this.overDate + '&isPage=false&orderField=' + this.detailOrderField + '&orderType=' + this.detailOrderType + '&accountType=' + this.accountType + '&stockCode=' + this.stockCode + '&ymtAccountId=' + this.ymtCode)
        }
      },
      // 获取盘中表格数据
      getSubTableData() {
        getDgbSubhold(this.pzPageSize, this.pzPageIndex, this.deduceOrderField, this.deduceOrderType).then((resp) => {
          this.deduceData = resp.bizData.metaData
          this.pageTotal1 = resp.bizData.totalRows
        })
      },
      // 查询获取数据
      getData() {
        if (!this.startDate || !this.overDate) {
          this.$message({
            showClose: true,
            message: '请选择查询日期',
            type: 'warning'
          })
        } else {
          // 获取历史总计表格数据
          getHistoryCount(this.startDate, this.overDate).then((resp) => {
            this.totalData = resp.bizData.metaData;
          })
          // 获取历史总计折线数据
          getHistoryLine(this.startDate, this.overDate).then((resp) => {
            // 大股东数据
            let dgdData = resp.dgd_data
            this.dgdrEduceMoney = dgdData.sub_val
            this.dgdrEduceCount = dgdData.sub_qty
            this.dgdHoldValue = dgdData.hold_qty
            let dgdTimeAxis = []
            // 减持金额
            let dgdReduceMoneyData = []
            let dgdLineName = []
            this.dgdrEduceMoney.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              dgdTimeAxis.push(moment(el.tradeDate).format('YYYY-MM-DD'));
              dgdReduceMoneyData.push(el.value / 100000000);
            })
            dgdLineName.push(this.dgdrEduceMoney.name)
            // 减持数量
            let dgdReduceCountData = []
            this.dgdrEduceCount.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              dgdReduceCountData.push(el.value / 1000000);
            })
            dgdLineName.push(this.dgdrEduceCount.name)
            // 持有股本
            let dgdHoldValueData = []
            this.dgdHoldValue.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              dgdHoldValueData.push(el.value);
            })
            dgdLineName.push(this.dgdHoldValue.name)
            let dgdSeriesData = [
              {
                name: this.dgdrEduceMoney.name,
                type: 'line',
                data: dgdReduceMoneyData
              },
              {
                name: this.dgdrEduceCount.name,
                type: 'line',
                yAxisIndex: 2,
                data: dgdReduceCountData
              },
              {
                name: this.dgdHoldValue.name,
                type: 'line',
                yAxisIndex: 1,
                data: dgdHoldValueData
              }
            ]
            let dgdDataList = {
              time: dgdTimeAxis,
              data1: dgdLineName,
              data2: dgdSeriesData
            }
            this.drawLineChart('bigHolder', dgdDataList)
            // 董监高数据
            let djgData = resp.djg_data
            this.dgdrEduceMoney = djgData.sub_val
            this.dgdrEduceCount = djgData.sub_qty
            this.dgdHoldValue = djgData.hold_qty
            let djgTimeAxis = []
            // 减持金额
            let djgReduceMoneyData = []
            let djgLineName = []
            this.dgdrEduceMoney.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              djgTimeAxis.push(moment(el.tradeDate).format('YYYY-MM-DD'));
              djgReduceMoneyData.push(el.value / 100000000);
            })
            djgLineName.push(this.dgdrEduceMoney.name)
            // 持有股本
            let djgHoldValueData = []
            this.dgdHoldValue.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              djgHoldValueData.push(el.value);
            })
            djgLineName.push(this.dgdHoldValue.name)
            // 减持数量
            let djgReduceCountData = []
            this.dgdrEduceCount.data.forEach((el) => {
              if (!el.value) {
                el.value = 0
              }
              djgReduceCountData.push(el.value / 1000000);
            })
            djgLineName.push(this.dgdrEduceCount.name)
            let djgSeriesData = [
              {
                name: this.dgdrEduceMoney.name,
                type: 'line',
                data: djgReduceMoneyData
              },
              {
                name: this.dgdHoldValue.name,
                type: 'line',
                yAxisIndex: 1,
                data: djgHoldValueData
              },
              {
                name: this.dgdrEduceCount.name,
                type: 'line',
                yAxisIndex: 2,
                data: djgReduceCountData
              }
            ]
            let djgDataList = {
              time: djgTimeAxis,
              data1: djgLineName,
              data2: djgSeriesData
            }
            this.drawLineChart('manager', djgDataList)
          })
          // 获取历史明细表格数据
          this.historyTable()
        }
      },
      // 封装历史明细表格请求
      historyTable() {
        let params = {
          accountType: this.accountType,
          startDate: this.startDate,
          endDate: this.overDate,
          stockCode: this.stockCode,
          ymtAccountId: this.ymtCode,
          pageSize: this.detailPageSize,
          pageIndex: this.detailPageIndex,
          orderField: this.detailOrderField,
          orderType: this.detailOrderType
        }
        postHistoryDetail(params).then((resp) => {
          resp.bizData.metaData.forEach((el) => {
            el.trade_date = moment(el.trade_date, 'YYYYMMDD').format('YYYY-MM-DD')
          })
          this.detailData = resp.bizData.metaData;
          this.pageTotal2 = resp.bizData.totalRows
        })
      },
      // 盘中表格数据刷新
      refresh() {
        getDgbSubhold(this.pzPageSize, this.pzPageIndex).then((resp) => {
          this.deduceData = resp.bizData.metaData
          this.pageTotal1 = resp.bizData.totalRows
          this.timer = setTimeout(() => {
            this.refresh()
          }, this.timeInterval)
        })
      },
      // 刷新表格数据
      refreshForm() {
        if (this.refreshText == '刷新') {
          this.refresh()
          this.refreshText = '停止刷新'
        } else {
          this.refreshText = '刷新'
          clearTimeout(this.timer)
        }
      },
      // 画图
      drawLineChart(id, dataList) {
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          title: {
            text: '注：左外轴代表减持金额(单位：亿元)，左内轴代表持有股本(单位：股)，右外轴代表减持数量(单位：万手)',
            left: '5%',
            bottom: '1%',
            textStyle: {
              color: '#506798',
              fontSize: 14,
              fontWeight: 200
            }
          },
          toolbox: {
            right: '6%',
            y: '2',
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter(val) {
              let texts = val[0].name + '<br/>'
              val.forEach((el) => {
                if (el.seriesName == '减持数量') {
                  texts += el.marker + el.seriesName + ':' + el.value + '万手 <br/>'
                } else if (el.seriesName == '持有股本') {
                  texts += el.marker + el.seriesName + ':' + el.value + '股 <br/>'
                } else {
                  texts += el.marker + el.seriesName + ':' + el.value + '亿元 <br/>'
                }
              })
              return texts
            }
          },
          grid: [
            {
              left: '5%',
              right: '5%'
            }
          ],
          legend: {
            inactiveColor: '#455579',
            right: 200,
            y: 10,
            data: dataList.data1,
            textStyle: {
              color: '#506798'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: dataList.time,
              axisLabel: {
                color: '#506798'
              },
              splitLine: {
                lineStyle: {
                  color: '#263657'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              nameTextStyle: {
                color: '#506798'
              },
              boundaryGap: false,
              axisLabel: {
                color: '#506798'
              },
              splitLine: {
                lineStyle: {
                  color: '#263657'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              type: 'value',
              boundaryGap: false,
              position: 'left',
              axisLabel: {
                color: '#506798',
                inside: true
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              type: 'value',
              boundaryGap: false,
              position: 'right',
              axisLabel: {
                color: '#506798'
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          series: dataList.data2
        })
      }
    }
  }
</script>

<style lang='less'>

  .shareholder .clearfix {
    position: relative;
    i {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 100px
    }
  }

  .shareholder .headtitle {
    padding-left: 10px;
    height: 35px;
    font-size: 16px;
    line-height: 35px;
    color: #fff
  }

  .shareholder {
    .el-card {
      .el-tabs--card {
        position: relative;
        > .el-tabs__header {
          position: absolute;
          top: -65px;
        }
        > .el-tabs__content {
          margin-top: 10px;
        }
      }
    }
  }

  .shareholder .block {
    padding: 10px;
    .el-pagination {
      text-align: center;
    }
  }

  .shareholder .headWrap {
    line-height: 38px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > div {
      height: 38px;
      margin: 0 10px;
    }
    .date {
      .el-row {
        margin: 0px;
      }
    }
    .upload {
      .el-row {
        margin: 0px;
      }
    }
  }

  .shareholder .el-icon-search {
    width: 28px;
    height: 28px;
    padding: 0px;
    border-radius: 0px;
    color: #000;
    background-color: #ccc;
    position: relative;
    top: -9px;
    left: -7px;
  }

  .shareholder .el-icon-search:hover {
    color: #000
  }

  .shareholder #pane-second {
    > .el-card {
      > .el-card__body {
        padding: 0px;
      }
    }
    > .el-card:nth-child(1) {
      position: relative;
      top: -5px
    }
    > .el-card:nth-child(2) {
      margin: 0px;
    }
  }
</style>
