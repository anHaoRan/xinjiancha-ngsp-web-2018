<!--账户组设置- 跳转页面-->
<template>
  <div class="accountGroupCode">
    <el-card class="el-caed-table" style="padding-top:20px">
      <fazzy-search-select-component
        ref="fazzySearchSelectRef"
        @updateList="reqAccountInfoList"
        :hasAddAccountsProps="tableData"
        :currentSelectedItemProps="currentSelectedItem"
        :propsName="`账户`"
        :propsCode="`accountCode`"
        :propsLabel="`accountPeople`"
        :hasButtonGroupProps="true"
        :showLabel="true"
        @getOptions="getSelectOptions"
      ></fazzy-search-select-component>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>查询结果</span>
        <el-button type="info" size="small" @click="goBack">返回</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table
            border
            ref="tableRef"
            :data="tableData"
            show-overflow-tooltip
            v-loading="loading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            style="width:100%;">
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <el-radio
                  class="radio" v-model="checked"
                  :label="scope.row.account_id"
                  @change="handleCheckedChange">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="investor_account_name"
              sortable
              label="账户名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="account_id"
              sortable
              label="账户代码">
            </el-table-column>
          </el-table>
          <el-row>
            <pageination
              @getPageination="getPageination"
              :pageTotal="totalNum"></pageination>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import {
    postCreateAccountGroupCode, // 账户组--搜索账户组下的账户
    getAccountInfosBycode // 根据输入的code进行搜索账户信息
  } from '@/service/systemManage/securityPlateSet'
  import FazzySearchSelectComponent from './accountGroup/FazzySearchSelectComponent'
  import pageination from '@/components/common/pageination'

  export default {
    name: 'accountGroupCode',
    components: {
      FazzySearchSelectComponent,
      pageination
    },
    data () {
      return {
        checked: '',
        tableData: [],
        loading: false,
        currentSelectedItem: {},
        totalNum: 0,
        pageination: {
          currentPage: 1,
          pageSizeNumber: 10
        }
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      getSelectOptions (query) {
        this.$refs['fazzySearchSelectRef'].loading = true
        let params = {
          accountCode: query
        }
        setTimeout(() => {
          getAccountInfosBycode(params).then((resp) => {
            this.$refs['fazzySearchSelectRef'].loading = false
            if (resp) {
              const {bizData} = resp
              this.$refs['fazzySearchSelectRef'].accountInfoOptions = bizData.metaData
            }
          })
        }, 200)
      },
      handleCheckedChange (val) {
        this.checked = val
        let filterItem = this.tableData.filter(v => {
          return v.account_id === val
        })
        this.currentSelectedItem = filterItem[0]
      },
      getPageination (pageination) {
        this.pageination = pageination
        this.reqAccountInfoList()
      },
      // 列表数据
      reqAccountInfoList () {
        this.loading = true
        let params = {
          'groupID': this.$route.query.groupID,
          'pageIndex': this.pageination.currentPage || 1,
          'pageRows': this.pageination.pageSizeNumber || 10
        }
        postCreateAccountGroupCode(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            this.tableData = resp.buzidata
            this.totalNum = resp.totalNum
          }
        })
      }
    },
    mounted () {
      this.reqAccountInfoList()
    }
  }
</script>
<style lang="less" scoped>
  .accountGroupCode {
    /deep/ .el-radio__label {
      display: none !important;
    }
  }
</style>
