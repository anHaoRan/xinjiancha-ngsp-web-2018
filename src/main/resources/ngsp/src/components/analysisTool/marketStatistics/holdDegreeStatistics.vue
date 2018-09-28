<template>
  <div class="hold-degree-statistics">
    <hold-degree-and-preferre-stock :componentsType="componentsType"></hold-degree-and-preferre-stock>
  </div>
</template>

<script>

export default {
  name: 'hold-degree-statistics',
  components: {
    //  持股集中度和优先股集中度公共组件
    HoldDegreeAndPreferreStock: () => import('./common/holdDegreeAndPreferreStock')
  },
  data() {
    return {
      componentsType: 'holdDegree'
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style lang="less" scoped>
  .hold-degree-statistics {

  }
</style>
