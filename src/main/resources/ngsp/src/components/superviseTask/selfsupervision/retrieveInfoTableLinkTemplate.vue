<template>
    <div class='retrieve-info-table-link-template'>
      <el-button type="text" size="small" style="border: none;" @click="goDetail">{{scope.row[item.field]}}</el-button>
    </div>
</template>

<script>
  export default {
    name: 'retrieve-info-table-link-template',
    props: ['scope', 'item'],
    components: {},
    mixin: [],
    data () {
      return {

      }
    },
    computed: {

    },
    watch: {},
    methods: {
      goDetail () {
        this.openNewWindow('surveyfinishform', `#/surveyfinishform?isoperateCheck=1&taskId=undefined&instanceId=${this.scope.row.infoId}`)
      }
    },
    created () {

    },
    mounted () {

    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
    .retrieve-info-table-link-template {

    }
</style>
