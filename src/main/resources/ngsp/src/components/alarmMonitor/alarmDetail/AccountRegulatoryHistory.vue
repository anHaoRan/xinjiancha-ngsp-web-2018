<!--账户监管历史 -->
<template>
  <div class="basicinformation">
    <!--tep-->
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户监管历史</span>
      </div>
      <el-form style="margin-top: 10px;" label-width="120px"
               label-position="top">
        <el-form-item label="账户信息展示:">
          <el-table
            border
            ref="accountInfo"
            :data="accountInfo"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="invacctno" label="账户代码" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="invacctname" label="账户名称" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="ymtid" label="一码通代码" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="branchname" label="交易营业部" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="investor_style_tag" label="投资风格标签" min-width="10%"
                             align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="转出历史:">
          <el-table
            border
            ref="outLog"
            :data="outLog"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="createDate" label="日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="accountCode" label="账户代码" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="accountName" label="账户名称" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="sveType" label="监管原因" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="sveMeasures" label="采取措施" min-width="10%" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="历史上报情况:">
          <el-table
            border
            ref="logReport"
            :data="logReport"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="report_date" label="日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="report_id" label="上报函号" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="report_reason" label="上报原因" min-width="30%" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="监控情况:">
          <el-table
            border
            ref="monitorTheSituation"
            :data="monitorTheSituation"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="account_id" label="账户代码" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="watch_start_date" label="起始日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="watch_end_date" label="结束日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="watch_reason" label="监控原因" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="involved_ctock" label="涉及股票" min-width="10%" align="center"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    //  接收父组件数据
    props: {
      accountInfo: {
        type: Array,
        default: function () {
          return []
        }
      },
      outLog: {
        type: Array,
        default: function () {
          return []
        }
      },
      logReport: {
        type: Array,
        default: function () {
          return []
        }
      },
      monitorTheSituation: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    // 组件注册
    components: {},
    data () {
      return {
        // v-model
      }
    },
    methods: {},
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {

    }
  }
</script>
<style lang="less">
</style>
