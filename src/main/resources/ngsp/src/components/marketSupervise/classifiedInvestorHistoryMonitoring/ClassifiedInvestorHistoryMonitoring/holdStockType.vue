<template>
  <el-card class="el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分类投资者各会员持有市值" name="memberHold">
        <inverstor-member-hold-value></inverstor-member-hold-value>
      </el-tab-pane>
      <el-tab-pane label="分类投资者持有证券分类" name="stockType">
        <inverstor-hold-stock-type></inverstor-hold-stock-type>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<script>
  import InverstorHoldStockType from './holdStockType/inverstorHoldStockType'
  import InverstorMemberHoldValue from './holdStockType/inverstorMemberHoldValue'

  export default {
    components: {
      InverstorHoldStockType,
      InverstorMemberHoldValue
    },
    data () {
      return {
        activeName: 'memberHold'
      }
    },
    mounted () {
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

<style lang="less">

</style>
