<template>
  <div style="display: flex;align-items:center;" class="inputContent">
    <el-date-picker
      v-model="scope.row[item.field]"
      :class="scope.row.readonly?'borderNone':''"
      :readonly="scope.row.readonly"
      type="date"
      size="small"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'reason',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {
        isActive: true
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .inputContent {
    input {
      text-align: center;
    }
    .borderNone {
      input {
        border: none !important;
      }
      .el-input__prefix {
        display: none;
      }
    }
  }
</style>
