<template>
  <div class="accessRequest">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建权限申请</el-button>
    </div>
    <el-card>
      <div slot="header">
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
          @click="handleSearch">查询
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
          <!--<el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="selectParams.keyWord" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建人" prop="createPerson">
              <selector-dealer class="customize-width" ref="selectorDealers"
                               @node-click="handlerClick"
                               :selectPerson="this.selectParams.createPerson"></selector-dealer>
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
              <!--<el-date-picker-->
                <!--class="customize-width"-->
                <!--:picker-options="pickerOption"-->
                <!--v-model="selectParams.selectDateRange"-->
                <!--type="daterange"-->
                <!--range-separator="至"-->
                <!--start-placeholder="开始日期"-->
                <!--end-placeholder="结束日期"-->
                <!--format="yyyy-MM-dd"-->
                <!--value-format="yyyy-MM-dd"-->
                <!--size="small"></el-date-picker>-->
            </el-form-item>
          </el-col>
          <el-col :xl="24" :md="24" :sm="24">
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
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns"
        :data="{
          data: tableData,
          pageIndex: pagination.currentPage,
          pageRows: pagination.pageSizeNumber,
          total: total
        }">
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
          </template>
        </el-table-column>
      </margin-table>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import MarginTable from '../../base/MarginTable'
  import { AccessRequestlist, AccessRequestdelete } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      Breadcrumb,
      MarginTable,
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [MinxinVue],
    props: ['activeName'],
    data () {
      return {
        loading: false,
        selectParams: {
          selectDateRange: [],
          localStatus: [],
          taskNo: '',
          keyWord: '',
          createPerson: ''
        },
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/specialWorkTablelist',
          label: '权限申请'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '审批中'
        }, {
          value: '2',
          label: '分配中'
        }, {
          value: '3',
          label: '操作中'
        }, {
          value: '4',
          label: '确认中'
        }, {
          value: '5',
          label: '办结'
        }],
        columns: [
          {label: '任务编号', field: 'taskNo', align: 'left', sortable: false},
          {label: '需求描述', field: 'needDesc', align: 'left', sortable: false},
          {label: '创建人', field: 'createPerson', align: 'left', sortable: false},
          {label: '创建时间', field: 'createTime', align: 'left', sortable: false},
          {label: '操作人', field: 'operatorNames', align: 'left', sortable: false},
          {label: '完成日期', field: 'finishTime', align: 'left', sortable: false},
          {label: '操作描述', field: 'operateDesc', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false}
        ],
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
      let {taskNumber, keyWord, createPeople, localStatus, creatTime} = this.$store.state.superviseTask.accessRequest
      this.selectParams.taskNo = taskNumber
      this.selectParams.keyWord = keyWord
      this.selectParams.createPerson = createPeople
      this.selectParams.localStatus = localStatus
      this.selectParams.selectDateRange = creatTime
      }
      this.getAllData()
    },
    methods: {
      handlerClick (code, name) {
        this.selectParams.createPerson = name
      },
      commitQueryParams () {
        let params = {
          taskNumber: this.selectParams.taskNo,
          keyWord: this.selectParams.keyWord,
          createPeople: this.selectParams.createPerson,
          localStatus: this.selectParams.localStatus,
          creatTime: this.selectParams.selectDateRange
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveAccessRequestQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getPageination (val) {
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
            AccessRequestdelete(JSON.stringify(params)).then(() => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleform (row) {
        let isoperateCheck = '0'
        if (row.operateCheck === '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess === '处理') {
          isoperateCheck = '2'
        }
        this.commitQueryParams()
        this.$router.push({path: '/accessRequestForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
      },
      getAllData () {
        let params = {
          'taskNo': this.selectParams.taskNo,
          'founder': this.selectParams.createPerson,
          'status': this.selectParams.localStatus.join(','),
          'startDate': this.selectParams.selectDateRange[0] || '',
          'endDate': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        AccessRequestlist(JSON.stringify(params)).then((resp) => {
          this.loading = false
          const {buzidata, totalNum} = resp
          this.tableData = buzidata
          this.total = totalNum
        })
      },
      clearAllData () {
        this.$refs.selectParams.resetFields()
        this.$refs.selectorDealers.clearValue()
        this.selectParams = {
          selectDateRange: [],
          localStatus: [],
          taskNo: '',
          keyWord: '',
          createPerson: ''
        }
      },
      routerProcessPage () {
        this.$router.push({
          path: '/accessRequestForm'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .accessRequest {
    .customize-width {
      width: 350px;
    }
  }
</style>
