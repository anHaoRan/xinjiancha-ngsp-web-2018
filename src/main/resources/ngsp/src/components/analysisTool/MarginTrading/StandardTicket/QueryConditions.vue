<template>
    <div class="query-conditions">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        @click="select()">查询
                </el-button>
            </div>
            <el-form :model="selectParams" ref="selectParams" :rules="rules" label-position="left" label-width="100px"
                     style="margin-top: 20px;">
                <el-row>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="证券类别">
                            <el-select v-model="selectParams.isinType" size="small">
                                <el-option
                                        label="所有标的券"
                                        value="a"/>
                                <el-option
                                        label="单只标的券"
                                        value="d"/>
                                <el-option
                                        label="融资标的券"
                                        value="m"/>
                                <el-option
                                        label="融券标的券"
                                        value="s"/>
                                <el-option
                                        label="担保品标的券"
                                        value="c"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="证券代码" prop="indexCode">
                            <stock-code-query :commonData="submitData" :clearable='false' style="display: inline-flex"
                                              @getStockCode="getStockCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="时间类别">
                            <el-select v-model="selectParams.dateType" size="small">
                                <el-option
                                        label="带时间"
                                        value="1"/>
                                <el-option
                                        label="不带时间"
                                        value="2"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24" v-if="selectParams.dateType==='1'">
                        <el-form-item label="起止时间" prop="selectTradeDate">
                            <el-date-picker v-model="selectParams.selectTradeDate"
                                            type="datetimerange"
                                            range-separator="至"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            format="yyyyMMdd HHmmss" value-format="yyyyMMdd HHmmss"
                                            @change="handlerChange"
                                            size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24" v-else>
                        <el-form-item label="起止时间" prop="selectTradeDate">
                            <el-date-picker v-model="selectParams.selectTradeDate"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            format="yyyyMMdd" value-format="yyyyMMdd"
                                            size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow">
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="参与者层级">
                            <el-select v-model="selectParams2.type" size="small">
                                <el-option
                                        label="会员"
                                        value="member"/>
                                <el-option
                                        label="营业部"
                                        value="branch"/>
                                <el-option
                                        label="账户"
                                        value="acct"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="排序规则">
                            <el-select v-model="selectParams2.statType" size="small">
                                <el-option v-for="(item,index) in statTypeOption"
                                           :key="index"
                                           :label="item.label"
                                           :value="item.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
  import MinxinVue from '../Mixin'
  import moment from 'moment'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery')
    },
    mixins: [MinxinVue],
    data () {
      return {
        selectParams: {
          isinType: 'a',
          indexCode: '',
          dateType: '1',
          selectTradeDate: []
        },
        selectParams2: {
          type: 'member',
          statType: 'bm_qty'
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        rules: {
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        },
        statTypeOption: [
          {label: '按融资买入量降序', value: 'bm_qty'},
          {label: '按卖券还款量降序', value: 'sm_qty'},
          {label: '按买券还券量降序', value: 'bs_qty'},
          {label: '按融券卖出量降序', value: 'ss_qty'},
          {label: '按融券平仓量降序', value: 'bp_qty'},
          {label: '按融资平仓量降序', value: 'sp_qty'},
          {label: '按担保品买入量降序', value: 'bc_qty'},
          {label: '按担保品卖出量降序', value: 'sc_qty'},
          {label: '按担保品划入量降序', value: 'ci_qty'},
          {label: '按担保品划出量降序', value: 'co_qty'},
          {label: '按券源划入量降序', value: 'si_qty'},
          {label: '按券源划出量降序', value: 'so_qty'},
          {label: '按余券划转量降序', value: 'st_qty'},
          {label: '按还券划转量降序', value: 'sr_qty'}
        ],
        isShow: false
      }
    },
    computed: {},
    watch: {
      tradeDate () {
        this.initTradeDate()
      },
      'selectParams.dateType': function (val) {
        let map = {
          1: () => {
            this.initTradeDate()
          },
          2: () => {
            this.initTradeDate(true)
          }
        }
        map[val]()
      },
      selectParams2: {
        handler (val) {
          this.$store.commit('setStandardTicketDetail', val)
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getStockCode (stockCodeData, type, isinCode) {
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.indexCode = isinCode
          this.selectParams.indexName = indexName
        }
      },
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            if (this.selectParams.isinType == 'd' && this.selectParams.indexCode == '') {
              this.$message.warning('当证券类型为单只标的券时，证券代码必填')
              return
            }
            if (this.selectParams.dateType === '1') {
              let {selectTradeDate} = this.selectParams,
              [dateStart] = selectTradeDate[0].split(' '),
              [dateEnd] = selectTradeDate[1].split(' ')
              if (!moment(dateStart).isSame(dateEnd)) {
                this.$message.warning('当时间类别为带时间时，该功能不支持跨日查询')
                return
              }
            } else {
              let {selectTradeDate} = this.selectParams,
              dateEnd = selectTradeDate[1]
              if (!moment(dateEnd).isBefore(moment().format('YYYYMMDD'))) {
                this.$message.warning('结束日期不能大于等于今天')
                return
              }
            }
            this.isShow = true
            this.$emit('select', this.selectParams)
          }
        })
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
</style>
