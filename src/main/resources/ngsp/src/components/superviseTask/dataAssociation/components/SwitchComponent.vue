<template>
  <div class="switchComponent">
    <div class="overlayDiv" @click="handleClick"></div>
    <el-switch v-model="switchValue"></el-switch>
  </div>
</template>
<script>
  export default {
    props: {
      switchValueProps: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        switchValue: false
      }
    },
    methods: {
      handleClick() {

      }
    }
  }
</script>
<style lang="less" scoped>
  .switchComponent {
    position: relative;
    .overlayDiv {
      position: absolute;
      top: 0;
      width: 100px;
      height: 50px;
      z-index: 11;
    }
  }
</style>
