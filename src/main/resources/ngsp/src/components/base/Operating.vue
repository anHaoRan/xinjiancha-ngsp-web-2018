<template>
    <div class="operating">
        <el-button type="primary" size="small" v-for="(items,index) in buttonList" :key="index"
                   @click="items.func(scope.row[item.field])">{{items.buttonLabel}}
        </el-button>
    </div>
</template>

<script>
  export default {
    name: 'operating',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      buttonList () {
        let arr = this.item.buttonList
        for (let key of arr) {
          if (typeof key.label == 'function') {
            key.buttonLabel = key.label(this.scope)
          } else {
            key.buttonLabel = key.label
          }
        }
        return arr
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .operating {
    }
</style>