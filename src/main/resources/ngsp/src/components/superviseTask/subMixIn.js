import {recalllist} from '../../service/superviseTask'
export default {
  name: 'subMixIn.js',
  props: [],
  components: {},
  mixins: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    recall(item, callback) { // 撤回
      this.$confirm('确定撤回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'activityName': item.lastOperateActivityName,
          'instanceId': item.instanceId,
          'processName': item.processName
        }
        if (item.localStatus === '办结') {
          params.isFinish = 'true'
        }
        recalllist(JSON.stringify(params)).then((resp) => {
          if (resp) {
            this.$message.success('撤回流程成功!')
          } else {
            this.$message.error('撤回流程失败!')
          }
          if (callback) {
            callback()
          } else { // 更新列表(默认方法)
            this.getAllData()
          }
        })
      }).catch(() => {})
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
