<template>
  <div
    v-loading="loading"
    element-loading-text="正在加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header" class="tabStyle">
        异常判定情况
        <div>
          <el-tabs v-model='activeName' type='card' @tab-click='changeTabs'>
            <el-tab-pane label='一年' name='first'>
            </el-tab-pane>
            <el-tab-pane label='半年' name='second'>
            </el-tab-pane>
            <el-tab-pane label='3个月' name='three'>
            </el-tab-pane>
            <el-tab-pane label='1个月' name='four'>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div id='abnormalDecide' style="height: 250px"></div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import echarts from 'echarts'
  import moment from 'moment'

  export default {
    components: {},
    data() {
      return {
        activeName: 'four',
        loading: true,
        period: 30
      }
    },
    props: ['accountId'],
    watch: {
      accountId: function (param1, param2) {
        this.getChartsData()
      }
    },
    mounted() {
      this.getChartsData()
    },
    methods: {
      changeTabs(val) {
        if (val.name == 'first') {
          this.period = '365'
        } else if (val.name == 'second') {
          this.period = '180'
        } else if (val.name == 'three') {
          this.period = '90'
        } else {
          this.period = '30'
        }
        this.getChartsData()
      },
      getChartsData() {
        this.loading = true
        let params = {
          key: JSON.stringify({
            accountId: this.accountId,
            period: this.period
          }),
          method: 'discriminationInfo'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp
          let falseDeclaim = res.falseDeclaim // 虚假申报
          let liftDown = res.liftDown // 拉抬打压
          let programTrading = res.programTrading // 程序化交易
          let data = []
          let date = []
          falseDeclaim.forEach((el, index) => {
            if (el.label == '1') {
              data.push([index, 2, 10, el.stks])
            }
            date.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
          })
          liftDown.forEach((el, index) => {
            if (el.label == '1') {
              data.push([index, 1, 10, el.stks])
            }
          })
          programTrading.forEach((el, index) => {
            if (el.label == '1') {
              data.push([index, 0, 10, el.stks])
            }
          })
          let chartList = {xAxis: date, data: data}
          this.drawLineChart('abnormalDecide', chartList)
        })
      },
      drawLineChart(id, chartList) {
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          tooltip: {
            show: true,
            trigger: 'axis',
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 35}
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            },
            formatter: function (params) {
              let texts = params[0].axisValue + '<br/>'
              params.forEach((el) => {
                if (el.data[1] == '0') {
                  texts += '程序化交易：<br/>'
                  el.data[3].forEach((res) => {
                    texts += res.code + ' ' + res.name + '<br/>'
                  })
                } else if (el.data[1] == '1') {
                  texts += '拉抬打压：<br/>'
                  el.data[3].forEach((res) => {
                    texts += res.code + ' ' + res.name + '<br/>'
                  })
                } else {
                  texts += '虚假申报：<br/>'
                  el.data[3].forEach((res) => {
                    texts += res.code + ' ' + res.name + '<br/>'
                  })
                }
              })
              return texts
            }
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {
                name: ''
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              position: 'top',
              data: chartList.xAxis,
              axisLabel: {
                color: '#506798',
                fontSize: 16
              },
              splitArea: {
                show: true
              },
              // splitLine: {
              //   show: false,
              //   lineStyle: {
              //     color: '#263657',
              //     type: 'solid'
              //   }
              // },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisLabel: {
                color: '#506798',
                fontSize: 16
              },
              data: ['程序化交易', '拉抬打压', '虚假申报'],
              splitArea: {
                show: true
              },
              // splitLine: {
              //   show: true,
              //   lineStyle: {
              //     color: '#273757'
              //   }
              // },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          series: [{
            visualMap: false,
            type: 'heatmap',
            data: chartList.data,
            label: {
              normal: {show: false}
            },
            itemStyle: {
              normal: {
                color: '#ff6633'
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            }
          }]
        })
        productline.on('dblclick', (params) => {
          this.$emit('getClickTime', params.name)
        })
      }
    }
  }
</script>

<style scoped>

</style>
