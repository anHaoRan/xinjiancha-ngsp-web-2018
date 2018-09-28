export default {
  name: 'mixin.js',
  props: [],
  components: {},
  mixins: [],
  data () {
    return {
      CYZCX : {
        // 参与者成交查询表格-营业部
        CHAX1: [
          {
            label: '营业部代码',
            field: 'id',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id')
          },
          {
            label: '营业部名称',
            field: 'name',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'name')
          },
          {
            label: '资金',
            field: 'mktval',
            width: '12%',
            isShow: true,
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ],
        // 参与者成交查询表格- PBU
        CHAX2: [
          {
            label: 'PBU代码',
            field: 'id',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id')
          },
          {
            label: '营业部名称',
            field: 'name',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'name')
          },
          {
            label: '资金',
            field: 'mktval',
            width: '12%',
            isShow: true,
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ],
        // 参与者成交查询表格-券商
        CHAX3: [
          {
            label: '券商代码',
            field: 'id',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id')
          },
          {
            label: '券商名称',
            field: 'name',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'name')
          },
          {
            label: '资金',
            field: 'mktval',
            width: '12%',
            isShow: true,
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ],
        // 参与者成交查询表格-各类投资者
        CHAX4: [
          {label: '', field: 'id', width: '12%', align: 'left', isShow: false},
          {
            label: '投资者类型',
            field: 'flag_name',
            width: '12%',
            isShow: true,
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'flag_name')
          },
          {
            label: '资金',
            field: 'mktval',
            width: '12%',
            isShow: true,
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ],
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    validateNum (minVal, maxVal, isInt, isRequired) {
      let checkNumber = (rule, value, callback) => {
        if (isRequired && !value) {
          callback(new Error('不能为空'))
          return
        }
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (minVal !== '' && Number(value) < minVal) {
          callback(new Error(`必须大于等于${minVal}`))
          return
        }
        if (maxVal !== '' && Number(value) > maxVal) {
          callback(new Error(`必须小于等于${maxVal}`))
          return
        }
        if (isInt && !/^\d+$/.test(value)) {
          callback(new Error(`必须为整数`))
          return
        }
        callback()
      }
      return checkNumber
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
