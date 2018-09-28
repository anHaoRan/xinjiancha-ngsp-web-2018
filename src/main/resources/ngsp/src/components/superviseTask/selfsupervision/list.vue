<template>
  <div class="selfSupervisionList">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建自律监管处罚单</el-button>
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
              <el-select
                class="customize-width"
                collapse-tags :clearable="true"
                v-model="selectParams.createType"
                placeholder="全部" size="small">
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
            <el-form-item label="监管分类">
              <el-select
                class="customize-width"
                collapse-tags :clearable="true"
                :multiple="true"
                v-model="selectParams.isclassification"
                placeholder="全部" size="small">
                <el-option
                  v-for="item in classification"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态">
              <el-select
                class="customize-width"
                collapse-tags :clearable="true"
                :multiple="true"
                v-model="selectParams.localStatus"
                placeholder="全部" size="small">
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
            <el-form-item label="申请人">
              <selector-dealer class="customize-width" ref="selectorDealers"
                               @node-click="getApplyPerson"
                               :selectPerson="selectParams.applicanter"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="在办人">
              <selector-dealer class="customize-width" ref="selectorDealers"
                               @node-click="getCurrentPerson"
                               :selectPerson="selectParams.people"></selector-dealer>
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
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="发函编号">
              <el-input class="customize-width" v-model="selectParams.sendLetterNumber" placeholder="" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>自律监管信息列表</span>
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
      <batch-dialog ref="letterBorrowLendBatchDialog" :letterBorrowBatchSelectArray="letterBorrowBatchSelectArray"  :letterLendBatchSelectArray="letterLendBatchSelectArray" :isBatchLetterLendFlow="isBatchLetterLendFlow"></batch-dialog>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import {
    reqSlsProcessTableData,
    postselfgulationlist,
    postdelete,
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
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/selfregulation',
          label: '自律监管'
        }],
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '预警转入'
        }],
        classification: [{
          value: '0',
          label: '标准化监管'
        }, {
          value: '1',
          label: '差异化监管'
        }, {
          value: '2',
          label: '纪律处分'
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
        // isapplicanter: [],
        selectRole: {
          dialogFormVisble: false
        },
        personFlag: '0', // 0,申请人，1，在办人
        // ispeople: [],
        iscreattype: '',
        isclassification: [],
        localStatus: [],
        applicanter: '',
        people: '',
        code: '',
        keyword: '',
        sendLetterNumber: '',
        selectParams: {
          keyword: '',
          createType: '',
          isclassification: [],
          localStatus: [],
          applicanter: '',
          people: '',
          selectDateRange: [],
          sendLetterNumber: ''
        },
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
          {label: '监管分类', field: 'superviseStandard', align: 'left', sortable: false},
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
        inquiredata: [],
        operate: [],
        deal: false,
        delet: false,
        retract: false,
        view: false,
        dimensionQueryForm: {
          beginDate: '',
          endDate: '',
        },
        commonData: {
          disabled: false,
          stockCode: ''
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.dimensionQueryForm.endDate).getTime()
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.beginDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyword, createType, localStatus, applicanter, people, selectDateRange, sendLetterNumber, isclassification} = this.$store.state.superviseTask.selfsupervision
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyword
        this.selectParams.createType = createType
        this.selectParams.localStatus = localStatus
        this.selectParams.applicanter = applicanter
        this.selectParams.isclassification = isclassification
        this.selectParams.people = people
        this.selectParams.selectDateRange = selectDateRange
        this.selectParams.sendLetterNumber = sendLetterNumber
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyword: this.selectParams.keyword, // 关键字
          createType: this.selectParams.createType, // 创建类型
          isclassification: this.selectParams.isclassification, // 监管分类
          localStatus: this.selectParams.localStatus, // 状态
          applicanter: this.selectParams.applicanter, // 申请人
          people: this.selectParams.people, // 在办人
          selectDateRange: this.selectParams.selectDateRange, // 申请日期
          sendLetterNumber: this.selectParams.sendLetterNumber // 发函编号
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveSelfGulationQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getTablelist () {
        this.commitQueryParams()
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.getAllData()
      },
      handledeleteform (row) {
        if (row.operateDelete == '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            postdelete(row.instanceId).then((resp) => {
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
          name: 'selfSupervisionFormPage',
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
          'createType': this.selectParams.createType,
          'superviseStandard': this.selectParams.isclassification.join(','),
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.applicanter,
          'procePerson': this.selectParams.people,
          'applyTimeStart': this.selectParams.selectDateRange[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange[1] || '',
          'sendLetNo': this.selectParams.sendLetterNumber,
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        reqSlsProcessTableData(data).then((resp) => {
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
        this.selectParams = {
          selectDateRange: [],
          createType: '',
          isclassification: [],
          localStatus: [],
          applicanter: '',
          people:  '',
          keyword:'',
          sendLetterNumber: ''
        }
      },
      routerProcessPage () {
        this.$router.push({
          name: 'selfSupervisionFormPage'
        })
      },
      getApplyPerson (code, name) {
        this.selectParams.applicanter = name
      },
      getCurrentPerson (code, name) {
        this.selectParams.people = name
      }
    }
  }
</script>
<style lang="less" scoped>
  .selfSupervisionList {
    .customize-width {
      width: 350px
    }
  }
</style>
