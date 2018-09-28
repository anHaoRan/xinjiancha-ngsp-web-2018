<template>
  <div class="table-plate">
    <el-button type="text" size="small" style="border: none;color:#1b5eed;" @click="handlerClick">
      #{{scope.row[item.field]}}
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'table-plate',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      handlerClick() {
        this.$router.push({path: `/pdf-preview/${this.scope.row[this.item.url]}`})
      }
    }
  }
</script>

<style lang="less" scoped>
  .table-plate {
  }
</style>
