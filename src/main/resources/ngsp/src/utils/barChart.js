import echarts from 'echarts'
import Vue from 'vue'

/*
 * 画柱分图的方法
 * @param {id} 页面上画柱状图的DOM id
 * @param {data} 柱状图数据及配置项
 */
export function drawBarChart (id, data) {
  let myLine = document.getElementById(id)
  let echart = echarts.init(myLine, Vue.prototype.gfnGetTheme())
  echart.clear()
  window.onresize = echart.resize
  echart.setOption({
    //  是否开启动画
    // animation:false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      inactiveColor: '#455579',
      right: '10%',
      top: '20px',
      data: [data.classify],
      textStyle: {
        color: '#7b8fb9'
      }
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '1%',
      containLabel: true
    },
    toolbox: {
      x: '90%',
      y: '15px',
      itemSize: 18,
      feature: {
        saveAsImage: {}
      },
      showTitle: false
    },
    xAxis: {
      show: true,
      axisLabel: {
        color: '#aec0e6',
        interval: 0
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'transparent'
        }
      },
      type: 'category',
      // boundaryGap: 'false',
      data: data.memberName
    },
    yAxis: {
      show: data.flag,
      type: 'value'
    },
    series: [
      {
        name: data.classify,
        type: 'bar',
        barWidth: 50,
        data: data.amount,
        label: {
          normal: {
            show: true,
            position: 'top',
            fontWeight: 500,
            fontsize: '20px',
            color: data.color2,
            formatter: function (val) {
              return val.data + '万元'
            }
          }
        },
        itemStyle: {
          normal: {
            color: data.color1
          }
        }
      }
    ]
  }, true)
}
