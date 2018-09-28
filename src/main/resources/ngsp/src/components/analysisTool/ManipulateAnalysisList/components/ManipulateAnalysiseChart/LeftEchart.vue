<template>
  <div class="left-echart">
    <div class="el-tabs">
      <div class="el-tabs__header">
        <div class="el-tabs__nav-wrap">
          <div class="el-tabs__item">
            <el-select
              v-model="accountGroupValue"
              size="small"
              collapse-tags
              multiple
              @change="fnAccountGroupValueChange">
              <el-option v-for="(item,index) in accountGroup" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
            <!--<el-button-->
            <!--type="info"-->
            <!--size="small"-->
            <!--@click="">导出-->
            <!--</el-button>-->
          </div>
        </div>
      </div>
    </div>
    <div id="left-echart"></div>
    <div style="padding: 20px 5%;">
      <el-checkbox-group v-model="markPoint" @change="fnMarkPointChange">
        <el-checkbox label="largeSharesPledge">大股东质押</el-checkbox>
        <el-checkbox label="largeSharesHold">大股东增减持</el-checkbox>
        <el-checkbox label="blockTrade">大宗交易</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  import MinxinVue from '../ManipulationAnalysisOrAbnormalTradingTab/Mixin'
  import moment from 'moment'
  import {extraInfo, acctidsTrdvol} from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'left-echart',
    props: {
      stockPriceTrend: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {},
    mixins: [MinxinVue],
    data() {
      return {
        accountGroup: [
          {
            label: '保留账户组',
            value: 'reservedAcctIds'
          },
          {
            label: '导入账户组',
            value: 'importAcctIds'
          },
          // {
          //   label: '物理关联组',
          //   value: '3'
          // },
          // {
          //   label: '交易关联组',
          //   value: '4'
          // },
          {
            label: '删除账户组',
            value: 'delAcctIds'
          }
        ],
        accountGroupValue: ['reservedAcctIds'],
        markPoint: [],
        extraInfo: {}
      }
    },
    computed: {
      reservedAcctIds() {
        return this.$store.getters.getGoDeleteRight.map(item => {
          return item.acct_id
        })
      },
      delAcctIds() {
        return this.$store.getters.getShuttleRight.map(item => {
          return item.acct_id
        })
      },
      importAcctIds() {
        return [...this.reservedAcctIds, ...this.delAcctIds]
      },
      getCheckAccount() {
        return this.$store.getters.getCheckAccount
      }
    },
    watch: {
      stockPriceTrend: {
        handler: function () {
          this.$nextTick(function () {
            this.dealWithOptions()
          })
        },
        deep: true,
        immediate: true
      },
      getCheckAccount: {
        handler: function () {
          this.ajaxAcctidsTrdvol()
        },
        deep: true
      }
    },
    methods: {
      dealWithOptions() {
        let res = this.stockPriceTrend
        let timeList = []
        let volumes = []
        for (let key of res) {
          timeList.push(moment(key[0]).format('YYYY-MM-DD'))
          volumes.push([
            key[1], // 开盘价格
            key[4], // 收盘价格
            key[3], // 最低价格
            key[2] // 最高价格
          ])
        }

        let seriseData = [
          {
            name: this.selectParams.indexName,
            type: 'candlestick',
            data: volumes,
            smooth: true,
            itemStyle: {
              color: '#ff402b',
              color0: '#12bba5',
              borderColor: null,
              borderColor0: null
            }
          }
        ]
        this.options.xAxis[0].data = timeList
        this.options.xAxis[1].data = timeList
        this.options.series = seriseData
        this.drawEcharts()
        this.ajaxAcctidsTrdvol()
        this.registeredEchartClick()
      },
      registeredEchartClick() {
        this.echart.on('click', (val) => {
          if (val.seriesType == 'candlestick') {
            this.$emit('click', val.name)
          }
        })
      },
      fnMarkPointChange(val) {
        let map = {
            //  大股东质押
            'largeSharesPledge': {
              symbol: 'path://M550 250 L570 325 L530 325 Z',
              symbolOffset: [0, -10]
            },
            //  大股东增减持
            'largeSharesHold': {
              symbol: 'path://M6.624,0.405 L7.938,3.189 C8.040,3.404 8.236,3.553 8.463,3.587 L11.403,4.034 C11.973,4.120 12.202,4.855 11.788,5.276 L9.661,7.443 C9.497,7.610 9.423,7.851 9.461,8.087 L9.963,11.148 C10.061,11.742 9.463,12.196 8.953,11.916 L6.324,10.471 C6.121,10.359 5.878,10.359 5.676,10.471 L3.047,11.916 C2.536,12.196 1.938,11.742 2.036,11.148 L2.538,8.087 C2.577,7.851 2.502,7.610 2.338,7.443 L0.211,5.276 C-0.202,4.855 0.026,4.120 0.597,4.034 L3.536,3.587 C3.763,3.553 3.959,3.404 4.061,3.189 L5.375,0.405 C5.631,-0.136 6.369,-0.136 6.624,0.405 Z',
              symbolOffset: [0, -20]
            },
            //  大宗交易
            'blockTrade': {
              symbol: 'circle',
              symbolOffset: [0, -30]
            }
          },
          option = this.echart.getOption(),
          markPoint = {
            data: [],
            symbolSize: 10
          }
        this.dealWithExtraInfo(map)
        if (val.length < 1) {
          markPoint.symbolSize = 0
        }
        for (let key of val) {
          markPoint.data.push(...this.dealWithOptionsMarkPoint(key, map, option.series[0].data))
        }
        this.options.dataZoom = option.dataZoom
        this.options.series[0].markPoint = markPoint
        this.echart.setOption(this.options, true)
      },
      dealWithExtraInfo(map) {
        for (let key in map) {
          map[key].data = this.extraInfo[key].map(item => {
            return item.trade_date
          })
        }
      },
      dealWithOptionsMarkPoint(key, map, data) {
        let arr = []
        for (let date of map[key].data) {
          let index = this.stockPriceTrend.findIndex((item) => {
            return (moment(item[0]).format('YYYY-MM-DD')) == date
          })
          if (index != -1)
            arr.push({
              symbol: map[key].symbol,
              symbolOffset: map[key].symbolOffset,
              coord: [date, Math.max.apply(Math, data[index])]
            })
        }
        return arr
      },
      fnAccountGroupValueChange(val) {
        console.log(val)
        this.ajaxAcctidsTrdvol()
      },
      ajaxAcctidsTrdvol() {
        let {selectTradeDate, indexCode} = this.selectParams
        let params = {
          startDate: selectTradeDate[0],
          endDate: selectTradeDate[1],
          stockCode: indexCode,
          reservedAcctIds: '',
          delAcctIds: '',
          checkAcctIds: '',
          importAcctIds: ''
        }, map = {
          reservedAcctIds: this.reservedAcctIds.join(','),
          delAcctIds: this.delAcctIds.join(','),
          importAcctIds: this.importAcctIds.join(',')
        }
        for (let key of this.accountGroupValue) {
          params[key] = map[key]
        }
        if (this.getCheckAccount.length > 0)
          params.checkAcctIds = this.getCheckAccount.join(',')
        acctidsTrdvol(params).then(res => {
          if (res)
            this.dealWithAcctidsTrdvol(res)
        })
      },
      dealWithAcctidsTrdvol(res) {
        let map = {
            trade: {
              name: '交易关联组',
              sdata: [],
              bdata: []
            },
            import: {
              name: '导入账户组',
              sdata: [],
              bdata: []
            },
            reserved: {
              name: '保留账户组',
              sdata: [],
              bdata: []
            },
            del: {
              name: '删除账户组',
              sdata: [],
              bdata: []
            },
            check: {
              name: '勾选账户组',
              sdata: [],
              bdata: []
            },
            physical: {
              name: '物理关联组',
              sdata: [],
              bdata: []
            }
          },
          seriseList = []
        for (let key in res) {
          if (res[key] && res[key].length > 0) {
            for (let val of res[key]) {
              map[key].sdata.push(0 - val.trdvol_s)
              map[key].bdata.push(val.trdvol_b)
            }
            seriseList.push(
              {
                name: map[key].name + '买入',
                type: 'bar',
                stack: '总量',
                data: map[key].bdata,
                xAxisIndex: 1,
                yAxisIndex: 1
              },
              {
                name: map[key].name + '卖出',
                type: 'bar',
                stack: '总量',
                data: map[key].sdata,
                xAxisIndex: 1,
                yAxisIndex: 1
              }
            )
          }
        }
        let option = this.echart.getOption()

        seriseList.unshift(this.options.series[0])
        this.options.dataZoom = option.dataZoom
        this.options.series = seriseList
        this.echart.setOption(this.options, true)
      },
      ajaxExtraInfo() {
        let {selectTradeDate, indexCode} = this.$store.getters.getSelectParams
        let params = {
          startDate: selectTradeDate[0],
          endDate: selectTradeDate[1],
          stockCode: indexCode
        }
        extraInfo(params).then(res => {
          this.extraInfo = res
        })
      }
    },
    created() {
      this.options = {
        title: {},
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
            let obj = {top: 35}
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        grid: [
          {
            left: '10%',
            right: '5%',
            top: '10%',
            height: '40%',
            containLabel: false,
            show: true,
            borderColor: '#263657',
            borderWidth: 1
          },
          {
            left: '10%',
            right: '5%',
            height: '20%',
            top: '65%',
            containLabel: false,
            show: true,
            borderColor: '#263657',
            borderWidth: 1
          }
        ],
        xAxis: [
          {
            type: 'category',
            min: 'dataMin',
            max: 'dataMax',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#506798'
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#506798'
              }
            },
            axisLabel: {
              color: '#506798'
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            min: 'dataMin',
            max: 'dataMax',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#506798'
              }
            },
            axisLabel: {
              color: '#506798'
            },
            max: function (value) {
              return parseInt(value.max + value.max)
            }
          },
          {
            name: '成交数量',
            type: 'value',
            max: function (value) {
              return value.max > value.min ? value.max : Math.abs(value.min)
            },
            min: function (value) {
              return value.max > value.min ? 0 - value.max : value.min
            },
            gridIndex: 1,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#263657'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#506798'
              }
            },
            axisLabel: {
              color: '#506798'
            },
            splitNumber: 1
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 40,
            end: 60
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '90%',
            start: 40,
            end: 60,
            textStyle: {
              color: '#506798'
            },
            dataBackgroundColor: '#334164',
            dataBackground: {
              lineStyle: {color: '#aec0e6'},
              areaStyle: {color: '#334164'}
            },
            handleColor: '#a7b7cc',
            fillerColor: 'rgba(0,0,0,0.1)',
            borderColor: '#334164'
          }
        ],
        color: [
          'rgba(255,65,43,1)',
          'rgba(18,187,165,1)',
          'rgba(255,65,43,0.9)',
          'rgba(18,187,165,0.9)',
          'rgba(255,65,43,0.8)',
          'rgba(18,187,165,0.8)',
          'rgba(255,65,43,0.7)',
          'rgba(18,187,165,0.7)',
          'rgba(255,65,43,0.6)',
          'rgba(18,187,165,0.6)',
          'rgba(255,65,43,0.5)',
          'rgba(18,187,165,0.5)',
          'rgba(255,65,43,0.4)',
          'rgba(18,187,165,0.4)',
          'rgba(255,65,43,0.3)',
          'rgba(18,187,165,0.3)'
        ],
        series: []
      }
      this.ajaxExtraInfo()
    },
    mounted() {
      this.initEcharts('left-echart')
    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less" scoped>
  #left-echart {
    height: 350px;
  }
</style>
