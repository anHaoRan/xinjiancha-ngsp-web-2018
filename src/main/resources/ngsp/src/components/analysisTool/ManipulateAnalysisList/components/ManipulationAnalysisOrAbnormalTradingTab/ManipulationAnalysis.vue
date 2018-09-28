<template>
  <div>
    <el-table
      id="oncontextmenu"
      border
      ref="accountSummary"
      :data="optResultList"
      @selection-change="handleSelectionChange"
      style="width: 100%; overflow:visible">
      <el-table-column
        type="selection"
        align="center"
      />
      <s-table-columns v-for="(item,index) in columns"
                       :key="index"
                       :item="item"
                       v-if="item.isActive===undefined||item.isActive"/>
    </el-table>
    <!-- <div id="replaceOncontextmenu">
      <div @click="fnOverlay">叠加至行情图</div>
    </div> -->
    <!--<el-row :gutter="20">
      <el-col :span="12">
        <marking/>
      </el-col>-->
      <!--<el-col :span="6">-->
      <!--<association-type/>-->
      <!--</el-col>-->
      <!--<el-col :span="12">
        <sales-department-account :branchAcctsList="branchAcctsList"/>
      </el-col>-->
      <!--<el-col :span="6">-->
      <!--<historical-report/>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  //  添加标记
  import AddMark from './Templates/AddMark'
  //  复核人意见
  import reanalFlag from './Templates/reanalFlag' 
  //  原因
  import Reason from './Templates/Reason'
  //  复核原因
  import reanalReason from './Templates/reanalReason'
  //  关联类型
  import Association from './Templates/Association'
  //  关联小类
  import Associated from './Templates/Associated'

  export default {
    name: 'manipulation-analysis',
    props: {
      optResultList: {
        type: Array,
        default () {
          return []
        }
      },
      branchAcctsList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),  // 表格列
      Marking: () => import('./ManipulationComponents/Marking'),  //  标记统计
      AssociationType: () => import('./ManipulationComponents/AssociationType'),  //  关联类型统计
      SalesDepartmentAccount: () => import('./ManipulationComponents/SalesDepartmentAccount'),  //  营业部账户统计
      HistoricalReport: () => import('./ManipulationComponents/HistoricalReport')  //  历史上报统计
    },
    mixins: [],
    data () {
      return {
        columns: [
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
            label: '营业部'
          }, {
            field: 'acct_type',
            align: 'center',
            label: '添加标记',
            width: '60',
            template: AddMark
          }, {
              field: "acct_remark",
              align: 'left',
              label: "原因",
              width: '100',
              template: Reason
            }, {
              field: "relate_type",
              align: 'left',
              label: "关联类型",
              width: '120',
              template: Association
            }, {
            //   field: "relation_smallType",
            //   align: 'left',
            //   label: "关联小类",
            //   width: '100',
            //   template: Associated
            // }, {
            field: 'trdamt',
            align: 'right',
            label: '目标证券成交金额(元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'per_trade',
            align: 'right',
            label: '目标证券成交占比(%)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'yl',
            align: 'right',
            label: '账面盈利(元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
          //   field: 'unusual_trade',
          //   align: 'left',
          //   label: '异常行为统计'
          //   }, {
          //     field: "history_report",
          //     align: 'right',
          //     label: "历史上报统计"
          // }, {
            field: 'reanal_flag',
            align: 'left',
            label: '复核人意见',
            width: '100',
            template: reanalFlag
            }, {
              field: "reanal_rmk",
              align: 'left',
              label: "复核原因",
              width: '100',
              template: reanalReason
          }
        ],
        columns2: [
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
            label: '营业部'
          }, {
            field: 'acct_type',
            align: 'center',
            label: '添加标记',
            width: '60',
            template: AddMark
          }, {
              field: "acct_remark",
              align: 'left',
              label: "原因",
              width: '100',
              template: Reason
            }, {
              field: "relate_type",
              align: 'left',
              label: "关联类型",
              width: '120',
              template: Association
            }, {
            field: 'trdamt',
            align: 'right',
            label: '目标证券成交金额(元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'per_trade',
            align: 'right',
            label: '目标证券成交占比(%)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'yl',
            align: 'right',
            label: '账面盈利(元)',
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        multipleSelection: []
      }
    },
    computed: {},
    watch: {     

    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // fnOverlay () {
      //   if (this.multipleSelection.length > 0) {
      //     this.$store.commit('setCheckAccount', this.multipleSelection.map(item => {
      //       return item.acct_id
      //     }))
      //     document.getElementById('replaceOncontextmenu').style.display = 'none'
      //     return
      //   }
      //   this.$message.error('请选择叠加账户')
      // }
    },
    created () {
    },
    mounted () {
      // document.getElementById('oncontextmenu').oncontextmenu = function (ev) {
      //   let oEvent = ev || event
      //   let menu = document.getElementById('replaceOncontextmenu')
      //   menu.style.left = oEvent.clientX + 'px'
      //   menu.style.top = oEvent.clientY + 'px'
      //   menu.style.display = 'block'
      //   return false
      // }
      // document.getElementById('oncontextmenu').onclick = function (ev) {
      //   let oEvent = ev || event
      //   let menu = document.getElementById('replaceOncontextmenu')
      //   menu.style.display = 'none'
      // }
      // 分析中状态没有复核人意见和原因
      if(JSON.parse(this.$route.params.params).task_status == 'x1' || JSON.parse(this.$route.params.params).task_status == 'x3'){
        this.columns = this.columns2
      }
      this.$emit('columns',this.columns)

    
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>

</style>
