<template>
  <el-card class="trade-liveness-map-chart">
    <div slot="header" class="clearfix" v-if="showNote">
      <span>市场交易3分钟热点区域分布图</span>
    </div>
    <div id="marketAreaMap" class="map-chart"></div>
    <el-row class="chart-description">
      <el-col :span="12">
        <ul class="clearfix">
          <li>
            <h4>账户数（个）</h4>
            <div class="bull"></div>
          </li>
          <li v-for="(item, index) in accountDesList" :key="index" class="clearfix">
            <span>{{item.label}}</span>
            <div :style="{backgroundColor:item.color}"></div>
          </li>
        </ul>
      </el-col>
      <el-col :span="10" :offset="2">
        <ul class="clearfix">
          <li>
            <h4>成交量（股|份）</h4>
            <div class="line"></div>
          </li>
          <li v-for="(item, index) in tradeDesList" :key="index" class="clearfix">
            <span>{{item.label}}</span>
            <div :style="{backgroundColor:item.color}"></div>
          </li>
        </ul>
      </el-col>
      <el-col :span="24" v-if="showNote">
        <h4>统计说明</h4>
        <p> 1，统计范围包括A股，B股及封闭基金。<br/> 2，根据每个营业部注册地或者所在地，统计该省所有营业部当前交易的账户数，以及累计交易量。<br/> &nbsp;&nbsp;&nbsp;&nbsp;其中，累计交易量单位具体为：（股票单位：股）（基金单位：份）
        </p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/map/js/china.js'
  import {
    TH_MAP_ACCOUNT_CODE,
    TH_MAP_TRADE_CODE,
    formatPointerColor,
    formatLineColor,
    formatCircleRadius
  } from './formatColor.js'
  import {COORDINATE00} from '../../../assets/js/chart/fluctConstants'
  import {getRegionThresholdParams} from '@/service/marketSupervise/areaTradeLiveness'

  // eslint-disable-next-line
  function formtGCData(geoData, data, srcNam, dest) {
    let tGeoDt = []
    if (dest) {
      for (let i = 0; i < data.length; i++) {
        if (srcNam !== data[i].name) {
          tGeoDt.push({
            coords: [geoData[srcNam], geoData[data[i].name]]
          })
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (srcNam !== data[i].name) {
          tGeoDt.push({
            coords: [geoData[data[i].name], geoData[srcNam]]
          })
        }
      }
    }
    return tGeoDt
  }

  export default {
    props: ['tradeMapData', 'showNote'],
    watch: {
      tradeMapData() {
        this.drawLivenessMap()
      }
    },
    data() {
      return {
        accountDesList: [{
          label: '< 5000',
          color: '#28d0ff'
        }, {
          label: '5000 - 5万',
          color: '#fff921'
        }, {
          label: '5万 - 50万',
          color: '#fb8104'
        }, {
          label: '>= 50万',
          color: '#ff000e'
        }],
        tradeDesList: [{
          label: '< 1000万',
          color: '#28d0ff'
        }, {
          label: '1000万 - 1亿',
          color: '#fff921'
        }, {
          label: '1亿 - 10亿',
          color: '#fb8104'
        }, {
          label: '>= 10亿',
          color: '#ff000e'
        }],
        thresholds: {},
        chart: null
      }
    },
    methods: {
      formatNumberUnit(val) {
        return this.gfnFormatNumberUnit(val)['value'] + this.gfnFormatNumberUnit(val)['unit']
      },
      reqRegionThresholdParams() {
        let _this = this
        getRegionThresholdParams().then(resp => {
          if (resp) {
            let provinceTradeList = resp.filter(v => {
              return v.name === 'province_trade'
            })[0].threshold
            _this.thresholds['province_trade'] = provinceTradeList
            let provinceAccountList = resp.filter(v => {
              return v.name === 'province_account'
            })[0].threshold
            _this.thresholds['province_account'] = provinceAccountList
            let provinceTradeArray = []
            for (let t in provinceTradeList) {
              provinceTradeArray.push(provinceTradeList[t])
            }
            let provinceAccountArray = []
            for (let a in provinceAccountList) {
              provinceAccountArray.push(provinceAccountList[a])
            }
            let tradeDesList = provinceTradeArray.map((v, i) => {
              return provinceTradeArray[i + 1]
                ? `${this.formatNumberUnit(v)} - ${this.formatNumberUnit(provinceTradeArray[i + 1])}`
                : `>= ${this.formatNumberUnit(provinceTradeArray[i])}`
            })
            tradeDesList.unshift(`< ${this.formatNumberUnit(provinceTradeArray[0])}`)
            let accountDesList = provinceAccountArray.map((v, i) => {
              return provinceAccountArray[i + 1]
                ? `${this.formatNumberUnit(v)} - ${this.formatNumberUnit(provinceAccountArray[i + 1])}`
                : `>= ${this.formatNumberUnit(provinceAccountArray[i])}`
            })
            accountDesList.unshift(`< ${this.formatNumberUnit(provinceAccountArray[0])}`)
            this.tradeDesList.forEach((v, i) => {
              this.tradeDesList[i]['label'] = tradeDesList[i]
            })
            this.accountDesList.forEach((v, i) => {
              this.accountDesList[i]['label'] = accountDesList[i]
            })
          }
        })
      },
      drawLivenessMap() {
        let _this = this
        if (this.chart == null) {
          this.chart = echarts.init(document.getElementById('marketAreaMap'))
        }
        let warnings = this.tradeMapData
        let COORDINATE = COORDINATE00
        let tradeLine = []
        let accountScatter = []
        for (let p in warnings) {
          let w = warnings[p]
          if (!w.name) {
            continue
          }

          accountScatter.push({
            name: w.name,
            value: COORDINATE[w.name].concat(w.accountNum)
          })

          tradeLine.push({
            fromName: w.name,
            toName: '上海',
            coords: [COORDINATE[w.name], COORDINATE['上海']],
            value: w.tradeNum
          })
        }

        let option = {
          title: {
            text: '市场交易3分钟热点区域分布图',
            top: 40,
            left: 'center',
            textStyle: {
              color: '#ffffff',
              fontFamily: 'Microsoft Yahei'
            }
          },
          backgroundColor: '',
          tooltip: {
            trigger: 'item',
            formatter: function (val) {
              if (!val.name) {
                return '<strong>' + val.seriesName + '</strong><br />' + val.data.fromName + ' :  ' + _this.gfnFormatThousands(val.value)
              }
              return '<strong>' + val.seriesName + '</strong><br />' + val.name + ' :  ' + _this.gfnFormatThousands(val.value[2])
            }
          },
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            containLabel: true
          },
          legend: {
            show: false
          },
          toolbox: {
            right: 20,
            feature: {
              saveAsImage: {
                show: true
              }
            }
          },
          geo: {
            map: 'china',
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.65)'
                }
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.85)'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: 'transparent',
                borderColor: '#0090ff'
              },
              emphasis: {
                areaColor: 'transparent'
              }
            }
          },

          series: [{
            name: '账户数',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'bottom',
                formatter: '{b}'
              },
              emphasis: {
                show: false,
                position: 'right',
                formatter: function (val) {
                  return val.seriesName + '\n' + val.name + ':' + _this.gfnFormatThousands(val.value[2])
                }
              }
            },
            symbolSize: function (val) {
              return formatCircleRadius(val, TH_MAP_ACCOUNT_CODE, _this.thresholds)
            },
            itemStyle: {
              normal: {
                color: function (val) {
                  let value = null
                  if (val != null) {
                    value = val.value[2]
                  }
                  return formatPointerColor(value, TH_MAP_ACCOUNT_CODE, _this.thresholds)
                }
              }
            },
            data: accountScatter
          }, {
            name: '成交量',
            type: 'lines',
            zlevel: 1,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                position: 'right',
                formatter: function (val) {
                  return val.seriesName + '\n' + val.data.fromName + ':' + _this.gfnFormatThousands(val.value)
                }
              }
            },
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: function (val) {
                  let value = val == null ? null : val.value
                  return formatLineColor(value, TH_MAP_TRADE_CODE, _this.thresholds)
                },
                width: 0,
                curveness: 0.2
              }
            },
            data: tradeLine
          }, {
            name: '成交量',
            type: 'lines',
            zlevel: 2,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                position: 'right',
                formatter: function (val) {
                  return val.seriesName + '\n' + val.data.fromName + ':' + _this.gfnFormatThousands(val.value)
                }
              }
            },
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbolSize: 3,
              symbol: 'circle'
            },
            lineStyle: {
              normal: {
                color: function (val) {
                  let value = val == null ? null : val.value
                  return formatLineColor(value, TH_MAP_TRADE_CODE, _this.thresholds)
                },
                width: 0.5,
                opacity: 0.7,
                curveness: 0.2
              }
            },
            data: tradeLine
          }]
        }
        window.onresize = this.chart.resize
        this.chart.setOption(option)
      }
    },
    mounted() {
      /* 获取阈值区间信息 */
      this.reqRegionThresholdParams()
    }
  }
</script>

<style scoped lang="less">
  .trade-liveness-map-chart {
    .map-chart {
      width: 100%;
      height: 700px;
    }
    .chart-description {
      position: absolute;
      left: 15px;
      bottom: 0;
      width: 380px;
      padding: 20px;
      h4 {
        font-size: 16px;
        color: #15b8d9;
        padding: 0;
        margin: 0;
        display: inline;
        font-weight: normal;
      }
      ul {
        padding: 0;
        li {
          width: 100%;
          div {
            width: 20px;
            height: 12px;
            float: right;
          }
          div.bull {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #fff921;
            margin-right: 4px;
          }
          div.line {
            width: 20px;
            height: 2px;
            background-color: #db9982;
            margin-top: 5px;
          }
        }
        li:first-of-type {
          padding-bottom: 5px;
        }
      }
      p {
        margin-top: 5px;
      }
    }
  }

</style>
