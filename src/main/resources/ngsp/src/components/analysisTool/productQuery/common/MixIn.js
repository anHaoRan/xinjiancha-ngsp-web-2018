export default {
  name: 'mixin.js',
  props: [],
  components: {
    DownTemplateFile: () => import('./downTemplateFile'),
    ParticipantLevelVal: () => import('./participantLevelVal'),
    orderOrCreditType: () => import('./orderOrCreditType'),
    TextUpload: () => import('../../../common/textUpload'),
    SelectLazyMultiple: () => import('../../../common/SelectLazyMultiple'),
  },
  mixins: [],
  data () {
    let checkNumber = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('必须是数字'))
        return
      }
      if (Number(value) < 0 || Number(value) % 1 !== 0) {
        callback(new Error('必须是正整数'))
        return
      }
      if (Number(value) > 1000) {
        callback(new Error('最大值为1000'))
        return
      }
      callback()
    }
    let numberRules = {
      validator: checkNumber
    }
    return {
      HOLD_STATISTICS: {
        EQU: {
          account: [
            {
              field: 'invacctno',
              label: '参与者代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '参与者名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'pbuoscod',
              label: 'PBU代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'pbuoscod')
            },
            {
              field: 'brnname',
              label: '营业部名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'brnname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_position_limit',
              label: '期初持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_limit')
            },
            {
              field: 'final_position_limit',
              label: '期末持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_limit')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          salePartAndMemberPBU: [
            {
              field: 'invacctno',
              label: '参与者代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '参与者名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_position_limit',
              label: '期初持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_limit')
            },
            {
              field: 'final_position_limit',
              label: '期末持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_limit')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          uniteCodeMain: [
            {
              field: 'invacctno',
              label: '一码通账户',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '一码通名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_position_limit',
              label: '期初持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_limit')
            },
            {
              field: 'final_position_limit',
              label: '期末持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_limit')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          uniteCodeSub: [
            {
              field: 'invacctno',
              label: '账户代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '账户名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'pbuoscod',
              label: 'PBU代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'pbuoscod')
            },
            {
              field: 'brnname',
              label: '营业部名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'brnname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_position_limit',
              label: '期初持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_limit')
            },
            {
              field: 'final_position_limit',
              label: '期末持有限售股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_limit')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ]
        },
        exceptEQU: {
          account: [
            {
              field: 'invacctno',
              label: '参与者代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '参与者名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'pbuoscod',
              label: 'PBU代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'pbuoscod')
            },
            {
              field: 'brnname',
              label: '营业部名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'brnname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          salePartAndMemberPBU: [
            {
              field: 'invacctno',
              label: '参与者代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '参与者名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          uniteCodeMain: [
            {
              field: 'invacctno',
              label: '一码通账户',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '一码通名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ],
          uniteCodeSub: [
            {
              field: 'invacctno',
              label: '账户代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno')
            },
            {
              field: 'invacctname',
              label: '账户名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'invacctname')
            },
            {
              field: 'pbuoscod',
              label: 'PBU代码',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'pbuoscod')
            },
            {
              field: 'brnname',
              label: '营业部名称',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'brnname')
            },
            {
              field: 'original_position',
              label: '期初持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
            },
            {
              field: 'original_position_ratio',
              label: '期初持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
            },
            {
              field: 'final_position',
              label: '期末持有流通股',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
            },
            {
              field: 'final_position_ratio',
              label: '期末持股比例',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
            },
            {
              field: 'position_diff',
              label: '持股变动量',
              align: 'right',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
            },
            {
              field: 'original_date',
              label: '期初日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'original_date')
            },
            {
              field: 'final_date',
              label: '期末日期',
              align: 'left',
              width: '120',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'final_date')
            }
          ]
        }
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    checkTopNNum (maxVal) {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0 || Number(value) % 1 !== 0) {
          callback(new Error('必须是正整数'))
          return
        }
        if (Number(value) > maxVal) {
          callback(new Error(`最大值为${maxVal}`))
          return
        }
        callback()
      }
      return {validator: checkNumber}
    },
    /**
     *  参数说明：
     *    focusType：当前输入是开始值还是结束值
     *    startNum：起始值
     *    endNum：结束值
     *    isInt：是否为整数类型
     *    isFloat：是否为小数类型
     *    msg：报错提示信息
     */
    resetPagenation () {
      this.currentPage = 1
      this.pageSize = 10
    },
    fnValidateStartToEndNum (focusType, startNum, endNum, isInt, isFloat, msg) {
      if (focusType === 'start' && !startNum) {
        return ['', endNum]
      }
      if (focusType === 'end' && !endNum) {
        return [startNum, '']
      }
      if (startNum && !isNaN(Number(startNum)) && isFloat) {
        startNum = this.gfnFormatDecimal(startNum, 3)
      }
      if (endNum && !isNaN(Number(endNum)) && isFloat) {
        endNum = this.gfnFormatDecimal(endNum, 3)
      }
      if (focusType === 'start' && (isNaN(startNum) || Number(startNum) < 0 || (isInt && !/^\d+$/.test(startNum)) || (isFloat && !(/^\d+\.\d+$/).test(startNum)))) {
        this.$message.warning(msg)
        return ['', endNum]
      }
      if (focusType === 'end' && (isNaN(endNum) || Number(endNum) < 0 || (isInt && !/^\d+$/.test(endNum)) || (isFloat && !(/^\d+\.\d+$/).test(endNum)))) {
        this.$message.warning(msg)
        return [startNum, '']
      }
      if (startNum && endNum && Number(startNum) > Number(endNum) && focusType) {
        switch (focusType) {
          case 'start':
            this.$message.warning(msg)
            startNum = ''
            break
          case 'end' :
            this.$message.warning(msg)
            endNum = ''
            break
        }
      }
      return [startNum, endNum]
    },
    fnValidateAccountCode (type, val, msg) {
      if (type === 'account' && val && !this.gfnStockCodeReg(val)) {
        this.$message.warning(msg)
      }
    },
    clearAll () {
      this.$refs.order.clear()
      this.$refs.credit.clear()
      this.$refs.participantLeavel.clearAll()
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
