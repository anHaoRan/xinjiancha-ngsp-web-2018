<template>
  <div class="temporaryCalculation">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建临时计算</el-button>
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
      <el-form :model="selectParams" ref="selectParams" :rules="rules" label-width="120px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="任务编号" prop="taskNo">
              <el-input v-model="selectParams.taskNo" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="selectParams.keyWord" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建类型" prop="createType">
              <el-select v-model="selectParams.createType" placeholder="" size="small"  class="customize-width" :clearable="true">
                <el-option
                  v-for="item in createTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建人" prop="createPerson">
              <selector-dealer class="customize-width" ref="selectorDealer" @node-click="handlerClick" :selectPerson="selectParams.createPerson"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建时间">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态" prop="localStatus">
              <el-select collapse-tags :multiple="true" v-model="selectParams.localStatus" placeholder="" size="small" class="customize-width">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleOperate(scope.row)">
              {{scope.row.operateProcess}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateDelete" size="mini" @click="handledeleteform(scope.row)">
              {{scope.row.operateDelete}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleOperate(scope.row)">
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
  import MarginTable from '../../base/MarginTable'
  import {columns} from './tableColumns'
  import {
    temporaryCalculationlist,
    // recalllist,
    temporaryCalculationdelete
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
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
          label: '临时计算'
        }],
        selectParams: {
          selectDateRange: [],
          localStatus: [],
          taskNo: '',
          keyWord: '',
          createType: '',
          createPerson: ''
        },
        createTypeOptions: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '其他流程转入'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '计算中'
        }, {
          value: '3',
          label: '复核中'
        }, {
          value: '4',
          label: '确认中'
        }, {
          value: '5',
          label: '办结'
        }],
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        rules: {}
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {taskNo, keyWord, createType, createPerson, selectDateRange, localStatus} = this.$store.state.superviseTask.temporaryCalculation
        this.selectParams.taskNo = taskNo
        this.selectParams.keyWord = keyWord
        this.selectParams.createType = createType
        this.selectParams.createPerson = createPerson
        this.selectParams.selectDateRange = selectDateRange
        this.selectParams.localStatus = localStatus
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          taskNo: this.selectParams.taskNo, // 任务编号
          keyWord: this.selectParams.keyWord, // 关键字
          createType: this.selectParams.createType, // 创建类型
          createPerson: this.selectParams.createPerson, // 创建人
          selectDateRange: this.selectParams.selectDateRange, // 创建时间
          localStatus: this.selectParams.localStatus // 状态
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveMomentCalculationQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      handlerClick(code, name) {
        this.selectParams.createPerson = name
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
            temporaryCalculationdelete(params).then(() => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleOperate (row) {
        this.commitQueryParams()
        let isoperateCheck = '0'
        if (row.operateCheck === '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess === '处理') {
          isoperateCheck = '2'
        }
        this.$router.push({path: '/temporaryCalculationForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
      },
      getAllData () {
        let data = {
          'keyword': this.selectParams.keyWord,
          'taskNo': this.selectParams.taskNo,
          'founder': this.selectParams.createPerson,
          'status': this.selectParams.localStatus.join(','),
          'startDate': this.selectParams.selectDateRange[0] || '',
          'endDate': this.selectParams.selectDateRange[1] || '',
          'createType': this.selectParams.createType,
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        temporaryCalculationlist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          const {buzidata, totalNum} = resp
          this.tableData = buzidata
          this.total = totalNum
        })
      },
      clearAllData () {
        this.$refs.selectParams.resetFields()
        this.$refs.selectorDealer.clearValue()
        this.selectParams = {
          selectDateRange: [],
          localStatus: [],
          taskNo: '',
          keyWord: '',
          createType: '',
          createPerson: ''
        }
      },
      routerProcessPage () {
        this.$router.push({
          path: '/temporaryCalculationForm'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .temporaryCalculation {
    .customize-width {
      width: 350px;
    }
  }
</style>
