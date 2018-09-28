<template>
  <div>
    <el-card class="el-card-table">
      <el-tabs :value="checkConditions[0]">
        <el-tab-pane :label="`初筛标准${item}的账户`" v-if="item<7" :name="item" :key="index"
                     v-for="(item,index) in checkConditions">
          <standard v-if="firstData['chkRes'+item]" :columns="columns[item]" :index="item"
                    :standardData="firstData['chkRes'+item]"></standard>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'first-screening-list',
    props: {
      firstData: Object
    },
    components: {
      Standard: () => import('./FirstTabPane/Standard')
    },
    mixins: [],
    data () {
      return {
        columns: {
          1: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_vol',
              align: 'right',
              label: '期间买入成交量(股)',
              formatter: this.gfnElColFormatDecThou0
              // sortable: true,
              // sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_vol',
              align: 'right',
              label: '期间卖出成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'tc_nl_bs',
              align: 'left',
              label: '期间净买卖方向',
              // formatter: this.dealWithTcNlBs
            }, {
              field: 'tc_bs',
              align: 'left',
              label: '买卖方向',
              // formatter: this.dealWithTcBs
            }, {
              field: 'acct_rank',
              align: 'left',
              label: '期间买卖排名'
            }
          ],
          2: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'tc_bs',
              align: 'left',
              label: '买卖方向',
              // formatter: this.dealWithTcBs
            }, {
              field: 'max_rank_day',
              align: 'left',
              label: '排名最高日'
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '该日买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'buy_vol',
              align: 'right',
              label: '该日买入成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '该日卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_vol',
              align: 'right',
              label: '该日卖出成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'acct_rank',
              align: 'right',
              label: '该日买卖排名'
            }
          ],
          3: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'trade_buy_freq',
              align: 'right',
              label: '期间买入成交次数'
            }, {
              field: 'trade_sell_freq',
              align: 'right',
              label: '期间卖出成交次数'
            }
          ],
          4: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'trade_amt',
              align: 'right',
              label: '期间总成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'branch_acct_id',
              align: 'left',
              label: '同一营业部的账户代码'
            }, {
              field: 'branch_acct_name',
              align: 'left',
              label: '同一营业部的账户名称'
            }, {
              field: 'sp_acct_scr_nm',
              align: 'left',
              label: '同一营业部的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ],
          5: [
            {
              field: 'a',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'a',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'a',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'a',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'a',
              align: 'left',
              label: '曾上报函号'
            }, {
              field: 'a',
              align: 'left',
              label: '曾上报日期'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户代码'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户名称'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ],
          6: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'ccrc_acct_id',
              align: 'left',
              label: '一码通账号'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
              // sortable: true,
              // sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'trade_amt',
              align: 'right',
              label: '期间总成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'ymt_acct_id',
              align: 'left',
              label: '同一一码通的账户代码'
            }, {
              field: 'ymt_acct_scr_nm',
              align: 'left',
              label: '同一一码通的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ]
        }
      }
    },
    computed: {
      checkConditions () {
        // eslint-disable-next-line
        return this.$parent.selectParams.condition.sort((x, y) => {
          return x - y
        })
      }
      // lastSelectParams() {
      //   return JSON.parse(JSON.stringify(this.$store.getters.getLastSelectParams))
      // }
    },
    watch: {
      // lastSelectParams: {
      //   handler() {
      //     for (let key of this.checkConditions) {
      //       if (key === '1') {
      //         this.dealColumns(key, this.lastSelectParams.chk1BS)
      //         continue
      //       }
      //       if (key === '2') {
      //         this.dealColumns(key, this.lastSelectParams.chk2DayBS)
      //         break
      //       }
      //     }
      //   },
      //   immediate: true
      // }
    },
    methods: {
      dealWithChkNm (row, column, cellValue) {
        return `符合初筛标准${cellValue}`
      },
      dealWithTcNlBs (row, column, cellValue) {
        let map = {
          B: '净买入',
          S: '净卖出'
        }
        return map[cellValue]
      },
      dealWithTcBs (row, column, cellValue) {
        let map = {
          B: '买',
          S: '卖',
          BS: '买卖'
        }
        return map[cellValue]
      }
      // dealColumns(index, buyorsale) {
      //   for (let key of this.columns[index]) {
      //     if (key.isActive) {
      //       key.isActive = false
      //     }
      //   }
      //   let index1 = this.columns[index].findIndex(item => {
      //     return item.value === buyorsale
      //   })
      //   this.columns[index][index1].isActive = true
      // }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style scoped>

</style>
