<template>
  <el-card class="el-card-table">
    <div slot="header" class="clearfix">
      <span>账户组盈利统计表</span>
      <div class="el-upload-list__item-name" style="display: initial;font-size: 14px">单位/万元</div>
      <el-dropdown @command="handleDownload">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="excel">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <!--<el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      border
      max-height="400"
      ref="accountSummary"
      :data="acctsProfit"
      style="width: 100%; overflow:visible">
      <s-table-columns v-for="(item,index) in columns"
                       :key="index"
                       :item="item"
                       v-if="item.isActive===undefined||item.isActive"/>
    </el-table>
  </el-card>
</template>

<script>
  import { acctsprofitExport } from '@/service/analysisTool/ManipulateAnalysisList/index'
  import Mixin from './Mixin'

  export default {
    name: 'profit-statistics',
    props: {
      acctsProfit: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      STableColumns: () => import('@/components/base/STableColumns')  //  表格列
    },
    mixins: [Mixin],
    data () {
      return {
        columns: [
          {
            field: 'accts_bl',
            align: 'right',
            label: '确定账户组盈余(万元)'
            // formatter: this.gfnElColFormatDecThou
          }, {
            field: 'accts_dr',
            align: 'right',
            label: '导入账户组(万元)'
            // formatter: this.gfnElColFormatDecThou
          }, {
            field: 'accts_wl',
            align: 'right',
            label: '最大物理关联组(万元)'
            // formatter: this.gfnElColFormatDecThou
          }, {
          //   field: 'trade',
          //   align: 'right',
          //   label: '交易关联组'
          //   // formatter: this.gfnElColFormatDecThou
          // }, {
            field: 'accts_dd',
            align: 'right',
            label: '不确定账户组(万元)'
            // formatter: this.gfnElColFormatDecThou
          }
        ]
      }
    },
    computed: {},
    watch: {},
    methods: {
      handleDownload (val) {
        // let {reservedAcctIds, delAcctIds} = this.dealWithReservedAcctIds(),
        //   params = {
        //     reservedAcctIds: reservedAcctIds,
        //     delAcctIds: delAcctIds
        //   }
        // this.createElementA(acctsprofitExport(), val, this.columns, params)
        // console.log('val:',val,'---this.columns:',this.columns,'---params:',params)

        this.$message.info('正在导出账户组盈利统计表，请稍等~')
        let downloadParams = {
          fileType: 'xlsx',
          tableColumns: [
            {
              'sheetName': '账户组盈利统计表',
              'fileColumns': this.columns
            }
          ],
          acctsProfit: this.acctsProfit
        }
        this.gfnExportFileWithForm('/specialqry/operate/v1/analysis-groupacct-export',downloadParams)
        
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

<style scoped>

</style>
