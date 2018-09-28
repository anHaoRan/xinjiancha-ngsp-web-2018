<template>  
  <div 
    v-loading="lookLoading" 
    element-loading-text="数据加载中，请耐心等待..."
    element-loading-background="rgba(0,0,0,0.3)">
  <div class="manipulate-analysis-list">
    <breadcrumb :breadcrumbList="breadcrumbItems"/>
    <account-transfer-table @calculation="calculation"
                            @lookTaskList="lookTaskList"
                            v-loading="isLoading"
                            element-loading-text="数据加载中，请耐心等待..."
                            element-loading-background="rgba(0,0,0,0.3)"/>
    <div :class="{onlyLookBox:isLook}">
    <!-- 遮罩层 -->
    <div :class="{onlyLookBack:isLook}"></div>
    <div v-if="isShow"
         v-loading="isLoading"
         element-loading-text="数据加载中，请耐心等待..."
         element-loading-background="rgba(0,0,0,0.3)">
      <profit-statistics :acctsProfit="calculateData['acctsProfit']"/>
      <!--<manipulate-analysise-chart :stockPriceTrend="calculateData['stockPriceTrend']"/>-->
      <manipulation-analysis-or-abnormal-trading :optResultList="calculateData['optResultList']"
                                                 :branchAcctsList="calculateData['branchAcctsList']"
                                                 :isLoadingBtn="isLoadingBtn"
                                                 @uploadOptResultList="uploadOptResultList"/>
      <div class="save-account-list" v-if="!(this.routeParams.routeType == 'look')">
        <el-button
          v-if="routeParams.task_status == 'x1' || routeParams.task_status == 'x3'"
          type="primary"
          size="small"
          @click="dialogVisble=true">保存账户列表
        </el-button>
        <!-- 提交复核 分析人员 -->
        <submit-review v-if="isNotX5" @submitReviewSure="submitReviewSure" :isSave="isSave"/>
        <!-- 待复核状态可操作 -->
        <span v-if="isX5" style="margin-left:10px">
          <!-- 确认 复核人员 -->
          <el-button
            type="primary"
            size="small"
            @click="handleTask('1')">确认
          </el-button>
          <!-- 退回 复核人员 -->
          <el-button
            type="primary"
            size="small"
            @click="handleTask('0')">退回
          </el-button>
        </span>
      </div>
    </div>
    <el-dialog
      width="30%"
      :show-close="false"
      class="manipulate-analysis-list-dialog"
      :visible.sync="dialogVisble">
      <el-form label-position="top">
        <el-form-item label="列表名称：">
          <div style="text-align:center">
            <span style="display: inline">{{dialogParams.posListName}}</span>
            <el-input v-model="dialogParams.listName" size="small" style="width: auto;"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="ajaxSaveAccountListName()" size="small" type="primary">保存</el-button>
        <el-button @click="dialogVisble=false" size="small" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
  <!-- 返回 复核人员 -->
  <div class="backBtn" v-if="this.routeParams.routeType == 'look'">
      <el-button
        type="primary"
        size="small"
        @click="handleBack">返回
      </el-button>
  </div>
  </div>
</template>

<script>
  import { calculate, calculateTD , getAccountListName, saveAccountListName, accountArrListQuery , changeTaskStatus , getLookTaskList } from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'manipulate-analysis-list',
    props: {},
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'),        // 面包屑组件
      AccountTransferTable: () => import('./components/AccountTransferTable'),
      ProfitStatistics: () => import('./components/ProfitStatistics'),
      ManipulateAnalysiseChart: () => import('./components/ManipulateAnalysiseChart'),   // 图表
      ManipulationAnalysisOrAbnormalTrading: () => import('./components/ManipulationAnalysisOrAbnormalTrading'),
      submitReview: () => import('./components/others/submitReview.vue') // 提交复核组件
    },
    mixins: [],
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
          router: '/manipulateAnalysisList/{}',
          label: '操纵分析列表'
        }],
        isShow: false,
        isLoading: false,
        dialogVisble: false,
        dialogParams: {
          posListName: '',
          listName: ''
        },
        calculateData: {},
        isX5: false,
        isNotX5: false,
        selectParams: {},
        routeParams: {}, // 路由跳转参数
        isLook: false, // 控制查看遮罩层
        isSave: false, // 是否保存
        listId: '',
        isLoadingBtn: false,
        lookLoading: false,

      }
    },
    computed: {
      getShuttleRight () {
        return this.$store.getters.getShuttleRight
      },
      getGoDeleteRight () {
        return this.$store.getters.getGoDeleteRight
      },
      saveReservedAcctIds () {
        let arr = []
        for (let key of this.calculateData.optResultList) {
          let index = this.getGoDeleteRight.findIndex(item => {
            return item.acct_id === key.acct_id
          })
          if (index > -1) {
            arr.push(this.getGoDeleteRight[index])
          }
        }
        return arr.map(item => {
          return {
            acct_id: item.acct_id,
            resource: item.resource
          }
        })
      }
    },
    watch: {
      getShuttleRight: {
        handler () {
          let arr = this.calculateData.optResultList
          if (arr && arr.length > 0) {
            for (let key of arr) {
              let index = this.getShuttleRight.findIndex(item => {
                return item.acct_id === key.acct_id
              })
              if (index > -1)
                key.status = '0'
              else
                key.status = '1'
            }
          }
        },
        deep: true
      },
      

    },
    methods: {
      handleAcctType(right){ // 处理确定账户和待定删除账户分类
        this.$store.commit('setShuttleLeft', right) //控制穿梭框数据 
        let arr = []
        for(var i=0;i<right.length;i++){
          if(right[i].acct_type.trim() == '待定' || right[i].acct_type.trim() == '删除'){
            arr.push(right[i])
          }
        }
        this.$store.commit('setShuttleRight', arr)
      },
      changeAllType(val){ // 联动改变账户类型
        let constArrLeft = this.$store.getters.getShuttleLeft        
        // 重新获取数据 
        for(var i=0;i<constArrLeft.length;i++){
          for(var j=0;j<val.length;j++){
            if(constArrLeft[i].acct_id == val[j].acct_id){            
              constArrLeft[i].acct_type = val[j].acct_type
            }
          }
        }       
        //处理确定账户和待定删除账户分类
        this.handleAcctType(constArrLeft)
      },
      uploadOptResultList(val){ //上传更新操纵结果表数据
        if(val.length >0){
          // 上传后判断复核意见
          for(var i=0;i<val.length;i++){
            if(val[i].reanal_flag == '通过'){
              val[i].reanal_flag = 1
            }else if(val[i].reanal_flag == '不通过'){
              val[i].reanal_flag = 0
            }
          }
          this.calculateData.optResultList = val // 测试上传
          // 上传后联动改变穿梭框值
          this.changeAllType(val)
        }else{
          this.calculateData.optResultList = [] 
        }
      },
      handleBack(){ //返回任务列表
        this.$router.push({ path:'/manipulateTaskList/'})
      },
      calculation (selectParams,rules,left) {
        this.$store.commit('setSelectParams', JSON.parse(JSON.stringify(selectParams)))
        this.selectParams = selectParams
        this.ajaxCalculate(selectParams,rules,left)
      },
      dealWithReservedAcctIds () {
        let reservedAcctIds = this.getGoDeleteRight.map(item => {
            return item.acct_id
          }),
          delAcctIds = this.getShuttleRight.map(item => {
            return item.acct_id
          })
        return {
          reservedAcctIds: reservedAcctIds.join(','),
          delAcctIds: delAcctIds.join(',')
        }
      },
      lookTaskList(){ // 处理跳转查看事件
        this.lookLoading = true // 查看加载中
        let params = {
          listId: this.listId  //taskId
        }
        getLookTaskList(params).then(res => {
          if(this.routeParams.routeType == 'look'){
            this.isLook = true
          }else{
            this.isLook = false
          }
          this.calculateData = res
          this.isShow = true
          //处理确定账户和待定删除账户分类
          this.handleAcctType(res.acctInfos)
          this.lookLoading = false // 查看加载中

        })
      },
      ajaxCalculate (selectParams,rules,left) {        
        console.log('selectParams:',selectParams,'--rules:',rules,'--left:',left)
        if(left.length<1){
          this.$message.error('账户列表不能为空！请导入或上传~')
        }else{        
          //计算-td
          this.isLoading = true
          let params = {
            filter_ip: rules.ipRules,  //ip地址 
            filter_mac: rules.macRules,  //map 
            acctList: left,
            stockCode: selectParams.indexCode,    //证券代码
            startDate: selectParams.selectTradeDate[0], //起止日期
            endDate: selectParams.selectTradeDate[1]
          }

          calculateTD(JSON.stringify(params)).then(res => {
            this.isLoading = false
            this.isShow = true
            // let res = {
            //   branchAcctsList: [],
            //   acctsProfit: [],
            //   stockPriceTrend: [],
            //   optResultList: []
            // }
            if (!res.branchAcctsList)
              res.branchAcctsList = []
              this.calculateData = res

              //处理确定账户和待定删除账户分类
              this.handleAcctType(res.acctInfos)
          })


          //计算-td
          


        }


      },
      ajaxAccountListName () {
        getAccountListName().then(res => {
          this.dialogParams.posListName = res.listName
        })
        // accountArrListQuery({listId: this.listId}).then(res => { // 判断是否保存过名字
        //   if(res[0].list_name == ""){ // list_name为空表示没有保存过
        //     getAccountListName().then(res => { // 获取前缀
        //       this.dialogParams.posListName = res.listName
        //     })
        //   }else{ // list_name不为空赋值为保存过得名字
        //     this.dialogParams.posListName = res[0].list_name
        //     // this.dialogParams.listName = 
        //   }
        // })
        
      },
      ajaxSaveAccountListName () {
        if (this.dialogParams.listName === '') {
          this.$message.warning('列表名不能为空')
          return
        }
        let params = {
          listName: this.dialogParams.posListName + this.dialogParams.listName,
          accList:  this.calculateData.optResultList, // 结果表数据
          acctsProfit : this.calculateData.acctsProfit, // 盈利组数据
          acctInfos: this.$store.getters.getShuttleLeft, // 确定账户组
          taskId: this.routeParams.task_id,//任务ID
          taskStatus: this.routeParams.task_status, //任务状态
          version: this.routeParams.version,   //任务版本
          startDate: this.selectParams.selectTradeDate[0],   //开始日期
          endDate: this.selectParams.selectTradeDate[1],  //结束日期
          listId: this.listId  //taskId
        }
        saveAccountListName(JSON.stringify(params)).then(res => {
          if (res.flag) {
            this.$message.success('保存成功')     
            this.listId = res.listId // 重新赋值listId       
            this.isSave = true // 保存成功后 进行下一步操作
          }else{
            this.$message.error('保存失败，请重试')
            this.isSave = false // 保存失败
          }
          this.dialogVisble = false
        })
      },
      handleChangeStatus(id,user,flag){ // 改变任务状态
        let params = {
          taskId: this.routeParams.task_id,
          reanalUserId: id,
          reanalUser: user,
          taskStatus: this.routeParams.task_status,
          version: this.routeParams.version,
          processId: this.routeParams.process_id,
          reanalFlag: flag,
        }
        changeTaskStatus(params).then(res => {     
          if (res.res.value) {
            this.$message.success('操作成功')
            this.$router.push({ path:'/manipulateTaskList/' })
          }else{
            this.$message.error('操作失败，请重试')
          }

        })
      },
      submitReviewSure(val){ // 提交复核-确定
        let params = val.split(' ')
        this.handleChangeStatus(params[0],params[1],'')
      },
      handleTask(type){ // 处理确认或退回
        // 处理确认退回之前 先自动保存
        let params = {
          listName: '',
          accList:  this.calculateData.optResultList, // 结果表数据
          acctsProfit : this.calculateData.acctsProfit, // 盈利组数据
          acctInfos: this.$store.getters.getShuttleLeft, // 确定账户组
          taskId: this.routeParams.task_id,//任务ID
          taskStatus: this.routeParams.task_status, //任务状态
          version: this.routeParams.version,   //任务版本
          startDate: this.routeParams.start_date,   //开始日期
          endDate: this.routeParams.end_date,  //结束日期
          listId: this.listId  //taskId
        }
        saveAccountListName(JSON.stringify(params)).then(res => {
          if (res) {
            this.$message.success('保存成功')    
            this.handleChangeStatus('','',type)  
          }else{
            this.$message.error('保存失败，请重试')
          }
          this.dialogVisble = false
        })
        
      },


    },
    created () {
      this.ajaxAccountListName()
    },
    mounted () {
      this.routeParams = JSON.parse(this.$route.params.params) // 路由跳转参数初始赋值
      this.listId = this.routeParams.list_id // listId初始赋值
      this.selectParams = {
        selectTradeDate:[this.routeParams.start_date,this.routeParams.end_date]
      } // startDate初始赋值 // endDate初始赋值
      if(this.$route.params.params.length > 2){ //判断任务状态控制操作按钮
        if(this.routeParams.task_status == 'x5'){
          this.isX5 = true
          this.isNotX5 = false
        }else{
          this.isX5 = false
          this.isNotX5 = true
        }
      }
      this.$store.commit('setShuttleLeft', [])  // 初始化-清空穿梭框数据
      this.$store.commit('setShuttleRight', [])  // 初始化-清空穿梭框数据
      //判断操作是否禁用
      if((this.routeParams.task_status != 'x1' && this.routeParams.task_status != 'x3') || this.routeParams.routeType == 'look' ){ //不是分析中不能操作上面的
        this.isLoadingBtn = true // 禁止操作
      }else{
        this.isLoadingBtn = false
      }


    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .manipulate-analysis-list {
    .save-account-list {
      margin: 20px 0;
      text-align: center;
    }
  }
  .onlyLookBack{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 50px;
    left: 0px;
    z-index: 2;
  }
  .onlyLookBox{
    position: relative;
    z-index: -1;
  }
  .backBtn{
    position: relative;
    bottom: -10px;
    right: 0px;
    width: 100%;
    z-index: 3;
    text-align: center;
  }
</style>
<style lang="less">
  .manipulate-analysis-list-dialog {
    .el-dialog__header {
      display: none;
    }
  }
</style>
