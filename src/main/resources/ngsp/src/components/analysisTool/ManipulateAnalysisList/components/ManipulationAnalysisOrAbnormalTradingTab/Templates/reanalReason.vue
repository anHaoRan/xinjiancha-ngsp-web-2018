<template>
  <div style="display: flex;align-items:center;">
    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="200" v-model="scope.row[item.field]" size="small"/>
    <!-- <i class="fa fa-lightbulb-o lightbulb-button" :class="{active:isActive}" @click="isActive=!isActive"/> -->
  </div>
</template>

<script>
  export default {
    name: 'reanalReason',
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

<style scoped>

</style>
