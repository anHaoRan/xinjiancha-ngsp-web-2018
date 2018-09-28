<template>
  <div class="dataAssoList">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建数据协查信息</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" size="small" style="float:right;" @click="clearAllData">清空</el-button>
        <el-button type="primary" size="small" style="float:right;" @click="getTablelist">查询</el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-form ref="selectParamsRef" :model="selectParams" label-width="145px" label-position="left">
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码">
              <stock-code-query :commonData="commonData" @getStockCode="getStockCode" class="customize-width"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input v-model="selectParams.keyword" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建类型">
              <el-select collapse-tags :clearable="true" v-model="selectParams.createType" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="item in creattype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="item in isstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="申请人">
              <selector-dealer
                class="customize-width" ref="selectorDealers"
                @node-click="getApplyPerson"
                :selectPerson="selectParams.applicanter"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="在办人">
              <selector-dealer
                class="customize-width" ref="selectorDealers"
                @node-click="getCurrentPerson"
                :selectPerson="selectParams.people"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="申请日期">
              <s-date-picker
                :value="selectParams.selectDateRange1"
                :isRange="true"
                @change="handleSelectDateRangeChange1"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="发函日期">
              <s-date-picker
                :value="selectParams.selectDateRange2"
                :isRange="true"
                @change="handleSelectDateRangeChange2"
              ></s-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <letter-borrow-lend-batch-button-group @handleLetterBorrowLendBatchDialogShow="handleLetterBorrowLendBatchDialogShow"></letter-borrow-lend-batch-button-group>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        @selection-change="handleLetterBorrowLendBatchSelectionChange"
        :columns="columns"
        :data="{
          data: inquiredata,
          pageIndex: pagination.currentPage,
          pageRows: pagination.pageSizeNumber,
          total: total
        }">
        <el-table-column
          slot="tableColumnsUnshift"
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="80px"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :width="300"
          slot="tableColumnsPush"
          prop="operateContent"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleform(scope.row)">
              {{scope.row.operateProcess}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateDelete" size="mini" @click="handledeleteform(scope.row)">
              {{scope.row.operateDelete}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleform(scope.row)">
              {{scope.row.operateCheck}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCancel" size="mini" @click="recall(scope.row)">
              {{scope.row.operateCancel}}
            </el-button>
            <el-button type="text" v-if="scope.row.isCanBorrow" size="mini" @click="handleLetterBorrrow(scope.row)">
              借阅
            </el-button>
            <el-button type="text" v-if="scope.row.isCanLend" size="mini" @click="handleLetterLend(scope.row)">
              传阅
            </el-button>
          </template>
        </el-table-column>
      </margin-table>
    </el-card>
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item label="创建类型：" :label-width="formLabelWidth">
          <el-select v-model="towhere" placeholder="" size="small" style="width:70%">
            <el-option
              v-for="item in istowhere"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
        <el-button type="primary" size="small" @click="cancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
    <batch-dialog ref="letterBorrowLendBatchDialog" :letterBorrowBatchSelectArray="letterBorrowBatchSelectArray"  :letterLendBatchSelectArray="letterLendBatchSelectArray" :isBatchLetterLendFlow="isBatchLetterLendFlow"></batch-dialog>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import {
    dataassociationtablelist,
    getUserRoles,
    // recalllist,
    dataassociationdelete
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      Breadcrumb,
      selectRoleComponent
    },
    props: ['activeName'],
    mixins: [MinxinVue],
    data () {
      return {
        breadcrumbItems: [
          {router: '', label: '监察任务'},
          {router: '/tablelist', label: '数据协查'}
        ],
        creattype: [
          {value: '1', label: '手工创建'},
          {value: '0', label: '信息化导入'}
        ],
        classification: [
          {value: '0', label: '公司管理一部'},
          {value: '1', label: '会员部'}
        ],
        isstatus: [
          {value: '0', label: '分配中'},
          {value: '1', label: '拟稿中'},
          {value: '2', label: '复核中'},
          {value: '3', label: '审核中'},
          {value: '4', label: '审批中'},
          {value: '5', label: '确认中'},
          {value: '6', label: '待发函'},
          {value: '7', label: '办结'}
        ],
        selectParams: {
          createType: '',
          localStatus: [],
          applicanter: '',
          people: '',
          keyword: '',
          selectDateRange1: [],
          selectDateRange2: []
        },
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '申请人', field: 'requesterName', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false},
          {label: '申请日期', field: 'reqTime', align: 'left', sortable: false},
          {label: '发函日期', field: 'sendDate', align: 'left', sortable: false}
        ],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        inquiredata: [],
        dialogFormVisble: false,
        formLabelWidth: '120px',
        towhere: '创建并分配',
        istowhere: [
          {value: '创建并分配', label: '创建并分配'},
          {value: '创建并拟稿', label: '创建并拟稿'}
        ],
        commonData: {
          disabled: false,
          stockCode: ''
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyword, createType, localStatus, applicanter, people, selectDateRange1, selectDateRange2} = this.$store.state.superviseTask.dataAssociation
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyword
        this.selectParams.createType = createType
        this.selectParams.localStatus = localStatus
        this.selectParams.applicanter = applicanter
        this.selectParams.people = people
        this.selectParams.selectDateRange1 = selectDateRange1
        this.selectParams.selectDateRange2 = selectDateRange2
      }
      this.getAllData()
    },
    methods: {
      handleSelectDateRangeChange1(val) {
        this.selectParams.selectDateRange1 = val
      },
      handleSelectDateRangeChange2(val) {
        this.selectParams.selectDateRange2 = val
      },
      getApplyPerson (code, name) {
        this.selectParams.applicanter = name
      },
      getCurrentPerson (code, name) {
        this.selectParams.people = name
      },
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyword: this.selectParams.keyword, // 关键字
          createType: this.selectParams.createType, // 创建类型
          localStatus: this.selectParams.localStatus, // 状态
          applicanter: this.selectParams.applicanter, // 申请人
          people: this.selectParams.people, // 在办人
          selectDateRange1: this.selectParams.selectDateRange1, // 申请日期
          selectDateRange2: this.selectParams.selectDateRange2 // 发函日期
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveDataAssociationQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getTablelist () {
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.commitQueryParams()
        this.getAllData()
      },
      handledeleteform (row) {
        if (row.operateDelete == '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {
              'instanceId': row.instanceId
            }
            params = JSON.stringify(params)
            dataassociationdelete(params).then((resp) => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleform (row) {
        this.commitQueryParams()
        let isoperateCheck = ''
        if (row.operateCheck == '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
        this.$router.push({
          name: 'dataAssocFormPage',
          query: {
            operate: isoperateCheck,
            taskId: row.taskId,
            instanceId: row.instanceId,
            processStatus: row.localStatusCode
          }
        })
      },
      getAllData () {
        // let createType = this.selectParams.createType
        // if (createType.indexOf('ALL') != -1) {
        //   createType = 'ALL'
        // }
        // let localStatus = this.selectParams.localStatus.join(',')
        // if (localStatus.indexOf('ALL') != -1) {
        //   localStatus = 'ALL'
        // }
        // let proposer = this.selectParams.applicanter
        // if (proposer.indexOf('ALL') != -1) {
        //   proposer = 'ALL'
        // }
        // let procePerson = this.selectParams.people
        // if (procePerson.indexOf('ALL') != -1) {
        //   procePerson = 'ALL'
        // }
        let data = {
          'stockCode': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'keyword': this.selectParams.keyword,
          'createType': this.selectParams.createType,
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.applicanter,
          'procePerson': this.selectParams.people,
          'applyTimeStart': this.selectParams.selectDateRange1[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange1[1] || '',
          'respTimeStart': this.selectParams.selectDateRange2[0] || '',
          'respTimeEnd': this.selectParams.selectDateRange2[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        let isparams = JSON.stringify(data)
        dataassociationtablelist(isparams).then((resp) => {
          this.loading = false
          this.inquiredata = resp.buzidata
          this.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.selectParams.selectDateRange1 = []
        this.selectParams.selectDateRange2 = []
        this.selectParams.createType = ''
        this.selectParams.localStatus = []
        this.selectParams.applicanter = ''
        this.selectParams.people = ''
        this.selectParams.keyword = ''
      },
      routerProcessPage () {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          let flag = false
          resp.forEach(item => {
            if (item.rolename.indexOf('组长') > -1) { // 组长
              flag = true
            }
          })
          if (flag) {
            this.dialogFormVisble = true
          } else {
            this.$router.push({
              path: '/dataAssocFormPage?operate=-1'
            })
          }
        })
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
      },
      veryfy () {
        this.dialogFormVisble = false
        if (this.towhere == '创建并分配') {
          this.$router.push({
            path: './dataAssocFormPage?operate=-2'
          })
        }
        if (this.towhere == '创建并拟稿') {
          this.$router.push({
            path: './dataAssocFormPage?operate=-1'
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .dataAssoList {
    .customize-width {
      width:350px
    }
  }
</style>
