<template>
  <el-tag :color="color" class="font-color-main" size="small">{{type==='lh'?'利好':'利空'}}</el-tag>
</template>

<script>
  export default {
    name: 'tag',
    props: {
      type: {
        type: String,
        default() {
          return 'lh'
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      color() {
        return this.type === 'lh' ? this.gfnFormatSecurityColor(1) : this.gfnFormatSecurityColor(-1)
      }
    }
  }
</script>
