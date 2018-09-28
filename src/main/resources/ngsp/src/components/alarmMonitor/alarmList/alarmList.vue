<!--实时预警列表 -->
<template>
  <div class="alarmlist">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--tep-->
    <el-card>
      <el-tabs v-model="activeName" @tab-click="test">
        <el-tab-pane label="实时预警信息列表" name="TdateAlarmlist">
          <tdate-alarmlist :activeName="activeName"></tdate-alarmlist>
        </el-tab-pane>
        <el-tab-pane label="盘中停牌公告列表" name="SuspensionBuletinList">
          <suspension-list></suspension-list>
        </el-tab-pane>
        <el-tab-pane label="历史预警信息列表" name="HistoryAlarmlist">
          <history-alarmlist></history-alarmlist>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  // 面包屑组件引入
  import breadcrumb from '../../common/Breadcrumb'
  // 实时预警信息列表页面组件引入
  import TdateAlarmlist from '../../alarmMonitor/alarmList/alarmlistcomponents/TdateAlarmlist'
  // 盘中停牌公告列表页面组件引入
  import SuspensionList from '../../alarmMonitor/alarmList/alarmlistcomponents/SuspensionBuletinList'
  // 历史预警信息列表页面组件引入
  import HistoryAlarmlist from '../../alarmMonitor/alarmList/alarmlistcomponents/HistoryAlarmlist'

  export default {
    // 组件注册
    components: {
      breadcrumb, // 面包屑组件
      TdateAlarmlist, // 实时预警信息列表组件
      SuspensionList, // 盘中停牌公告列表组件
      HistoryAlarmlist // 历史预警信息列表组件
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '/alarmList',
            label: '预警管理'
          }, {
            router: '/alarmList',
            label: '实时预警列表'
          }
        ],
        // v-model
        activeName: 'TdateAlarmlist',
        TdateTimerFun: null,
        getStockCode: ''
      }
    },
    methods: {
      // 三个数据列表  tab切换事件
      test () {
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      console.log(this.$route.fullPath)
      if (this.getUrlParam(this.$route.fullPath).activeName) {
        this.activeName = this.getUrlParam(this.$route.fullPath).activeName
        console.log(this.activeName)
      }
    }
  }
</script>
<style lang="less">
  .alarmlist {
    .required {
      color: #f00;
    }
    .toptab {
      position: absolute;
      top: 80px;
      right: 65px;
    }
    .name {
      line-height: 36px;
    }
    /*.el-input:hover{*/
    /*border: 1px solid #1b5eed;*/
    /*}*/
    .alert {
      font-size: 10px;
      color: #f00;
    }
    .el-row {
      margin-top: 20px;
    }
    .reloadContainer {
      width: 200px;
      height: 40px;
      text-align: center;
      .el-input__inner {
        width: 80px;
        height: 30px;
        border-radius: 4px;
        border: solid 1px #455579;
      }
    }
    .el-dialog {
      width: 460px;
      background-color: #1b2b4e;
      .el-dialog__header {
        padding: 0px;
        height: 55px;
        background-color: rgba(0, 0, 0, 0.05);
        line-height: 55px;
        .el-dialog__title {
          font-size: 16px;
          color: #fff;
          margin-left: 20px;
        }

      }
      .el-dialog__body {
        font-size: 14px;
        color: #7b8fb9;
      }

      .el-button {
        color: #fff;
      }
    }
    .el-radio {
      color: #7b8fb9;
    }
    .el-radio .el-radio__inner {
      border: 1px solid #455579;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border: 1px solid #1b5eed;
    }
    .el-radio__input.is-checked .el-radio__inner::after {
      background-color: #1b5eed;
    }

    .el-range-input {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.8);
    }

    .tableStyle {
      width: 100%;
      max-height: 800px;
      overflow: auto;
    }

  }
</style>
