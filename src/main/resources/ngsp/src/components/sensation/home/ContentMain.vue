<template>
  <div class="content-main">
    <el-card>
      <div slot="header" class="clearfix">
        <span>十大热门事件</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="14">
          <margin-table :isPageination="false" :show-header="false" :height="400" :columns="columns"
                        :data="data"
                        @row-click="handlerRowClick"></margin-table>
        </el-col>
        <el-col :span="10">
          <div id="sensation_type"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import VueMixin from '../VueMixin'
  import TableTag from './components/TableTag'
  import TablePlate from './components/TablePlate'
  import TableCty from './components/TableCty'

  export default {
    name: 'content-main',
    props: [],
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [VueMixin],
    data() {
      return {
        columns: [
          {
            field: 'type',
            align: 'center',
            width: '80',
            label: '',
            template: TableTag
          },
          {
            field: 'title',
            align: 'left',
            width: '300',
            label: '标题'
          },
          {
            field: 'plate',
            url: 'url',
            align: 'center',
            width: '80',
            label: '板块',
            template: TablePlate
          },
          {
            field: 'heat',
            align: 'center',
            width: '80',
            label: '热度'
          },
          {
            field: 'cty',
            align: 'center',
            width: '80',
            label: '较昨日',
            template: TableCty
          }
        ],
        data: {
          data: [
            {
              id: 1,
              type: 'lh',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              plate: '政务',
              url: '111',
              heat: '88.77',
              cty: '+55.11'
            },
            {
              id: 1,
              type: 'lk',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              plate: '政务2',
              url: '222',
              heat: '88.77',
              cty: '+55.11'
            },
            {
              id: 1,
              type: 'lh',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              plate: '政务1',
              url: '333',
              heat: '88.77',
              cty: '-55.11'
            }
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
      }
    },
    computed: {},
    watch: {},
    created() {
      let rich = {
        title: {
          fontSize: 18
          // color: '#333'
        },
        title_sub: {
          fontSize: 14
          // color: '#333'
        }
      }
      this.options = {
        title: [{
          text: '{title_sub|总热度}',
          left: 'center',
          top: '52%',
          textStyle: {
            rich: rich
          }
        }, {
          text: '',
          left: 'center',
          top: '42%',
          textStyle: {
            rich: rich
          }
        }],
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['42%', '50%'],
            // color: ['#d74e67', '#0092ff'],
            label: {
              show: true,
              formatter: function (params) {
                return `{title_sub|${params.name}}\n{title|${params.percent}%}`
              },
              rich: rich,
              position: 'outer'
            }

          }
        ]
      }
    },
    mounted() {
      this.initEcharts('sensation_type')
      this.ajax()
    },
    beforeDestroy() {
    },
    methods: {
      ajax() {
        let data = [
          {value: 50, name: '政务'},
          {value: 30, name: '政务1'}
        ]
        this.options.series[0].data = data
        let total = 0
        for (let key of data) {
          total += key.value
        }
        this.options.title[1].text = `{title|${total}}`
        this.drawEcharts()
      },
      handlerRowClick(row, event, column) {
        console.log(row, event, column)
        this.$router.push({path: `/sensationHomeDetail/${row.id}`})
      }
    }
  }
</script>

<style lang="less" scoped>
  .content-main {
    #sensation_type {
      height: 400px;
      background-color: #17274b;
    }
  }
</style>
<style lang="less">
  .content-main {
    .el-table tr td {
      border-bottom: 1px solid transparent;
      border-right: 1px solid transparent;
      &:last-child {
        border-bottom: 1px solid transparent;
      }
    }
  }
</style>
