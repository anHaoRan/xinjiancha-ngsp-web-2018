<!-- 实时预警信息列表 -->
<template>
  <div>
    <el-card class="el-card-table">
      <div slot="header" class="alarmLists">
        <span>查询条件</span>
        <el-button  @click="clear" type="text" size="small" style="float:right;">清空</el-button>
        <el-button @click="submit" type="primary" size="small" style="float:right; ">查询</el-button>
      </div>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">证券代码：</el-col>
          <el-col :span="18" class="name">
            <stock-code-query :commonData="submitData" @getStockCode="getStockCode"></stock-code-query>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">处理状态：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="submitData.alarmStatus">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">预警类型：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="请选择预警类型" size="small" v-model="submitData.alarmType">
              <el-option v-for="item in alarmCategoryOptions" :key="item.value" :label="item.text" :value="item.text"></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">板块：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="submitData.insType">
              <el-option v-for="item in modelOptions" :key="item.value" :label="item.category" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">关键字：</el-col>
          <el-col :span="18" class="name">
            <el-input size="small" v-model="submitData.keyWorld" @change="keyCodevalidChangeT" @blur="keyCodevalid"></el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">处理人员：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="请选择处理人员" size="small" v-model="submitData.operatorID">
              <el-option v-for="item in dealerOptions" :key="item.value" :label="item.category" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">预警时间：</el-col>
          <el-col :span="18">
            <el-time-picker
              style="width:100%"
              :clearable="false"
              is-range
              v-model="alarmTimePicker"
              type="datetimerange"
              range-separator="至"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              @change="changeAlarmTime">
            </el-time-picker>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">处理时间：</el-col>
          <el-col :span="18">
            <el-col :span="11">
              <el-time-picker
                style="width:100%;"
                size="small"
                :clearable="false"
                @blur="blurTimeStart"
                v-model="operatorTimeStart"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :picker-options="operatorTimeRange1">
              </el-time-picker>
            </el-col>
            <el-col :span="2" class="name">至</el-col>
            <el-col :span="11">
              <el-time-picker
                style="width:100%;"
                size="small"
                @blur="blurTimeEnd"
                :clearable="false"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                v-model="operatorTimeEnd"
                :picker-options="operatorTimeRange2">
              </el-time-picker>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button @click="Tdatestopreload" type="text" size="mini" class="refreshShop" style="float:right">
          {{TdateReloadOperate}}
        </el-button>
        <el-form :model="intervalTime" ref="intervalTime" :rules="intervalTimeRules" style="display:inline-block ;float: right;margin-right: 20px;">
          <el-form-item prop="TdatereloadTime">
            隔
            <el-input size="mini" style="display:inline-block ;width: 50px;" v-model="intervalTime.TdatereloadTime" @blur="changeReloadTime"></el-input>
            <el-input size="mini" style="display:none" v-model="activeName"></el-input>
            秒刷新
          </el-form-item>
        </el-form>
        <!--<div class="reloadContainer" style="float:right;font-size: 14px;">-->
          <!---->
        <!--</div>-->
      </div>
      <el-row>
        <el-col class="totalNumbers">
          <span>预警数 &#x2f; 未处理数</span>&nbsp;&nbsp;&nbsp;
          <span>总计{{totalNumber}} &#x2f; {{totalUnDealNumber}} </span>
          <span v-for="item in  alarmArr" :key="item.name">
            {{item.name}}类 {{item.deal}} &#x2f; {{item.undeal}}
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="tableStyle">
            <!--复选框-->
            <el-table
              :data="tdateData"
              border
              style="width: 100%; overflow:visible"
              @selection-change="handleSelectionChange">
              <el-table-column :check="check" type="selection" min-width="5%"></el-table-column>
              <el-table-column
                v-for="item in ALARM_LIST_COLUMNS"
                :align="item.align"
                header-align="center"
                :key="item.field"
                :show-overflow-tooltip="true"
                :prop="item.field"
                :label="item.label"
                :min-width="item.width"
                :formatter="item.formatter">
              </el-table-column>
              <el-table-column min-width="6%" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="checkDetails(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <!--分页-->
      <el-row>
        <el-col :span="12">
          <pageination style="float: left" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="expotFileF" type="primary" size="small" style="float:right;margin:0 10px;">导出预警</el-button>
        <el-button type="primary" size="small" style="float:right;margin:0 10px;" @click="translatePageTable">转换图表</el-button>
        <el-button type="primary" size="small" style="float:right;margin:0 10px;" @click="processingBathControll">批处理</el-button>
        <el-dialog title="预警批处理" :visible.sync="dialogFormVisble">
          处理方案：
          <el-row>
            <el-radio-group v-model="radio" text-color="#5a5e66">
              <el-radio :label="3">继续观察</el-radio>
              <el-radio :label="6"> 关闭预警</el-radio>
              <el-radio :label="9">虚警</el-radio>
            </el-radio-group>
            <el-row class="ptRight">
              <el-button style="width:100px" type="primary" size="small" @click="processingBathDealAlarm">处理预警</el-button>
              <el-button style="width:100px; background-color:transparent;border:1px solid #1b5eed" size="small" @click="close">关闭</el-button>
            </el-row>
          </el-row>
        </el-dialog>
      </el-row>
      <el-row>
        <div class="translateTable">
          <div v-show="showPicTable" ref="alarmPieChart" class="pie-chart"></div>
          <div v-show="showPicTable" ref="alarmBarChart" class="bar-chart"></div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import { getNolinkMetaData } from '@/service/common/commonFunc'
  // 实时预警信息列表接口引入
  import {
    alarmListRealTime, // 实时预警表格数据请求接口
    getPageTableData, // 实时图标转换
    processingBath, // 批处理
    alarmType // 预警类型
  } from '../../../../service/alarmMonitor/alarmList'
  // 证券代码组件引入
  import StockCodeQuery from '../../../common/StockCodeQuery'
  // 分页组件引入
  import Pageination from '../../../common/pageination'
  // 查询结果列表组件引入
  import { ALARM_LIST_COLUMNS } from '../tableDefine'
  // 日期插件引入
  import moment from 'moment'
  import ElButton from 'element-ui/packages/button/src/button'
  // echarts 组件引入
  let echarts = require('echarts')
  export default {
    components: {
      ElButton,
      StockCodeQuery, // 证券代码组件注册
      Pageination // 分页组件注册
    },
    props: ['activeName'],
    data () {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0||Number(value)%1!==0) {
          callback(new Error('必须是正整数'))
          return
        }
        callback()
      }
      let numberRules = {
        validator: checkNumber
      }
      return {
        ALARM_LIST_COLUMNS: ALARM_LIST_COLUMNS,
        showPicTable: false,
        check: true,
        stockOption: [],
        TableControl: 'false',
        alarmTimeStart: '',
        alarmTimeEnd: '',
        operatorTimeStart: '',
        operatorTimeEnd: '',
        operatorTimeRange1: {
          selectableRange: ''
        },
        operatorTimeRange2: {
          selectableRange: ''
        },
        alarmTimePicker: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
        ],
        // operatorTimePicker:[new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),0,0,0),
        //   new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59)
        // ],
        // 查询提交参数
        submitData: {
          alarmStatus: '',
          stockCode: '',
          keyWorld: '',
          alarmType: '',
          operatorID: '',
          insType: '',
          alarmTimeStart: '',
          alarmTimeEnd: '',
          operatorTimeStart: '',
          operatorTimeEnd: '',
          operatorPersion: [],
          pageIndex: 1,
          pageRows: 10
        },
        // 查询表格显示数据
        tdateData: [],
        // 批处理提交参数
        submitProcessingBathData: [{
          alarmStatus: 3,
          operatorName: '',
          alarmProcTime: '',
          alarmID: '',
          alarmProcDate: '',
          alarmProcAdvice: ''
        }],
        // 批处理之复选框选中数据
        processingBathData: [],
        processingBathCon: false,
        processingBathDisabled: false,
        dialogFormVisble: false,
        radio: 3,
        keyCodeMessage: '',
        alarmTimeRange: [],
        alarmCategoryOptions: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        statusOptions: [],
        modelOptions: [],
        dealerOptions: [
          {category: '所有的'},
          {category: '本人的'},
          {category: '所有未处理的'},
          {category: '本人未处理'}
        ],
        TdateReloadOperate: '停止刷新',
        intervalTime:{
          TdatereloadTime: 30,
        },
        intervalTimeRules:{
          TdatereloadTime: [numberRules, {trigger: 'blur'}]
        },
        TdatetimerFun: null,
        TddealBarData: [],
        TdundealBarData: [],
        TdpieData: [],
        currentPage: 1,
        pageSizeNumber: 10,
        pageTotal: 0,
        totalNumber: 0,
        totalUnDealNumber: 0,
        alarmArr: []
      }
    },
    computed:{
      isRefresh:function () {
        return isNaN(this.intervalTime.TdatereloadTime)||Number(this.intervalTime.TdatereloadTime) < 0||Number(this.intervalTime.TdatereloadTime)%1!==0
      }
    },
    watch:{
      operatorTimeStart:{
        handler:function (val1,val2) {
          this.operatorTimeRange2.selectableRange = `${val1} - 23:59:59`
        }
      },
      operatorTimeEnd:{
        handler:function (val1,val2) {
          this.operatorTimeRange1.selectableRange = `00:00:00 - ${val1}`
        }
      }
    },
    methods: {
      // 定时刷新
      changeReloadTime () {
        if (this.TdateReloadOperate === '恢复刷新') {
          this.$message({
            showClose: true,
            message: '请恢复刷新',
            type: 'warning'
          })
        } else {
          clearInterval(this.TdatetimerFun)
          if(!this.isRefresh){
            this.TdatetimerFun = setInterval(this.getRealTimeData, this.intervalTime.TdatereloadTime * 1000)
          }
        }
      },
      // 清空
      clear () {
        this.alarmTimePicker = [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
        ]
        this.operatorTimeStart = ''
        this.operatorTimeEnd = ''
        this.submitData.alarmStatus = ''
        this.submitData.stockCode = ''
        this.submitData.keyWorld = ''
        this.submitData.alarmType = ''
        this.submitData.insType = ''
        this.submitData.alarmTimeStart = ''
        this.submitData.alarmTimeEnd = ''
        this.submitData.operatorTimeStart = ''
        this.submitData.operatorTimeEnd = ''
        this.submitData.operatorPersion = []
        this.submitData.pageIndex = 1
        this.stockCodeMessage = ''
        this.keyCodeMessage = ''
      },
      // 预警时间
      changeAlarmTime () {
        this.submitData.alarmTimeStart = moment(this.alarmTimePicker[0]).format('HH:mm:ss')
        this.submitData.alarmTimeEnd = moment(this.alarmTimePicker[1]).format('HH:mm:ss')
      },
      // 获取焦点获取时间 处理时间
      // timeLimit () {
      //   let start = this.operatorTimeStart
      //   if (start == null) {
      //     this.operatorTimeRange.selectableRange = '00:00:00-23:59:59'
      //   } else {
      //     let str = (start).getHours() + ':' + (start).getMinutes() + ':' + (start).getSeconds()
      //     this.operatorTimeRange.selectableRange = str + '-23:59:59'
      //   }
      // },
      // 开始失去焦点获取时间
      blurTimeEnd () {
        this.submitData.operatorTimeEnd = this.operatorTimeEnd
      },
      // 结束失去焦点获取时间
      blurTimeStart () {
        this.submitData.operatorTimeStart = this.operatorTimeStart
      },
      // 查询
      submit () {
        clearInterval(this.TdatetimerFun)
        this.TdateReloadOperate = '恢复刷新'
        this.keyCodeMessage = ''
        this.stockCodeMessage = ''
        this.getRealTimeData()
      },
      // 证券代码
      getStockCode (stockCodeData) {
        this.submitData.stockCode = stockCodeData
      },
      // 预警类型：
      getAlarmType () {
        alarmType('warnningType', 'realWarn').then((resp) => {
          this.alarmCategoryOptions = resp
        })
      },
      // 板块1
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
      keyCodevalidChangeT (val) {
        this.submitData.keyWorld = val.replace(/\'/g, '') // eslint-disable-line
      },
      // 关键字
      keyCodevalid () {
        if (!this.submitData.keyWorld.trim()) {
          this.keyCodeMessage = '输入不能为空'
        } else if (!/^([\u4e00-\u9fa5]|\w)+$/.test(this.submitData.keyWorld)) {
          this.keyCodeMessage = '输入格式不正确'
        } else {
          this.keyCodeMessage = ''
        }
      },
      // 表格样式设置
      headerStyle () {
      },
      // 表格内容更新
      Tdatestopreload () {
        if (this.TdateReloadOperate === '停止刷新') {
          clearInterval(this.TdatetimerFun)
          this.TdateReloadOperate = '恢复刷新'
        } else if (this.TdateReloadOperate === '恢复刷新') {
          this.TdatetimerFun = setInterval(this.getRealTimeData, this.intervalTime.TdatereloadTime * 1000)
          this.TdateReloadOperate = '停止刷新'
        }
      },
      // 时间
      getRealTimeData () {
        if (this.submitData.alarmTimeStart === '') {
          this.submitData.alarmTimeStart = moment(this.alarmTimePicker[0]).format('HH:mm:ss')
        }
        if (this.submitData.alarmTimeEnd === '') {
          this.submitData.alarmTimeEnd = moment(this.alarmTimePicker[1]).format('HH:mm:ss')
        }
        if (this.operatorTimeStart !== '') {
          this.submitData.operatorTimeStart = moment(this.operatorTimeStart).format('HH:mm:ss')
        }
        if (this.operatorTimeEnd !== '') {
          this.submitData.operatorTimeEnd = moment(this.operatorTimeEnd).format('HH:mm:ss')
        }
        alarmListRealTime(this.submitData).then((res) => {
          this.totalUnDealNumber = 0
          if (res.alarmData.totalRows) {
            this.pageTotal = res.alarmData.totalRows
            this.tdateData = res.alarmData.metaData
            let counts = res.count
            this.totalNumber = counts.total
            this.totalUnDealNumber = counts.undetail
            this.alarmArr = [
              {name: 'A', deal: counts.aTotal, undeal: counts.aUndeal},
              {name: 'B', deal: counts.bTotal, undeal: counts.bUndeal},
              {name: 'C', deal: counts.cTotal, undeal: counts.cUndeal},
              {name: 'D', deal: counts.dTotal, undeal: counts.dUndeal},
              {name: 'S', deal: counts.sTotal, undeal: counts.sUndeal}
            ]
          } else {
            this.alarmArr = []
            this.tdateData = []
            this.totalNumber = 0
            this.pageTotal = 0
          }
        })
        this.dialogFormVisble = false
      },
      getAlarmPieChartData (arr) {
        let echart = echarts.init(this.$refs.alarmPieChart, this.gfnGetTheme())
        let option = {
          backgroundColor: ['transparent'],
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.marker + params.name + '： ' + params.value + '%'
            }
          },
          toolbox: {
            feature: {
              // 下载
              saveAsImage: {show: true}
            }
          },
          title: {
            text: '预警统计',
            x: 'center',
            textStyle: {
              color: '#ffffff',
              fontFamily: 'Microsoft Yahei'
            }
          },
          legend: {
            orient: 'vertical',
            x: '1%',
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
              center: ['50%', '48%'],
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
      // 转换图表之柱状图
      getAlarmBarChartData (arr1, arr2) {
        let echart = echarts.init(this.$refs.alarmBarChart, this.gfnGetTheme())
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'}
          },
          title: {
            text: '预警处理统计',
            // top:'20px',
            x: 'center',
            textStyle: {
              color: '#ffffff',
              fontFamily: 'Microsoft Yahei'
            }
          },
          backgroundColor: ['transparent'],
          toolbox: {
            feature: {
              // 下载
              saveAsImage: {show: true}
            }
          },
          legend: {
            orient: 'vertical',
            x: '92%',
            y: 90,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            textStyle: {color: '#7b8fb9'},
            data: ['已处理', '未处理']
          },
          xAxis: [
            {
              type: 'category',
              // x 轴线条颜色
              axisLine: {
                lineStyle: {color: '#7b8fb9'}
              },
              data: ['A类预警', 'B类预警', 'C类预警', 'D类预警', 'S类预警']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量',
              min: 0,
              // y 轴线条颜色
              axisLine: {
                lineStyle: {color: '#7b8fb9'}
              },
              // y分割线颜色
              splitLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              max: this.pageTotal,
              interval: Math.ceil(this.pageTotal / 10)
            }
          ],
          series: [
            {
              name: '已处理',
              type: 'bar',
              data: arr1
            },
            {
              name: '未处理',
              type: 'bar',
              data: arr2
            }
          ]
        }
        window.onresize = echart.resize
        echart.setOption(option)
      },
      translatePageTable () {
        this.showPicTable = !this.showPicTable
        getPageTableData(this.submitData).then((res) => {
          let obj3 = res.PIEGRAPH
          let arr4 = [
            {value: parseFloat(obj3.aPercentages), name: 'A类预警'},
            {value: parseFloat(obj3.bPercentages), name: 'B类预警'},
            {value: parseFloat(obj3.cPercentages), name: 'C类预警'},
            {value: parseFloat(obj3.dPercentages), name: 'D类预警'},
            {value: parseFloat(obj3.sPercentages), name: 'S类预警'}
          ]
          let arr1 = [
            res.GRAPHDEAL.aDeal,
            res.GRAPHDEAL.bDeal,
            res.GRAPHDEAL.cDeal,
            res.GRAPHDEAL.dDeal,
            res.GRAPHDEAL.sDeal
          ]
          let arr2 = [
            res.GRAPHUNDEAL.aUndeal,
            res.GRAPHUNDEAL.bUndeal,
            res.GRAPHUNDEAL.cUndeal,
            res.GRAPHUNDEAL.dUndeal,
            res.GRAPHUNDEAL.sUndeal
          ]
          this.getAlarmPieChartData(arr4)
          this.getAlarmBarChartData(arr1, arr2)
        })
      },
      // 预警处理 -关闭
      close () {
        this.$message({
          showClose: true,
          message: '预警未做处理',
          type: 'success',
          duration: 1500
        })
        this.dialogFormVisble = false
      },
      // 批处理控制
      processingBathControll () {
        if ((this.submitProcessingBathData.length === 1 && this.submitProcessingBathData[0].alarmID === '') || (this.submitProcessingBathData.length === 0)) {
          this.$message({
            message: '请选择预警信息',
            type: 'warning',
            showClose: true
          })
          this.dialogFormVisble = false
        } else {
          this.dialogFormVisble = true
        }
      },
      // 批处理提交参数方法
      processingBathDealAlarm () {
        let arr = this.submitProcessingBathData
        arr.forEach((v, i) => {
          v.alarmStatus = this.radio
          if (this.radio === 3) {
            v.alarmProcAdvice = '继续观察'
          } else if (this.radio === 6) {
            v.alarmProcAdvice = '关闭预警'
          } else if (this.radio === 9) {
            v.alarmProcAdvice = '虚警'
          }
        })
        arr = JSON.stringify(arr)
        processingBath(arr).then((res) => {
          if (res) {
            this.$message({
              showClose: true,
              message: '预警处理成功',
              type: 'success',
              duration: 10000
            })
            this.getRealTimeData()
          } else {
            this.$message({
              showClose: true,
              message: '预警处理失败',
              type: 'warning',
              duration: 10000
            })
          }
        })
        this.dialogFormVisble = false
      },
      // 复选框的方法能够获取
      handleSelectionChange (selection) {
        let arr = []
        let date = new Date()
        selection.forEach((v, i) => {
          let obj = {
            alarmStatus: 3,
            operatorName: v.operator_name,
            alarmProcTime: date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            alarmProcDate: date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString(),
            alarmID: v.alarm_id,
            alarmProcAdvice: '继续观察'
          }
          arr.push(obj)
        })
        this.submitProcessingBathData = arr
      },
      // 分页方法
      getPageination (pageinationVal) {
        this.submitData.pageRows = pageinationVal.pageSizeNumber
        this.submitData.pageIndex = pageinationVal.currentPage
        this.getRealTimeData()
      },
      // 导出预警
      expotFileF () {
        let submitParams = JSON.parse(JSON.stringify(this.submitData))
        delete submitParams.pageRows
        delete submitParams.pageIndex
        submitParams.tableColumns = this.ALARM_LIST_COLUMNS
        this.gfnExportFileWithForm('/alarm/warning/today-list/export', submitParams)
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
    mounted () {
      this.getWarningDetailOption()
      this.getRealTimeData()
      this.TdatetimerFun = setInterval(this.getRealTimeData, this.intervalTime.TdatereloadTime * 1000)
      this.getAlarmType()
      this.getinsType()
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }
  }
</script>

<style scoped lang="less">
  .totalNumbers {
    text-indent: 20px;
  }

  .ptRight {
    display: flex;
    justify-content: flex-end;
  }

  .el-row {
    width: 100%;
    .translateTable {
      /*margin-left:50px;*/
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
        width: 50%;
        height: 500px;
        float: left;
      }
      .bar-chart {
        width: 50%;
        height: 500px;
        float: right;
      }
    }
  }
</style>
