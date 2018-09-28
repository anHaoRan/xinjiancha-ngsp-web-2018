import {
  investigationOptions,
  abnormalBehavOptionsList
} from './constants'
import CommonTable from './component/tablePaginationComponent'
export default {
  name: 'mixin.js',
  props: [],
  components: {CommonTable},
  mixins: [],
  data () {
    return {
      investigationOptions,
      abnormalBehavOptionsList
    }
  },
  computed: {},
  watch: {},
  methods: {
    dealCascaderParams(a, b) {
      let targetParams = []
      let aCodeMap = a.map((item, index) => {
        targetParams[index] = {
          investigation: item,
          abnormalBehav: []
        }
        return investigationOptions.indexOf(item)
      })
      aCodeMap.forEach((v, i) => {
        let filterItem = b.filter(l => {
          return abnormalBehavOptionsList[v].indexOf(l) > -1
        })
        if (filterItem.length) {
          targetParams[i]['abnormalBehav'] = filterItem
        }
      })
      return targetParams
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
