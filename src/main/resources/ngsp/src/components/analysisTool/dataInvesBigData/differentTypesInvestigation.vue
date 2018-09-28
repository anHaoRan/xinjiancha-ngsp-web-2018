<template>
  <div class="basicDataBox">
    <el-radio-group size="medium" v-model="activeType">
      <el-radio-button v-for="(item, index) in btnList" :key="index" :label="item"></el-radio-button>
    </el-radio-group>
    <!--利用未公开信息交易-->
    <undisclosed-deal v-if="activeType === '利用未公开信息交易'"></undisclosed-deal>
    <!--内幕交易-->
    <insider-deal v-if="activeType === '内幕交易'"></insider-deal>
    <!--操纵市场-->
    <rig-market v-if="activeType === '操纵市场'"></rig-market>
    <!--持股超比例、短线交易-->
    <shortline-deal v-if="activeType === '持股超比例、短线交易'"></shortline-deal>

  </div>
</template>

<script>
  import insiderDeal from './differentTypesInvestigation/insiderDeal'
  import rigMarket from './differentTypesInvestigation/rigMarket'
  import shortlineDeal from './differentTypesInvestigation/shortlineDeal'
  import undisclosedDeal from './differentTypesInvestigation/undisclosedDeal'

  export default {
    name: 'different-types-investigation',
    components: {
      insiderDeal,
      rigMarket,
      shortlineDeal,
      undisclosedDeal
    },
    data() {
      return {
        btnList: ['利用未公开信息交易', '内幕交易', '操纵市场', '持股超比例、短线交易'],
        activeType: '利用未公开信息交易'
      }
    },
    methods: {},
    mounted() {
    },
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
