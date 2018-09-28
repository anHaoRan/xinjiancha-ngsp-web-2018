<template>
  <div class="focusMonitorSecurity">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建日志审计</el-button>
    </div>
    <div>
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
        <el-form :model="selectParams" ref="selectParams" label-width="120px" label-position="left">
          <el-row>
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="任务编号">
                <el-input v-model="selectParams.taskNo" placeholder="" size="small" class="customize-width"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="描述">
                <el-input v-model="selectParams.description" placeholder="请输入描述内容" size="small" class="customize-width"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="创建人">
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
              <el-form-item label="状态">
                <el-select multiple collapse-tags v-model="selectParams.localStatus" placeholder="请选择" size="small" class="customize-width">
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
    </div>
    <el-card class="el-card-table">
      <div slot="header">
        <span>日志审计列表</span>
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
  import MarginTable from '../../base/MarginTable'
  import { logAudittablelist, logAuditdelete } from '../../../service/superviseTask/index.js'
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
        loading: false,
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '',
            label: '日志审计'
          }
        ],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '审计中'
        }, {
          value: '2',
          label: '汇总审计中'
        }, {
          value: '3',
          label: '审批中'
        }, {
          value: '4',
          label: '办结'
        }],
        selectParams: {
          taskNo: '',
          description: '',
          createPerson: '',
          selectDateRange: [],
          localStatus: []
        },
        columns: [
          {label: '任务编号', field: 'taskNo', align: 'center'},
          {label: '描述', field: 'description', align: 'center'},
          {label: '创建人', field: 'createPerson', align: 'center'},
          {label: '创建时间', field: 'createTime', align: 'center'},
          {label: '状态', field: 'localStatus', align: 'center'},
          {label: '在办人', field: 'currentUserNames', align: 'center'}
        ],
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {taskNo, description, createPerson, selectDateRange, localStatus} = this.$store.state.superviseTask.logAudit
        this.selectParams.taskNo = taskNo
        this.selectParams.description = description
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
          description: this.selectParams.description, // 关键字
          createPerson: this.selectParams.createPerson, // 创建人
          selectDateRange: this.selectParams.selectDateRange, // 创建时间
          localStatus: this.selectParams.localStatus // 状态
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveLogAuditQueryParams', params)
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
            logAuditdelete(params).then(() => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleform (row) {
        this.commitQueryParams()
        let isoperateCheck = ''
        let taskId = ''
        if (row.operateCheck === '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess === '处理') {
          isoperateCheck = '2'
        }
        if (row.localStatus === '办结') {

        } else {
          for (let i = 0; i < row.currentUsers.split(',').length; i++) {
            if (row.currentUsers.split(',')[i] === this.gfnGetUsername()) {
              for (let j = 0; j < row.taskId.split(',').length; j++) {
                if (i === j) {
                  taskId = row.taskId.split(',')[j]
                }
              }
            }
          }
        }
        this.$router.push({path: '/logAuditForm', query: {operate: isoperateCheck, taskId: taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
      },
      getAllData () {
        let data = {
          'taskNo': this.selectParams.taskNo,
          'description': this.selectParams.description,
          'createPerson': this.selectParams.createPerson,
          'status': this.selectParams.localStatus.join(','),
          'startDate': this.selectParams.selectDateRange[0] || '',
          'endDate': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        logAudittablelist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          this.tableData = resp.buzidata
          this.total = resp.totalNum
        })
      },
      clearAllData () {
        this.$refs.selectParams.resetFields()
        this.$refs.selectorDealer.clearValue()
        this.selectParams = {
          taskNo: '',
          description: '',
          createPerson: '',
          selectDateRange: [],
          localStatus: []
        }
      },
      routerProcessPage () {
        this.$router.push({
          path: '/logAuditForm'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .focusMonitorSecurity {
    .customize-width {
      width: 350px;
    }
  }
</style>
