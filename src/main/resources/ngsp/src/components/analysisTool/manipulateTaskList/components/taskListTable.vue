<template>
  <div class="taskTableBox">
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <!--查询结果表格-->
      <el-table
        v-loading="tableData.loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        :data="tableData.taskArr"
        style="width: 100%"
        max-height="600">
        <el-table-column
        prop="task_id"
        label="序号"
        width="200"
        align="center">
        </el-table-column>
        <el-table-column
        prop="sec_code"
        label="证券代码"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="sec_name"
        label="证券名称"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        label="线索来源"
        width="180"
        prop="data_type"
        align="left">
        </el-table-column>
        <el-table-column
        prop="reply_comp"
        label="反馈单位"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="task_status"
        label="状态"
        width="180"
        align="left">
        <template slot-scope="scope">
          <span v-if=" scope.row.task_status == 'x1' || scope.row.task_status == 'x3' "> 分析中 </span>
          <span v-if=" scope.row.task_status == 'x5' "> 待复核 </span>
          <span v-if=" scope.row.task_status == 'x6' "> 被退回 </span>
          <span v-if=" scope.row.task_status == 'x9' "> 已复核 </span>            
        </template>
        </el-table-column>
        <el-table-column
        prop="anal_user"
        label="创建人"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="reanal_user"
        label="在办人"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="start_date"
        label="操纵开始日期"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="end_date"
        label="操纵结束日期"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="create_time"
        label="创建日期"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="case_type"
        label="案件类型"
        width="180"
        align="left">
        </el-table-column>
        <el-table-column
        prop="opt"
        label="操作"
        fixed="right"
        width="200"
        align="center">
        <template slot-scope="scope">
            <span v-if=" scope.row.opt.split(',')[0] == '1' " @click="handleActions(scope.row)">处理</span>
            <span v-if=" scope.row.opt.split(',')[0] == '2' " @click="handleLook(scope.row)">查看</span>
            <span v-if=" scope.row.opt.split(',')[1] == '1' " @click="handleActions(scope.row)">处理</span>
            <span v-if=" scope.row.opt.split(',')[1] == '2' " @click="handleLook(scope.row)">查看</span>
        </template>
        </el-table-column>
    </el-table>
    <!--分页-->
    <pageination style="text-align:center" :pageTotal="parseInt(tableData.cnt)" :pageSizes="pageSizes"
      @getPageination="getPageination"
      :paginationProps="{pageSizeNumber:tableData.pageRows,currentPage:tableData.pageIndex}"></pageination>
    </el-card>
    <!--跳转其他页面-弹框-->
    <el-dialog title="跳转至：" :visible.sync="isRouterDialog">
      <router-link v-if="isToAccount" :to="{path:'/manipulationAutomationScreening/'+codeName}">操纵账户初筛</router-link><br>
      <router-link :to="{path:'/manipulateAnalysisList/'+codeName}">操纵分析列表</router-link>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click=" isRouterDialog = false ">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'task-list-table',
    props: {
      tableData: Object
    },
    components: {
      Pageination: () => import('@/components/common/pageination'), // 分页组件引入
    },
    mixins: [],
    data () {
      return {
        pageSizes: [10, 20, 50, 100],
        isRouterDialog: false,
        codeName: {},
        isToAccount: false,


      }
    },
    computed: {
      
    },
    watch: {
      
    },
    methods: {
      getPageination(val){ // 分页
        this.$emit('getPageination', val) 

      },
      handleActions(row){ // 处理事件
        this.isRouterDialog = true 
        this.codeName = JSON.stringify({
          sec_code: row.sec_code,
          sec_name: row.sec_name,
          task_id: row.task_id,
          version: row.version,
          task_status: row.task_status,
          process_id: row.process_id,
          list_id: row.list_id,
          start_date: row.start_date,
          end_date: row.end_date
        })
        if(row.task_status == 'x1' || row.task_status == 'x3'){ //分析中
          this.isToAccount = true
        }else{
          this.isToAccount = false
        }
        
      },
      handleLook(row){ // 查看事件
        this.codeName = JSON.stringify({
          sec_code: row.sec_code,
          sec_name: row.sec_name,
          task_id: row.task_id,
          version: row.version,
          task_status: row.task_status,
          process_id: row.process_id,
          list_id: row.list_id,
          routeType: 'look',
          start_date: row.start_date,
          end_date: row.end_date
        })
        this.$router.push({ path:'/manipulateAnalysisList/'+this.codeName })

        
      },
      
      
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
   .taskTableBox{
    .el-table{
      margin-top:20px;
      span{
        color: #66b1ff;
        margin-right: 10px;
        cursor: pointer;

      }
    }
    
    a{
      color:#409EFF;
      margin-left:80px;
      line-height:40px;
    }
  }
</style>
