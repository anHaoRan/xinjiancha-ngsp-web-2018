<template>
  <div class="supervise-task-top-page">
    <el-card class="el-card-table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`待办事项(${totalData[1].total})`" name="one">
          <keep-alive>
            <Todolist @todolist="dealWithData" :height="newHeight" v-if="activeName==='one'"
                      :totalData.sync="totalData[1]"
                      ref="Todolist"></Todolist>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="`在办事项(${totalData[2].total})`" name="two">
          <keep-alive>
            <doninglist @doing="dealWithData" :height="newHeight" v-if="activeName==='two'"
                        :totalData.sync="totalData[2]"
                        ref="doninglist"></doninglist>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="`已办事项(${totalData[3].total})`" name="three">
          <keep-alive>
            <donelist @donelist="dealWithData" :height="newHeight" v-if="activeName==='three'"
                      :totalData.sync="totalData[3]"
                      ref="donelist"></donelist>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import { topPageTodolist, topPageDoinglist, topPageDonelist } from '@/service/superviseTask'

  export default {
    name: 'supervise-task-top-page',
    props: ['height', 'setTime'],
    components: {
      Todolist: () => import('./tab/Todolist'),
      doninglist: () => import('./tab/doninglist'),
      donelist: () => import('./tab/donelist')
    },
    mixins: [],
    data () {
      return {
        activeName: 'one',
        selectParams: {
          businessType: '',
          localStatus: '',
          selectTradeDate: []
        },
        totalData: {
          1: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          },
          2: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          },
          3: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
        },
        tdatereloadTime: '60',
        TdatetimerFun: null
      }
    },
    watch: {
      selectParams: {
        handler () {
          this.isShow = false
          this.totalData = {
            1: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            },
            2: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            },
            3: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            }
          }
          this.getAllTable()
        },
        deep: true
      }
    },
    computed: {
      newHeight () {
        return this.height ? Number(this.height) - 108 : this.height
      }
    },
    methods: {
      dealWithData (type = this.activeName) {
        let startDate = ''
        let endDate = ''
        if (!this.selectParams.selectTradeDate[0]) {
          startDate = ''
        } else {
          startDate = `${this.selectParams.selectTradeDate[0]} 00:00:00`
        }
        if (!this.selectParams.selectTradeDate[1]) {
          endDate = ''
        } else {
          endDate = `${this.selectParams.selectTradeDate[0]} 23:59:59`
        }
        let data = {
          'processName': this.selectParams.businessType,
          'status': this.selectParams.localStatus,
          'startDate': startDate,
          'endDate': endDate
        }
        if (type === 'three') {
          data.status = ''
        }
        let map = {
          'one': () => {
            data.pageIndex = this.totalData[1].pageIndex
            data.pageRows = this.totalData[1].pageRows
            topPageTodolist(JSON.stringify(data)).then((resp) => {
              this.totalData[1].data = resp.buzidata
              this.totalData[1].total = resp.totalNum
            })
            this.$emit('updateCharts')
          },
          'two': () => {
            data.pageIndex = this.totalData[2].pageIndex
            data.pageRows = this.totalData[2].pageRows
            topPageDoinglist(JSON.stringify(data)).then((resp) => {
              this.totalData[2].data = resp.buzidata
              this.totalData[2].total = resp.totalNum
            })
          },
          'three': () => {
            data.pageIndex = this.totalData[3].pageIndex
            data.pageRows = this.totalData[3].pageRows
            topPageDonelist(JSON.stringify(data)).then((resp) => {
              this.totalData[3].data = resp.buzidata
              this.totalData[3].total = resp.totalNum
            })
          }
        }
        map[type]()
      },
      getAllTable () {
        let arr = ['one', 'two', 'three']
        for (let key of arr) {
          this.dealWithData(key)
        }
        if (this.setTime) {
          this.TdatetimerFun = setTimeout(this.getAllTable, this.tdatereloadTime * 1000)
        }
        // this.$emit('updateCharts')
      },
      handleClick (tab, event) {
        this.getAllTable()
      }
    },
    created () {
      this.getAllTable()
    },
    mounted () {
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }
  }
</script>

<style lang="less">
  .supervise-task-top-page {
    .el-card {
      .el-card {
        margin-top: 0px;
      }
    }
  }
</style>
