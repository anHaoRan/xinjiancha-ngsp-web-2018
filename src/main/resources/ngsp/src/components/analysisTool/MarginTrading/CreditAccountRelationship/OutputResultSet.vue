<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="信用账户关联关系查询" :columns="columns[1]" :data="totalData[1]"
             @getPageination="getPageination" v-show="isShow">
      <el-dropdown @command="handleDownload" slot="elCardHeader">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exl">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>
    <s-table ref="marginTable2" headerTitle="信用账户关联关系查询" :columns="columns[2]" :data="totalData[2]"
             @getPageination="getPageination2" v-show="!isShow">
      <el-dropdown @command="handleDownload2" slot="elCardHeader">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exl">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>
  </div>
</template>

<script>
  import { accountRelation } from '@/service/analysisTool/MarginTrading/Index'
  import ExportMixin from '../ExportMixin'

  export default {
    name: 'output-result-set',
    props: {},
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixins: [ExportMixin],
    data () {
      return {
        columns: {
          1: [
            {field: 'recmi', align: 'left', label: '券商代码', sortable: true},
            {field: 'recmn', align: 'left', label: '券商名称', sortable: true},
            {
              field: 'a_counts',
              align: 'right',
              label: 'A账户数',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'a_counts')
            },
            {
              field: 'b_counts',
              align: 'right',
              label: 'B账户数',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_counts')
            },
            {
              field: 'd_counts',
              align: 'right',
              label: 'D账户数',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'd_counts')
            },
            {
              field: 'e_account',
              align: 'right',
              label: 'E账户数',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'e_account')
            }
          ],
          2: [
            {field: 'aid', align: 'left', label: '普通账户', sortable: true},
            {field: 'crrt_acct_id', align: 'left', label: '信用账户', sortable: true},
            {field: 'investor_account_name', align: 'left', label: '账户名称', sortable: true},
            {field: 'member_name', align: 'left', label: '券商名称', sortable: true},
            {field: 'startdate', align: 'left', label: '开始日期', sortable: true},
            {field: 'enddate', align: 'left', label: '结束日期', sortable: true}
          ]
        },
        isShow: true,
        totalData: {
          1: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          },
          2: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
        },
        selectParams: {},
        exportSelectParams: {}
      }
    },
    computed: {},
    watch: {
      selectParams: {
        handler () {
          this.totalData = {
            1: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            },
            2: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            }
          }
          this.ajaxAccountRelation()
        },
        deep: true
      }
    },
    methods: {
      ajaxAccountRelation () {
        let {memberId, accountId, isHistory, selectTradeDate} = this.selectParams,
          params = {
            openDate: selectTradeDate,
            memberId: memberId.join(','),
            accountId: accountId,
            isHistory: isHistory ? '1' : '2'
          }
        if (!params.openDate && !params.accountId && !params.memberId) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        params.pageIndex = this.totalData[this.isShow ? 1 : 2].pageIndex
        params.pageRows = this.totalData[this.isShow ? 1 : 2].pageRows
        this.showOrHideLoading(true)
        accountRelation(params).then(res => {
          this.showOrHideLoading(false)
          let {bizData: {metaData, totalRows}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: totalRows,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            if (this.isShow) {
              this.totalData[1] = data
            } else {
              this.totalData[2] = data
            }
          }
        })
      },
      showOrHideLoading (flag) {
        if (this.isShow)
          this.$refs.marginTable.showOrHideLoading(flag)
        else
          this.$refs.marginTable2.showOrHideLoading(flag)
      },
      getPageination (pageinationVal) {
        this.totalData[1].pageRows = pageinationVal.pageSizeNumber
        this.totalData[1].pageIndex = pageinationVal.currentPage
        this.ajaxAccountRelation()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxAccountRelation()
      },
      handleDownload (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'accountRelation'
        params.tableColumns = [
          {
            sheetName: '融资融券-信用账户关联关系查询',
            fileColumns: this.columns[1]
          }
        ]
        this.createElementA(params)
      },
      handleDownload2 (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'accountRelation'
        params.tableColumns = [
          {
            sheetName: '融资融券-信用账户关联关系查询',
            fileColumns: this.columns[2]
          }
        ]
        this.createElementA(params)
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
