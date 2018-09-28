import Vue from 'vue'
import {getCreateAuthority} from '../../service/superviseTask'
import {activityNameMapRouteName} from './constants'
export default {
  name: 'mixinAuthority.js',
  props: [],
  components: {},
  mixins: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  beforeRouteEnter(to, from, next) {
    if (typeof to.query.processStatus === 'undefined') {
      if (String(to.query.operate) === '1' || String(to.query.isoperateCheck) === '1') { // 超链接跳转表单页面进行查看
        next()
      } else {
        getCreateAuthority(activityNameMapRouteName[to.name]).then(resp => {
          const {canClick} = resp
          if (canClick) {
            next()
          } else {
            Vue.prototype.$message.error('无权限进行新建操作')
            next(false)
          }
        })
      }
    } else {
      next()
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
