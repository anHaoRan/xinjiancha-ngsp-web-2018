<template>
  <div>
    <el-select v-model="scope.row[item.field]" size="small" @change="handlerChange" placeholder="请选择复核意见">
      <el-option
        label="通过"
        value="1"/>
      <el-option
        label="不通过"
        value="0"/>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'reanal-flag',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      handlerChange (val) {
        // let transfer = this.$store.getters.getTransfer
        // let constArrRight = this.$store.getters.getShuttleRight
        // let constArrLeft = this.$store.getters.getShuttleLeft

        // switch (val) {
        //   case '1':
        //     let index = constArrRight.findIndex(item => {
        //       return item.acct_id == this.scope.row.acct_id
        //     })
        //     transfer.$refs.multipleTableRight.toggleRowSelection(constArrRight[index])
        //     transfer.handleLeftTransfer()
        //     break
        //   case '0':
        //     let index1 = constArrLeft.findIndex(item => {
        //       return item.acct_id == this.scope.row.acct_id
        //     })
        //     transfer.$refs.multipleTableLeft.toggleRowSelection(constArrLeft[index1])
        //     transfer.handleRightTransfer()
        //     break
        // }
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
