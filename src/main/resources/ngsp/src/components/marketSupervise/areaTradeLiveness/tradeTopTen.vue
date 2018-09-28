<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>3分钟成交量前十</span>
    </div>
    <div id="tradeTopTenBar" class="bar-chart"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts';
import 'echarts/map/js/china.js';
import {TH_MAP_ACCOUNT_CODE, TH_MAP_TRADE_CODE, formatPointerColor, formatLineColor, formatCircleRadius } from './formatColor.js';
import { getRegionThresholdParams } from '@/service/marketSupervise/areaTradeLiveness'
export default {
  props: ['tradeTopTenData'],
  watch: {
    tradeTopTenData() {
      this.drawTradeTopTenBar();
    }
  },
  data () {
    return {
      thresholds: {}
    }
  },
  methods: {
    reqRegionThresholdParams () {
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
        }
      })
    },
    drawTradeTopTenBar() {
      let provinces = [];
      let dataArr = [];
      for (let item of this.tradeTopTenData) {
        provinces.push(item.provinceName);
        dataArr.push(item.tradQty);
      }

      provinces.reverse();
      dataArr.reverse();

      let myChart = document.getElementById('tradeTopTenBar');
      let echart = echarts.init(myChart, this.gfnGetTheme());
      let _this = this;

      let option = {
        tooltop: {
          trigger: 'axis',
          axisPointer: {
            type: 'shodow'
          }
        },
        grid: {
          top: '20',
          left: '2%',
          right: 100,
          bottom: '10',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value, index) {
              let val = _this.gfnFormatNumberUnit(value)
              return val.value + val.unit
            }
          }
        },
        yAxis: {
          type: 'category',
          data: provinces
        },
        series: [
          {
            type: 'bar',
            data: dataArr,
            itemStyle: {
              normal: {
                color: function(params) {
                  return formatLineColor(params.data, TH_MAP_TRADE_CODE, _this.thresholds)
                },
                label: {
                  show: true,
                  position: 'right',
                  formatter: function (param) {
                    return _this.gfnFormatThousands(param.data)
                  }
                }
              }
            }
          }
        ]
      };

      window.onresize = echart.resize;
      echart.setOption(option);
    }
  },
  created() {
    this.reqRegionThresholdParams()
  }
}
</script>

<style scoped lang="less">
//首页地图
.bar-chart {
  width: 100%;
  height: 304px;
}
</style>