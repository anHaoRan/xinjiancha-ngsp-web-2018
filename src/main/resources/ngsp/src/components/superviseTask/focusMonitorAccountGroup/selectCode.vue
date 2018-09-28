<template>
  <div style='display: flex;align-items:center;' class='inputContent'>
    <stock-code-query :commonData='submitData' :clearable='false' @getStockCode='getStockCode'
                      :class='scope.row.readonly?"borderNone":""'></stock-code-query>
  </div>
</template>
<script>
  import StockCodeQuery from '../../common/StockCodeQuery'

  export default {
    name: 'reason',
    props: ['scope', 'item'],
    components: {StockCodeQuery},
    mixins: [],
    data () {
      return {
        isActive: true,
        submitData: {
          disabled: this.scope.row.readonly,
          stockCode: this.scope.row.securityId + ' ' + this.scope.row.securityName
        }
      }
    },
    computed: {},
    watch: {
      'scope.row.readonly': {
        handler: function (param1, param2) {
          this.submitData.disabled = param1
        },
        deep: true
      }
    },
    methods: {
      getStockCode (stock) {
        this.scope.row.securityId = stock.split(' ')[0]
        this.scope.row.securityName = stock.split(' ')[1]
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang='less'>
  .inputContent {
    input {
      text-align: center;
    }
    .borderNone {
      input {
        border: none !important;
      }
    }
    .el-select .el-input.is-disabled .el-input__inner {
      background-color: transparent;
      color: #aec0e6
    }
  }
</style>
