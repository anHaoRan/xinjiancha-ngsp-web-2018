<!--历史预警信息列表-->
<template>
  <div>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button @click="clear" type="text" size="small" class="refreshShop" style="float:right;">清空</el-button>
        <el-button @click="submit" type="primary" size="small" style="float:right; ">查询</el-button>
      </div>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">证券代码：</el-col>
          <el-col :span="18" class="name">
            <stock-code-query :commonData="SubmitData" @getStockCode="getStockCode"></stock-code-query>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">处理状态：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="SubmitData.alarmStatus">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">预警类型：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="SubmitData.alarmType">
              <el-option v-for="item in alarmCategoryOptions" :key="item.value" :label="item.text"
                         :value="item.text"></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">板块：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="SubmitData.insType">
              <el-option v-for="item in modelOptions" :key="item.value" :label="item.category"
                         :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">关键字：</el-col>
          <el-col :span="18" class="name">
            <el-input size="small" v-model="SubmitData.keyWorld" @change="keyCodevalidChangeH"
                      @blur="keyCodevalid"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">预警日期：</el-col>
          <el-col :span="18">
            <el-date-picker
              style="width:100%"
              v-model="alarmDatePicker"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              @change="changeAlarmDate">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">预警时间：</el-col>
          <el-col :span="18">
            <el-time-picker
              style="width:100%"
              :clearable="false"
              is-range
              v-model="alarmTimePicker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              @change="changeAlarmTime">
            </el-time-picker>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="tableStyle">
            <el-table
              border
              ref="multipleTable"
              :data="HistoryData"
              tooltip-effect="dark"
              style="width: 100%; overflow:visible"
              @row-click="getRow"
              @selection-change="handleSelectionChange">
              <el-table-column
                v-for="item in ALARM_LIST_COLUMNSH"
                :key="item.field"
                :show-overflow-tooltip="true"
                :prop="item.field"
                :label="item.label"
                :min-width="item.width"
                :align="item.align"
                header-align="center"
                :formatter="item.formatter"
              ></el-table-column>
              <el-table-column min-width="6%" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="checkDetails(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <pageination style="float: left" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="expotFileF" type="primary" size="small" style="float:right;margin:0 10px;">导出预警</el-button>
        <el-button @click="translatePageTable" type="primary" size="small" style="float:right;margin:0 10px;">转换图表
        </el-button>
      </el-row>
      <div class="exportBox"></div>
      <el-row type="flex" justify="center">
        <div class="translateTable">
          <div v-show="showPicTable" ref="alarmPieChart" class="pie-chart"></div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import { getNolinkMetaData,getCurTradeDate } from '@/service/common/commonFunc'
  // 历史预警信息列表引入
  import {
    getHistoryAlarmResult, // 历史表格数据请求
    getHPageTableData, // 历史图表转换
    alarmType // 预警类型
  } from '../../../../service/alarmMonitor/alarmList'
  // tab 列表组件引入
  import { ALARM_LIST_COLUMNSH } from '../tableDefine'
  // 证券代码组件引入
  import StockCodeQuery from '../../../common/StockCodeQuery'
  // 分页组件页面引入
  import Pageination from '../../../common/pageination'
  // 日期插件引入
  import moment from 'moment'
  // ngsp

  let echarts = require('echarts')
  export default {
    props: ['activeName'],
    components: {
      StockCodeQuery, // 证券代码组件注册
      Pageination // 分页组件页面注册
    },
    data () {
      return {
        ALARM_LIST_COLUMNSH: ALARM_LIST_COLUMNSH,
        alarmDatePicker: ['', ''],
        alarmTimePicker: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
        ],
        showPicTable: false,
        alarmDateStart: '',
        alarmDateEnd: '',
        alarmTimeStart: '',
        alarmTimeEnd: '',
        alarmTimeRange: {
          selectableRange: ''
        },
        stockOption: [],
        statusOptions: [],
        modelOptions: [],
        stockCodeMessage: '',
        keyCodeMessage: '',
        SubmitData: {
          userID: '3gss',
          stockCode: '',
          keyWorld: '',
          alarmType: '',
          alarmStatus: '',
          insType: '',
          alarmDateStart: '',
          alarmDateEnd: '',
          alarmTimeStart: '',
          alarmTimeEnd: '',
          pageIndex: 1,
          pageRows: 10,
          accountId: '', // 参与者查询-账户id，可输入多个
          branchId: '', // 参与者查询-营业部id，可输入多个
          memberId: '' // 参与者查询-会员id，可输入多个
        },
        alarmCategoryOptions: [],
        HistoryData: [],
        currentPage: 1,
        pageSizeNumber: 10,
        pageTotal: 0,
        urlstrs: []
      }
    },
    methods: {
      // 预警日期事件
      changeAlarmDate () {
        if (!$.isEmptyObject(this.alarmDatePicker)) {
          this.SubmitData.alarmDateStart = moment(this.alarmDatePicker[0]).format('YYYYMMDD')
          this.SubmitData.alarmDateEnd = moment(this.alarmDatePicker[1]).format('YYYYMMDD')
        }
      },

      // 预警时间事件
      changeAlarmTime () {
        this.SubmitData.alarmTimeStart = moment(this.alarmTimePicker[0]).format('HH:mm:ss')
        this.SubmitData.alarmTimeEnd = moment(this.alarmTimePicker[1]).format('HH:mm:ss')
      },

      // 清空查询条件
      clear () {
        this.stockCodeMessage = ''
        this.keyCodeMessage = ''
        this.alarmTimePicker = [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
        ]
        this.alarmDatePicker = ['', '']
        this.SubmitData.userID = '3gss'
        this.SubmitData.stockCode = ''
        this.SubmitData.keyWorld = ''
        this.SubmitData.alarmType = ''
        this.SubmitData.alarmStatus = ''
        this.SubmitData.insType = ''
        this.SubmitData.alarmDateStart = ''
        this.SubmitData.alarmDateEnd = ''
        this.SubmitData.alarmTimeStart = ''
        this.SubmitData.alarmTimeEnd = ''
        this.SubmitData.pageIndex = 1
      },
      // 查询条件
      submit () {
        this.stockCodeMessage = ''
        this.keyCodeMessage = ''
        if (this.alarmDatePicker[0] !== '') {
          // 预警开始日期
          this.SubmitData.alarmDateStart = this.alarmDatePicker[0]
          // 预警结束日期
          this.SubmitData.alarmDateEnd = this.alarmDatePicker[1]
        }
        this.getHistoryData() // 预警时间
      },
      getStockCode (stockCodeData) {
        this.SubmitData.stockCode = stockCodeData
      },
      getAlarmType () {
        alarmType('warnningType', 'realWarn').then((resp) => {
          this.alarmCategoryOptions = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.alarmCategoryOptions.unshift(All)
        })
      },
      getinsType () {
        let arr = []
        arr.push({value: '1', category: '债券'})
        arr.push({value: '2', category: '风险警示'})
        arr.push({value: '3', category: '国际板'})
        arr.push({value: '4', category: '新兴板'})
        arr.push({value: '5', category: '个股期权'})
        arr.push({value: '', category: '全部'})
        this.modelOptions = arr
      },
      // 关键字
      keyCodevalidChangeH (val) {
        if (val.match(/\'/g)) { // eslint-disable-line
          this.$message.error('内容不能包含单引号')
        }
      },
      // 关键字
      keyCodevalid () {
        if (!this.SubmitData.keyWorld.trim()) {
          this.keyCodeMessage = '输入不能为空'
        } else if (!/^([\u4e00-\u9fa5]|\w)+$/.test(this.SubmitData.keyWorld)) {
          this.keyCodeMessage = '输入格式不正确'
        } else {
          this.keyCodeMessage = ''
        }
      },
      //  历史数据获取
      getHistoryData () {
        /**
         * 从参与者查询页面跳转该页面，带过来一些参数：
         * accountId 参与者查询-账户,可以输入多个
         * branchId 参与者查询-营业部,可以输入多个
         * memberId 参与者查询-会员,可以输入多个
         * */
        const {accountId, branchId, memberId} = this.$route.query
        this.SubmitData.accountId = accountId || ''
        this.SubmitData.branchId = branchId || ''
        this.SubmitData.memberId = memberId || ''

        let params = JSON.parse(JSON.stringify(this.SubmitData))
        params.alarmTimeStart = params.alarmTimeStart === '' ? moment(this.alarmTimePicker[0]).format('HH:mm:ss') : params.alarmTimeStart
        params.alarmTimeEnd = params.alarmTimeEnd === '' ? moment(this.alarmTimePicker[1]).format('HH:mm:ss') : params.alarmTimeEnd
        params.alarmType = params.alarmType === '全选' ? 'ALL' : params.alarmType
        // 历史表格数据请求
        getHistoryAlarmResult(params).then((res) => {
          let arr = res.bizData.metaData
          if (res.bizData.totalRows) {
            this.pageTotal = res.bizData.totalRows
            arr.forEach((v, i) => {
              if (v.alarm_status === '1') {
                v.status = ''
                v.alarmStatus = '新预警'
              } else if (v.alarm_status === '3') {
                v.status = '√'
                v.alarmStatus = '继续观察'
              } else if (v.alarm_status === '6') {
                v.status = '√'
                v.alarmStatus = '关闭预警'
              } else if (v.alarm_status === '9') {
                v.status = '√'
                v.alarmStatus = '虚警'
              }
            })
            this.HistoryData = arr
          } else {
            this.HistoryData = []
            this.pageTotal = 0
          }
        })
      },
      getRow () { },
      // 复选框的方法能够获取
      handleSelectionChange (selection) { },
      getAlarmPieChartData (arr) {
        let echart = echarts.init(this.$refs.alarmPieChart, this.gfnGetTheme())
        let option = {
          backgroundColor: ['transparent'],
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.marker + params.name + '：' + params.value + '%'
            }
          },
          title: {
            text: '预警统计',
            x: '47.6%',
            textStyle: {
              color: '#ffffff',
              fontFamily: 'Microsoft Yahei'
            }
          },
          // data  以下是对data 数据的字体和位置、颜色等设置；
          legend: {
            orient: 'vertical',
            x: '64%',
            y: 90,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            textStyle: {color: '#7b8fb9'},
            data: ['A类预警', 'B类预警', 'C类预警', 'D类预警', 'S类预警']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              center: ['50%', '45%'],
              label: {
                normal: {
                  formatter: '{per|{d}%}',
                  borderWidth: 0,
                  borderRadius: 4,
                  rich: {
                    per: {
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: arr
            }
          ]
        }
        window.onresize = echart.resize
        echart.setOption(option)
        echart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        })
      },
      translatePageTable () {
        if (!this.showPicTable) {
          this.alarmPieChart()
        }
        this.showPicTable = !this.showPicTable
      },
      alarmPieChart () {
        getHPageTableData(this.SubmitData).then((res) => {
          let arr4 = []
          if (res === null) {
            arr4 = [
              {value: 0, name: 'A类预警'},
              {value: 0, name: 'B类预警'},
              {value: 0, name: 'C类预警'},
              {value: 0, name: 'D类预警'},
              {value: 0, name: 'S类预警'}
            ]
          } else {
            let {aPercentages, bPercentages, cPercentages, dPercentages, sPercentages} = res.PIEGRAPH
            arr4 = [
              {value: parseFloat(aPercentages), name: 'A类预警'},
              {value: parseFloat(bPercentages), name: 'B类预警'},
              {value: parseFloat(cPercentages), name: 'C类预警'},
              {value: parseFloat(dPercentages), name: 'D类预警'},
              {value: parseFloat(sPercentages), name: 'S类预警'}
            ]
          }
          this.getAlarmPieChartData(arr4)
        })
      },
      // 表格操作方法函数
      handleClick (row) { },
      downLoad (row) { },
      // 分页方法
      getPageination (pageinationVal) {
        this.SubmitData.pageRows = pageinationVal.pageSizeNumber
        this.SubmitData.pageIndex = pageinationVal.currentPage
        this.getHistoryData()
      },
      expotFileF () {
        delete this.SubmitData.pageRows
        delete this.SubmitData.pageIndex
        let submitParams = this.SubmitData
        submitParams.tableColumns = this.ALARM_LIST_COLUMNSH
        this.gfnExportFile('/alarm/warning/history-list/export', JSON.stringify(submitParams))
      },
      // 查看详情
      checkDetails (row) {
        this.openNewWindow('tdateAlarmDetail', `#/tdateAlarmDetail/${row.alarm_id}`)
      },
      // 获取处理状态内容
      getWarningDetailOption () {
        getNolinkMetaData('warnningDealStatus').then(res => {
          let arr = res.map(item => {
            return {
              value: item.value,
              label: item.text
            }
          })
          arr.unshift({value: '', label: '全部'})
          this.statusOptions = arr
        })
      }
    },
    created(){
      getCurTradeDate().then(resp=>{
        let endDate = moment(resp,'YYYYMMDD').format('YYYY-MM-DD'),
        startDate = moment(moment(endDate,'YYYYMMDD').toDate().getTime()-3600*1000*24*90).format('YYYY-MM-DD')
        this.alarmDatePicker=[startDate,endDate]
      })
    },
    mounted () {
      this.getWarningDetailOption()
      this.getAlarmType()
      this.getinsType()
      if (window.location.href.indexOf('stockCode') !== -1) {
        this.SubmitData.stockCode = decodeURI(window.location.href.split('?')[1].split('&')[0].split('=')[1])
      }
      this.getHistoryData()
    },
    beforeDestroy () { }
  }
</script>

<style scoped lang="less">
  .translateTable {
    width: 100%;
    .chart-title {
      height: 54px;
      line-height: 54px;
      font-size: 18px;
      color: #14b9d5;
      padding-left: 58px;
      border-bottom: 1px solid #eeeeee;
      position: relative;
      z-index: 10;
      box-sizing: border-box;
    }
    .pie-chart {
      width: 1500px;
      height: 500px;
    }
  }
</style>
