<template>
  <div style="display: flex;align-items:center;">
    <el-select v-model="scope.row[item.field]" size="small" @change="handlerChange" placeholder="请选择关联类型"  
    :disabled="JSON.parse(this.$route.params.params).task_status != 'x1' && JSON.parse(this.$route.params.params).task_status != 'x3'">
      <el-option
        label="最大物理关联账户组"
        value="最大物理关联账户组"/>
      <el-option
        label="交易关联"
        value="交易关联"/>
      <el-option
        label="无关联"
        value="无关联"/>
      <el-option
        label="华为上网卡"
        value="华为上网卡"/>
    </el-select>
    <!-- <i class="fa fa-lightbulb-o lightbulb-button" :class="{active:isActive}" @click="isActive=!isActive"/> -->
  </div>
</template>

<script>
  export default {
    name: 'association',
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
