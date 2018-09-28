<template>
    <div class="to-detail">
        <el-button type="text" size="small" style="border: none;color:#1b5eed;" @click="handlerClick">
            查看
        </el-button>
    </div>
</template>

<script>
  export default {
    name: 'to-detail',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handlerClick () {
        this.$router.push({path: `/${this.item.url}/${this.scope.row[this.item.field]}`})
      }
    }
  }
</script>

<style lang="less" scoped>
    .to-detail {
    }
</style>