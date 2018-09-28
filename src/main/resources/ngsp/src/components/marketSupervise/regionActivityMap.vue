<template>
  <trade-liveness-map :tradeMapData="tradeMapData" :showNote="false" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.4)"></trade-liveness-map>
</template>

<script>
  import TradeLivenessMap from './areaTradeLiveness/tradeLivenessMap'
  import { getTradeMap } from '../../service/marketSupervise'

  export default {
    components: {
      TradeLivenessMap
    },
    data () {
      return {
        tradeMapData: [],
        timeout: null,
        loading: false
      }
    },
    methods: {
      getTradeMapData () {
        this.loading = true
        getTradeMap().then(resp => {
          this.loading = false
          this.tradeMapData = resp.branchQtyMap
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000)
        }, () => {
          this.loading = false
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000)
        })
      },
      refreshMapData () {
        getTradeMap().then(resp => {
          this.tradeMapData = resp.branchQtyMap
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000)
        }, () => {
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000)
        })
      }
    },
    mounted () {
      this.getTradeMapData()
    },
    created () {
    },
    beforeDestroy () {
      if (this.timeout != null) {
        clearTimeout(this.timeout)
      }
    }
  }
</script>

<style scoped lang="less">

</style>
