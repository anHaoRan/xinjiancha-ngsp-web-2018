<template>
  <div style="display: flex;align-items:center;">
    <el-select v-model="scope.row[item.field]" size="small" @change="handlerChange">
      <el-option
        label="一码通"
        value="1"/>
      <el-option
        label="日内"
        value="2"/>
    </el-select>
    <i class="fa fa-lightbulb-o lightbulb-button" :class="{active:isActive}" @click="isActive=!isActive"/>

  </div>
</template>

<script>
  export default {
    name: 'associated',
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
    methods: {
      handlerChange (val) {
        console.log(val)
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style scoped>

</style>
