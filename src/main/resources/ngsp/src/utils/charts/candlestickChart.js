import moment from 'moment/moment'
import { getTheme } from '../storageUtil'
import * as types from '../../store/mutation-types'

let echarts = require('echarts')

/*
 * 画股票日K图的方法
 * @param chartData 图表数据
 * @param DOMId 需要画图的domId
 */
export function drawCandlestickChart (chartData, DOMId) {
  let myKChart = document.getElementById(DOMId)
  let echart = echarts.init(myKChart, getTheme())
  if (chartData.DATA.chartName === '') {
    echart.clear()
    return false
  }
  echart.showLoading()
  let data = splitData(chartData.DATA)
  let tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
        color: '#006cee'
      }
    },
    backgroundColor: 'rgba(245,245,245,0.8)',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    textStyle: {
      color: '#000'
    },
    position: function (pos, params, el, elRect, size) {
      let obj = {top: 35}
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
      return obj
    }
  }
  let toolbox = {
    top: 0,
    right: 50,
    feature: {
      dataZoom: {
        show: false
      },
      brush: {
        type: ['lineX', 'clear']
      }
    }
  }
  let brush = {
    xAxisIndex: 'all',
    brushLink: 'all',
    throttleType: 'debounce',
    throttleDelay: '300',
    removeOnClick: true,
    outOfBrush: {
      colorAlpha: 1
    }
  }
  let xAxis = {
    type: 'category',
    data: data.timeList,
    scale: true,
    boundaryGap: true,
    axisLine: {onZero: true},
    axisLabel: {
      color: '#7b8fb9'
    },
    splitLine: {show: false},
    splitNumber: 30
  }
  let yAxis = {
    scale: true,
    splitArea: {
      show: true
    },
    axisLabel: {
      color: '#7b8fb9'
    }
  }
  let series = [
    {
      name: '日K图',
      type: 'candlestick',
      data: data.volumes,
      itemStyle: {
        color: '#e33f2d',
        color0: '#12a08e',
        borderColor: null,
        borderColor0: null
      }
    }
  ]
  let options = {
    tooltip: tooltip,
    axisPointer: {
      link: {xAxisIndex: 'all'}
    },
    toolbox: toolbox,
    brush: brush,
    grid: [
      {
        left: '60',
        right: '0',
        top: '2%',
        height: '90%',
        containLabel: false
      }
      // {
      //   left: "5%",
      //   right: "5%",
      //   top: "70%",
      //   height: "20%",
      //   containLabel: false
      // }
    ],
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
  }
  let _this = this
  echart.on('brushSelected', function (val) {
    let timeData = val.batch[0].areas[0]
    if (timeData) {
      let sd, ed
      if (timeData.coordRange[0].toString().indexOf('-') > 0) {
        sd = timeData.coordRange[0]
        ed = timeData.coordRange[1]
      } else {
        let l = data.timeList.length - 1
        sd = data.timeList[timeData.coordRange[0] < 0 ? 0 : timeData.coordRange[0]]
        ed = data.timeList[timeData.coordRange[1] > l ? l : timeData.coordRange[1]]
      }
      let startDate = new Date(sd)
      let endDate = new Date(ed)
      // store.commit(types.C_CHANGE_DATE_RANGE, [startDate, endDate]);
    } else {
      let startDate = new Date(data.timeList[0])
      let endDate = new Date(data.timeList[data.timeList.length - 1])
      // store.commit(types.C_CHANGE_DATE_RANGE, [startDate, endDate]);
    }
  })
  echart.clear()
  window.onresize = echart.resize
  echart.setOption(options)
  echart.hideLoading()
  return echart
}

// 图形数据结构处理
function splitData (rawData) {
  let data = rawData
  let timeList = []
  let volumes = []
  for (let i = 0; i < data.length; i++) {
    timeList.push(moment(data[i][0]).format('YYYY-MM-DD'))
    volumes.push([
      data[i][1], // 开盘open
      data[i][4], // 收盘close
      data[i][3], // 最低lowest
      data[i][2]  // 最高highest
    ])
  }
  return {
    timeList,
    volumes
  }
}

/**
 * 日K图框选调整
 * @param {string} DOMId 日K图domId
 * @param {string} store 全局状态
 * @return {object} null
 */
export function changeCandlestickBrush (DOMId, store) {
  let myLine = document.getElementById(DOMId)
  let echart = echarts.init(myLine, getTheme())
  // echart.showLoading();
  let range = [moment(store.state.startDate).format('YYYY-MM-DD'), moment(store.state.endDate).format('YYYY-MM-DD')]
  echart.dispatchAction({
    type: 'brush',
    areas: [
      {
        brushType: 'lineX',
        coordRange: range,
        xAxisIndex: 0
      }
    ]
  })
}
