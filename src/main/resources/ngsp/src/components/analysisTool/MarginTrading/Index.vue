<template>
  <div class="index">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="会员查询" name="MemberInquiry">
        <keep-alive>
          <member-inquiry v-if="activeName==='MemberInquiry'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="标的券交易查询" name="StandardTicket">
        <keep-alive>
          <standard-ticket v-if="activeName==='StandardTicket'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="信用账户查询" name="CreditAccount">
        <keep-alive>
          <credit-account v-if="activeName==='CreditAccount'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="融资余额查询" name="Financing">
        <keep-alive>
          <financing v-if="activeName==='Financing'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="融券余量查询" name="Securities">
        <keep-alive>
          <securities v-if="activeName==='Securities'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="账户融资融券超比例查询" name="AccountFinancingSecurities">
        <keep-alive>
          <account-financing-securities v-if="activeName==='AccountFinancingSecurities'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="交易过量查询" name="OverTrading">
        <keep-alive>
          <over-trading v-if="activeName==='OverTrading'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="信用账户关联关系查询" name="CreditAccountRelationship">
        <keep-alive>
          <credit-account-relationship v-if="activeName==='CreditAccountRelationship'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="融资融券盘前数据处理" name="securitiesMarginTrading">
        <keep-alive>
          <before-data-handing v-if="activeName==='securitiesMarginTrading'"/>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'),        // 面包屑组件
      MemberInquiry: () => import('./MemberInquiry/Index'),
      StandardTicket: () => import('./StandardTicket/Index'),
      CreditAccount: () => import('./CreditAccount/Index'),
      Financing: () => import('./Financing/Index'),
      Securities: () => import('./Securities/Index'),
      AccountFinancingSecurities: () => import('./AccountFinancingSecurities/Index'),
      OverTrading: () => import('./OverTrading/Index'),
      CreditAccountRelationship: () => import('./CreditAccountRelationship/Index'),
      BeforeDataHanding: () => import('./securitiesMarginTrading/beforeDataHanding')
    },
    mixins: [],
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '常规查询'
          }, {
            router: '',
            label: '融资融券交易'
          }
        ],
        activeName: 'MemberInquiry' // tab栏默认项
      }
    },
    computed: {},
    watch: {},
    methods: {
      handleTabsClick () {
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
