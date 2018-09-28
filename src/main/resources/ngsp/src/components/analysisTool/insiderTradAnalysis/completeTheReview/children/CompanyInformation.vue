<!--公司信息-->
<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card>
        <div slot="header" class="clearfix">
          <span>公司信息列表</span>
          <el-tooltip placement="top-start">
            <div slot="content">
              <h2>公司基本信息</h2>
              <p v-html="item" v-for="(item,index) in text.split('\n')" :key="index" class="tooltip-p"></p>
            </div>
            <span style="color: #999;float: right;margin-right: 20px;">
            <i class="el-icon-info" style="color:#cc9a32"></i>
            公司基本信息
          </span>
          </el-tooltip>
        </div>
        <div class="card-main" style="overflow-x: auto;">
          <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
            <el-checkbox :label="item.notice_id" :key="item.notice_id" v-for="item in checkListData"
                         class="company-check">
              {{item.notice_date +' '+ item.sec_name+'：'+ item.notice_name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div slot="header" class="clearfix">
          <span>股价走势图</span>
        </div>
        <div class="card-main" id="priceChart">

        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {
    query,
    shIndexQuery
  } from '@/service/analysisTool/insiderTradAccountAnalysis/completeTheReview/index'
  import moment from 'moment'

  let echarts = require('echarts')
  export default {
    components: {},
    name: 'company-information',
    props: {},
    data () {
      return {
        text: `平安银行，全称平安银行股份有限公司，是中国平安保险（集团）股份有限公司控股的一家跨区域经营的股份制商业银行，为中国大陆12家全国性股份制商业银行之一。注册资本为人民币51.2335亿元，总资产近1.37万亿元，总部位于广东省深圳市。
              \n中国平安保险（集团）股份有限公司（以下简称“中国平安”）及其控股子公司持有平安银行股份共计约26.84亿股，占比约52.38%，为平安银行的控股股东。
              \n2012年1月，现平安银行的前身深圳发展银行收购平安保险集团旗下的深圳平安银行，收购完成后，深圳发展银行更名为新的平安银行，组建新的平安银行正式对外营业。2013年5月24日内部正式发文宣布调整总行组织架构，总行一级部门由原来的79个精简至52个， 新建或整合形成了3个行业事业部、11个产品事业部和1个平台事业部。
              \n截至2013年6月底，平安银行资产总额18,269.98亿元，存款总额11,753.61亿元，贷款总额（含贴现）7,864.84亿元。
              \n2013年12月30日晚，平安银行发布公告称，收到了中国证券监督管理委员会的批复，核准公司非公开发行不超过13.23亿股新股，平安银行将于6个月内完成本次定向增发。`,
        checkList: [],
        checkListData: [],
        shIndexQueryData: [],
        echart: null,
        options: null,
        echartData: null
      }
    },
    mounted () {
      this.ajaxQuery()
      this.ajaxShIndexQuery()
    },
    methods: {
      handleCheckListChange (val) {
        let obj = {
          data: [],
          symbolSize: 25
        }
        if (val.length < 1) {
          obj.symbolSize = 0
        }
        let arr = []
        for (let key of val) {
          let index = this.checkListData.findIndex((item) => {
            return item.notice_id == key
          })
          if (index != -1)
            arr.push(this.checkListData[index].new_date)
        }
        if (arr.length > 0)
          arr = Array.from(new Set(arr))
        for (let key of arr) {
          let nDate = moment(key, 'YYYY/MM/DD').format('YYYY-MM-DD')
          let index = this.shIndexQueryData.findIndex((item) => {
            return item.trading_date == nDate
          })
          if (index != -1) {
            obj.data.push({
              coord: [nDate, this.shIndexQueryData[index].close_price]
            })
          }
        }
        this.$set(this.options.series[0], 'markPoint', obj)
        this.echart.setOption(this.options)
      },
      initEcharts () {
        let myLine = document.getElementById('priceChart')
        this.echart = echarts.init(myLine, this.gfnGetTheme())
        this.echartData = splitData(this.shIndexQueryData)
        this.gfnEchartShowLoading(this.echart)
        this.options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 10}
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          grid: [
            {
              left: '0',
              right: '30',
              top: '10%',
              height: '50%'
            },
            {
              left: '0',
              right: '30',
              top: '70%',
              height: '20%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: this.echartData.timeList,
              boundaryGap: false,
              axisLabel: {
                show: false
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: this.echartData.timeList,
              boundaryGap: false,
              axisLabel: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              position: 'right'
            },
            {
              gridIndex: 1,
              position: 'right',
              splitNumber: 3,
              axisTick: {show: false},
              splitLine: {show: false},
              axisLabel: {
                show: true,
                align: 'right'
              },
              axisLine: {show: false}
            }
          ],
          series: [
            {
              name: '股票收盘价',
              type: 'line',
              data: this.echartData.closePrice,
              itemStyle: {
                color: '#ff402b'
              }
            },
            {
              name: '成交量',
              type: 'bar',
              data: this.echartData.tradeVolume,
              xAxisIndex: 1,
              yAxisIndex: 1,
              smooth: true,
              itemStyle: {
                color: '#ff402b'
              }
            }
          ]
        }
        this.echart.clear()
        this.echart.setOption(this.options)
        this.echart.hideLoading()
      },
      ajaxQuery () {
        let params = {
          taskId: this.$route.params.taskId,
          pageIdx: 1,
          pageRw: 50
        }
        query(params).then((res) => {
          this.checkListData = res.mattersList
          this.text = res.basicInfo
        })
      },
      ajaxShIndexQuery () {
        shIndexQuery(this.$route.params.taskId).then((res) => {
          this.shIndexQueryData = res.kList
          this.initEcharts()
        })
      }
    }
  }

  // 图形数据结构处理
  function splitData (rawData) {
    let data = rawData
    let timeList = []
    let closePrice = []
    let tradeVolume = []
    for (let key of data) {
      timeList.push(key.trading_date)
      closePrice.push(key.close_price)
      tradeVolume.push(key.trade_volume)
    }
    return {
      timeList,
      closePrice,
      tradeVolume
    }
  }
</script>

<style lang="less" scoped>
  .tooltip-p {
    width: 500px;
    word-wrap: break-word;
  }

  .company-check {
    display: inherit;
    line-height: 30px;
  }

  .company-check + .company-check {
    margin-left: 0px;
  }

  .card-main {
    height: 300px;
  }
</style>
