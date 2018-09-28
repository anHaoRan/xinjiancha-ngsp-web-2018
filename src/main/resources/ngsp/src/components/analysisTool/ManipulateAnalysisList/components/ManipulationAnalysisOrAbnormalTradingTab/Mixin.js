let echarts = require('echarts')
export default {
  data () {
    return {
      echart: null,
      options: {}
    }
  },
  computed: {
    selectParams () {
      return this.$store.getters.getSelectParams
    }
  },
  created () {

  },
  methods: {
    initEcharts (dom) {
      let myLine = document.getElementById(dom)
      this.echart = echarts.init(myLine, this.gfnGetTheme())
      this.gfnEchartShowLoading(this.echart)
      this.echart.clear()
    },
    drawEcharts () {
      this.echart.setOption(this.options, true)
      this.hideLoading()
    },
    hideLoading () {
      this.echart.hideLoading()
    }
  }
}
