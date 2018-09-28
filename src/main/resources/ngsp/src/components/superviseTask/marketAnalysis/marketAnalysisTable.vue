<template>
  <div class="marketAnalysis">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建市场分析报告</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="clearAllData"
        >清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSearch"
        >查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-form ref="marketAnalysis" :model="selectParams" label-width="120px" label-position="left">
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="报告编号">
              <el-input v-model="selectParams.reportNo" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建日期">
              <s-date-picker
                :value="selectParams.createDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange1"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建人">
              <selector-dealer class="customize-width" ref="selectorDealer1" @node-click="handlerClick1" :selectPerson="selectParams.createPerson"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="在办人">
              <selector-dealer class="customize-width" ref="selectorDealer2" @node-click="handlerClick2" :selectPerson="selectParams.procePerson"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="发函日期">
              <s-date-picker
                :value="selectParams.sendDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange2"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态" prop="localStatus">
              <el-select multiple collapse-tags v-model="selectParams.localStatus" size="small" class="customize-width"
                         placeholder="全部">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="24" :md="24" :sm="24">
            <el-form-item label="关键字">
              <el-input v-model="selectParams.keyword" placeholder="" size="small" class="customize-width" :maxlength="50"></el-input>
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
          label="操作"
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
      </margin-table>
      <batch-dialog ref="letterBorrowLendBatchDialog" :letterBorrowBatchSelectArray="letterBorrowBatchSelectArray"  :letterLendBatchSelectArray="letterLendBatchSelectArray" :isBatchLetterLendFlow="isBatchLetterLendFlow"></batch-dialog>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import MarginTable from '../../base/MarginTable'
  import {columns} from './tableColumns'
  import {
    // getUserRoles,
    marketAnalysislist,
    // recalllist,
    marketAnalysisdelete
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      Breadcrumb,
      MarginTable,
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [MinxinVue],
    data () {
      return {
        columns,
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/specialWorkTablelist',
          label: '市场分析'
        }],
        statusOptions: [{
          value: '0',
          label: '分配中'
        }, {
          value: '1',
          label: '拟稿中'
        }, {
          value: '2',
          label: '复核中'
        }, {
          value: '3',
          label: '组长审核中'
        }, {
          value: '4',
          label: '审批中'
        }, {
          value: '5',
          label: '领导审核中'
        }, {
          value: '6',
          label: '确认中'
        }, {
          value: '7',
          label: '待发函'
        }, {
          value: '8',
          label: '办结'
        }],
        selectParams: {
          keyword: '',
          reportNo: '',
          createDateRange: [],
          sendDateRange: [],
          createPerson: '',
          procePerson: '',
          localStatus: []
        },
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        pickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= Date.now() - 8.46e6
          }
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {keyword, reportNo, createDateRange, createPerson, procePerson, sendDateRange, localStatus} = this.$store.state.superviseTask.marketAnalysis
        this.selectParams.keyword = keyword
        this.selectParams.reportNo = reportNo
        this.selectParams.createDateRange = createDateRange
        this.selectParams.createPerson = createPerson
        this.selectParams.procePerson = procePerson
        this.selectParams.sendDateRange = sendDateRange
        this.selectParams.localStatus = localStatus
      }
      this.getAllData()
    },
    methods: {
      handleSdatePickerDateRangeChange1(val) {
        this.selectParams.createDateRange = val
      },
      handleSdatePickerDateRangeChange2(val) {
        this.selectParams.sendDateRange = val
      },
      commitQueryParams () {
        let params = {
          keyword: this.selectParams.keyword, // 关键字
          reportNo: this.selectParams.reportNo, // 报告编号
          createDateRange: this.selectParams.createDateRange, // 创建日期
          createPerson: this.selectParams.createPerson, // 创建人
          procePerson: this.selectParams.procePerson, // 在办人
          sendDateRange: this.selectParams.sendDateRange, // 发函日期
          localStatus: this.selectParams.localStatus // 状态
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveMarketAnalysisQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      handlerClick1(code, name) {
        this.selectParams.createPerson = name
      },
      handlerClick2(code, name) {
        this.selectParams.procePerson = name
      },
      getPageination(val) {
        this.pagination = val
        this.getAllData()
      },
      handleSearch () {
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
              'instanceId': row.instanceId
            }
            params = JSON.stringify(params)
            marketAnalysisdelete(params).then(() => {
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
        this.$router.push({path: '/marketAnalysisForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
      },
      getAllData () {
        let data = {
          'keyword': this.selectParams.keyword,
          'reportNo': this.selectParams.reportNo,
          'createPerson': this.selectParams.createPerson,
          'procePerson': this.selectParams.procePerson,
          'status': this.selectParams.localStatus.join(','),
          'createDateStart': this.selectParams.createDateRange[0] || '',
          'createDateEnd': this.selectParams.createDateRange[1] || '',
          'sendDateStart': this.selectParams.sendDateRange[0] || '',
          'sendDateEnd': this.selectParams.sendDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        marketAnalysislist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          this.tableData = resp.buzidata
          this.total = resp.totalNum
        })
      },
      clearAllData () {
        this.$refs.marketAnalysis.resetFields()
        this.$refs.selectorDealer1.clearValue()
        this.$refs.selectorDealer2.clearValue()
        this.selectParams = {
          keyword: '',
          reportNo: '',
          createDateRange: [],
          sendDateRange: [],
          createPerson: '',
          procePerson: '',
          localStatus: []
        }
      },
      routerProcessPage () {
        // formPage页面进行判断角色信息
        this.$router.push({name: 'marketAnalysisForm'})
        // let username = this.gfnGetUsername()
        // getUserRoles(username).then((resp) => {
        //   if (resp[0].rolename.indexOf('组长') > 0) {
        //     this.$router.push({
        //       path: '/marketAnalysisForm?operate=-2' // 组员-1，组长-2
        //     })
        //   } else {
        //     this.$router.push({
        //       path: '/marketAnalysisForm?operate=-1' // 组员-1，组长-2
        //     })
        //   }
        // })
      }
    }
  }
</script>
<style lang="less" scoped>
  .marketAnalysis {
    .customize-width {
      width: 350px;
    }
  }
</style>
