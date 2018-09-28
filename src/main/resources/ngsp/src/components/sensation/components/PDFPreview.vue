<template>
  <div class="p-d-f-preview">
    <p-d-f :src="routerUrl"></p-d-f>
  </div>
</template>

<script>
  export default {
    name: 'p-d-f-preview',
    components: {
      PDF: () => import('vue-pdf')
    },
    data() {
      return {
        routerUrl: ''
      }
    },
    watch: {
      '$route': 'init'
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.routerUrl = this.$route.params.url
      }
    }
  }
</script>

<style lang="less" scoped>
  .p-d-f-preview {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
