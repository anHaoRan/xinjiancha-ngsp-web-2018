<template>
  <div class="holdProperty"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header" class="tabStyle">
        持仓资产：{{holdValue}}
        <div style="display: flex">
          <el-button type="primary" size="small" style="margin: 5px 0px" @click="overlyCode">
            叠加
            <i :class="searchShow?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </el-button>
          <el-tabs v-model='activeName1' type='card' @tab-click='changeTabs'>
            <el-tab-pane label='一年' name='first'>
            </el-tab-pane>
            <el-tab-pane label='半年' name='second'>
            </el-tab-pane>
            <el-tab-pane label='3个月' name='three'>
            </el-tab-pane>
            <el-tab-pane label='1个月' name='four'>
            </el-tab-pane>
          </el-tabs>
          <search-select ref='downMoreSelect1' :optionData='overlayCode'
                         :size='size' :clearFlag='clearFlag' :searchShow='searchShow' @input="input"></search-select>
        </div>
      </div>
      <div id='holdMoney' style="height: 350px"></div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import echarts from 'echarts'
  import moment from 'moment'
  import SearchSelect from '../../common/searchSelect'

  export default {
    components: {SearchSelect},
    data() {
      return {
        activeName1: 'four',
        holdValue: '',
        creditTypeOption: [], // 传递给子组件的账户类型数据
        clearFlag: 1,
        size: 'small',
        searchShow: false,
        period: '30',
        stkCode: '',
        loading: true
      }
    },
    props: ['accountId', 'overlayCode'],
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
        this.$emit('getPeriodDate', this.period)
        this.loading = true
        let params1 = {
          key: JSON.stringify({
            accountId: this.accountId,
            period: this.period,
            stkCode: this.stkCode
          }),
          method: 'stocksPosition'
        }
        let myLine = document.getElementById('holdMoney');
        let echart = echarts.init(myLine);
        let option = echart.getOption()
        if (this.stkCode) {
          let params = {
            key: JSON.stringify({accountId: this.accountId, period: this.period}),
            method: 'tradeLog'
          }
          let time = []
          let data1 = ['持仓资产']
          let data2 = []
          postIntestorPic(params).then(resp => {
            let res = resp
            this.holdValue = res.holdValue
            let holdMoney = []
            res.dailySeq.forEach((el) => {
              time.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
              holdMoney.push(el.hv)
            })
            data2.push({
              name: '持仓资产',
              type: 'line',
              data: holdMoney
            })
            postIntestorPic(params1).then(resp => {
              let result = resp.stockSeq
              result.forEach((el) => {
                data1.push(el.name)
                let overlay = []
                el.dailySeq.forEach(res => {
                  overlay.push(res.hv)
                })
                data2.push({
                  name: el.name,
                  type: 'line',
                  data: overlay
                })
              })
              option.legend[0].data = data1
              option.xAxis[0].axisLabel = {
                color: '#506798'
              }
              option.xAxis[0].data = time
              option.yAxis[0].axisLabel = {
                color: '#506798'
              }
              option.series = data2
              echart.setOption(option)
            })
          })
        } else {
          let params = {
            key: JSON.stringify({accountId: this.accountId, period: this.period}),
            method: 'tradeLog'
          }
          let time = []
          let data1 = ['持仓资产']
          let data2 = []
          postIntestorPic(params).then(resp => {
            this.loading = false
            let res = resp
            this.holdValue = res.holdValue
            let holdMoney = []
            res.dailySeq.forEach((el) => {
              time.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
              holdMoney.push(el.hv)
            })
            data2.push({
              name: '持仓资产',
              type: 'line',
              data: holdMoney
            })
            option.legend[0].data = data1
            option.xAxis[0].axisLabel = {
              color: '#506798'
            }
            option.xAxis[0].data = time
            option.yAxis[0].axisLabel = {
              color: '#506798'
            }
            option.series = data2
            echart.setOption(option)
          })
        }
      },
      overlyCode() {
        this.searchShow = !this.searchShow
      },
      // 获取叠加值
      input(val) {
        this.stkCode = val.join(',')
        let params = {
          key: JSON.stringify({
            accountId: this.accountId,
            period: this.period,
            stkCode: this.stkCode
          }),
          method: 'stocksPosition'
        }
        let myLine = document.getElementById('holdMoney');
        let echart = echarts.init(myLine);
        let option = echart.getOption()
        postIntestorPic(params).then(resp => {
          let result = resp.stockSeq
          result.forEach((el) => {
            option.legend[0].data.push(el.name)
            let overlay = []
            el.dailySeq.forEach(res => {
              overlay.push(res.hv)
            })
            option.series.push({
              name: el.name,
              type: 'line',
              data: overlay
            })
          })
          option.xAxis[0].axisLabel = {
            color: '#506798'
          }
          option.yAxis[0].axisLabel = {
            color: '#506798'
          }
          echart.setOption(option)
        })
        this.searchShow = false
      },
      getChartsData() {
        this.loading = true
        let params = {
          key: JSON.stringify({accountId: this.accountId, period: this.period}),
          method: 'tradeLog'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp
          this.holdValue = res.holdValue
          let time = []
          let holdMoney = []
          if (res) {
            res.dailySeq.forEach((el) => {
              time.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
              holdMoney.push(el.hv)
            })
          }
          let dataList = {
            data1: ['持仓资产'],
            time: time,
            data2: [
              {
                name: '持仓资产',
                type: 'line',
                data: holdMoney
              }
            ]
          }
          this.drawLineChart('holdMoney', dataList)
        })
      },
      drawLineChart(id, dataList) {
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: dataList.data1,
            textStyle: {
              color: '#506798'
            }
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {
                name: '持仓资产趋势图'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: dataList.time,
              axisLabel: {
                color: '#506798'
              },
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
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              boundaryGap: false,
              axisLabel: {
                color: '#506798'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          series: dataList.data2
        });
      }
    }
  }
</script>

<style lang="less">
  .holdProperty {
    .downMoreSelect {
      position: absolute;
      top: 60px;
      .check-btn {
        .el-button {
          float: none;
          margin-top: 0px;
          margin-right: 0px
        }
      }
    }
  }

</style>
