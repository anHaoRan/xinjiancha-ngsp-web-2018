
<!--账户代码模糊搜索和懒加载组件-->
<template>
  <div class="accountCode">
    <el-col :span="6" style="width:150px;font-size:15px;">请输入账户代码</el-col>
    <el-col :span="10">
      <el-select
        ref="selectRef"
        style="display:inline-block"
        class="el-select-width"
        :clearable="true"
        v-model="accountCode"
        filterable
        remote
        reserve-keyword
        default-first-option
        placeholder="请输入账户代码"
        :remote-method="remoteMethod"
        :loading="loading"
        size="small"
        v-selectLoadMore="handleLoadSelectMore"
        @keyup.enter.native="addNewInvestor"
        @change="handleSelect">
        <el-option
          v-for="item in accountCodeOptions"
          :key="item.investor_account_id"
          :label="`${item.investor_account_name}${item.investor_account_id}`"
          :value="item.investor_account_id">
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  quzzySearchAllAccounts,
  getConnectinvestoraccounts,
  createInvestors
} from '@/service/systemManage/securityPlateSet'

export default {
  name: 'AccountCodeQuery',
  props: {
    hasEnterEvent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageIndex: 1, // 当前页
      pageRows: 20, // 每页显示数量
      loading: false,
      accountCode: '',
      accountCodeOptions: [],
      searchedTags: [],
      currentSelectOrgflg: ''
    }
  },
  computed: {
    ...mapGetters(['getcurrentOrgCode'])
  },
  watch: {
    accountCode(newValue) {
      this.$emit('updateAccountCode', newValue)
    }
  },
  methods: {
    // select控件懒加载事件
    handleLoadSelectMore() {
      // 否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
      this.pageIndex += 1
      this.getOptions(this.accountCode)
    },
    getOptions(query) {
      this.loading = true;
      let params = {
        investorid: query,
        pageRows: this.pageRows,
        pageIndex: this.pageIndex
      }
      setTimeout(() => {
        quzzySearchAllAccounts(params).then((resp) => {
          this.loading = false;
          this.accountCodeOptions = resp.buzidata
        })
      }, 200)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.getOptions(query)
      } else {
        this.accountCodeOptions = [];
      }
    },
    handleSelect (item) {
      let orgCode = this.getcurrentOrgCode
      if (!orgCode) {
        this.$message.error('请先选择一个投资者')
        return
      }
      let filterItem = this.accountCodeOptions.filter(v => {
        return v.investor_account_id === item
      })
      this.currentSelectOrgflg = filterItem[0]['accttype']
      let params = {
        pageIndex: 1,
        pageRows: 10,
        orgcode: orgCode,
        investorid: item
      }
      this.$emit('fazzySearchSelectItem', filterItem)
      if (this.hasEnterEvent) {
        getConnectinvestoraccounts(params).then(resp => {
          if (resp) {
            const {buzidata} = resp
            this.searchedTags = buzidata
            this.$emit('updateSelectTags', buzidata)
          }
        })
      }
    },
    addNewInvestor() {
      if (!this.hasEnterEvent) {
        return
      }
      this.$refs['selectRef'].blur()
      if (this.accountCode && this.searchedTags.length === 0) {
        let params = [{
          orgcode: this.getcurrentOrgCode,
          orgflg: this.currentSelectOrgflg,
          investorid: this.accountCode
        }]
        createInvestors(JSON.stringify(params)).then(resp => {
          if (resp) {
            this.$message.success('新增账号成功')
            this.accountCode = ''
            this.$emit('ajaxTagList')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .accountCode {
    .el-col {
      /deep/ .el-select {
        /deep/ .el-input {
          width: 100%;
        }
      }
    }

  }
</style>
