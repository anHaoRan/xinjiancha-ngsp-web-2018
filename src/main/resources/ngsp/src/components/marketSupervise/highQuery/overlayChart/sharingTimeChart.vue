<template>
  <div id='sharingTimeChart' style='height: 400px;'></div>
</template>

<script>
  import moment from 'moment';
  import {getNetbuy, postOverlayChart} from '../../../../service/marketSupervise/highQuery/index'
  import {getMarketTimeLine} from '../../../../service/marketSupervise/index'

  let echarts = require('echarts');
  export default {
    name: 'sharing-time-chart',
    props: ['queryParams', 'changeSelectTime'],
    data() {
      return {
        chart: null,
        chartOption: null,
        overlayData: {},
        indexTodayData: [],
        allTime: [],
        jumpParams: {},
        rateValue: '',
        timer: null,
        timeInterval: 60 * 1000
      }
    },
    mounted() {
      this.getShareTimeData()
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    watch: {
      'queryParams.indexParams.tradeDate': {
        handler: function (val) {
          this.getShareTimeData()
        },
        deep: true
      },
      'queryParams.overlayParams': {
        handler: function (val) {
          for (let k in val) {
            this.overlayData[k] = val[k]
          }
          this.getOverlayData()
        },
        deep: true
      },
      'changeSelectTime': {
        handler: function (val) {
          this.changeTimeChartBrush('sharingTimeChart', val)
        },
        deep: true
      }
    },
    methods: {
      // 获取叠加数据
      getOverlayData() {
        let trdDate = ''
        if (!this.queryParams.indexParams.tradeDate) {
          trdDate = ''
        } else {
          trdDate = moment(this.queryParams.indexParams.tradeDate, 'YYYY-MM-DD').format('YYYYMMDD')
        }
        let params = {
          'type': 'time',
          'startTime': moment(this.overlayData.startTime, 'HH:mm').format('HHmm'),
          'endTime': moment(this.overlayData.endTime, 'HH:mm').format('HHmm'),
          'tradeDate': trdDate,
          'codes': this.overlayData.codes,
          'sort': this.overlayData.sort,
          'swVocs': this.overlayData.swVocs,
          'wdVocs': this.overlayData.wdVocs,
          'cusVocs': this.overlayData.cusVocs
        }
        let NetParams = {
          trdDate: trdDate,
          stockCode: '000001',
          codeType: 'index'
        }
        let NetValue = {}
        let lineParams = {
          code: '000001',
          codeType: 'index',
          trdDate: trdDate,
          startTime: '',
          endTime: ''
        }
        getNetbuy(NetParams).then(resp => {
          let data = []
          let saleSoldMaxValue = resp.saleSoldMaxValue
          resp.saleSoldValue.forEach((el) => {
            data.push(el[1])
          })
          NetValue = {saleSoldMaxValue, data}
          getMarketTimeLine(lineParams).then(resp => {
            let oldData = this.splitData(resp, NetValue);
            let option = this.chart.getOption()
            postOverlayChart(JSON.stringify(params)).then(resp => {
              let that = this
              let lastCloseData = (Number(option.yAxis[0].min) + Number(option.yAxis[0].max)) / 2;
              let previous;
              option.tooltip = {
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
                  if (pos[0] < size.viewSize[0] / 2) {
                    return [pos[0] + 20, '36']
                  }
                  return [pos[0] - 220, '16']
                },
                formatter: function (params) {
                  let texts = params[0].name + '<br/>'
                  params.forEach((res) => {
                    if (res.seriesName == '价格') {
                      if (!res.value[2]) {
                        texts = ''
                      } else {
                        params.forEach((el) => {
                          if (el.seriesName == '成交金额') {
                            if (!el.value) {
                              texts += el.marker + el.seriesName + ':' + '--<br/>'
                            } else {
                              texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
                            }
                            params.forEach((res) => {
                              if (res.seriesName == '价格') {
                                if (!res.value[3]) {
                                  texts += el.marker + '成交量:' + '--<br/>'
                                } else {
                                  texts += el.marker + '成交量:' + res.value[3] + '亿股<br/>'
                                }
                              }
                            })
                          } else if (el.seriesName == '价格') {
                            if (!el.value[2]) {
                              texts += el.marker + el.seriesName + ':' + '--<br/>'
                            } else {
                              texts += el.marker + el.seriesName + ':' + el.value[2] + '<br/>'
                            }
                            if (!el.value[4]) {
                              texts += el.marker + '涨跌值:--<br/>'
                            } else {
                              texts += el.marker + '涨跌值:<i class=' + (el.value[4] > 0 ? 'up>' : 'down>') + el.value[4] + '</i><br/>'
                            }
                            if (!el.value[1]) {
                              texts += el.marker + '涨跌幅:--<br/>'
                            } else {
                              texts += el.marker + '涨跌幅:<i class=' + (el.value[1] > 0 ? 'up>' : 'down>') + el.value[1] + '%</i><br/>'
                            }
                          } else if (el.seriesName == '内外盘差') {
                            if (!el.value) {
                              texts += el.marker + el.seriesName + ':' + '--<br/>'
                            } else {
                              texts += el.marker + el.seriesName + ':' + el.value + '<br/>'
                            }
                          } else {
                            if (!el.value) {
                              texts += el.marker + el.seriesName + ':' + '--<br/>'
                            } else {
                              texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                            }
                          }
                        })
                      }
                    }
                  })

                  return texts
                }
              };
              option.xAxis[0].axisLabel = {
                color: '#506798',
                interval: 29
              };
              option.yAxis[0].axisLabel = {color: '#506798'};
              option.yAxis[2].axisLabel = {
                color: '#506798',
                formatter: function (value) {
                  return value + '%';
                }
              };
              option.yAxis[1].axisLabel = {
                color: '#506798',
                formatter: function (value, index) {
                  if (index === 0) {
                    return '';
                  } else {
                    return Number(value) + '亿元';
                  }
                }
              };
              let colorList = ['#339933', '#1b5eed', '#288783', '#1de3c0', '#6766cc', '#ea6e0d', '#ca6796']
              resp.forEach((el, i) => {
                let data = this.overlaySplitData(el);
                if (option.yAxis[2].max < data.max) {
                  option.yAxis[2].min = -data.max
                  option.yAxis[2].max = data.max
                }
                oldData.seriseData.push({
                  name: data.name,
                  type: 'line',
                  xAxisIndex: 0,
                  yAxisIndex: 2,
                  data: data.seriesData,
                  lineStyle: {color: colorList[i]},
                  itemStyle: {normal: {color: colorList[i]}}
                })
              });
              option.series = oldData.seriseData
              option.series[1].itemStyle = {
                normal: {
                  color: function (params) {
                    let volumesColor = '';
                    if (params.dataIndex === 0) {
                      if (that.indexTodayData[params.dataIndex][1] >= lastCloseData) {
                        volumesColor = that.gfnFormatSecurityColor(1)
                      } else {
                        volumesColor = that.gfnFormatSecurityColor(-1);
                      }
                    } else {
                      if (that.indexTodayData[params.dataIndex][1] > that.indexTodayData[params.dataIndex - 1][1]) {
                        volumesColor = that.gfnFormatSecurityColor(1)
                      } else {
                        volumesColor = that.gfnFormatSecurityColor(-1)
                      }
                    }
                    previous = params.data;
                    return volumesColor;
                  }
                }
              };
              option.series[2].itemStyle = {
                normal: {
                  color: function (params) {
                    if (params.data > 0) {
                      return '#e33f2d';
                    } else {
                      return '#12a08e';
                    }
                  }
                }
              };
              this.chart.setOption(option, true);
              this.chart.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'brush',
                brushOption: {
                  brushType: 'lineX',
                  brushMode: 'single'
                }
              })
              let range = [this.$store.state.highQuery.brushSharingTime.beginTime, this.$store.state.highQuery.brushSharingTime.endTime]
              this.changeTimeChartBrush('sharingTimeChart', range)
            });
          })
        })
      },
      // 日期改变叠加参数保存
      getChangeOverlayData() {
        let trdDate = ''
        if (!this.queryParams.indexParams.tradeDate) {
          trdDate = ''
        } else {
          trdDate = moment(this.queryParams.indexParams.tradeDate, 'YYYY-MM-DD').format('YYYYMMDD')
        }
        let params = {
          'type': 'time',
          'startTime': moment(this.overlayData.startTime, 'HH:mm').format('HHmm'),
          'endTime': moment(this.overlayData.endTime, 'HH:mm').format('HHmm'),
          'tradeDate': trdDate,
          'codes': this.overlayData.codes,
          'swVocs': this.overlayData.swVocs,
          'wdVocs': this.overlayData.wdVocs,
          'cusVocs': this.overlayData.cusVocs
        }
        postOverlayChart(JSON.stringify(params)).then(resp => {
          let option = null
          let that = this
          option = JSON.parse(JSON.stringify(this.chart.getOption()));
          let lastCloseData = (Number(option.yAxis[0].min) + Number(option.yAxis[0].max)) / 2;
          let previous;
          option.tooltip = {
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
              if (pos[0] < size.viewSize[0] / 2) {
                return [pos[0] + 20, '36']
              }
              return [pos[0] - 220, '16']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((res) => {
                if (res.seriesName == '价格') {
                  if (!res.value[2]) {
                    texts = ''
                  } else {
                    params.forEach((el) => {
                      if (el.seriesName == '成交金额') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
                        }
                        params.forEach((res) => {
                          if (res.seriesName == '价格') {
                            if (!res.value[3]) {
                              texts += el.marker + '成交量:' + '--<br/>'
                            } else {
                              texts += el.marker + '成交量:' + res.value[3] + '亿股<br/>'
                            }
                          }
                        })
                      } else if (el.seriesName == '价格') {
                        if (!el.value[2]) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value[2] + '<br/>'
                        }
                        if (!el.value[4]) {
                          texts += el.marker + '涨跌值:--<br/>'
                        } else {
                          texts += el.marker + '涨跌值:<i class=' + (el.value[4] > 0 ? 'up>' : 'down>') + el.value[4] + '</i><br/>'
                        }
                        if (!el.value[1]) {
                          texts += el.marker + '涨跌幅:--<br/>'
                        } else {
                          texts += el.marker + '涨跌幅:<i class=' + (el.value[1] > 0 ? 'up>' : 'down>') + el.value[1] + '%</i><br/>'
                        }
                      } else if (el.seriesName == '内外盘差') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '<br/>'
                        }
                      } else {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                        }
                      }
                    })
                  }
                }
              })

              return texts
            }
          };
          option.series[1].itemStyle = {
            normal: {
              color: function (params) {
                let volumesColor = '';
                if (params.dataIndex === 0) {
                  if (that.indexTodayData[params.dataIndex][1] >= lastCloseData) {
                    volumesColor = that.gfnFormatSecurityColor(1)
                  } else {
                    volumesColor = that.gfnFormatSecurityColor(-1)
                  }
                } else {
                  if (that.indexTodayData[params.dataIndex][1] > that.indexTodayData[params.dataIndex - 1][1]) {
                    volumesColor = that.gfnFormatSecurityColor(1)
                  } else {
                    volumesColor = that.gfnFormatSecurityColor(-1)
                  }
                }
                previous = params.data;
                return volumesColor;
              }
            }
          };
          option.series[2].itemStyle = {
            normal: {
              color: function (params) {
                if (params.data > 0) {
                  return '#e33f2d';
                } else {
                  return '#12a08e';
                }
              }
            }
          };
          option.xAxis[0].axisLabel = {
            color: '#506798',
            interval: 29
          };
          option.yAxis[0].axisLabel = {color: '#506798'};
          option.yAxis[2].axisLabel = {
            color: '#506798',
            formatter: function (value) {
              return value + '%';
            }
          };
          option.yAxis[1].axisLabel = {
            color: '#506798',
            formatter: function (value, index) {
              if (index === 0) {
                return '';
              } else {
                return Number(value) + '亿元';
              }
            }
          };
          let colorList = ['#339933', '#1b5eed', '#288783', '#1de3c0', '#6766cc', '#ea6e0d', '#ca6796']
          resp.forEach((el, i) => {
            let data = this.overlaySplitData(el);
            option.yAxis[2].min = -data.max
            option.yAxis[2].max = data.max
            option.series.push({
                name: data.name,
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 2,
                data: data.seriesData,
                lineStyle: {color: colorList[i]},
                itemStyle: {normal: {color: colorList[i]}}
              }
            );
          });
          this.chart.setOption(option);
        });
      },
      // 实时刷新
      refelshCharts() {
        let trdDate = ''
        if (!this.queryParams.indexParams.tradeDate) {
          trdDate = ''
        } else {
          trdDate = moment(this.queryParams.indexParams.tradeDate, 'YYYY-MM-DD').format('YYYYMMDD')
        }
        let NetParams = {
          trdDate: trdDate,
          stockCode: '000001',
          codeType: 'index'
        }
        let NetValue = {}
        let lineParams = {
          code: '000001',
          codeType: 'index',
          trdDate: trdDate,
          startTime: '',
          endTime: ''
        }
        getNetbuy(NetParams).then(resp => {
          let data = []
          let saleSoldMaxValue = resp.saleSoldMaxValue
          resp.saleSoldValue.forEach((el) => {
            data.push(el[1])
          })
          NetValue = {saleSoldMaxValue, data}
          getMarketTimeLine(lineParams).then(resp => {
            let data = this.splitData(resp, NetValue);
            let option = null
            let that = this
            if (this.chartOption !== null) {
              option = JSON.parse(JSON.stringify(this.chartOption));
            } else {
              this.chartOption = JSON.parse(JSON.stringify(this.chart.getOption()));
              option = JSON.parse(JSON.stringify(this.chart.getOption()));
            }
            let previous;
            option.tooltip = {
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
                if (pos[0] < size.viewSize[0] / 2) {
                  return [pos[0] + 20, '36']
                }
                return [pos[0] - 220, '16']
              },
              formatter: function (params) {
                let texts = params[0].name + '<br/>'
                params.forEach((res) => {
                  if (res.seriesName == '价格') {
                    if (!res.value[2]) {
                      texts = ''
                      return texts
                    } else {
                      params.forEach((el) => {
                        if (el.seriesName == '成交金额') {
                          if (!el.value) {
                            texts += el.marker + el.seriesName + ':' + '--<br/>'
                          } else {
                            texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
                          }
                          params.forEach((res) => {
                            if (res.seriesName == '价格') {
                              if (!res.value[3]) {
                                texts += el.marker + '成交量:' + '--<br/>'
                              } else {
                                texts += el.marker + '成交量:' + res.value[3] + '亿股<br/>'
                              }
                            }
                          })
                        } else if (el.seriesName == '价格') {
                          if (!el.value[2]) {
                            texts += el.marker + el.seriesName + ':' + '--<br/>'
                          } else {
                            texts += el.marker + el.seriesName + ':' + el.value[2] + '<br/>'
                          }
                          if (!el.value[4]) {
                            texts += el.marker + '涨跌值:--<br/>'
                          } else {
                            texts += el.marker + '涨跌值:<i class=' + (el.value[4] > 0 ? 'up>' : 'down>') + el.value[4] + '</i><br/>'
                          }
                          if (!el.value[1]) {
                            texts += el.marker + '涨跌幅:--<br/>'
                          } else {
                            texts += el.marker + '涨跌幅:<i class=' + (el.value[1] > 0 ? 'up>' : 'down>') + el.value[1] + '%</i><br/>'
                          }
                        } else if (el.seriesName == '内外盘差') {
                          if (!el.value) {
                            texts += el.marker + el.seriesName + ':' + '--<br/>'
                          } else {
                            texts += el.marker + el.seriesName + ':' + el.value + '<br/>'
                          }
                        } else {
                          if (!el.value) {
                            texts += el.marker + el.seriesName + ':' + '--<br/>'
                          } else {
                            texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                          }
                        }
                      })
                    }
                  }
                })
                return texts
              }
            };
            option.series[1].itemStyle = {
              normal: {
                color: function (params) {
                  let volumesColor = '';
                  if (params.dataIndex === 0) {
                    if (that.indexTodayData[params.dataIndex][1] >= data.lastCloseData) {
                      volumesColor = that.gfnFormatSecurityColor(1)
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1);
                    }
                  } else {
                    if (that.indexTodayData[params.dataIndex][1] > that.indexTodayData[params.dataIndex - 1][1]) {
                      volumesColor = that.gfnFormatSecurityColor(1)
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1)
                    }
                  }
                  previous = params.data;
                  return volumesColor;
                }
              }
            };
            option.series[2].itemStyle = {
              normal: {
                color: function (params) {
                  if (params.data > 0) {
                    return '#e33f2d';
                  } else {
                    return '#12a08e';
                  }
                }
              }
            };
            option.xAxis[0].axisLabel = {
              color: '#506798',
              interval: 29
            };
            option.yAxis[0].axisLabel = {color: '#506798'};
            option.yAxis[2].axisLabel = {
              color: '#506798',
              formatter: function (value) {
                return value + '%';
              }
            };
            option.yAxis[1].axisLabel = {
              color: '#506798',
              formatter: function (value, index) {
                if (index === 0) {
                  return '';
                } else {
                  return Number(value) + '亿元';
                }
              }
            };
            option.series = data.seriseData
            let params = {
              'type': 'time',
              'startTime': moment(this.overlayData.startTime, 'HH:mm').format('HHmm'),
              'endTime': moment(this.overlayData.endTime, 'HH:mm').format('HHmm'),
              'tradeDate': trdDate,
              'codes': this.overlayData.codes,
              'sort': this.overlayData.sort,
              'swVocs': this.overlayData.swVocs,
              'wdVocs': this.overlayData.wdVocs,
              'cusVocs': this.overlayData.cusVocs
            }
            postOverlayChart(JSON.stringify(params)).then(resp => {
              let colorList = ['#339933', '#1b5eed', '#288783', '#1de3c0', '#6766cc', '#ea6e0d', '#ca6796']
              resp.forEach((el, i) => {
                let data = this.overlaySplitData(el);
                if (option.yAxis[2].max < data.max) {
                  option.yAxis[2].min = -data.max
                  option.yAxis[2].max = data.max
                }
                option.series.push({
                  name: data.name,
                  type: 'line',
                  xAxisIndex: 0,
                  yAxisIndex: 2,
                  data: data.seriesData,
                  lineStyle: {color: colorList[i]},
                  itemStyle: {normal: {color: colorList[i]}}
                })
              });
              this.chart.setOption(option, true);
              this.chart.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'brush',
                brushOption: {
                  brushType: 'lineX',
                  brushMode: 'single'
                }
              })
              let range = [this.$store.state.highQuery.brushSharingTime.beginTime, this.$store.state.highQuery.brushSharingTime.endTime]
              this.changeTimeChartBrush('sharingTimeChart', range)
            });
          })
        })
        this.timer = setTimeout(() => {
          this.refelshCharts()
        }, this.timeInterval)
      },
      overlaySplitData(chartData) {
        let name = chartData.name;
        let seriesData = [];
        let max = 0;
        let rate = 0;
        chartData.data.forEach((el) => {
          rate = Math.abs(el[3]);
          max = rate > max ? rate : max;
          seriesData.push(el[3])
        });
        max = max > this.rateValue ? max : this.rateValue
        return {
          max,
          name,
          seriesData
        }
      },
      getShareTimeData() {
        let trdDate = ''
        if (!this.queryParams.indexParams.tradeDate) {
          trdDate = ''
        } else {
          trdDate = moment(this.queryParams.indexParams.tradeDate, 'YYYY-MM-DD').format('YYYYMMDD')
        }
        let NetParams = {
          trdDate: trdDate,
          stockCode: '000001',
          codeType: 'index'
        }
        let NetValue = {}
        let lineParams = {
          code: '000001',
          codeType: 'index',
          trdDate: trdDate,
          startTime: '',
          endTime: ''
        }
        getNetbuy(NetParams).then(resp => {
          let data = []
          let saleSoldMaxValue = resp.saleSoldMaxValue
          resp.saleSoldValue.forEach((el) => {
            data.push(el[1])
          })
          NetValue = {saleSoldMaxValue, data}
          getMarketTimeLine(lineParams).then(resp => {
            this.drawChart(resp, NetValue, 'sharingTimeChart');
          }).then(() => {
            this.refelshCharts()
            if (this.$route.query.params) {
              let params = JSON.parse(this.$route.query.params)
              this.jumpParams = params
              if (params.stockCode != '000001') {
                this.overlayData.codes = params.stockCode
                this.overlayData.cusVocs = ''
                this.overlayData.swVocs = ''
                this.overlayData.wdVocs = ''
                this.overlayData.tradeDate = this.queryParams.indexParams.tradeDate
                this.overlayData.startTime = moment(this.queryParams.indexParams.startTime, 'HH:mm').format('HHmm')
                this.overlayData.endTime = moment(this.queryParams.indexParams.endTime, 'HH:mm').format('HHmm')
                this.getOverlayData()
              }
            }
            this.getChangeOverlayData()
          })
        })
      },
      drawChart(chartData, NetValue, DOMId) {
        let myLine = document.getElementById(DOMId);
        let echart = echarts.init(myLine, this.gfnGetTheme());
        this.chart = echarts.init(myLine, this.gfnGetTheme());
        echart.clear();
        window.onresize = echart.resize;
        echart.showLoading();
        let data = this.splitData(chartData, NetValue);
        let options = {
          tooltip: {
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
              if (pos[0] < size.viewSize[0] / 2) {
                return [pos[0] + 20, '36']
              }
              return [pos[0] - 220, '16']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((res) => {
                if (res.seriesName == '价格') {
                  if (!res.value[2]) {
                    texts = ''
                  } else {
                    params.forEach((el) => {
                      if (el.seriesName == '成交金额') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
                        }
                        params.forEach((res) => {
                          if (res.seriesName == '价格') {
                            if (!res.value[3]) {
                              texts += el.marker + '成交量:' + '--<br/>'
                            } else {
                              texts += el.marker + '成交量:' + res.value[3] + '亿股<br/>'
                            }
                          }
                        })
                      } else if (el.seriesName == '价格') {
                        if (!el.value[2]) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value[2] + '<br/>'
                        }
                        if (!el.value[4]) {
                          texts += el.marker + '涨跌值:--<br/>'
                        } else {
                          texts += el.marker + '涨跌值:<i class=' + (el.value[4] > 0 ? 'up>' : 'down>') + el.value[4] + '</i><br/>'
                        }
                        if (!el.value[1]) {
                          texts += el.marker + '涨跌幅:--<br/>'
                        } else {
                          texts += el.marker + '涨跌幅:<i class=' + (el.value[1] > 0 ? 'up>' : 'down>') + el.value[1] + '%</i><br/>'
                        }
                      } else if (el.seriesName == '内外盘差') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '<br/>'
                        }
                      } else {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                        }
                      }
                    })
                  }
                }
              })
              return texts
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          toolbox: {
            top: 5,
            right: 100,
            feature: {
              dataZoom: {
                show: false
              },
              brush: {
                type: ['lineX', 'clear']
              },
              saveAsImage: {}
            }
          },
          legend: {
            show: false
          },
          brush: {
            xAxisIndex: 'all',
            throttleType: 'debounce',
            throttleDelay: 300,
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#455577',
              borderWidth: 1
            },
            outOfBrush: {
              colorAlpha: 0.8
            },
            z: -1
          },
          grid: [
            {
              left: '60',
              right: '60',
              top: '3%',
              height: '60%',
              containLabel: false
            },
            {
              left: '60',
              right: '60',
              top: '70%',
              height: '27%',
              containLabel: false
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: data.timeList,
              boundaryGap: false,
              splitLine: {
                show: true,
                interval: 29,
                lineStyle: {
                  type: 'solid',
                  color: '#263657'
                }
              },
              axisLine: {show: false},
              axisTick: {
                show: false,
                interval: 29,
                length: 8,
                lineStyle: {
                  color: '#aec0e6'
                }
              },
              axisLabel: {
                color: '#506798',
                interval: 29
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.timeList,
              boundaryGap: false,
              axisTick: {show: false},
              splitLine: {
                show: true,
                interval: 29,
                lineStyle: {
                  type: 'solid',
                  color: '#263657'
                }
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {show: false},
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#263657'
                }
              },
            },
            // {
            //   type: 'category',
            //   gridIndex: 0,
            //   axisTick: {show: false},
            //   splitLine:{show:false},
            //   axisLine: {
            //     onZero: true,
            //     lineStyle: {
            //       color: '#455579'
            //     }
            //   }
            // }
          ],
          yAxis: [
            {
              scale: true,
              axisLabel: {
                color: '#506798'
              },
              axisTick: {show: false},
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'left',
              splitNumber: 2,
              min: data.minPrice,
              tickInterval: data.increase,
              max: data.maxPrice
            },
            {
              type: 'value',
              gridIndex: 1,
              axisTick: {show: false},
              splitNumber: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLabel: {
                color: '#506798',
                formatter: function (value, index) {
                  if (index === 0) {
                    return '';
                  } else {
                    return Number(value) + '亿元';
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            },
            {
              scale: true,
              axisLabel: {
                color: '#506798',
                formatter: function (value) {
                  return value + '%';
                }
              },
              splitNumber: 1,
              axisTick: {show: false},
              axisLine: {show: false},
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              position: 'right',
              min: 0 - data.rate,
              max: data.rate
            },
            {
              show: false,
              splitNumber: 1,
              min: -data.saleSoldMaxValue,
              max: data.saleSoldMaxValue,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
            }
          ],
          series: data.seriseData
        };
        echart.setOption(options, true);
        let that = this
        echart.on('brushSelected', function (val) {
          let timeData = val.batch[0].areas[0]
          if (timeData) {
            if ((timeData.coordRange[0] && timeData.coordRange[1])) {
              let range
              range = timeData.coordRange
              let startTime = range[0]
              let overTime = range[1]
              startTime = data.timeList[startTime]
              overTime = data.timeList[overTime]
              that.$emit('getTimeData', [startTime, overTime])
              that.$store.commit('savebrushSharingTimeParams', {beginTime: startTime, endTime: overTime})
            }
          } else {
            that.$emit('getTimeData', ['09:30:00', '15:00:00'])
            that.$store.commit('savebrushSharingTimeParams', {beginTime: '', endTime: ''})
          }
        })
        echart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
        if (this.$route.query.params) {
          let params = JSON.parse(this.$route.query.params)
          let beginTime = params.beginTime
          let endTime = params.endTime
          let coordRange = []
          data.timeList.forEach((el, index) => {
            if (el == beginTime) {
              coordRange[0] = index
            }
            if (el == endTime) {
              coordRange[1] = index
            }
          })
          echart.dispatchAction({
            type: 'brush',
            areas: [
              {
                brushType: 'lineX',
                coordRange: coordRange,
                xAxisIndex: 0
              }
            ]
          })
        }
        echart.hideLoading();
      },
      // 改变时间触发框选改变
      changeTimeChartBrush(DOMId, range) {
        let myLine = document.getElementById(DOMId);
        let echart = echarts.init(myLine);
        let coord = []
        if (!range) {
          coord = []
        } else {
          let startTime = range[0]
          let endTime = range[1]
          this.allTime.forEach((el, index) => {
            if (el === startTime) {
              startTime = index
            }
            if (el === endTime) {
              endTime = index
            }
          })
          coord = [startTime, endTime]
        }
        echart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: coord,
              xAxisIndex: 0
            }
          ]
        });
      },
      splitData(rawData, NetValue) {
        let that = this
        let saleSoldMaxValue = NetValue.saleSoldMaxValue
        let indexData = rawData;
        let timeList = [];
        let chartData = [];
        let volumes = [];
        let previous;
        let lastCloseData = indexData.lastClose;
        let todayData = indexData.chartData;
        let maxPrice = (indexData.lastClose + indexData.increase).toFixed(2);
        let minPrice = (indexData.lastClose - indexData.increase).toFixed(2);
        let increase = indexData.increase;
        this.indexTodayData = indexData.chartData;
        let rate = '';
        if (!indexData.amplitude) {
          rate = '';
          this.rateValue = ''
        } else {
          rate = indexData.amplitude;
          this.rateValue = indexData.amplitude;
          rate = rate.toFixed(2);
        }
        todayData.forEach((el, i) => {
          timeList.push(moment(el[0], 'HHmm').format('HH:mm'));
          this.allTime.push(moment(el[0], 'HHmm').format('HH:mm'))
          chartData.push([i, el[3], el[1], el[4], el[2]]);
          volumes.push(el[5]);
        });
        let seriseData = [
          {
            name: '价格',
            type: 'line',
            data: chartData,
            xAxisIndex: 0,
            yAxisIndex: 2,
            smooth: true
          },
          {
            name: '成交金额',
            type: 'bar',
            stack: '总量',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumes,
            itemStyle: {
              normal: {
                color: function (params) {
                  let volumesColor = '';
                  if (params.dataIndex === 0) {
                    if (todayData[params.dataIndex][1] >= lastCloseData) {
                      volumesColor = that.gfnFormatSecurityColor(1)
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1)
                    }
                  } else {
                    if (todayData[params.dataIndex][1] > todayData[params.dataIndex - 1][1]) {
                      volumesColor = that.gfnFormatSecurityColor(1)
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1)
                    }
                  }
                  previous = params.data;
                  return volumesColor;
                }
              }
            }
          },
          {
            name: '内外盘差',
            type: 'bar',
            stack: 'up',
            xAxisIndex: 0,
            yAxisIndex: 3,
            data: NetValue.data,
            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.data > 0) {
                    return '#e33f2d';
                  } else {
                    return '#12a08e';
                  }
                }
              }
            }
          }
        ]
        return {
          timeList,
          lastCloseData,
          seriseData,
          rate,
          maxPrice,
          minPrice,
          increase,
          saleSoldMaxValue
        };
      }
    }
  }
</script>

<style lang='less'>

</style>
