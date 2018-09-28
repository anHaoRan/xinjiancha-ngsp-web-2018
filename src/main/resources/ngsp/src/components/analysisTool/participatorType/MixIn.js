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
  computed: {},
  watch: {},
  methods: {
    orderOrCreditChange (val) {
      if (val.includes('ALL')) {
        if (val[0] === 'ALL' && val.length === 2) {
          this.$message.info('请先取消全选')
        }
        return ['ALL']
      } else {
        return [...val]
      }
    },
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
