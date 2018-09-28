<template>
    <div class="dialog-input">
        <el-input type="text" size="small" v-model="scope.row[item.field]"
                  :readonly="!scope.row.isEdit&&item.readonly"></el-input>
    </div>
</template>

<script>
  export default {
    name: 'dialog-input',
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
    methods: {}
  }
</script>

<style lang="less" scoped>
    .dialog-input {
    }
</style>