<template>
  <div class="surveyList">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建调查单</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="clearAllData">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="getTablelist">查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" label-width="120px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码">
              <stock-code-query class="customize-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建类型">
              <el-select collapse-tags :clearable="true" v-model="selectParams.iscreattype" placeholder="全部" size="small" class="customize-width">
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
            <el-form-item label="申请人">
              <selector-dealer class="customize-width" ref="selectorDealers"
                               @node-click="getApplyPerson"
                               :selectPerson="selectParams.applicanter"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="申请日期">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="24" :md="24" :sm="24">
            <el-form-item label="发函编号">
              <el-input class="customize-width" v-model="selectParams.sendLetterNumber" placeholder="" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>调取资料信息列表</span>
        <letter-borrow-lend-batch-button-group @handleLetterBorrowLendBatchDialogShow="handleLetterBorrowLendBatchDialogShow"></letter-borrow-lend-batch-button-group>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        @selection-change="handleLetterBorrowLendBatchSelectionChange"
        :columns="columns"
        :data="{
          data: tableData,
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
      <batch-dialog ref="letterBorrowLendBatchDialog" :letterBorrowBatchSelectArray="letterBorrowBatchSelectArray"  :letterLendBatchSelectArray="letterLendBatchSelectArray" :isBatchLetterLendFlow="isBatchLetterLendFlow"></batch-dialog>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import {
    postsurveylist,
    postdeleteobd,
    // recalllist
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectRoleComponent
    },
    mixins: [MinxinVue],
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/informationtable',
          label: '调取资料'
        }],
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '预警转入'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '分配中'
        }, {
          value: '3',
          label: '待发函'
        }, {
          value: '4',
          label: '待回函'
        }, {
          value: '5',
          label: '待归档'
        }, {
          value: '6',
          label: '已归档'
        }],
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
          {label: '调取类别', field: 'obtainType', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '申请人', field: 'requesterName', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false},
          {label: '申请日期', field: 'reqTime', align: 'left', sortable: false}
        ],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        tableData: [],
        selectParams: {
          selectDateRange: [],
          iscreattype: '',
          localStatus: [],
          applicanter: '',
          sendLetterNumber: '',
          keyword: ''
        },
        commonData: {
          disabled: false,
          stockCode: ''
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyWord, createdType, localStatus, applicanter, sendLetterNumber, selectDateRange} = this.$store.state.superviseTask.retrieveinformation
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyWord
        this.selectParams.iscreattype = createdType
        this.selectParams.localStatus = localStatus
        this.selectParams.applicanter = applicanter
        this.selectParams.sendLetterNumber = sendLetterNumber
        this.selectParams.selectDateRange = selectDateRange
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyWord: this.selectParams.keyword, // 关键字
          createdType: this.selectParams.iscreattype, // 创建类型
          localStatus: this.selectParams.localStatus, // 状态
          applicanter: this.selectParams.applicanter, // 申请人
          sendLetterNumber: this.selectParams.sendLetterNumber, // 发函编号
          selectDateRange: this.selectParams.selectDateRange
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveRetrieveInfoQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getTablelist () {
        this.commitQueryParams()
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.getAllData()
      },
      handledeleteform (row) {
        if (row.operateDelete === '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {
              instanceId: row.instanceId
            }
            params = JSON.stringify(params)
            postdeleteobd(params).then((resp) => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleform (row) {
        this.commitQueryParams()
        let isoperateCheck = ''
        if (row.operateCheck === '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess === '处理') {
          isoperateCheck = '2'
        }
        this.$router.push({
          name: 'surveyFormPage',
          query: {
            operate: isoperateCheck,
            taskId: row.taskId,
            instanceId: row.instanceId,
            processStatus: row.localStatusCode
          }
        })
      },
      getAllData () {
        let data = {
          'stockCode': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'keyword': this.selectParams.keyword,
          'createType': this.selectParams.iscreattype,
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.applicanter,
          'obtainType': '',
          'applyTimeStart': this.selectParams.selectDateRange[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange[1] || '',
          'sendLetNo': this.selectParams.sendLetterNumber,
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        postsurveylist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          this.tableData = resp.buzidata
          this.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.selectParams.selectDateRange = []
        this.selectParams.iscreattype = ''
        this.selectParams.localStatus = []
        this.selectParams.applicanter = ''
        this.selectParams.keyword = ''
        this.selectParams.sendLetterNumber = ''
      },
      routerProcessPage () {
        this.$router.push({
          path: '/surveyFormPage'
        })
      },
      getApplyPerson (code, name) {
        this.selectParams.applicanter = name
      }
    }
  }
</script>
<style lang="less" scoped>
  .surveyList {
    .customize-width {
      width: 350px;
    }
  }
</style>
