import moment from 'moment'
export default {
  name: 'mixin.js',
  props: [],
  components: {

  },
  mixins: [],
  data () {
    return {
    }
  },
  computed: {
    taskID:function () {
      return this.$store.state.insiderTradAnalysis.demensionTaskInfo.task_id
    },
    ccrcAcctID:function () {
      return this.$store.state.insiderTradAnalysis.accountparam[0]
    },
    acctCodes:function () {
      return this.$store.state.insiderTradAnalysis.accountparam[1]
    },
    secCode:function () {
      return this.$store.state.insiderTradAnalysis.demensionTaskInfo.sec_code
    },
    secCodeName:function () {
      return `${this.$store.state.insiderTradAnalysis.demensionTaskInfo.sec_code} ${this.$store.state.insiderTradAnalysis.demensionTaskInfo.sec_name}`
    },
    acctAnalId:function () {
      return this.$store.state.insiderTradAnalysis.accountparam[2]
    },
    checkStartDate:function () {
      return moment(this.$store.state.insiderTradAnalysis.demensionTaskInfo.check_startdate, 'YYYYMMDD').format('YYYY-MM-DD')
    },
    checkEndDate:function () {
      return moment(this.$store.state.insiderTradAnalysis.demensionTaskInfo.check_enddate, 'YYYYMMDD').format('YYYY-MM-DD')
    },
    analTypeName:function () {
      return this.$store.state.insiderTradAnalysis.demensionTaskInfo.anal_type_name
    }
  },
  watch: {},
  methods: {
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
