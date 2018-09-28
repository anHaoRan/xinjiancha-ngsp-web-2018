const formatMin = (value) => {
  if (value < 60) {
    return `${value}分`
  } else if (value > 60 * 24) {
    let day = Math.floor(value / 60 / 24)
    let hour = Math.floor(value % (60 * 24) / 60)
    let min = value % (60 * 24) % 60
    return `${day}天${hour}小时${min}分`
  }
  let hour = Math.floor(value / 60)
  let min = value % 60
  return min ? `${hour}小时${min}分` : `${hour}小时`
}

export const pieDefaultOption = {
  title: {
    text: '已办占比图',
    left: 'center',
    textStyle: {
      // color: '#409eff'
    }
  },
  color: ['#009fff', '#ca5252'],
  legend: {
    bottom: 1,
    left: 'center',
    data: []
  },
  grid: {
    top: 50
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  toolbox: {
    show: true,
    right: '25%',
    top: 0,
    itemSize: 20,
    iconStyle: {
    },
    feature: {
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
  series: {
    type: 'pie',
    radius: '65%',
    center: ['50%', '50%'],
    selectedMode: 'single',
    name: '已办占比图',
    data: []
  }
}
export const barDefaultOption = {
  title: {
    text: '每日处理量',
    left: 'center',
    textStyle: {
      // color: '#409eff'
    }
  },
  color: ['#009fff', '#ca5252'],
  legend: {
    bottom: 10,
    left: 'center',
    data: []
  },
  grid: {
    top: 50,
    right: 100
  },
  tooltip: {
    trigger: 'axis', // axis
    // axisPointer: {type: 'cross'},
    formatter: '{a} <br/>{b} : {c}个'
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  toolbox: {
    show: true,
    right: '25%',
    top: 0,
    itemSize: 20,
    iconStyle: {
    },
    feature: {
      saveAsImage: {
        type: 'jpeg',
        title: 'jpg图片导出'
      }
    }
  },
  xAxis: {
    type: 'category',
    name: '近10个工作日',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    },
    axisLabel: {
      rotate: 20,
      interval: 0
    },
    data: []
  },
  yAxis: {
    type: 'value',
    name: '处理量（个）',
    minInterval: 1,
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    }
  },
  series: {
    type: 'bar',
    name: '每日处理量',
    data: []
  }
}
export const lineDefaultOption1 = {
  title: {
    text: '每日流程耗时',
    left: 'center',
    textStyle: {
      // color: '#409eff'
    }
  },
  color: ['#009fff', '#ca5252'],
  legend: {
    bottom: 10,
    left: 'center',
    data: []
  },
  grid: {
    top: 50,
    right: 100
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {type: 'cross'},
    formatter: function (params, ticket, callback) {
      return `${params[0].seriesName}<br/>${params[0].name}：${formatMin(params[0].value)}`
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  toolbox: {
    show: true,
    right: '25%',
    top: 0,
    itemSize: 20,
    iconStyle: {
    },
    feature: {
      saveAsImage: {
        type: 'jpeg',
        title: 'jpg图片导出'
      }
    }
  },
  xAxis: {
    type: 'category',
    name: '近10个工作日',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    },
    axisLabel: {
      rotate: 20,
      interval: 0
    },
    data: []
  },
  yAxis: {
    type: 'value',
    name: '耗时（分）',
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    }
  },
  series: {
    type: 'line',
    name: '每日流程耗时',
    data: []
  }
}
export const lineDefaultOption2 = {
  title: {
    text: '每日预警走势',
    left: 'center',
    textStyle: {
      // color: '#409eff'
    }
  },
  color: ['#009fff', '#ca5252'],
  legend: {
    bottom: 10,
    left: 'center',
    data: []
  },
  grid: {
    top: 50,
    right: 100
  },
  tooltip: {
    trigger: 'axis',
    // axisPointer: {type: 'cross'},
    formatter: '{a} <br/>{b} : {c}个'
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  toolbox: {
    show: true,
    right: '25%',
    top: 0,
    itemSize: 20,
    iconStyle: {
    },
    feature: {
      saveAsImage: {
        type: 'jpeg',
        title: 'jpg图片导出'
      }
    }
  },
  xAxis: {
    type: 'category',
    name: '30天',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    },
    axisLabel: {
      rotate: 20
      // interval: 0
    },
    data: []
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    name: '预警数量（个）',
    nameTextStyle: {
      color: '#fff',
      fontWeight: 600
    }
  },
  series: {
    type: 'line',
    name: '每日预警走势',
    data: []
  }
}