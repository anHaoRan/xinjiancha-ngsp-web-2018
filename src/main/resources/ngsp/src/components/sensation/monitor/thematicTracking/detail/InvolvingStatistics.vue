<template>
    <div class="involving-statistics">
        <s-table ref="involvingStatistics" :isHeader="false" :columns="columns" :data="totalData"
                 @getPageination="getPageination"></s-table>
    </div>
</template>

<script>
  export default {
    name: 'involving-statistics',
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
            label: '简称'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '代码'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '主题总数'
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
            label: '媒体总数'
          }
        ],
        totalData: {
          data: [
            {a: 1}
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
    .involving-statistics {
    }
</style>