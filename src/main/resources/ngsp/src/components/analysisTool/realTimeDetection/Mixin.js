export default {
  data () {
    return {
      routerParams: {}
    }
  },
  created () {
    this.routerParams = JSON.parse(this.$route.params.params)
  },
  methods: {
    getAccountGroup (arr) {
      let strArr = []
      for (let key of arr) {
        switch (key) {
          case '选中账户':
            strArr.push(...this.routerParams.checkedAccount)
            break
          case '待分析账户':
            strArr.push(...this.routerParams.analysisAccount)
            break
          case '待监控账户':
            strArr.push(...this.routerParams.monitorAccount)
            break
        }
      }
      return Array.from(new Set(strArr)).join(',')
    }
  }
}
