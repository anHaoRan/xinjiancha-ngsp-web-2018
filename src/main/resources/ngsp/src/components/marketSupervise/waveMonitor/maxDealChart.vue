<template>
  <div class='clearfix max'>
    <el-col :span='12'>
      <div id='buy' :style='{height:"300px"}'></div>
    </el-col>
    <el-col :span='12'>
      <div id='sale' :style='{height:"300px"}'></div>
    </el-col>
  </div>
</template>
<script>
  import {drawBarChart} from './charts/barChart.js'
  import {getMemberData} from '../../../service/marketSupervise/waveMonitor/index'

  export default {
    data() {
      return {
        buyMemberName: [],
        saleMemberName: [],
        buyAmount: [],
        saleAmount: [],
        timer: '',
        refreshTime: 60 * 1000
      }
    },
    mounted() {
      this.draw()
    },
    beforeDestroy() {
      if (this.timer != '') {
        clearTimeout(this.timer)
      }
    },
    methods: {
      draw() {
        let that = this;
        getMemberData().then((data) => {
          let buyList = data.memberBuy
          let saleList = data.memberSell
          this.buyMemberName = []
          this.saleMemberName = []
          this.buyAmount = []
          this.saleAmount = []
          buyList.forEach((el) => {
            this.buyMemberName.push(el.MEMBER_NAME_B.trim())
            this.buyAmount.push((el.MEMBER_MKTVAL_B / 10000).toFixed(2))
          })
          saleList.forEach((el) => {
            this.saleMemberName.push(el.MEMBER_NAME_S.trim())
            this.saleAmount.push((el.MEMBER_MKTVAL_S / 10000).toFixed(2))
          })
          let maxBuy = Math.max(...this.buyAmount)
          let maxSell = Math.max(...this.saleAmount)
          let maxVal = maxBuy > maxSell ? Math.ceil(maxBuy) : Math.ceil(maxSell);
          let buyData = {
            classify: '买入',
            color1: that.gfnFormatSecurityColor(1),
            color2: '#aec0e6',
            memberName: this.buyMemberName,
            amount: this.buyAmount,
            flag: false,
            maxValue: maxVal
          }
          let saleData = {
            classify: '卖出',
            color1: that.gfnFormatSecurityColor(-1),
            color2: '#aec0e6',
            memberName: this.saleMemberName,
            amount: this.saleAmount,
            flag: false,
            maxValue: maxVal
          }
          drawBarChart('buy', buyData)
          drawBarChart('sale', saleData)
          this.timer = setTimeout(function () {
            that.draw()
          }, that.refreshTime)
        })
      }
    }
  }
</script>
<style lang='less' scoped>

</style>
