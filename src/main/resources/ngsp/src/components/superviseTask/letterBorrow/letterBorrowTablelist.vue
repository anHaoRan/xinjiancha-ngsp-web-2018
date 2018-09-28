<template>
  <div class="letterBorrow">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建函件借阅</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
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
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="借阅日期">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
              <!--<el-date-picker
                v-model="letterBorrowForm.selectDateRange"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOption"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>-->
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card>
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
  import MarginTable from '../../base/MarginTable'
  import { letterBorrowlist, recalllist, letterBorrowdelete } from '../../../service/superviseTask/index.js'
  import {columns} from './tableColumns'
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
          label: '函件借阅'
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
      recall (row) {
        this.$confirm('确定撤回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'activityName': row.lastOperateActivityName,
            'instanceId': row.instanceId,
            'processName': 'ltb'
          }
          let isparams = JSON.stringify(params)
          recalllist(isparams).then((resp) => {
            if (resp) {
              this.$message({
                showClose: true,
                message: '撤回流程成功',
                type: 'success'
              })
            } else {
              this.$message.error('撤回流程失败!')
            }
            this.getAllData()
          })
        }).catch(() => {

        })
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
            letterBorrowdelete(params).then(() => {
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
        this.$router.push({path: '/letterBorrowForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
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
        letterBorrowlist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          this.tableData = resp.buzidata
          this.total = resp.totalNum
        })
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
      },
      routerProcessPage () {
        this.$router.push({
          path: '/letterBorrowForm'
        })
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
