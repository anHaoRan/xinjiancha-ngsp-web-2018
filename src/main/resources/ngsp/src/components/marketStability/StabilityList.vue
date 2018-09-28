<!--维稳 -->
<template>
  <div class="stability-list">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--tep-->
    <div>
      <el-tabs v-model="activeName" @tab-click="test">
        <el-tab-pane label="账户" name="AccountList">
          <account-list :activeName="activeName"
                        v-if="activeName=='AccountList'"></account-list>
        </el-tab-pane>
        <el-tab-pane label="机构" name="InstitutionsList">
          <institutions-list :activeName="activeName"
                             v-if="activeName=='InstitutionsList'"></institutions-list>
        </el-tab-pane>
        <!--<el-tab-pane label="证券" name="SecuritiesList">-->
        <!--<securities-list :activeName="activeName" :selectDate="selectDate"-->
        <!--v-if="activeName=='SecuritiesList'"></securities-list>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>
<script>
  // 面包屑组件引入
  import breadcrumb from '@/components/common/Breadcrumb'
  // 账户
  import AccountList from './stabilitylistcomponents/AccountList'
  // 机构
  import InstitutionsList from './stabilitylistcomponents/InstitutionsList'
  // 证券
  import SecuritiesList from './stabilitylistcomponents/SecuritiesList'

  export default {
    // 组件注册
    components: {
      breadcrumb,        // 面包屑组件
      AccountList,   // 账户
      InstitutionsList,   // 机构
      SecuritiesList  // 证券
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '/stabilityList',
            label: '市场运行监测'
          }, {
            router: '/stabilityList',
            label: '市场维稳监控'
          }
        ],
        // v-model
        activeName: 'AccountList',
        selectDate: ''
      }
    },
    methods: {
      // 三个数据列表  tab切换事件
      test () {
      }
    },
    created () {
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      if (this.getUrlParam(this.$route.fullPath).activeName) {
        this.activeName = this.getUrlParam(this.$route.fullPath).activeName
      }
    }
  }
</script>
<style lang="less">
</style>
