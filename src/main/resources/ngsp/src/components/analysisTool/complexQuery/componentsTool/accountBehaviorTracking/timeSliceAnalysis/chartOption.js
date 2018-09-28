export const defaultOption = {
  title: {
    text: ''
  },
  color: ['#7b8fb9', '#009fff'],
  legend: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'cross'}
  },
  toolbox: {
    show: true,
    right: '25%',
    top: 0,
    itemSize: 25,
    iconStyle: {
      // color: '#fff'
    },
    feature: {
      /* dataZoom: {
       yAxisIndex: 'none'
       }, */
      saveAsImage: {
        type: 'jpeg',
        title: 'jpg图片导出'
      }
    }
  },
  /* dataZoom: [
   {
   type: 'inside',
   start: 50,
   end: 100
   },
   {
   type: 'slider',
   show: true,
   y: '90%',
   start: 50,
   end: 100,
   bottom: 30
   }
   ], */
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  grid: [
    {
      x: '5%',
      y: '5%',
      width: '90%',
      height: '32%'
    },
    {
      x: '5%',
      y: '50%',
      width: '90%',
      height: '32%'
    }
  ],
  xAxis: [
    {
      type: 'category',
      gridIndex: 0,
      name: '交易时间',
      nameLocation: 'start',
      nameTextStyle: {
        color: '#fff',
        fontWeight: 600
      },
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    },
    {
      type: 'category',
      gridIndex: 1,
      name: '交易时间',
      nameLocation: 'start',
      nameTextStyle: {
        color: '#fff',
        fontWeight: 600
      },
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      gridIndex: 0,
      name: '每分钟平均成交价',
      nameTextStyle: {
        color: '#fff',
        fontWeight: 600
      },
      position: 'right'
    },
    {
      type: 'value',
      gridIndex: 1,
      name: '成交量',
      nameTextStyle: {
        color: '#fff',
        fontWeight: 600
      },
      position: 'right'
    }
  ],
  dataset: {
    // dimensions: ['trade_date', 'close_price', 'trade_vol', 'hold_muster1', 'above_avg_bal_ratio', 'above_avg_cnt_ratio'],
    // source: []
    source: []
  },
  series: [
    {
      name: '每分钟平均成交价',
      type: 'line',
      /* markPoint: {
        symbol: 'circle',
        symbolSize: 60
      }, */
      xAxisIndex: 0,
      yAxisIndex: 0,
      encode: {
        x: 'trade_date',
        y: 'avg_trade_price'
      }
    },
    {
      name: '成交量',
      type: 'bar',
      barMaxWidth: 30,
      xAxisIndex: 1,
      yAxisIndex: 1,
      encode: {
        x: 'trade_date',
        y: 'trade_vol'
      }
    }
  ]
}
