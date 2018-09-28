let echarts = require('echarts')
export default {
  data () {
    return {
      echart: null,
      options: {}
    }
  },
  computed: {
    selectParams: function () {
      return this.$store.getters.getSelectParams
    },
    getShuttleRight () {
      return this.$store.getters.getShuttleRight
    },
    getGoDeleteRight () {
      return this.$store.getters.getGoDeleteRight
    }
  },
  created () {

  },
  methods: {
    dealWithReservedAcctIds () {
      let reservedAcctIds = this.getGoDeleteRight.map(item => {
          return item.acct_id
        }),
        delAcctIds = this.getShuttleRight.map(item => {
          return item.acct_id
        })
      return {
        reservedAcctIds: reservedAcctIds.join(','),
        delAcctIds: delAcctIds.join(',')
      }
    },
    createElementA (url, fileType, columns, installParams) {
      let selectParams = this.selectParams,
        params = {
          startDate: selectParams.selectTradeDate[0],
          endDate: selectParams.selectTradeDate[1],
          stockCode: selectParams.indexCode
        }
      for (let key in installParams) {
        params[key] = installParams[key]
      }
      params.tableColumns = columns
      params.fileType = fileType
      console.log(JSON.stringify(params))
      this.gfnExportFileWithForm(url, params)
    }
  }
}
