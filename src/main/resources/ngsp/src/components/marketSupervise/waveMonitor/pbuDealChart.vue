<template>
  <div class='clearfix max'>
    <el-col :span='12'>
      <div id='pbuBuy' :style='{height:"300px"}'></div>
    </el-col>
    <el-col :span='12'>
      <div id='pbuSale' :style='{height:"300px"}'></div>
    </el-col>
  </div>
</template>
<script>
  import {drawBarChart} from './charts/barChart.js'
  import {getPbuMemberData} from '../../../service/marketSupervise/waveMonitor/index'

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
        let that = this
        getPbuMemberData().then((data) => {
          let buyList = data.pbuBuy
          let saleList = data.pbuSell
          this.buyPbuId = []
          this.salePbuId = []
          this.buyAmount = []
          this.saleAmount = []
          buyList.forEach((el) => {
            this.buyPbuId.push(el.PBU_NAME_B.trim())
            this.buyAmount.push((el.PBU_MKTVAL_B / 10000).toFixed(2))
          })
          saleList.forEach((el) => {
            this.salePbuId.push(el.PBU_NAME_S.trim())
            this.saleAmount.push((el.PBU_MKTVAL_S / 10000).toFixed(2))
          })
          let maxBuy = Math.max(...this.buyAmount)
          let maxSell = Math.max(...this.saleAmount)
          let maxVal = maxBuy > maxSell ? Math.ceil(maxBuy) : Math.ceil(maxSell);
          let buyData = {
            classify: '买入',
            color1: that.gfnFormatSecurityColor(1),
            color2: '#aec0e6',
            memberName: this.buyPbuId,
            amount: this.buyAmount,
            flag: false,
            maxValue: maxVal
          }
          let saleData = {
            classify: '卖出',
            color1: that.gfnFormatSecurityColor(-1),
            color2: '#aec0e6',
            memberName: this.salePbuId,
            amount: this.saleAmount,
            flag: false,
            maxValue: maxVal
          }
          drawBarChart('pbuBuy', buyData)
          drawBarChart('pbuSale', saleData)
          this.timer = setTimeout(function () {
            that.draw()
          }, that.refreshTime)
        })
        // getWaveData().then((data) => {
        //   let buyList = data.pbuBuyList
        //   let saleList = data.pbuSaleList
        //   this.buyPbuId = []
        //   this.salePbuId = []
        //   this.buyAmount = []
        //   this.saleAmount = []
        //   buyList.forEach((el) => {
        //     this.buyPbuId.push(el.pbuId)
        //     this.buyAmount.push((el.amount / 10000).toFixed(2))
        //   })
        //   saleList.forEach((el) => {
        //     this.salePbuId.push(el.pbuId)
        //     this.saleAmount.push((el.amount / 10000).toFixed(2))
        //   })
        //   let buyData = {
        //     classify: '买入',
        //     color1: '#6b221c',
        //     color2: '#e33f2d',
        //     memberName: this.buyPbuId,
        //     amount: this.buyAmount,
        //     flag: false
        //   }
        //   let saleData = {
        //     classify: '卖出',
        //     color1: '#075859',
        //     color2: '#12a08e',
        //     memberName: this.salePbuId,
        //     amount: this.saleAmount,
        //     flag: false
        //   }
        //   drawBarChart('pbuBuy', buyData)
        //   drawBarChart('pbuSale', saleData)
        //   let that = this
        //   this.timer = setTimeout(function () {
        //     that.draw()
        //   }, that.refreshTime)
        // })
      }
    }
  }
</script>
<style lang='less' scoped>

</style>
