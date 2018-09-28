<template>
  <div class="letterBorrow">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <el-tabs v-model="activeTabName" @tab-click="getAllData">
        <el-tab-pane :name="'0'" label="函件借阅"></el-tab-pane>
        <el-tab-pane :name="'1'" label="函件传阅"></el-tab-pane>
      </el-tabs>
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
          <el-form ref="letterBorrowForm" :model="selectParams" label-width="120px" label-position="left">
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="函件编号">
                <el-input v-model="selectParams.letterNumber" placeholder="" size="small" class="customize-width"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="关键字">
                <el-input v-model="letterBorrowForm.keyWord" placeholder="" size="small" class="customize-width"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="创建人">
                <selector-dealer class="customize-width" ref="selectorDealer1" @node-click="handlerClick1" :selectPerson="selectParams.requesterName"></selector-dealer>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="在办人">
                <selector-dealer class="customize-width" ref="selectorDealer2" @node-click="handlerClick2" :selectPerson="selectParams.currentUserNames"></selector-dealer>
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
            <!-- :propsUpDisabledTime="defaultPropsDisabledTime" -->
            <el-col :xl="8" :md="12" :sm="24">
              <el-form-item label="创建日期">
                <s-date-picker
                  :value="selectParams.selectDateRange"
                  :isRange="true"
                  @change="handleSdatePickerDateRangeChange"
                ></s-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <margin-table
        style="margin-top:15px"
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
  import MarginTable from '../../base/MarginTable'
  import { letterBorrowlist, letterBorrowdelete, ltlProcessList, letterLendDelete } from '../../../service/superviseTask/index.js'
  import {columns1, columns2} from './tableColumns'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      Breadcrumb,
      MarginTable,
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [MinxinVue],
    watch: {
      activeTabName(val) {
        if (val === '1') {
          this.columns = columns2
        } else {
          this.columns = columns1
        }
      }
    },
    data () {
      return {
        columns1,
        columns2,
        columns: columns1,
        loading: false,
        activeTabName: '0',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '',
          label: '函件借(传)阅'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '组长审核中'
        }, {
          value: '2',
          label: '函件组长审核中'
        }, {
          value: '3',
          label: '确认中'
        }, {
          value: '4',
          label: '办结'
        }],
        selectParams: {
          letterNumber: '',
          keyWord: '',
          requesterName: '',
          currentUserNames: '',
          localStatus: [],
          selectDateRange: []
        },
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0
      }
    },
    mounted () {
      this.activeTabName = this.$store.state.superviseTask.letterBorrow.activeTabName || '0'
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {letterNumber, keyWord, requesterName, currentUserNames, localStatus, selectDateRange} = this.$store.state.superviseTask.letterBorrow
        this.selectParams.letterNumber = letterNumber
        this.selectParams.keyWord = keyWord
        this.selectParams.requesterName = requesterName
        this.selectParams.currentUserNames = currentUserNames
        this.selectParams.localStatus = localStatus
        this.selectParams.selectDateRange = selectDateRange
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          letterNumber: this.selectParams.letterNumber, // 函件编号
          keyWord: this.selectParams.keyWord, // 关键字
          requesterName: this.selectParams.requesterName, // 创建人
          currentUserNames: this.selectParams.currentUserNames, // 在办人
          localStatus: this.selectParams.localStatus, // 状态
          selectDateRange: this.selectParams.selectDateRange // 借阅日期
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveLetterBorrowQueryParams', params)
        this.$store.commit('saveUser', user)
        this.$store.commit('saveLetterBorrowLendTabs', String(this.activeTabName))
      },
      handlerClick1(code, name) {
        this.selectParams.requesterName = name
      },
      handlerClick2(code, name) {
        this.selectParams.currentUserNames = name
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
            if (String(this.activeTabName) === '1') {
              // 传阅
              letterLendDelete(params).then(() => {
                this.getAllData()
              })
            } else {
              // 借阅
              letterBorrowdelete(params).then(() => {
                this.getAllData()
              })
            }
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
        if (String(this.activeTabName) === '1') {
          this.$router.push({path: '/letterLendFormPage', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
        } else {
          this.$router.push({path: '/letterBorrowForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
        }
      },
      getAllData () {
        let data = {
          'letterNo': this.selectParams.letterNumber,
          'requesterName': this.selectParams.requesterName,
          'currentUserNames': this.selectParams.currentUserNames,
          'status': this.selectParams.localStatus.join(','),
          'startDate': this.selectParams.selectDateRange[0] || '',
          'endDate': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        if (String(this.activeTabName) === '1') {
          ltlProcessList(JSON.stringify(data)).then(resp => {
            this.loading = false
            this.tableData = resp.buzidata
            this.total = resp.totalNum
          })
        } else {
          letterBorrowlist(JSON.stringify(data)).then((resp) => {
            this.loading = false
            this.tableData = resp.buzidata
            this.total = resp.totalNum
          })
        }
      },
      clearAllData () {
        this.$refs.letterBorrowForm.resetFields()
        this.$refs.selectorDealer1.clearValue()
        this.$refs.selectorDealer2.clearValue()
        this.selectParams = {
          letterNumber: '',
          keyWord: '',
          requesterName: '',
          currentUserNames: '',
          localStatus: [],
          selectDateRange: []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .letterBorrow {
    .customize-width {
      width: 350px;
    }
  }
</style>
