<template>
    <div class="media-release">
        <s-table ref="mediaRelease" :isHeader="false" :columns="columns" :data="totalData"
                 @getPageination="getPageination"></s-table>
    </div>
</template>

<script>
  export default {
    name: 'media-release',
    props: [],
    components: {
      STable: () => import('@/components/base/STable'),
    },
    mixins: [],
    data () {
      return {
        columns: [
          {
            field: 'a',
            align: 'left',
            width: '100',
            label: '序号'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '媒体名称'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '媒体类型'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '文章总数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '评论总数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '正面占比'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '负面占比'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '中性占比'
          }
        ],
        totalData: {
          data: [
            {a: 0},
            {a: 1},
            {a: -1}
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      getPageination (pagination) {

      },
    }
  }
</script>

<style lang="less" scoped>
    .media-release {
    }
</style>