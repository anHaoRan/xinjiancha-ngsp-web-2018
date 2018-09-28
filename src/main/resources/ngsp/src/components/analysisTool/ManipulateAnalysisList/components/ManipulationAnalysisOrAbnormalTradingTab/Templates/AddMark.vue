<template>
  <div>
    <el-select v-model="scope.row[item.field]" size="small" @change="handlerChange" 
    :disabled="JSON.parse(this.$route.params.params).task_status != 'x1' && JSON.parse(this.$route.params.params).task_status != 'x3'">
      <el-option
        label="确定"
        value="确定"/>
      <el-option
        label="待定"
        value="待定"/>
      <el-option
        label="删除"
        value="删除"/>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'add-mark',
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
        let constArrRight = this.$store.getters.getShuttleRight
        let constArrLeft = this.$store.getters.getShuttleLeft
        
        // 重新获取数据 
        for(var i=0;i<constArrLeft.length;i++){
          if(constArrLeft[i].acct_id == this.scope.row.acct_id){            
            constArrLeft[i].acct_type = val
          }
        }
        this.$store.commit('setShuttleLeft', constArrLeft) //控制穿梭框数据 
        //处理确定账户和待定删除账户分类
        let arr = [],
            right = constArrLeft
        for(var i=0;i<right.length;i++){
          if(right[i].acct_type.trim() == '待定' || right[i].acct_type.trim() == '删除'){
            arr.push(right[i])
          }
        }
        this.$store.commit('setShuttleRight', arr)

        // switch (val) {
        //   case '1':
        //     // let index = constArrRight.findIndex(item => {
        //     //   return item.acct_id == this.scope.row.acct_id
        //     // })
        //     // console.log('1111index:',index)
        //     // transfer.$refs.multipleTableRight.toggleRowSelection(constArrRight[index])
        //     // transfer.handleLeftTransfer()
            
        //     let arr = []
        //     // 重新获取数据 
        //     for(var i=0;i<constArrRight.length;i++){
        //       if(constArrRight[i].acct_id == this.scope.row.acct_id){
                
        //         constArrRight[i].acct_type = '确定'
        //       }else{
                
        //         arr.push(constArrRight[i])
        //       }
        //     }
        //     console.log('setShuttleRight:',arr)
        //     // this.$store.commit('setShuttleLeft', [{'acct_id':'2222'},{'acct_id':'33333'},{'acct_id':'44444'}])
        //     this.$store.commit('setShuttleRight', arr )
            
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
