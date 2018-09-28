<!--证券监管历史 -->
<template>
  <div class="securitiesregulatoryhistory">
    <!--tep-->
    <el-card>
      <div slot="header" class="clearfix">
        <span>证券监管历史</span>
      </div>
      <el-form style="margin-top: 10px;" label-width="120px"
               label-position="top">
        <el-form-item label="风险指数:">
          <el-row>
            <el-col :span="6">
              炒作风险指数 &nbsp; &nbsp; &nbsp;{{securitiesRisk.hype_riskindex}}
            </el-col>
            <el-col :span="6">
              内幕风险指数&nbsp; &nbsp; &nbsp;{{securitiesRisk.inside_riskindex}}
            </el-col>
            <el-col :span="6">
              操纵风险指数&nbsp; &nbsp; &nbsp;{{securitiesRisk.operon_riskindex}}
            </el-col>
            <el-col :span="6">
              大宗交易及减持风险指数&nbsp; &nbsp; &nbsp;{{securitiesRisk.blored_riskindex}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="重点监控证券情况:">
          <el-table
            border
            ref="securitiesMonitoring"
            :data="securitiesMonitoring"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="product_id," label="监控编号" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="watch_start_date," label="起始日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="watch_end_date," label="结束日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="monitor_reason," label="监控原因" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="monitor_level  " label="监控级别" min-width="10%" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="历史日志:">
          <el-table
            border
            ref="securitiesLog"
            :data="securitiesLog"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="alarm_id" label="预警编号" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="alarm_date" label="预警日期" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="alarm_time" label="预警时间" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="alarm_rule_name" label="预警规则名" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="account_id" label="涉及账户" min-width="10%" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="舆情公告:">
          <el-table
            border
            ref="securitiesAnnouncement"
            :data="securitiesAnnouncement"
            max-height="240"
            tooltip-effect="dark"
            style="width: 100%; overflow:visible">
            <el-table-column prop="popufeel_id" label="编号" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="popufeel_title" label="标题" min-width="30%" align="center"></el-table-column>
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
      securitiesMonitoring: {
        type: Array,
        default: function () {
          return []
        }
      },
      securitiesLog: {
        type: Array,
        default: function () {
          return []
        }
      },
      securitiesAnnouncement: {
        type: Array,
        default: function () {
          return []
        }
      },
      securitiesRisk: {
        type: Object,
        default: function () {
          return {}
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
