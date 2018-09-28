<template>
    <div class="related-compant-item">
        <el-row>
            <el-col :span="15">
                <el-radio-group v-model="chartTabsName" size="mini" class="chart-tabs">
                    <el-radio-button label="timeSharing">分时</el-radio-button>
                    <el-radio-button label="dayK">日K</el-radio-button>
                </el-radio-group>
                <time-sharing v-if="chartTabsName=='timeSharing'" :data="echartsData"></time-sharing>
                <day-k v-else :data="echartsData"></day-k>
            </el-col>
            <el-col :span="9">
                <margin-table :isPageination="false" :height="200" :columns="columns"
                              :data="data"
                ></margin-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import ToDetail from './ToDetail'
  import { json } from '../../1111'
  import { json2 } from '../../2222'

  export default {
    name: 'related-compant-item',
    props: {
      isinCode: {
        type: [String],
        required: true
      }
    },
    components: {
      MarginTable: () => import('@/components/base/MarginTable'),
      TimeSharing: () => import('./TimeSharing'),
      DayK: () => import('./DayK'),
    },
    mixins: [],
    data () {
      return {
        chartTabsName: 'timeSharing',
        columns: [
          {
            field: 'date',
            align: 'center',
            label: '日期'
          },
          {
            field: 'title',
            align: 'left',
            label: '标题'
          },
          {
            field: 'concise',
            align: 'left',
            label: '简介'
          },
          {
            field: 'detail',
            align: 'center',
            url: 'pdf-preview',
            label: '详情',
            template: ToDetail
          }
        ],
        data: {
          data: [
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              concise: '122211',
              detail: '1'
            },
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              concise: '122211',
              detail: '1'
            },
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              concise: '122211',
              detail: '1'
            }
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        echartsData: {}
      }
    },
    computed: {},
    watch: {
      chartTabsName: {
        handler (val) {
          if (val == 'timeSharing') {
            this.echartsData = json
          } else {
            this.echartsData = json2
          }
        },
        immediate: true
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less">
    .related-compant-item {
        .el-table tr td, .el-table tr th {
            border-right: 1px solid transparent;
        }
    }
</style>
<style lang="less" scoped>
    .related-compant-item {
        margin-bottom: 10px;
        .chart-tabs {
            position: absolute;
            left: 120px;
            top: 3px;
            z-index: 2;
        }
    }
</style>