<template>
  <div class="table-download-file">
    <a class="link-common-css" v-for="(it, index) in scope.row[item.field]" :key="index" @click="downloadFile(it)">{{it.fileName}}</a>
  </div>
</template>

<script>
  export default {
    name: 'table-download-file',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      downloadFile(fileItem) {
        window.location.href = this.gfnGetDownloadFileUrl(fileItem.fileId, fileItem.fileName)
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

<style lang="less" scoped>
  .table-download-file {
  }
</style>
