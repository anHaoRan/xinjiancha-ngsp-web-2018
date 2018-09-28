<template>
  <div class="oneYearDeal"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        近一年交易情况
      </div>
      <p>交易天数：{{tradeDayCount}}</p>
      <p>日均买卖：{{avgTradeFreq}}</p>
      <p>平均持股周期：{{avgHoldDays}}</p>
      <el-row v-if="isShow">
        <el-col :span="8">
          <img :class="!stockRatio?'imgFilter':''" src="../../../assets/images/stock.png"/>
        </el-col>
        <el-col :span="8">
          <img :class="!repurchaseRatio?'imgFilter':''" src="../../../assets/images/repurchase.png"/>
        </el-col>
        <el-col :span="8">
          <img :class="!bondRatio?'imgFilter':''" src="../../../assets/images/bond.png"/>
        </el-col>
        <el-col :span="8">
          <img :class="!LOFRatio?'imgFilter':''" src="../../../assets/images/LOF.png"/>
        </el-col>
        <el-col :span="8">
          <img :class="!ETFRatio?'imgFilter':''" src="../../../assets/images/ETF.png"/>
        </el-col>
        <el-col :span="8">
          <img :class="!otherRatio?'imgFilter':''" src="../../../assets/images/other.png"/>
        </el-col>
      </el-row>
      <div id='oneYearDeal' style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import echarts from 'echarts'
  import moment from 'moment'

  export default {
    components: {},
    data() {
      return {
        tradeDayCount: '',
        avgTradeFreq: '',
        avgHoldDays: '',
        stockRatio: '',
        repurchaseRatio: '',
        bondRatio: '',
        LOFRatio: '',
        ETFRatio: '',
        otherRatio: '',
        isShow: false,
        loading: true
      }
    },
    props: ['accountId', 'resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   this.getChartData()
      // },
      resultData: {
        handler: function (param1, param2) {
          this.getChartData()
        },
        deep: true
      },
    },
    mounted() {
      this.getChartData()
    },
    methods: {
      getChartData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          this.loading = false
          if (this.resultData.latestTradeInfo.avgHoldDays) {
            this.avgHoldDays = this.resultData.latestTradeInfo.avgHoldDays + '天'
          } else {
            this.avgHoldDays = ''
          }
          if (this.resultData.latestTradeInfo.tradeDayCount) {
            this.tradeDayCount = this.resultData.latestTradeInfo.tradeDayCount + '天'
          } else {
            this.tradeDayCount = ''
          }
          if (this.resultData.latestTradeInfo.avgTradeFreq) {
            this.avgTradeFreq = this.resultData.latestTradeInfo.avgTradeFreq + '笔'
          } else {
            this.avgTradeFreq = ''
          }
          if (JSON.stringify(this.resultData.latestTradeCategory) != '{}') {
            let res = this.resultData.latestTradeCategory
            let data1 = []
            let data2 = []
            res.forEach((el, index) => {
              data1.push({icon: 'roundRect', name: el.name})
              data2.push({value: el.ratio, name: el.name})
              if (el.name == '股票') {
                this.stockRatio = Number(res[index].ratio)
              } else if (el.name == '逆回购') {
                this.repurchaseRatio = Number(res[index].ratio)
              } else if (el.name == '债券') {
                this.bondRatio = Number(res[index].ratio)
              } else if (el.name == 'LOF') {
                this.LOFRatio = Number(res[index].ratio)
              } else if (el.name == 'ETF') {
                this.ETFRatio = Number(res[index].ratio)
              } else {
                this.otherRatio = Number(res[index].ratio)
              }
            })
            let voTopList = {
              data1: data1,
              data2: data2
            }
            this.drawPieChart('oneYearDeal', voTopList)
          } else {
            this.drawPieChart('oneYearDeal', {})
          }
        } else {
          this.avgHoldDays = ''
          this.tradeDayCount = ''
          this.avgTradeFreq = ''
          this.drawPieChart('oneYearDeal', {})
        }
      },
      drawPieChart(id, pieList) {
        let businesspie = echarts.init(document.getElementById(id), this.gfnGetTheme());
        businesspie.clear()
        window.onresize = businesspie.resize;
        businesspie.setOption({
          title: {
            left: 10,
            top: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
            }
          },
          legend: {
            bottom: 0,
            data: pieList.data1,
            textStyle: {
              color: '#798fb8'
            }
          },
          toolbox: {
            right: '6%',
            feature: {
              saveAsImage: {
                name: '近一年交易情况环形图'
              }
            }
          },
          tooltip: {
            show: true,
            trigger: 'item'
            // formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [{
            name: '交易情况',
            type: 'pie',
            radius: ['58%', '70%'],
            center: ['50%', '50%'],
            selectedOffset: 10,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  formatter: '{d}%',
                  position: 'outer'
                }
              }
            },
            data: pieList.data2
          }]
        })
      }
    }
  }
</script>

<style lang="less">
  .oneYearDeal {
    p {
      text-align: center;
    }
    img {
      width: 80px;
    }
    .imgFilter {
      filter: grayscale(1);
    }
    .el-col-8 {
      text-align: center;
    }
  }

</style>
