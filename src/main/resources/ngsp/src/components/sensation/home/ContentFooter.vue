<template>
  <div class="content-footer">
    <el-row :gutter="20">
      <el-col :xl="8" :lg="8" :md="12" :sm="24">
        <el-card class="el-card-table">
          <div slot="header" class="clearfix">
            <span>十大热门概念</span>
            <el-button type="info" size="small" icon="el-icon-tickets"
                       @click="switchView1?switchView1=false:switchView1=true"></el-button>
          </div>
          <funnel-charts v-if="switchView1"
                         :data="data"/>
          <funnel-table v-else
                        :columns="columns[1]"
                        :data="data2"/>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="24">
        <el-card class="el-card-table">
          <div slot="header" class="clearfix">
            <span>十大热门股票</span>
            <el-button type="info" size="small" icon="el-icon-tickets"
                       @click="switchView2?switchView2=false:switchView2=true"></el-button>
          </div>
          <funnel-charts v-if="switchView2"
                         :data="data"/>
          <funnel-table v-else
                        :columns="columns[2]"
                        :data="data2"/>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="24">
        <el-card class="el-card-table">
          <div slot="header" class="clearfix">
            <span>十大热门行业</span>
            <el-button type="info" size="small" icon="el-icon-tickets"
                       @click="switchView3?switchView3=false:switchView3=true"></el-button>
          </div>
          <funnel-charts v-if="switchView3"
                         :data="data"/>
          <funnel-table v-else
                        :columns="columns[3]"
                        :data="data2"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableTag from './components/TableTag'
  import TableCty from './components/TableCty'

  export default {
    name: 'content-footer',
    props: [],
    components: {
      FunnelCharts: () => import('./components/FunnelCharts'),
      FunnelTable: () => import('./components/FunnelTable')
    },
    mixins: [],
    data() {
      return {
        switchView1: true,
        switchView2: true,
        switchView3: true,
        data: [
          {name: '111', value: '886'},
          {name: '222', value: '1266'},
          {name: '333', value: '1388'},
          {name: '444', value: '1388'},
          {name: '555', value: '1736'},
          {name: '666', value: '1766'},
          {name: '777', value: '1888'},
          {name: '888', value: '2000'}
        ],
        columns: {
          1: [
            {
              field: 'type',
              align: 'center',
              width: '80',
              label: '',
              template: TableTag
            },
            {
              field: 'plate',
              align: 'center',
              width: '80',
              label: '概念'
            },
            {
              field: 'title',
              align: 'left',
              width: '300',
              label: '标题'
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
          2: [
            {
              field: 'type',
              align: 'center',
              width: '80',
              label: '',
              template: TableTag
            },
            {
              field: 'plate',
              align: 'center',
              width: '80',
              label: '股票'
            },
            {
              field: 'title',
              align: 'left',
              width: '300',
              label: '标题'
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
          3: [
            {
              field: 'type',
              align: 'center',
              width: '80',
              label: '',
              template: TableTag
            },

            {
              field: 'plate',
              align: 'center',
              width: '80',
              label: '行业'
            },
            {
              field: 'title',
              align: 'left',
              width: '300',
              label: '标题'
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
          ]
        },
        data2: {
          data: [
            {
              type: 'lh',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              plate: '政务',
              url: '111',
              heat: '88.77',
              cty: '+55.11'
            },
            {
              type: 'lk',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              plate: '政务2',
              url: '222',
              heat: '88.77',
              cty: '+55.11'
            },
            {
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
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {}
  }
</script>

<style lang="less">
  .content-footer {
  }
</style>
