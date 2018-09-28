<template>
  <div class="account-transfer-table">
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        <div>
          确定账户列表
          <div>
            <el-button
              type="info"
              size="small"
              :disabled="isLoadingBtn"
              @click="download">模板下载
            </el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="isLoadingBtn || data.length == 0"
              @click="downloadAccount">下载账户
            </el-button>
            <file-upload
              style="display: inline-block;float: right"
              :disabled="isLoadingBtn"
              :isShowSuccessMessage="true"
              :limitFileType="['xls', 'xlsx']"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              :uploadOption="{size: 'small',type: 'primary',name: '上传账户'}"
              :uploadParams="uploadParams1"
              @getTxtCon="getTxtData"
            ></file-upload>
            <el-button
              type="primary"
              size="small"
              :disabled="isLoadingBtn"
              @click="importAccount">导入账户列表
            </el-button>
          </div>
        </div>
        <div>不确定账户列表</div>
      </div>
      <div
        v-loading="isLoading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <transfer-table
          :data="data"
          :columns="columns"
          :columnsRight="columns2"
          :value="value"
          ref="accountTransfer"
          @update="handleUpdate"
        ></transfer-table>
        <div class="el-card__header">查询条件</div>
        <el-form :model="selectParams" ref="selectParams" :rules="rules" :inline="true" label-width="100px"
                 label-position="left" style="padding: 0 20px;">
          <el-form-item label="证券代码" prop="indexCode">
            <stock-code-query :commonData="submitData" :clearable='false' @getStockCode="getStockCode"/>
          </el-form-item>
          <el-form-item label="起止时间" prop="selectTradeDate">
            <el-date-picker v-model="selectParams.selectTradeDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="yyyyMMdd" value-format="yyyyMMdd"
                            size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="isLoadingBtn"
              type="primary"
              size="small"
              @click="calculation('selectParams')">计算
            </el-button>
          </el-form-item>
          <el-form-item>
            <!--物理关联清洗规则-->
            <cleaning-rules-box @rules="getRules"
              :disabled="isLoadingBtn" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="操纵分析列表"
      class="openList"
      :visible.sync="dialogVisble">
      <div style="padding: 0 20px;margin-bottom: 20px;">
        <label>列表名称</label>
        <el-input style="width: 200px;" v-model="dialogSelectParamsName" size="small"/>
        <el-button @click="ajaxAccountArrListQuery" size="small" type="primary">查询</el-button>
      </div>
      <el-table
        max-height="400"
        :data="operationAnalysisList"
        v-if="dialogVisble">
        <el-table-column
          align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row.list_id" v-model="listRadio"><br/></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :align="item.align"
          :show-overflow-tooltip="true"
          :key="index"
          :prop="item.field"
          :label="item.label"
          v-for="(item,index) in dialogColumns"
        ></el-table-column>
      </el-table>
      <div slot="footer" style="text-align: center">
        <el-button @click="ajaxAccountListImport" size="small" type="primary">导入</el-button>
        <el-button @click="dialogVisble=false" size="small" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { tradeDate } from '@/service/common/commonFunc'
  import {
    accountArrListQuery,
    accountListImport,
    accountInfoListQuery
  } from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'account-transfer-table',
    props: {},
    components: {
      TransferTable: () => import('./others/transferTable'),
      FileUpload: () => import('@/components/common/textUpload'),
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      cleaningRulesBox: () => import('./AccountTransferTable/cleaningRulesBox')
    },
    mixins: [],
    data () {
      return {
        uploadOption: {
          loading: false,
          name: '上传账户',
          size: 'small',
          type: 'primary'
        },
        uploadParams1: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'acct_type'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        columns: [
          {label: '账户代码', field: 'acct_id', align: 'left'},
          {label: '账户名称', field: 'acct_name', align: 'left'},
          {label: '会员名称', field: 'mem_name', align: 'left'},
          {label: '营业部名称', field: 'branch_name', align: 'left'},
          {label: '一码通', field: 'ccrc_acct_id', align: 'left'},
          {label: '账户来源', field: 'resource', align: 'left', formatter: this.acctRsByName},
          {label: '账户类型', field: 'acct_type', align: 'left'}
        ],
        columns2: [
          {label: '账户代码', field: 'acct_id', align: 'left'},
          {label: '账户名称', field: 'acct_name', align: 'left'},
          {label: '会员名称', field: 'mem_name', align: 'left'},
          {label: '营业部名称', field: 'branch_name', align: 'left'},
          {label: '一码通', field: 'ccrc_acct_id', align: 'left'},
          {label: '账户来源', field: 'resource', align: 'left', formatter: this.acctRsByName}
        ],
        isLoading: false,
        isLoadingBtn: false,
        selectParams: {
          indexCode: '',
          indexName: '',
          selectTradeDate: []
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        rules: {
          indexCode: [
            {required: true, message: '请输入证券代码', trigger: 'change'}
          ],
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        },
        routerParams: null,
        //  弹出框
        dialogVisble: false,
        dialogSelectParamsName: '',
        dialogColumns: [
          {
            field: 'create_time',
            align: 'left',
            label: '列表生成日期'
          }, {
            field: 'list_name',
            align: 'left',
            label: '列表名'
          }
        ],
        operationAnalysisList: [],
        listRadio: '',
        determineAccounts: [],
        ipmacRules: {
          ipRules: ['192.168.0.0~192.168.255.255','10.0.0.0~10.255.255.255','0.0.0.0~0.0.0.0','123.0.0.1~123.0.0.1','172.16.0.0~172.31.255.255'],
          macRules: ['00-00-00-00-00-00','FF-FF-FF-FF-FF-FF','0C-5B-8F-27-9A-64','02-1E-10-1F-00-00','00-1E-10-1F-00-00']
        },

      }
    },
    computed: {
      data: function () {
        return this.$store.getters.getShuttleLeft
      },
      value: function () {
        return JSON.parse(JSON.stringify(this.$store.getters.getShuttleRight))
      }
    },
    watch: {
      // 'routerParams.acctIdArr': { // 监听路由跳转账户参数变换
      //   handler: function () {
      //     this.ajaxAccountInfoListQuery(this.routerParams.acctIdArr)
      //   }
      // },
      'routerParams.routeType': { // 监听路由跳转类型
        handler: function () {
          if(this.routerParams.routeType == 'new' || this.routerParams.routeType == 'open'){ // 新建或导入
            // 处理参数账户
            let route = this.routerParams.acctIdArr.split(','),
                arr = []
            for(var i=0;i<route.length;i++){
              let obj = {
                acct_id: route[i],
                resource: '1',
                acct_type: '确定',
              }
              arr.push(obj)
            }
            this.$store.dispatch('setShuttleLeft', arr)
          }else if(this.routerParams.routeType == 'look'){ // 查看
            this.$emit('lookTaskList')
            this.isLoadingBtn = true // 禁止操作
          }

        }
      },
      'routerParams.list_id': { // 监听路由跳转类型
        handler: function () {
          if(this.routerParams.list_id != ''){ // 处理获取数据
            this.$emit('lookTaskList')
          }
          if(this.routerParams.task_status != 'x1' && this.routerParams.task_status != 'x3'){ //不是分析中不能操作上面的
            this.isLoadingBtn = true // 禁止操作
          }

        }
      },


    },
    methods: {
      getRules(rules){ // 获取过滤规则
        this.ipmacRules = rules
      },
      //  获取交易偏移量，默认
      ajaxTradeDate () {
        tradeDate(-1).then(res => {
          this.selectParams.selectTradeDate = [res, res]
        })
      },
      getStockCode (stockCodeData) {
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.indexCode = indexCode
          this.selectParams.indexName = indexName
        }
      },
      importAccount () {
        this.ajaxAccountArrListQuery()
        this.dialogVisble = true
      },
      ajaxAccountArrListQuery () {
        accountArrListQuery({listName: this.dialogSelectParamsName}).then(res => {
          this.operationAnalysisList = res
        })
      },
      ajaxAccountListImport () {
        this.isLoading = true
        this.isLoadingBtn = true
        this.dialogVisble = false
        accountListImport({listId: this.listRadio}).then(res => {
          this.handleTransferTable(res)
        })
      },
      ajaxAccountInfoListQuery (ids, resource = 1) {
        this.isLoading = true
        this.isLoadingBtn = true
        accountInfoListQuery({
          acctIds: ids,
          resource: resource
        }).then(res => {
          this.handleTransferTable(res)
        })
      },
      validateAcctType(res){// 上传验证账户类型
        for(var i =0;i<res.length;i++){
          if(res[i].acct_type.match('确定')){
            res[i].acct_type = '确定'
          }else if(res[i].acct_type.match('待定')){
            res[i].acct_type = '待定'
          }else if(res[i].acct_type.match('删除')){
            res[i].acct_type = '删除'
          }
        }
      },
      getTxtData (val) {
        this.isLoading = true
        this.isLoadingBtn = true
        let res = val.Sheet0
        this.validateAcctType(res)
        this.handleTransferTable(res,'2')
      },
      handleTransferTable(res,src){ // 处理表格穿梭数据
        // this.$store.dispatch('setShuttleLeft', []) // 初始化清空
        if (res) {
          this.determineAccounts = res
          //处理账户来源
          if(src){
            for(var i=0;i<res.length;i++){
              res[i].resource = src
            }
          }
          this.$store.commit('setShuttleLeft', res)
          //处理确定账户和待定删除账户分类
          let arr = []
          for(var i=0;i<res.length;i++){
            if(res[i].acct_type.trim() == '待定' || res[i].acct_type.trim() == '删除'){
              arr.push(res[i])
            }
          }
          this.$store.commit('setShuttleRight', arr)

        }
        this.isLoading = false
        this.isLoadingBtn = false
      },
      handleUpdate (value,data) {
        this.$store.commit('setShuttleLeft', [...data,...value])
        this.$store.commit('setShuttleRight', value)
      },
      calculation (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$store.commit('setTransfer', this.$refs.accountTransfer)
            this.$emit('calculation', this.selectParams,this.ipmacRules,this.data)
          }
        })
      },
      acctRsByName (row, column, cellValue) {
        let map = {
          1: '自动化初筛',
          2: '用户上传',
          3: '线索上报传入'
        }
        return map[cellValue]
      },
      download () {
        this.gfnDownloadTemplateFile({code: 'analysislist.accounts'})
      },
      downloadAccount(){ // 下载账户
        this.$message.info('正在导出表格数据，请稍等~')
        let downloadParams = {
          fileType: 'xlsx',
          tableColumns: [
            {
              'sheetName': '确定账户列表',
              'fileColumns': this.columns
            }
          ],
          acctArrExp: this.data
        }
        this.gfnExportFileWithForm('/specialqry/operate/v1/analysis-svct-export',downloadParams)
      }

    },
    created () {
      this.routerParams = JSON.parse(this.$route.params.params) //读取路由参数-报错
    },
    mounted () {
      if(this.$route.params.params.length > 2){
        this.submitData.stockCode = this.routerParams.sec_code + ' ' + this.routerParams.sec_name //页面跳转获取代码名称
        this.selectParams.indexCode = this.routerParams.sec_code //页面跳转获取代码
      }
      // 判断日期显示
      if(this.routerParams.start_date != ""){
        this.selectParams.selectTradeDate = [this.routerParams.start_date,this.routerParams.end_date]
      }else{
        this.ajaxTradeDate()
      }
      


    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .account-transfer-table {
    .el-transfer__button {
      border-radius: 0;
    }
    .clearfix {
      display: flex;
      > div {
        flex: 1;
        display: inherit;
        justify-content: space-between;
      }
      > div + div {
        padding-left: 20px;
        margin-left: 90px;
      }
    }
    .openList {
      .el-dialog__body {
        padding: 30px 0;
      }
    }
  }
</style>
