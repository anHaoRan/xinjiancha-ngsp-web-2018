<template>
  <div class="basicDataBox">
    <el-radio-group size="small" v-model="activeType">
      <el-radio-button v-for="(item, index) in btnList" :key="index" :label="item"></el-radio-button>
    </el-radio-group>
    <!--跨期连续操纵-->
    <rig-continuous v-if="activeType === '跨期连续操纵'"></rig-continuous>
    <!--短线操纵-->
    <rig-short v-if="activeType === '短线操纵'"></rig-short>
    <!--信息操纵-->
    <rig-info v-if="activeType === '信息操纵'"></rig-info>
    <!--抢帽子-->
    <rig-hat v-if="activeType === '抢帽子'"></rig-hat>

  </div>
</template>

<script>
  import rigContinuous from './rigMarket/rigContinuous'
  import rigShort from './rigMarket/rigShort'
  import rigInfo from './rigMarket/rigInfo'
  import rigHat from './rigMarket/rigHat'

  export default {
    name: 'rig-market',
    components: {
      rigContinuous,
      rigShort,
      rigInfo,
      rigHat
    },
    data() {
      return {
        btnList: ['跨期连续操纵', '短线操纵', '信息操纵', '抢帽子'],
        activeType: '跨期连续操纵'
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
    padding: 0px;
    .el-radio-group {
      margin-bottom: 10px;
      .el-radio-button {
        margin-right: 10px;
      }
    }

  }
</style>
