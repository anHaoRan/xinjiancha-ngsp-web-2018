<template>
  <el-card style="height:100px">
    <el-steps :active="Number(currentProcessStatus)" finish-status="success" :process-status="processStatusColor">
      <el-step v-for="(item, index) in steps" :key="index" :title="item" :description="description[index] || ''"></el-step>
    </el-steps>
  </el-card>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      steps: {
        type: Array,
        default() {
          return []
        }
      },
      description: {
        type: Array,
        default() {
          return []
        }
      },
      currentProcessStatus: {
        type: [String, Number],
        default: 0
      }
    },
    computed: {
      processStatusColor() {
        return this.steps.length === Number(this.currentProcessStatus) + 1 ? 'success' : 'process'
      }
    }
  }
</script>
<style lang="less" scoped>
  .stepsCommonComponent {
  }
</style>
