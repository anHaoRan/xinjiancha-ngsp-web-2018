<template>
  <div class="top_Five">
    <el-card class="el-card-table">
      <div slot='header'>
        近五日TOP5
      </div>
      <el-form :inline="true" :model="selectParams" label-width="100px" class="condition">
        <el-card style="overflow: visible">
          <el-form-item label="投资者类别">
            <down-more-select v-model="selectParams.intervalType" @input="getIntervalType"
                              :optionData="orderTypeOption" ref="cancelOrdrtypcod"></down-more-select>
          </el-form-item>
        </el-card>
      </el-form>
      <div style="padding: 0px 10px">
        <div>
          <div style="padding-top: 5px">
            <i class="fa fa-calendar dateShow">&nbsp&nbsp{{dateOne}}</i>
          </div>
          <div id="topOne" class="charts"></div>
        </div>
        <div>
          <i class="fa fa-calendar dateShow">&nbsp&nbsp{{dateTwo}}</i>
          <div id="topTwo" class="charts"></div>
        </div>
        <div>
          <i class="fa fa-calendar dateShow">&nbsp&nbsp{{dateThree}}</i>
          <div id="topThree" class="charts"></div>
        </div>
        <div>
          <i class="fa fa-calendar dateShow">&nbsp&nbsp{{dateFour}}</i>
          <div id="topFour" class="charts"></div>
        </div>
        <div>
          <i class="fa fa-calendar dateShow">&nbsp&nbsp{{dateFive}}</i>
          <div id="topFive" class="charts"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {drawBarCharts} from './barChart'
  import DownMoreSelect from '../../common/downMoreSelect'
  import {
    getInvestorTypeData
  } from '@/service/capitalFlow/index'

  export default {
    components: {
      DownMoreSelect
    },
    data() {
      return {
        dateOne: '2017-07-18',
        dateTwo: '2017-07-17',
        dateThree: '2017-07-16',
        dateFour: '2017-07-15',
        dateFive: '2017-07-14',
        selectParams: {
          intervalType: ''
        },
        orderTypeOption: [] // 传递给子组件的投资者类型数据
      }
    },
    mounted() {
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.orderTypeOption.push({value: el.value, label: el.text})
        })
      })
      this.getBarData()
    },
    methods: {
      getBarData() {
        let data1 = {
          sellCount: [163, 260, 310, 490, 563],
          category1: [['非银金融', '1.5', 'a', 'b'], ['银行', '-1.9', 'a', 'b'], ['家用电器', '4.5', 'a', 'b'], ['房地产', '-3.5', 'a', 'b'], ['通信', '2.5', 'a', 'b']],
          category2: [['建筑材料', '1.5', 'a', 'b'], ['通信', '-1.9', 'a', 'b'], ['计算机', '4.5', 'a', 'b'], ['商业贸易', '-3.5', 'a', 'b'], ['交通运输', '2.5', 'a', 'b']],
          color: '#d24c29'
        }
        drawBarCharts(data1, 'topOne')
        let data2 = {
          sellCount: [163, 260, 310, 490, 563],
          category1: [['非银金融', '1.5', 'a', 'b'], ['银行', '-1.9', 'a', 'b'], ['家用电器', '4.5', 'a', 'b'], ['房地产', '-3.5', 'a', 'b'], ['通信', '2.5', 'a', 'b']],
          category2: [['建筑材料', '1.5', 'a', 'b'], ['通信', '-1.9', 'a', 'b'], ['计算机', '4.5', 'a', 'b'], ['商业贸易', '-3.5', 'a', 'b'], ['交通运输', '2.5', 'a', 'b']],
          color: '#c28d28'
        }
        drawBarCharts(data2, 'topTwo')
        let data3 = {
          sellCount: [163, 260, 310, 490, 563],
          category1: [['非银金融', '1.5', 'a', 'b'], ['银行', '-1.9', 'a', 'b'], ['家用电器', '4.5', 'a', 'b'], ['房地产', '-3.5', 'a', 'b'], ['通信', '2.5', 'a', 'b']],
          category2: [['建筑材料', '1.5', 'a', 'b'], ['通信', '-1.9', 'a', 'b'], ['计算机', '4.5', 'a', 'b'], ['商业贸易', '-3.5', 'a', 'b'], ['交通运输', '2.5', 'a', 'b']],
          color: '#788d32'
        }
        drawBarCharts(data3, 'topThree')
        let data4 = {
          sellCount: [163, 260, 310, 490, 563],
          category1: [['非银金融', '1.5', 'a', 'b'], ['银行', '-1.9', 'a', 'b'], ['家用电器', '4.5', 'a', 'b'], ['房地产', '-3.5', 'a', 'b'], ['通信', '2.5', 'a', 'b']],
          category2: [['建筑材料', '1.5', 'a', 'b'], ['通信', '-1.9', 'a', 'b'], ['计算机', '4.5', 'a', 'b'], ['商业贸易', '-3.5', 'a', 'b'], ['交通运输', '2.5', 'a', 'b']],
          color: '#1c9286'
        }
        drawBarCharts(data4, 'topFour')
        let data5 = {
          sellCount: [163, 260, 310, 490, 563],
          category1: [['非银金融', '1.5', 'a', 'b'], ['银行', '-1.9', 'a', 'b'], ['家用电器', '4.5', 'a', 'b'], ['房地产', '-3.5', 'a', 'b'], ['通信', '2.5', 'a', 'b']],
          category2: [['建筑材料', '1.5', 'a', 'b'], ['通信', '-1.9', 'a', 'b'], ['计算机', '4.5', 'a', 'b'], ['商业贸易', '-3.5', 'a', 'b'], ['交通运输', '2.5', 'a', 'b']],
          color: '#55D222'
        }
        drawBarCharts(data5, 'topFive')
      },
      getIntervalType(val) {
        console.log(val)
      }
    }
  }
</script>

<style lang="less">
  .top_Five {
    .charts {
      border-bottom: 1px solid #253761;
      height: 160px
    }
    #topFive {
      border-bottom: none;
    }
    .dateShow {
      padding-top: 10px;
    }
  }
</style>