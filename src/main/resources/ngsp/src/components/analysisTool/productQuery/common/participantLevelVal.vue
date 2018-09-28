<template>
  <div class='participant-level-val' style="display: initial">
    <el-select
        v-model="participantLevelVal"
        size="small"
        @change="participantLevelChange"
        style="width:260px">
      <el-option
          v-for="item in participantLevelOptions"
          :key="item.value"
          :label="item.text"
          :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { transactionSelect } from '../../../../service/analysisTool/productQuery'
  export default {
    name: 'participant-level-val',
    props: {},
    components: {},
    mixins: [],
    data () {
      return {
        participantLevelVal:'account',
        participantLevelOptions:[]
      }
    },
    computed: {
      
    },
    watch: {},
    methods: {
      participantLevelChange(val){
        this.$emit('getParticipantLevelVal',val)
      },
      clearAll() {
        this.participantLevelVal = 'account'
        this.participantLevelChange('account')
      }
    },
    created () {
      // transactionSelect('particiLevel', 'statis').then((resp) => {
        this.participantLevelOptions = this.$store.state.productQuery.participantLevelOptions
      // })
    },
    mounted () {
      this.$emit('getParticipantLevelVal',this.participantLevelVal)
    },
    beforeDestory () {
      
    }
  }
</script>

<style lang='less' scoped>
  .participant-level-val {

  }
</style>