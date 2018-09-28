<!--完成复核 -->
<template>
  <div class="complete-the-review">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <review-table :type="type" :dynamicTableHead="dynamicTableHead"
                    @listensCurrentRow="getCurrentRow"></review-table>
      <characterization :current-row="currentRow" :score-list="scoreList"></characterization>
      <company-information></company-information>
      <macro-analysis-conclusion></macro-analysis-conclusion>
      <!--<complete-the-report></complete-the-report>-->
      <div style="text-align: center;margin-top: 20px;">
        <el-button @click="fnChangeTaskStatus" size="small" type="primary" v-if="!taskStatus">完成核查</el-button>
        <el-button @click="backInsiderTradAnalysis" size="small" type="primary" v-else>返回</el-button>
        <el-button @click="goInsiderTradAccountAnalysis" size="small" type="info">返回初筛账户</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  // 面包屑组件引入
  import breadcrumb from '@/components/common/Breadcrumb'
  //  表格
  import ReviewTable from './children/ReviewTable'
  //  特征分析
  import Characterization from './children/Characterization'
  //  公司信息
  import CompanyInformation from './children/CompanyInformation'
  //  宏观分析结论
  import MacroAnalysisConclusion from './children/MacroAnalysisConclusion'
  //  完成报告
  import CompleteTheReport from './children/CompleteTheReport'
  import {
    quotaClms,
    queryTask
  } from '@/service/analysisTool/insiderTradAccountAnalysis/completeTheReview/index'
  import { changeTaskstatus } from '@/service/analysisTool/insiderTradAccountAnalysis/index'

  export default {
    // 组件注册
    components: {
      breadcrumb,        // 面包屑组件,
      ReviewTable,
      Characterization,
      CompanyInformation,
      MacroAnalysisConclusion,
      CompleteTheReport
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '/insiderTradAnalysis',
            label: '分析工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '特定工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '内幕交易分析'
          }
        ],
        type: '',
        currentRow: null,
        scoreList: [],
        dynamicTableHead: [],
        issetCurrentRow: false,
        taskStatus: true
      }
    },
    created () {
      if (this.$store.state.insiderTradAnalysis.taskStatus == '5')
        this.taskStatus = false
      this.ajaxQueryTask()
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
    },
    methods: {
      getCurrentRow (data) {
        this.currentRow = data
        this.scoreList = []
        for (let key of this.dynamicTableHead) {
          if (key.index_name.indexOf('score') != -1) {
            this.scoreList.push({
              index: key.index_desc,
              description: '',
              score: data[key.index_id]
            })
          }
        }
      },
      ajaxQueryTask: function () {
        queryTask({taskID: this.$route.params.taskId}).then((res) => {
          this.type = res.bizData.metaData[0].anal_type_name
        }).then(() => {
          this.ajaxQuotaClms()
        })
      },
      ajaxQuotaClms () {
        quotaClms({groupCode: this.type == 'lk' ? 'ZHLK' : 'ZHLH'}).then((resp) => {
          let res = resp.quotaClms
          res.sort((x, y) => {
            return x.index_sort - y.index_sort
          })
          for (let key of res) {
            this.dynamicTableHead.push(key)
          }
        }).then(() => {
          this.issetCurrentRow = true
        })
      },
      backInsiderTradAnalysis () {
        this.$router.push({
          path: '/insiderTradAnalysis/'
        })
      },
      fnChangeTaskStatus: function () {
        let processId = this.$store.state.insiderTradAnalysis.currentTaskData.processId,
          // let processId = "4895031"
          taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
          // let taskId="20180323133322"
          taskStatus = this.$store.state.insiderTradAnalysis.taskStatus
        // let taskStatus = '4';
        let params = {
          'taskId': taskId,
          'processId': processId,
          'stopStatus': '0'
        }
        console.log(taskStatus)
        if (taskStatus == '5') {
          changeTaskstatus(params).then((resp) => {
            if (resp) {
              this.$store.commit('changeTaskStatus', '6')
            }
            this.$router.push({
              path: '/insiderTradAnalysis/'
            })
          })
        }
      },
      goInsiderTradAccountAnalysis: function () {
        this.$router.push({
          name: 'insiderTradAccountAnalysis',
          params:{isGoBack:'1'}
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
