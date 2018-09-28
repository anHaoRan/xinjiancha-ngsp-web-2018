<template>
  <div class="clubReportTableList">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建线索上报</el-button>
    </div>
    <div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>查询条件</span>
          <el-button
            type="info"
            size="small"
            style="float:right;"
            @click="clearAllData"
          >清空
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="float:right;"
            @click="getTablelist"
          >查询
          </el-button>
        </div>
        <el-form :model="selectParams" ref="selectParams" label-width="130px" label-position="left" style="margin-top: 20px;">
          <el-row>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="证券代码及简称：">
                <stock-code-query class="customize-width" :commonData="commonData" @getStockCode="getStockCode" size="small"></stock-code-query>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="关键字：">
                <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="创建类型：">
                <el-select class="customize-width" v-model="selectParams.creatType" placeholder="全部" size="small">
                  <el-option
                    v-for="item in creatTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="状态：">
                <el-select class="customize-width" multiple collapse-tags v-model="selectParams.localStatus" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="申请人：">
                <selector-dealer class="customize-width" ref="selectorDealers"
                                 @node-click="getApplyPerson"
                                 :selectPerson="selectParams.applicantPerson"></selector-dealer>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="在办人：">
                <selector-dealer class="customize-width" ref="selectorDealers"
                                 @node-click="getCurrentPerson"
                                 :selectPerson="selectParams.currentUser"></selector-dealer>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="申请日期：">
                <s-date-picker
                  :value="selectParams.applicationDate"
                  :isRange="true"
                  :propsUpDisabledTime="defaultPropsDisabledTime"
                  @change="handleSdatePickerDateRangeChange1"
                ></s-date-picker>
                <!--                <el-date-picker
                                  v-model="selectParams.applicationDate"
                                  type="daterange"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                                </el-date-picker>-->
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" :sm="24">
              <el-form-item label="发函日期：">
                <s-date-picker
                  :value="selectParams.sendLetterDate"
                  :isRange="true"
                  :propsUpDisabledTime="defaultPropsDisabledTime"
                  @change="handleSdatePickerDateRangeChange2"
                ></s-date-picker>
                <!--<el-date-picker
                  v-model="selectParams.sendLetterDate"
                  type="daterange"
                  size="small"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="el-card-table">
      <div slot="header">
        <span>线索报告列表</span>
        <letter-borrow-lend-batch-button-group @handleLetterBorrowLendBatchDialogShow="handleLetterBorrowLendBatchDialogShow"></letter-borrow-lend-batch-button-group>
      </div>
      <el-table
        :data="clueReportData"
        border
        tooltip-effect="dark"
        highlight-current-row
        max-height="400"
        :reserve-selection="true"
        @selection-change="handleLetterBorrowLendBatchSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="column in clueReportColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          :width="300"
          prop="operateContent"
          label="操作"
          minWidth="6%"
          show-overflow-tooltip>
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
      </el-table>
      <div>
        <el-col :span="24" style="margin-top:10px">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pagenum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalpage"
            @current-change="currentpagination"
            @size-change="sizepagination">
          </el-pagination>
        </el-col>
      </div>
      <batch-dialog ref="letterBorrowLendBatchDialog" :letterBorrowBatchSelectArray="letterBorrowBatchSelectArray"  :letterLendBatchSelectArray="letterLendBatchSelectArray" :isBatchLetterLendFlow="isBatchLetterLendFlow"></batch-dialog>
    </el-card>
  </div>

</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import {
    ClueReporttablelist,
    ClueReportdelete,
    getUserRoles
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      Breadcrumb,
      selectRoleComponent,
      StockCodeQuery,
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [MinxinVue],
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '',
            label: '线索报告'
          }
        ],
        statusOptions: [{
          value: '0',
          label: '创建'
        }, {
          value: '1',
          label: '实时组长审核'
        }, {
          value: '2',
          label: '分配'
        }, {
          value: '3',
          label: '拟稿'
        }, {
          value: '4',
          label: '复核'
        }, {
          value: '5',
          label: '线索组长审核'
        }, {
          value: '6',
          label: '部门审批'
        }, {
          value: '7',
          label: '所领导审批'
        }, {
          value: '8',
          label: '拟稿人确认'
        }, {
          value: '9',
          label: '发函'
        }, {
          value: '10',
          label: '办结'
        }],
        commonData: {
          disabled: false,
          stockCode: ''
        },
        creatTypeOption: [{
          value: '0',
          label: '手工创建'
        }, {
          value: '1',
          label: '其他流程转入'
        }],
        selectParams: {
          keyword: '',
          creatType: '',
          localStatus: [],
          applicantPerson: '', // 申请人
          currentUser: '', // 在办人
          applicationDate: [],
          sendLetterDate: []
        },
        clueReportData: [],
        clueReportColumns: [
          {label: '证券代码及简称', field: 'security', align: 'center', minWidth: '6%'},
          {label: '创建类型', field: 'createType', align: 'center', minWidth: '6%'},
          {label: '状态', field: 'localStatus', align: 'center', minWidth: '6%'},
          {label: '申请人', field: 'requesterName', align: 'center', minWidth: '6%'},
          {label: '在办人', field: 'currentUserNames', align: 'center', minWidth: '6%'},
          {label: '申请日期', field: 'createTime', align: 'center', minWidth: '6%'},
          {label: '发函日期', field: 'sendDate', align: 'center', minWidth: '6%'},
        ],
        selectRole: {
          dialogFormVisble: false,
        },
        personFlag: '0', // 0,创建人
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCodeName, keyword, creatType, taskStatus, applicantPerson, currentUser, applicationDate, sendLetterDate} = this.$store.state.superviseTask.clueReport
        this.commonData.stockCode = stockCodeName
        this.selectParams.keyword = keyword
        this.selectParams.creatType = creatType
        this.selectParams.localStatus = taskStatus
        this.selectParams.applicantPerson = applicantPerson
        this.selectParams.currentUser = currentUser
        this.selectParams.applicationDate = applicationDate
        this.selectParams.sendLetterDate = sendLetterDate
      }
      console.log(this.selectParams.stockCode)
      this.getAllData()
    },
    methods: {
      handleSdatePickerDateRangeChange1(val) {
        this.selectParams.applicationDate = val
      },
      handleSdatePickerDateRangeChange2(val) {
        this.selectParams.sendLetterDate = val
      },
      getApplyPerson (code, name) {
        this.selectParams.applicantPerson = name
      },
      getCurrentPerson (code, name) {
        this.selectParams.currentUser = name
      },
      commitQueryParams () {
        let params = {
          stockCodeName: this.commonData.stockCode,
          keyword: this.selectParams.keyword,
          creatType: this.selectParams.creatType,
          taskStatus: this.selectParams.localStatus,
          applicantPerson: this.selectParams.applicantPerson,
          currentUser: this.selectParams.currentUser,
          applicationDate: this.selectParams.applicationDate,
          sendLetterDate: this.selectParams.sendLetterDate
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveClueReportQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getTablelist () {
        this.commitQueryParams()
        this.currentPage = 1
        this.pagenum = 10
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
            ClueReportdelete(params).then((resp) => {
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
          path: '/clueReportForm',
          query: {
            operate: isoperateCheck,
            taskId: row.taskId,
            instanceId: row.instanceId,
            processStatus: row.localStatusCode
          }
        })
      },
      getAllData () {
        // let startime = ''
        // let endtime = ''
        // let sendDateStart = ''
        // let sendDateEnd = ''
        // if (!this.selectParams.applicationDate) {
        // } else {
        //   startime = this.selectParams.applicationDate[0]
        //   endtime = this.selectParams.applicationDate[1]
        // }
        // if (!this.selectParams.sendLetterDate) {
        // } else {
        //   sendDateStart = this.selectParams.sendLetterDate[0]
        //   sendDateEnd = this.selectParams.sendLetterDate[1]
        // }
        let data = {
          'keyword': this.selectParams.keyword,
          'security': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'createPerson': String(this.selectParams.applicantPerson),
          'currentUserNames': String(this.selectParams.currentUser),
          'createType': this.selectParams.creatType,
          'status': this.selectParams.localStatus.length === 0 ? '' : this.selectParams.localStatus.join(','),
          'createDateStart': this.selectParams.applicationDate[0] || '',
          'createDateEnd': this.selectParams.applicationDate[1] || '',
          'sendDateStart': this.selectParams.sendLetterDate[0] || '',
          'sendDateEnd': this.selectParams.sendLetterDate[1] || '',
          'pageIndex': this.currentPage,
          'pageRows': this.pagenum
        }
        let isparams = JSON.stringify(data)
        ClueReporttablelist(isparams).then((resp) => {
          this.clueReportData = resp.buzidata
          this.totalpage = resp.totalNum
        })
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.selectParams.keyword = ''
        this.selectParams.creatType = ''
        this.selectParams.applicantPerson = ''
        this.selectParams.localStatus = []
        this.selectParams.currentUser = ''
        this.selectParams.applicationDate = []
        this.selectParams.sendLetterDate = []
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      currentpagination (val) {
        this.currentPage = val
        this.getAllData()
      },
      sizepagination (val) {
        this.pagenum = val
        this.getAllData()
      },
      routerProcessPage () {
        this.$router.push({
          path: `/clueReportForm`
        })
      }
    }
  }
</script>

<style lang="less">
  .clubReportTableList {
    .customize-width {
      width:350px;
    }
  }
</style>
