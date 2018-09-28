<template>
  <margin-table
    class="self-table-css"
    v-loading="loading"
    :columns="columns"
    :height="200"
    :isPageination="false"
    :data="{
        data: tableData
      }"
    :otherProps="{
      disabled: disabled
    }"
    @handlerChange="searchAccount"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      slot="tableColumnsUnshift"
      type="selection"
      align="center"
      width="50"
    ></el-table-column>
  </margin-table>
</template>
<script>
  import MarginTable from '@/components/base/MarginTable'
  import InputEnterComponent from './InputEnterComponent'
  export default {
    components: {MarginTable},
    data() {
      return {
        assortmentOptions: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        middlePushCanOptions: [{
          value: '可以',
          label: '可以'
        }, {
          value: '不可',
          label: '不可'
        }]
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default() {
          return [{
            // field: 'accountCode', label: '账户代码', template: InputEnterComponent
            field: 'accountCode', label: '账户代码'
          },{
            field: 'accountName', label: '账户名称'
          },{
            field: 'member', label: '会员名称'
          },{
            field: 'salepart', label: '营业部名称'
          },{
            field: 'oneword', label: '一码通'
          },{
            field: 'assortment', label: '产品账户'
          },{
            field: 'middlePushCan', label: '是否可推送中间库'
          },{
            field: 'contactP1', label: '联系人'
          },{
            field: 'contactNo1', label: '联系方式'
          }]
        }
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
      },
      searchAccount(row) {
        if (!row.accountCode) {
          this.$message.error('请输入证券账户！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(row.accountCode)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.tableData.filter(v => {
          return v.accountCode === row.accountCode && v.oneword
        }).length
        if (isHas) {
          this.$message.error('输入证券账户重复！')
          row.accountCode = ''
        } else {
          this.$emit('updateAccountInfoByAccounts', [row.accountCode], 1)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .self-table-css {
    /deep/.el-loading-mask {
      background: rgba(0,0,0,0.3) !important;
    }
  }
</style>