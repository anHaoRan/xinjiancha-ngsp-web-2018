<template>
  <div class="precedence-stock-query">
    <hold-degree-and-preferre-stock :componentsType="componentsType"></hold-degree-and-preferre-stock>
  </div>
</template>

<script>
export default {
  name: 'precedence-stock-query',
  props: [],
  components: {
    // 持股集中度和优先股集中度公共组件
    HoldDegreeAndPreferreStock: () => import('./common/holdDegreeAndPreferreStock')
  },
  mixin: [],
  data() {
    return {
      // msg:'优先股股集中度查询',
      componentsType: 'preferredStockConcentrate'
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {

  },
  mounted() {

  },
  beforeDestory() {

  }
}
</script>

<style lang="less" scoped>
  .precedence-stock-query {

  }
</style>
