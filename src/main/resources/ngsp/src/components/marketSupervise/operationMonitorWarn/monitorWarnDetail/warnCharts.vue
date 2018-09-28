<template>
  <div class="warnCharts">
    <div class="overlayBtn">
      <el-button type="primary" size="small" style="margin: 5px 0px" @click="overlyCode">
        叠加
        <i :class="treeShow?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      </el-button>
      <tree-select @getTreeList="getTreeList" :treeShow='treeShow' :treeData="treeData"></tree-select>
    </div>
    <div id='alarmDetail' style='height: 400px;'></div>
  </div>
</template>

<script>
  import moment from 'moment';
  import {
    getAlarmCharts,
    getOverlayList
  } from '../../../../service/marketSupervise/operationMonitorWarn/index'
  import treeSelect from '../../../common/treeSelect'

  let echarts = require('echarts');
  export default {
    name: 'warn-charts',
    components: {treeSelect},
    data() {
      return {
        routerParams: {},
        treeShow: false,
        treeData: [],
        flag: false,
        alarmType: '',
        alarmRuleCode: '',
        timer: null,
        timeInterval: 60 * 1000
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    mounted() {
      this.routerParams = JSON.parse(this.$route.query.params)
      this.alarmRuleCode = this.routerParams.alarmRuleCode
      this.getOverlayData()
      this.getChartData()
    },
    methods: {
      // 获取叠加选项
      getOverlayData() {
        getOverlayList().then(resp => {
          let obj1 = {id: '', label: '', children: []}
          let obj2 = {id: '', label: '', children: []}
          let obj3 = {id: '', label: '', children: []}
          resp.forEach((el) => {
            if (el.alarmTypeCode == 'alarm_type_01') {
              obj1.id = el.alarmTypeCode
              obj1.label = el.alarmTypeName
              obj1.children.push({id: el.alarmRuleCode, label: el.alarmRuleName})
            } else if (el.alarmTypeCode == 'alarm_type_02') {
              obj2.id = el.alarmTypeCode
              obj2.label = el.alarmTypeName
              obj2.children.push({id: el.alarmRuleCode, label: el.alarmRuleName})
            } else {
              obj3.id = el.alarmTypeCode
              obj3.label = el.alarmTypeName
              obj3.children.push({id: el.alarmRuleCode, label: el.alarmRuleName.substring(7)})
            }
          })
          this.treeData.push(obj1)
          this.treeData.push(obj2)
          this.treeData.push(obj3)
        })
      },
      overlyCode() {
        this.treeShow = !this.treeShow
      },
      getTreeList(val) {
        this.alarmType = this.routerParams.alarmType
        this.alarmRuleCode = ''
        if (!val) {
          this.alarmRuleCode = this.routerParams.alarmRuleCode
        } else {
          val.push(this.routerParams.alarmRuleCode)
          this.alarmRuleCode = val.join(',')
        }
        getAlarmCharts(this.alarmType, this.alarmRuleCode)
          .then((resp) => {
            this.drawChart(resp, 'alarmDetail');
          })
        this.$emit('getAlarmRuleCode', this.alarmRuleCode)
        this.treeShow = false
      },
      getChartData() {
        this.alarmType = this.routerParams.alarmType
        // this.alarmRuleCode = this.routerParams.alarmRuleCode
        getAlarmCharts(this.alarmType, this.alarmRuleCode)
          .then((resp) => {
            if (!this.flag) {
              this.drawChart(resp, 'alarmDetail');
            } else {
              let myLine = document.getElementById('alarmDetail')
              let echart = echarts.init(myLine, this.gfnGetTheme())
              let option = echart.getOption()
              let data = this.splitData(resp);
              option.xAxis[0].axisLabel = {
                color: '#506798',
                interval: 29
              };
              option.yAxis[0].axisLabel = {color: '#506798'};
              option.yAxis[1].axisLabel = {
                color: '#506798',
                formatter: function (value, index) {
                  if (index === 0) {
                    return 0;
                  } else {
                    return Number(value) + '亿元';
                  }
                }
              };
              option.yAxis[2].axisLabel = {
                color: '#506798',
                formatter: function (value) {
                  return value + '%';
                }
              };
              option.yAxis[3].axisLabel = {
                color: '#506798',
                formatter: function (value) {
                  return value + '%'
                },
                inside: true
              };
              option.yAxis[4].axisLabel = {
                color: '#506798',
                formatter: function (value) {
                  return Number(value) + '亿元';
                },
                inside: true
              };
              option.series = data.seriseData
              echart.setOption(option, true)
              echart.dispatchAction({
                type: 'brush',
                areas: [
                  {
                    brushType: 'lineX',
                    coordRange: data.coordRange,
                    xAxisIndex: 0
                  }
                ]
              })
            }
          })
        this.timer = setTimeout(() => {
          this.getChartData()
        }, this.timeInterval)
      },
      drawChart(chartData, DOMId) {
        this.flag = true
        let myLine = document.getElementById(DOMId);
        let echart = echarts.init(myLine, this.gfnGetTheme());
        echart.showLoading();
        let data = this.splitData(chartData);
        let options = {
          color: ['#339933', '#1b5eed', '#288783', '#1de3c0', '#6766cc', '#ea6e0d', '#ca6796', '#7140fe', '#6b0b68', '#654428'],
          title: {
            text: '注：左外轴代表指数点数，左内轴代表分类投资者交易额；右内轴代表乖离率百分比，右外轴代表指数的涨跌百分比',
            left: '5%',
            bottom: '1%',
            textStyle: {
              color: '#506798',
              fontSize: 14,
              fontWeight: 200
            }
          },
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
                if (res.seriesName == '上证指数') {
                  if (!res.value[2]) {
                    texts = ''
                  } else {
                    params.forEach((el) => {
                      if (el.seriesType == 'bar') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':-<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
                        }
                        params.forEach((res) => {
                          if (res.seriesName == '上证指数') {
                            if (!res.value[3]) {
                              texts += el.marker + '成交量:-<br/>'
                            } else {
                              texts += el.marker + '成交量:' + res.value[3] + '亿股<br/>'
                            }
                          }
                        })
                      } else if (el.seriesName == '中证500') {
                        texts += el.marker + el.seriesName + ':' + (!el.value[2] ? '-' : el.value[2]) + '<br/>'
                      } else if (el.seriesName == '上证指数') {
                        texts += el.marker + el.seriesName + ':' + (!el.value[2] ? '-' : el.value[2]) + '<br/>'
                        texts += el.marker + '涨跌值:<i class=' + (el.value[4] > 0 ? 'up>' : 'down>') + el.value[4] + '</i><br/>'
                        texts += el.marker + '涨跌幅:<i class=' + (el.value[1] > 0 ? 'up>' : 'down>') + el.value[1] + '%</i><br/>'
                      } else if (el.seriesName == '乖离率') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':-<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                        }
                      } else {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':-<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
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
            top: 7,
            right: 75,
            feature: {
              dataZoom: {
                show: false
              },
              brush: {
                show: false
              },
              saveAsImage: {}
            }
          },
          legend: {
            top: 10,
            data: data.category,
            textStyle: {
              color: '#506798'
            },
            selected: data.selected
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: '300',
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#ff402b',
              borderWidth: 1
            },
            outOfBrush: {
              color: '#ddd',
              colorAlpha: 0.8
            },
            z: 1
          },
          grid: [
            {
              left: '5%',
              right: '5%',
              top: '12%',
              height: '50%',
              containLabel: false
            },
            {
              left: '5%',
              right: '5%',
              top: '70%',
              height: '20%',
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
              }
            }
            // {
            //   type: 'category',
            //   gridIndex: 0,
            //   axisTick: {show: false},
            //   axisLine: {
            //     onZero: true,
            //     lineStyle: {
            //       color: '#455579'
            //     }
            //   }
            // }
          ],
          yAxis: [
            //   左轴
            {
              scale: true,
              axisLabel: {
                color: '#506798'
              },
              splitNumber: 2,
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
              min: data.minPrice,
              tickInterval: data.increase,
              max: data.maxPrice
            },
            //  左下轴
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
            //  右外轴
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
            // 右内轴
            {
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798',
                formatter: function (value) {
                  return value + '%'
                },
                inside: true
              },
              axisTick: {show: false},
              axisLine: {show: false},
              splitNumber: 2,
              splitLine: {
                show: false
              },
              position: 'right',
              zlevel: 1000
            },
            {
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798',
                formatter: function (value) {
                  return Number(value) + '亿元';
                },
                inside: true
              },
              axisTick: {show: false},
              axisLine: {show: false},
              splitNumber: 2,
              splitLine: {
                show: false
              },
              position: 'left',
              zlevel: 1000
            }
          ],
          series: data.seriseData
        };
        echart.clear();
        window.onresize = echart.resize;
        echart.setOption(options, true);
        echart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: data.coordRange,
              xAxisIndex: 0
            }
          ]
        })
        echart.hideLoading();
      },
      splitData(rawData) {
        let that = this;
        let indexData = rawData.SZZZ;
        let timeList = [];
        let chartData = [];
        let volumes = [];
        let previous;
        let lastCloseData = indexData.lastClose;
        let todayData = indexData.chartData;
        let maxPrice = (indexData.lastClose + indexData.increase).toFixed(2);
        let minPrice = (indexData.lastClose - indexData.increase).toFixed(2);
        let increase = indexData.increase;
        let overlayData = rawData.ZDJE;
        let GLL = rawData.GLL;
        let zIndexData = rawData.ZZ500;
        let category = ['上证指数'] // 图例类别
        let rate = '';
        if (!indexData.amplitude) {
          rate = '';
        } else {
          rate = indexData.amplitude;
          rate = rate.toFixed(2);
        }
        todayData.forEach((el, i) => {
          timeList.push(moment(el[0], 'HHmm').format('HH:mm'));
          chartData.push([i, el[3], el[1], el[4], el[2]]);
          volumes.push(el[5]);
        });
        let seriseData = [
          {
            name: '上证指数',
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
                      volumesColor = that.gfnFormatSecurityColor(1);
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1);
                    }
                  } else {
                    if (todayData[params.dataIndex][1] > todayData[params.dataIndex - 1][1]) {
                      volumesColor = that.gfnFormatSecurityColor(1);
                    } else {
                      volumesColor = that.gfnFormatSecurityColor(-1);
                    }
                  }
                  previous = params.data;
                  return volumesColor;
                }
              }
            }
          }
        ]
        if (GLL) {
          category.push(GLL.secName)
          let arr = []
          GLL.chartData.forEach((el) => {
            arr.push(el[1])
          });
          seriseData.push({
            name: GLL.secName,
            type: 'line',
            data: arr,
            xAxisIndex: 0,
            yAxisIndex: 3,
            smooth: true
          })
        }
        if (overlayData) {
          overlayData.category.forEach((el) => {
            category.push(el)
          })
          overlayData.sdata.forEach((el) => {
            let arr = []
            el.data.forEach((v) => {
              if (v.value === null) {
                arr.push(v.value)
              } else {
                arr.push((v.value / 100000000).toFixed(2))
              }
            })
            seriseData.push({
              name: el.name,
              type: 'line',
              data: arr,
              xAxisIndex: 0,
              yAxisIndex: 4,
              smooth: true
            })
          });
        }
        // 叠加中证500
        if (zIndexData) {
          let zzIndexData = []
          let rate1 = zIndexData.amplitude
          if (rate1 > rate) {
            rate = rate1
          }
          zIndexData.chartData.forEach((el, i) => {
            zzIndexData.push([i, el[3], el[1]]);
          })
          category.push(zIndexData.secName)
          seriseData.push({
            name: zIndexData.secName,
            type: 'line',
            data: zzIndexData,
            xAxisIndex: 0,
            yAxisIndex: 2,
            smooth: true
          })
        }
        // 框选
        let coordRange = []
        let start = this.routerParams.alarmStartTime == '13:00' ? '11:30' : this.routerParams.alarmStartTime
        let end = this.routerParams.alarmEndTime == '13:00' ? '11:30' : this.routerParams.alarmEndTime
        timeList.forEach((el, index) => {
          if (el == start) {
            start = index
          }
          if (el == end) {
            end = index
          }
          coordRange = [start, end]
        })
        // 小旗子位置
        let alarmList = rawData.alarmList
        let flagArr = []
        let selected = {} // 默认显示的图例
        if (alarmList) {
          alarmList.forEach((el, n) => {
            if (!flagArr.length) {
              flagArr.push({
                strikeOB: el.strikeOB,
                flagCoord: [{
                  startTime: el.alarmStartTime == '130000' ? '11:30' : moment(el.alarmStartTime, 'HHmmss').format('HH:mm'),
                  coord: []
                }]
              })
            } else {
              let index = flagArr.findIndex(item => {
                return item.strikeOB == el.strikeOB
              })
              if (index < 0) {
                flagArr.push({
                  strikeOB: el.strikeOB,
                  flagCoord: [{
                    startTime: alarmList[n].alarmStartTime == '130000' ? '11:30' : moment(alarmList[n].alarmStartTime, 'HHmmss').format('HH:mm'),
                    coord: []
                  }]
                })
              } else {
                flagArr[index].flagCoord.push({
                  startTime: alarmList[n].alarmStartTime == '130000' ? '11:30' : moment(alarmList[n].alarmStartTime, 'HHmmss').format('HH:mm'),
                  coord: []
                })
              }
            }
          })
          flagArr.forEach((res, i) => {
            if (res.strikeOB == '上证指数') {
              todayData.forEach((s, num) => {
                flagArr[i].flagCoord.forEach((el, n) => {
                  if (el.startTime == moment(s[0], 'HHmm').format('HH:mm')) {
                    flagArr[i].flagCoord[n].coord = [el.startTime, todayData[num][3]]
                  }
                })
              })
            } else if (res.strikeOB == '乖离率') {
              GLL.chartData.forEach((res, index) => {
                flagArr[i].flagCoord.forEach((el, n) => {
                  if (el.startTime == moment(res[0], 'YYYYMMDDHHmmss').format('HH:mm')) {
                    flagArr[i].flagCoord[n].coord = [el.startTime, GLL.chartData[index][1]]
                  }
                })
              });
            } else {
              overlayData.sdata.forEach((el, index) => {
                if (el.name == res.strikeOB) {
                  flagArr[i].flagCoord.forEach((res, n) => {
                    overlayData.sdata[index].data.forEach((s, num) => {
                      if (res.startTime == moment(s.time, 'Hmm').format('HH:mm')) {
                        flagArr[i].flagCoord[n].coord = [res.startTime, (overlayData.sdata[index].data[num].value / 100000000).toFixed(2)]
                      }
                    })
                  })
                }
              });
            }
          })
        }
        seriseData.forEach((el, index) => {
          flagArr.forEach((res, n) => {
            if (el.name == res.strikeOB) {
              seriseData[index].markPoint = {
                data: flagArr[n].flagCoord,
                emphasis: {
                  label: {
                    show: true,
                    formatter: function (params) {
                      let time = moment(params.data.coord[0], 'HHmm').format('HHmmss')
                      let str = ''
                      let arr = []
                      let label = ''
                      alarmList.forEach((resp, index) => {
                        if (resp.alarmStartTime == time && resp.strikeOB == res.strikeOB) {
                          str = alarmList[index].alarmDesc
                          arr = str.split(';')
                        }
                      })
                      arr.forEach((m) => {
                        if (m) {
                          label += m + '\n'
                        }
                      })
                      return label
                    },
                    padding: [10, 10, 0, 10],
                    position: 'left',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    width: 100,
                    align: 'left',
                    borderRadius: 5,
                    distance: 80
                  }
                },
                symbol: 'path://M2 12 L2 27 L0 27 L0 12 L0 12 L0 0 L17 12 L2 12 Z',
                symbolSize: [20, 26],
                symbolOffset: ['40%', '-45%']
              }
            }
          })
        })
        return {
          timeList,
          lastCloseData,
          seriseData,
          category,
          selected,
          maxPrice,
          minPrice,
          increase,
          rate,
          coordRange
        };
      }
    }
  }
</script>

<style lang="less">
  .warnCharts {
    .el-tree {
      > div {
        > div:nth-child(1) {
          .el-checkbox {
            display: none;
          }
        }
      }
    }
    .overlayBtn {
      position: absolute;
      top: 0px;
      right: 20px;
      min-width: 350px;
    }
    .downMoreSelect .wrap {
      width: auto;
      label {
        padding: 5px;
      }
      > div:nth-child(1) {
        display: none;
      }
      > div:nth-child(3) {
        display: none;
      }
    }
  }
</style>
