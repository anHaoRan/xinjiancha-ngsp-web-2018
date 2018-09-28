<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建自律监管处罚单</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="clearAllData">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="getTablelist">查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码:</el-col>
        <el-col :span="3">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode"
                            style="width: 90%;"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">关键字:</el-col>
        <el-col :span="3">
          <el-input style="width:90%" v-model="keyword" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px">创建类型:</el-col>
        <el-col :span="3">
          <el-select collapse-tags :clearable="true" v-model="iscreattype" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in creattype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">监管分类:</el-col>
        <el-col :span="3">
          <el-select collapse-tags v-bind:multiple="true" v-model="isclassification" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in classification"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-top:8px">状态:</el-col>
        <el-col :span="3">
          <el-select collapse-tags v-bind:multiple="true" v-model="localStatus" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">申请人:</el-col>
        <el-col :span="3">
          <selector-dealer class="customize-width" ref="selectorDealers"
                           @node-click="getApplyPerson"
                           :selectPerson="applicanter"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">在办人:</el-col>
        <el-col :span="3">
          <selector-dealer class="customize-width" ref="selectorDealers"
                           @node-click="getCurrentPerson"
                           :selectPerson="people"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">申请日期:</el-col>
        <el-col :span="12">
          <el-col :span="10" style="width:46%">
            <el-date-picker
              v-model="dimensionQueryForm.beginDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="startpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="margin:8px 1% 0">至</el-col>
          <el-col :span="10" style="width:45.5%">
            <el-date-picker
              v-model="dimensionQueryForm.endDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="endpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">发函编号:</el-col>
        <el-col :span="3">
          <el-input style="width:90%" v-model="sendLetterNumber" placeholder="" size="small"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>自律监管信息列表</span>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns"
        :data="{
          data: inquiredata,
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
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import {
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
        },
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyWord, createdType, localStatus, applicanter, people, beginDate, endDate, sendLetterNumber, isclassification} = this.$store.state.superviseTask.selfsupervision
        this.commonData.stockCode = stockCode
        this.keyword = keyWord
        this.iscreattype = createdType
        this.localStatus = localStatus
        this.applicanter = applicanter
        this.isclassification = isclassification
        this.people = people
        this.dimensionQueryForm.beginDate = beginDate
        this.dimensionQueryForm.endDate = endDate
        this.sendLetterNumber = sendLetterNumber
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyWord: this.keyword, // 关键字
          createdType: this.iscreattype, // 创建类型
          isclassification: this.isclassification, // 监管分类
          localStatus: this.localStatus, // 状态
          applicanter: this.applicanter, // 申请人
          people: this.people, // 在办人
          beginDate: this.dimensionQueryForm.beginDate, // 申请开始日期
          endDate: this.dimensionQueryForm.endDate, // 申请结束日期
          sendLetterNumber: this.sendLetterNumber // 发函编号
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
      /*recall (row) {
        this.$confirm('确定撤回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'activityName': row.lastOperateActivityName,
            'instanceId': row.instanceId,
            'processName': 'sls'
          }
          let isparams = JSON.stringify(params)
          recalllist(isparams).then((resp) => {
            if (resp) {
              this.$message.success('撤回流程成功')
            } else {
              this.$message.error('撤回流程失败')
            }
            this.getAllData()
          })
        }).catch(() => {

        })
      },*/
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
        switch (row.localStatus) {
          case '创建中':
            this.$router.push({
              path: './processform?isoperateCheck=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '审核中':
            this.$router.push({
              path: './checkform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '分配中':
            this.$router.push({
              path: './assignform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '待发函':
            this.$router.push({
              path: './sentform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '待回函':
            this.$router.push({
              path: './returnform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '待归档':
            this.$router.push({
              path: './archiveform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
          case '已归档':
            this.$router.push({
              path: './finishform?taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&isoperateCheck=' + isoperateCheck + '&activityName=' + row.activityName + '&processStatus=' + row.localStatusCode
            })
            break
        }
      },
      getAllData () {
        let createType = this.iscreattype
        let superviseStandard = this.isclassification.join(',')
        let localStatus = this.localStatus.join(',')
        let proposer = this.applicanter
        let procePerson = this.people
        let startime = this.dimensionQueryForm.beginDate // +" "+"00:00:00"
        let endtime = this.dimensionQueryForm.endDate // +" "+"00:00:00"
        let data = {
          'stockCode': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'keyword': this.keyword,
          'createType': createType,
          'superviseStandard': superviseStandard,
          'status': localStatus,
          'proposer': proposer,
          'procePerson': procePerson,
          'applyTimeStart': startime,
          'applyTimeEnd': endtime,
          'sendLetNo': this.sendLetterNumber,
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        postselfgulationlist(data).then((resp) => {
          this.loading = false
          this.inquiredata = resp.buzidata
          this.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.dimensionQueryForm.beginDate = ''
        this.dimensionQueryForm.endDate = ''
        this.iscreattype = ''
        this.isclassification = []
        this.localStatus = []
        this.applicanter = ''
        this.people = ''
        this.code = ''
        this.keyword = ''
        this.commonData.stockCode = ''
        this.sendLetterNumber = ''
      },
      routerProcessPage () {
        this.$router.push({
          path: './processform'
        })
      },
      getApplyPerson (code, name) {
        this.applicanter = name
      },
      getCurrentPerson (code, name) {
        this.people = name
      }
    }
  }
</script>
<style>
</style>
