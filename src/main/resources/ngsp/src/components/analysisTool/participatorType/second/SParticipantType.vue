<template>
  <div class='s-participant-type'>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${tabText}基本资料`" name="0">
        </el-tab-pane>

        <el-tab-pane v-if="tabText != '账户组'" :label="`${tabText}托管统计`" name="1">
        </el-tab-pane>
        <el-tab-pane v-else :label="`${tabText}持仓统计`" name="1">
        </el-tab-pane>

        <el-tab-pane :label="`${tabText}申报详情`" name="2">
        </el-tab-pane>

        <el-tab-pane :label="`${tabText}成交详情`" name="3">
        </el-tab-pane>

        <el-tab-pane :label="`${tabText}申报统计`" name="4">
        </el-tab-pane>

        <el-tab-pane :label="`${tabText}成交统计`" name="5">
        </el-tab-pane>
      </el-tabs>
      <template v-for="(item, index) in totalTab">
        <s-participant-type-form
          v-show="activeName == index"
          :key="`form${index}`"
          :setRef="`participantRef${index}`"
          :activeName="activeName"
          :needParams="secondDevData"
          :classType="classification"
          @handleSearch="handleSearchForm"></s-participant-type-form>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 's-participant-type',
    props: {
      secondDevData: {
        type: Object,
        default: {}
      },
      classification: {
        type: Object,
        default: {}
      },
    },
    components: {
      SParticipantTypeForm: () => import('./SParticipantTypeForm')
    },
    mixin: [],
    data() {
      return {
        totalTab: [0, 1, 2, 3, 4, 5],
        tabText: '',
        activeName: '0'
      }
    },
    computed: {
      
    },
    watch: {
      'secondDevData.text'(val) {
        if (val == 'accountArr') {
          this.tabText = '账户组'
        } else if (val == 'member') {
          this.tabText = '券商'
        } else {
          this.tabText = 'PBU'
        }
        this.activeName = '5'
      }
    },
    methods: {
      handleClick() {},
      handleSearchForm(type, data) {
        console.log(type, JSON.stringify(data))
      }
    },
    mounted() {
      if (this.secondDevData.text == 'accountArr') {
        this.tabText = '账户组'
      } else if (this.secondDevData.text == 'member') {
        this.tabText = '券商'
      } else {
        this.tabText = 'PBU'
      }
      this.activeName = '5'
    },
    beforeDestory() {
      
    }
  }
</script>

<style lang='less' scoped>
  .s-participant-type {

  }
</style>