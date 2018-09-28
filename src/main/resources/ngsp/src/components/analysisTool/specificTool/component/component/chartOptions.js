export const pieDefaultOption1 = {
  title: {
    text: '涨跌平幅饼图',
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
    name: '涨跌平幅饼图',
    data: []
  }
}
export const pieDefaultOption2 = {
  title: {
    text: '重点监控原因饼图',
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
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    selectedMode: 'single',
    name: '重点监控原因饼图',
    avoidLabelOverlap: false,
    label: {
      normal: {
        show: true,
        position: 'center',
        fontSize: 25,
        color: '#fff',
        formatter: ''
      }
    },
    data: []
  }
}
export const pieDefaultOption3 = {
  title: {
    text: '重点监控级别分布',
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
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    selectedMode: 'single',
    name: '重点监控级别分布',
    avoidLabelOverlap: false,
    label: {
      normal: {
        show: true,
        position: 'center',
        fontSize: 25,
        color: '#fff',
        formatter: ''
      }
    },
    data: []
  }
}