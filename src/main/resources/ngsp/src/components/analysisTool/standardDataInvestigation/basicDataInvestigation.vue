<template>
  <div class="basicDataBox">
    <el-radio-group size="medium" v-model="activeType">
      <el-radio-button v-for="(item, index) in btnList" :key="index" :label="item"></el-radio-button>
    </el-radio-group>
    <!--交易类-->
    <deal-type v-if="activeType === '交易类'"></deal-type>
    <!--行情类-->
    <market-type v-if="activeType === '行情类'"></market-type>
    <!--登记结算类-->
    <registration-type v-if="activeType === '登记结算类'"></registration-type>
    <!--盈利类-->
    <profit-type v-if="activeType === '盈利类'"></profit-type>

  </div>
</template>

<script>
  import dealType from './basicDataInvestigation/dealType'
  import marketType from './basicDataInvestigation/marketType'
  import profitType from './basicDataInvestigation/profitType'
  import registrationType from './basicDataInvestigation/registrationType'

  export default {
    name: 'basic-data-investigation',
    components: {
      dealType,
      marketType,
      profitType,
      registrationType
    },
    data() {
      return {
        btnList: ['交易类', '行情类', '登记结算类', '盈利类'],
        activeType: '交易类'
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<style scoped lang="less">
  .basicDataBox {
    padding: 10px 20px;
    .el-radio-group {
      margin-bottom: 10px;
      .el-radio-button {
        margin-right: 10px;
      }
    }

  }
</style>
