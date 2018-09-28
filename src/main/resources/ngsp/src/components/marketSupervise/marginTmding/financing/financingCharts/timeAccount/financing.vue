<template>
  <div class="clearfix financing">
    <div id="financeChart" class="financeChart"></div>
    <div class="itemList">
      <div class='item'>
        <div>
          <h2>{{this.gfnFormatThousands(result.today_rzmr)}} 亿元</h2>
          <p>融资买入</p>
        </div>
      </div>
      <div class='item'>
        <div>
          <h2>{{this.gfnFormatThousands(result.today_mqhke)}} 亿元</h2>
          <p>卖券还款</p>
        </div>
      </div>
      <div class='item'>
        <div>
          <h2>{{this.gfnFormatThousands(result.today_rzpc)}} 亿元</h2>
          <p>融资强平</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts');
  export default {
    props: ['result'],
    data() {
      return {
        chart: null
      }
    },
    watch: {
      result(curVal, oldVal) {
        this.drawLineChart([curVal.today_rzmr, curVal.today_mqhke, curVal.today_rzpc])
      }
    },
    methods: {
      drawLineChart(data) {
        if (this.chart == null) {
          this.chart = echarts.init(document.getElementById('financeChart'), this.gfnGetTheme());
          let options = {
            xAxis: {
              show: false,
              type: 'category',
              boundaryGap: true,
              data: ['融资买入', '卖券还款', '融资强平']
            },
            yAxis: {
              show: false,
              type: 'value'
            },
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 5
            },
            series: [{
              data: data,
              symbol: 'circle',
              symbolSize: 6,
              type: 'line',
              smooth: true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#1c3157'
                    }, {
                      offset: 1,
                      color: '#1c3157'
                    }])
                }
              }
            }]
          }
          this.chart.setOption(options);
          console.log('draw line 1', data)
        } else {
          this.chart.setOption({
            series: [{
              data: data
            }]
          })
          console.log('draw line 2', data)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .clearfix:after {
    content: "";
    display: block;
    height: 0px;
    clear: both;
  }

  .financing {
    .financeChart {
      height: 180px;
      width: 470px;
    }
    .itemList {
      margin: 10px 10px;
      display: flex;
      justify-content: space-between;

      .item {
        align-items: center;
        margin-bottom: 25px;

        div {
          padding: 15px 0;

          h2 {
            color: rgba(255, 255, 255, 1);
            font-weight: 400;
            font-size: 26px;
            line-height: 36px;
            margin: 0;
          }

          p {
            line-height: 1;
            margin: 0;
          }
        }
      }
    }
  }

</style>
