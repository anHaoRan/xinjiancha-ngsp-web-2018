<!--实时预警列表 -->
<template>
  <div class="operationMonitorWarn">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <monitor-warn-table></monitor-warn-table>
  </div>
</template>
<script>
  import breadcrumb from '../common/Breadcrumb';
  import MonitorWarnTable from './operationMonitorWarn/monitorWarnTable';
  export default {
    components: {
      breadcrumb,
      MonitorWarnTable
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/operationMonitorWarn',
            label: '运行监测预警'
          }
        ],
        TdateTimerFun: null,
        getStockCode: ''
      }
    },
    methods: {
    },
    mounted() {
      if (window.location.href.indexOf('activeName') != -1) {
        this.activeName = window.location.href.toString().split('?')[1].split('&')[1].split('=')[1];
      }
    }
  }
</script>
<style lang="less">
  .operationMonitorWarn {
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
        height: 30px;
        border-radius: 4px;
        border: solid 1px #455579;
      }
    }
    .el-dialog {
      width: 700px;
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
