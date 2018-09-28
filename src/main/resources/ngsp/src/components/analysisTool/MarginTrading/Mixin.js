import { getCurTradeDate, getRelativeTradeDate } from '@/service/common/commonFunc'
import moment from 'moment'

export default {
  name: 'mixin.js',
  props: [],
  components: {},
  mixins: [],
  data () {
    return {
      tradeDate: undefined,
      tradeDate1: undefined
    }
  },
  computed: {},
  watch: {},
  methods: {
    ajaxTradeDate () {
      getCurTradeDate().then(res => {
        this.tradeDate = res
      })
      getRelativeTradeDate('-1').then(res => {
        this.tradeDate1 = res
      })
    },
    initTradeDate (flag = false) {
      if (flag)
        this.selectParams.selectTradeDate = [this.tradeDate1, this.tradeDate1]
      else
        this.selectParams.selectTradeDate = [this.tradeDate + ' 090000', this.tradeDate + ' 170000']
    },
    handlerChange (val) {
      if (val) {
        let [dateStart, timeStart] = val[0].split(' '),
          [dateEnd, timeEnd] = val[1].split(' ')
        if (timeStart === '000000') {
          this.selectParams.selectTradeDate[0] = dateStart + ' 090000'
        }
        if (timeEnd === '000000') {
          if (moment(dateEnd).isBefore(moment(this.tradeDate))) {
            this.selectParams.selectTradeDate[1] = dateEnd + ' 170000'
          } else {
            this.selectParams.selectTradeDate[1] = dateEnd + ' ' + moment(new Date()).format('HHmmss')
          }
        }
      }
    }
  },
  created () {
    this.ajaxTradeDate()
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
