<template>
  <div id="candleDateChart" class="stock-k-chart"></div>
</template>

<script>
  import { getMarketDayLine } from '@/service/marketSupervise'
  import { drawStockCandleChart } from '@/utils/charts/stockCandleChart'

  export default {
    methods: {
      getCandleDateData () {
        let params = {
          market: 'sh1',
          code: '000001',
          codeType: 'index',
          candleStyle: 'D',
          startDate: null,
          endDate: null
        }
        getMarketDayLine(params).then(resp => {
          drawStockCandleChart(resp.chartData, 'candleDateChart', resp.secCode ? (resp.secCode + ' ' + resp.secName) : '')
        })
      }
    }
  }
</script>
