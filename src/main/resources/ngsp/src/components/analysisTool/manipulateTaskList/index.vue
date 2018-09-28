<template>
  <div class="manipulate-task-list">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--查询条件-->
    <query-conditions @queryConditions="handleQuery" />
    <div class="bottomBox">
      <!--新建操纵分析任务-->
      <add-task-list @addTaskList="addTaskList" />
      <!--查询结果-->
      <task-list-table :tableData="tableData" @getPageination="changePage" />
    </div>
  </div>
</template>

<script>
  import {
    queryManipulateTaskList,
    addManipulateTaskList
  } from '@/service/analysisTool/manipulateTaskList/index' // 操纵任务列表接口

  export default {
    name: 'manipulate-task-list',
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      queryConditions: () => import('./components/queryConditions'), // 查询条件组件
      taskListTable: () => import('./components/taskListTable'), // 操纵任务列表表格组件
      addTaskList: () => import('./components/addTaskList'), // 新建操纵分析任务组件
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [{
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '特定工具'
        }, {
          router: '/manipulateTaskList',
          label: '操纵任务列表'
        }],
        tableData: {
          taskArr: [],
          cnt: 0,
          pageIndex: 1,
          pageRows: 10,
          loading: true,
        },
        queryParams: {
          secCode: '', 
          secName:'',
          dataType: '',
          replyComp: '',
          taskStatus: '',
          createUser: '',
          reanalUser: '',
          createTime: '',
          caseType: ''
        },
        pageIndex: 1,
        pageRows: 10,
        
      }
    },
    computed: {
      
    },
    watch: {},
    methods: {
      handleQueryTable(){ // 查询方法
        let params = {
          pageIdx: this.pageIndex,
          pageRw: this.pageRows,
          secCode: this.queryParams.secCode,
          secName: this.queryParams.secName,
          dataType: this.queryParams.dataType,
          replyComp: this.queryParams.replyComp,
          taskStatus: this.queryParams.taskStatus,
          createUser: this.queryParams.createUser,
          reanalUser: this.queryParams.reanalUser,
          createTime: this.queryParams.createTime,
          caseType: this.queryParams.caseType
        }
        queryManipulateTaskList(params).then((resp) => {
          this.tableData =  {
            taskArr: resp.taskArr,
            cnt: resp.cnt,
            pageIndex: this.pageIndex,
            pageRows: this.pageRows,
            loading: false,
          }

        })
      },
      changePage(val){ // 分页
        this.pageIndex = val.currentPage
        this.pageRows = val.pageSizeNumber
        this.handleQueryTable()
      },
      handleQuery(val){ // 查询参数
        this.queryParams = val
        //初始化分页参数
        this.pageIndex = 1,
        this.pageRows = 10,
        this.handleQueryTable()

      },
      addTaskList(params){
        addManipulateTaskList(params).then((resp) => {
          let status = resp.res.success
          if(status == true){
            this.$message.success('已成功新建操纵分析任务！')
          }else{
            this.$message.error('新建操纵分析任务失败，请重试！')
          }
          this.handleQueryTable() //重新刷新数据

        })

      },
      
    },
    created () {
    },
    mounted () {
      this.handleQueryTable() // 默认显示全部列表

    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .bottomBox{
    position: relative;
  }

</style>
