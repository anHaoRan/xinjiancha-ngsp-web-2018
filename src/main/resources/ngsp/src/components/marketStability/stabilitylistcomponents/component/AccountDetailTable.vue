<template>
  <div class="accountDetailTable">
    <div class="title">账户成交统计表</div>
    <el-table
      :data="tableData"
      :show-header="false"
      style="width: 100%;">
      <el-table-column
        v-for="column in tableColumns"
        :key="column.field"
        :align="column.align"
        :prop="column.field"
        :label="column.label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'account-detail-table',
    data () {
      return {
        tableColumns: [
          {label: '名称', field: 'name', align: 'center', minWidth: '5%'},
          {label: '数值', field: 'value', align: 'center', minWidth: '5%'}
        ],
        tableData: [
          {name: '一分钟最大卖出金额', value: '3000万'},
          {name: '期间一分钟最大卖出金额', value: '300万'},
          {name: '期间净卖出金额', value: '5000万'},
          {name: '全天净卖出金额', value: '6000万'},
          {name: '是否程序化特征账户', value: '程序化'},
          {name: '是否存在打压行为', value: '是'}
        ]
      }
    }
  }
</script>

<style lang="less">
  .accountDetailTable {
    .title {
      font-size: 20px;
      color: #fff;
      padding: 15px;
    }
  }
</style>
