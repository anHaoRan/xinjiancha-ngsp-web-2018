<template>
  <el-card class="account-margin-top-30">
    <div slot="header" class="clearfix">
      <span>3分钟账户数前十</span>
    </div>
    <div id="accountTopTenBar" class="bar-chart"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts';
import 'echarts/map/js/china.js';
import { TH_MAP_ACCOUNT_CODE, TH_MAP_TRADE_CODE, formatPointerColor, formatLineColor, formatCircleRadius } from './formatColor.js';
import { getRegionThresholdParams } from '@/service/marketSupervise/areaTradeLiveness'
export default {
  props: ['accountTopTenData'],
  watch: {
    accountTopTenData() {
      this.drawAccountTopTenBar()
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
    drawAccountTopTenBar() {
      let myChart = document.getElementById('accountTopTenBar');
      let echart = echarts.init(myChart, this.gfnGetTheme());
      let _this = this;

      let accountTopTenProvince = [];
      let accountTopTenValue = [];

      for (let item of this.accountTopTenData) {
        accountTopTenProvince.push(item.provinceName);
        accountTopTenValue.push(item.accNum);
      }

      accountTopTenProvince.reverse();
      accountTopTenValue.reverse();

      let option = {
        tooltop: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '20',
          left: '2%',
          right: 60,
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
          data: accountTopTenProvince
        },
        series: [
          {
            type: 'bar',
            data: accountTopTenValue,
            itemStyle: {
              normal: {
                color: function(params) {
                  return formatPointerColor(params.data, TH_MAP_ACCOUNT_CODE, _this.thresholds)
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
.account-margin-top-30 {
  margin-top: 30px;
  .bar-chart {
    width: 100%;
    height: 304px;
  }
}

</style>