<template>
  <div class='history-msg-common-table'>
    <s-table
      :headerTitle="tableTitle"
      :columns="columnOption"
      :data="tableData"
      :isPageination="false"
      :showOrHideLoading="showOrHideLoading"
      :height="tableHeight">
      <el-table-column
        slot="tableColumnsUnshift"
        type="index"
        width="50"
        label="序号">
      </el-table-column>
    </s-table>
  </div>
</template>

<script>
  import STable from '../../base/STable'
  import GoRetrieveInfoForm from './retrieveInfoTableLinkTemplate'

  export default {
    name: 'history-msg-common-table',
    props: {
      tableData: {
        type: Object,
        default () {
          return {data: [], total: 0, pageRows: 10, pageIndex: 1}
        }
      },
      infoId: {
        type: String,
        default () {
          return ''
        }
      },
      tableHeight: {
        type: Number,
        default () {
          return 200
        }
      }
    },
    components: {
      STable,
      GoRetrieveInfoForm
    },
    mixin: [],
    data () {
      return {
        tableTitle: '调取资料历史信息',
        columnOption: [
          {field: 'invesNo', label: '处理单编号', template: GoRetrieveInfoForm},
          {field: 'accountCode', label: '账户代码'},
          {field: 'abnormalBehav', label: '异常行为'},
          {field: 'accountName', label: '账户名称'},
          {field: 'salepart', label: '营业部名称'},
          {field: 'investigation', label: '调查事项'},
          {field: 'securityId', label: '证券代码'},
          {field: 'obtainType', label: '调取类型'},
          {field: 'oneword', label: '一码通'},
          {field: 'createDate', label: '创建日期'}
        ],
        showOrHideLoading: true
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {},
    mounted () {},
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
  .history-msg-common-table {

  }
</style>
