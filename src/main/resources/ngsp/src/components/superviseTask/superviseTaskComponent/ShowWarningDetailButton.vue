<template>
  <div v-if="showWarningDetailButton">
    <el-button @click="openWarnPage" type="primary" style="position:absolute;right:35px;top:198px;z-index: 1000;">
      显示预警详情
    </el-button>
  </div>
</template>
<script>
  export default {
    props: {
      showWarningDetailButton: {
        type: Boolean,
        default: false
      },
      alarmId: {
        type: [String, Number],
        default: ''
      }
    },
    methods: {
      openWarnPage () {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      }
    }
  }
</script>
