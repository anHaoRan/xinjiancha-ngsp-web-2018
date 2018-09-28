<template>
  <div class="highQuery">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <overlay-chart></overlay-chart>
    <drilling-table></drilling-table>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import overlayChart from './highQuery/overlayChart'
  import drillingTable from './highQuery/drillingTable'

  export default {
    components: {
      Breadcrumb,
      overlayChart,
      drillingTable
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '',
          label: '高级查询'
        }]
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="less">
  .highQuery {
    position: relative;
    .el-card {
      margin-top: 20px;
    }
  }
</style>
