<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建数据协查信息</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
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
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码:</el-col>
        <el-col :span="3">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" style="width:96%"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">关键字:</el-col>
        <el-col :span="3">
          <el-input style="width:96%" v-model="keyword" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px">创建类型:</el-col>
        <el-col :span="3">
          <el-select collapse-tags :clearable="true" v-model="iscreattype" placeholder="全部" size="small">
            <el-option
              v-for="item in creattype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-top:8px">状态:</el-col>
        <el-col :span="3">
          <el-select collapse-tags v-bind:multiple="true" v-model="localStatus" placeholder="全部" size="small">
            <el-option
              v-for="item in isstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-top:8px">申请人:</el-col>
        <el-col :span="3">
          <selector-dealer class="customize-width" ref="selectorDealers"
                           @node-click="getApplyPerson"
                           :selectPerson="applicanter"></selector-dealer>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">在办人:</el-col>
        <el-col :span="3">
          <selector-dealer class="customize-width" ref="selectorDealers"
                           @node-click="getCurrentPerson"
                           :selectPerson="people"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">申请日期:</el-col>
        <el-col :span="7">
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
          <el-col :span="10" style="width:46%">
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
        <el-col :span="2" style="margin-top:8px">发函日期:</el-col>
        <el-col :span="7">
          <el-col :span="10" style="width:46%">
            <el-date-picker
              v-model="dimensionQueryForm.sendstartDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="sendletterstartdate"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="margin:8px 1% 0">至</el-col>
          <el-col :span="10" style="width:46%">
            <el-date-picker
              v-model="dimensionQueryForm.sendendDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="sendletterenddate"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
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
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item label="创建类型：" :label-width="formLabelWidth">
          <el-select v-model="towhere" placeholder="" size="small" style="width:70%">
            <el-option
              v-for="item in istowhere"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
        <el-button type="primary" size="small" @click="cancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import {
    dataassociationtablelist,
    getUserRoles,
    recalllist,
    dataassociationdelete
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      Breadcrumb,
      selectRoleComponent
    },
    props: ['activeName'],
    mixins: [MinxinVue],
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/tablelist',
          label: '数据协查'
        }],
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '信息化导入'
        }],
        classification: [{
          value: '0',
          label: '公司管理一部'
        }, {
          value: '1',
          label: '会员部'
        }],
        isstatus: [{
          value: '0',
          label: '分配中'
        }, {
          value: '1',
          label: '拟稿中'
        },
          {
            value: '2',
            label: '复核中'
          },
          {
            value: '3',
            label: '审核中'
          },
          {
            value: '4',
            label: '审批中'
          },
          {
            value: '5',
            label: '确认中'
          }, {
            value: '6',
            label: '待发函'
          }, {
            value: '7',
            label: '办结'
          },],
        // isapplicanter: [],
        // ispeople: [],
        selectRole: {
          dialogFormVisble: false,
        },
        personFlag: '0', // 0,申请人，1，在办人
        iscreattype: '',
        localStatus: [],
        applicanter: '',
        people: '',
        code: '',
        keyword: '',
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '申请人', field: 'requesterName', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false},
          {label: '申请日期', field: 'reqTime', align: 'left', sortable: false},
          {label: '发函日期', field: 'sendDate', align: 'left', sortable: false}
        ],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        inquiredata: [],
        operate: [],
        dialogFormVisble: false,
        formLabelWidth: '120px',
        towhere: '创建并分配',
        istowhere: [{
          value: '创建并分配',
          label: '创建并分配'
        }, {
          value: '创建并拟稿',
          label: '创建并拟稿'
        },],
        dimensionQueryForm: {
          beginDate: '',
          endDate: '',
          sendstartDate: '',
          sendendDate: '',
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
        sendletterstartdate: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.dimensionQueryForm.sendendDate).getTime()
          }
        },
        sendletterenddate: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.sendstartDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyWord, createdType, localStatus, applicanter, people, beginDate, endDate, sendstartDate, sendendDate} = this.$store.state.superviseTask.dataAssociation
        this.commonData.stockCode = stockCode
        this.keyword = keyWord
        this.iscreattype = createdType
        this.localStatus = localStatus
        this.applicanter = applicanter
        this.people = people
        this.dimensionQueryForm.beginDate = beginDate
        this.dimensionQueryForm.endDate = endDate
        this.dimensionQueryForm.sendstartDate = sendstartDate
        this.dimensionQueryForm.sendendDate = sendendDate
      }
      this.getAllData()
    },
    methods: {
      getApplyPerson (code, name) {
        this.applicanter = name
      },
      getCurrentPerson (code, name) {
        this.people = name
      },
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyWord: this.keyword, // 关键字
          createdType: this.iscreattype, // 创建类型
          localStatus: this.localStatus, // 状态
          applicanter: this.applicanter, // 申请人
          people: this.people, // 在办人
          beginDate: this.dimensionQueryForm.beginDate, // 申请开始日期
          endDate: this.dimensionQueryForm.endDate, // 申请结束日期
          sendstartDate: this.dimensionQueryForm.sendstartDate, // 发函开始日期
          sendendDate: this.dimensionQueryForm.sendendDate // 发函结束日期
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveDataAssociationQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      getTablelist () {
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.commitQueryParams()
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
            'processName': 'dig',
          }
          let isparams = JSON.stringify(params)
          recalllist(isparams).then((resp) => {
            if (resp) {
              this.$message({
                showClose: true,
                message: '撤回流程成功',
                type: 'success',
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
        console.log(row.instanceId)
        if (row.operateDelete == '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {
              'instanceId': row.instanceId
            }
            params = JSON.stringify(params)
            dataassociationdelete(params).then((resp) => {
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
          case '分配中':
            this.$router.push({path: './dataAssociationassign?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '拟稿中':
            this.$router.push({path: './dataAssociationdraft?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '复核中':
            this.$router.push({path: './dataAssociationdraft?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '审核中':
            this.$router.push({path: './dataAssociationdraft?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '审批中':
            this.$router.push({path: './dataAssociationdraft?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '确认中':
            this.$router.push({path: './dataAssociationdraft?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '待发函':
            this.$router.push({path: './dataAssociationsendletter?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
          case '办结':
            this.$router.push({path: './dataAssociationsendletter?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId + '&processStatus=' + row.localStatusCode})
            break
        }
      },
      getAllData () {
        let createType = this.iscreattype
        if (createType.indexOf('ALL') != -1) {
          createType = 'ALL'
        }
        let localStatus = this.localStatus.join(',')
        if (localStatus.indexOf('ALL') != -1) {
          localStatus = 'ALL'
        }
        let proposer = this.applicanter
        if (proposer.indexOf('ALL') != -1) {
          proposer = 'ALL'
        }
        let procePerson = this.people
        if (procePerson.indexOf('ALL') != -1) {
          procePerson = 'ALL'
        }
        let startime = this.dimensionQueryForm.beginDate // +" "+"00:00:00"
        let endtime = this.dimensionQueryForm.endDate // +" "+"00:00:00"
        let data = {
          'stockCode': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'keyword': this.keyword,
          'createType': createType,
          'status': localStatus,
          'proposer': proposer,
          'procePerson': procePerson,
          'applyTimeStart': startime,
          'applyTimeEnd': endtime,
          'respTimeStart': this.dimensionQueryForm.sendstartDate,
          'respTimeEnd': this.dimensionQueryForm.sendendDate,
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        let isparams = JSON.stringify(data)
        dataassociationtablelist(isparams).then((resp) => {
          this.loading = false
          this.inquiredata = resp.buzidata
          this.total = resp.totalNum
          /* for (let i = 0; i < resp.buzidata.length; i++) {
           let isstockCode = []
           let name = resp.buzidata[i].stockName.split(',')
           let code = resp.buzidata[i].stockCode.split(',')
           for (let j = 0; j < name.length; j++) {
           let result = code[j] + ' ' + name[j]
           isstockCode.push(result)
           }
           resp.buzidata[i].stockCode = isstockCode.join(';')
           } */
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.dimensionQueryForm.beginDate = ''
        this.dimensionQueryForm.endDate = ''
        this.dimensionQueryForm.sendstartDate = ''
        this.dimensionQueryForm.sendendDate = ''
        this.iscreattype = ''
        this.localStatus = []
        this.applicanter = ''
        this.people = ''
        this.code = ''
        this.keyword = ''
      },
      routerProcessPage () {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          if (resp[0].rolename.indexOf('组长') > 0) {
            this.dialogFormVisble = true
          } else {
            this.$router.push({
              path: './dataAssociationdraft?operate=' + '-1' // 组员-1，组长-2
            })
          }

        })
      },
      displayapplicanter () {
        this.personFlag = '0'
        this.selectRole.dialogFormVisble = true
      },
      displaypeople () {
        this.personFlag = '1'
        this.selectRole.dialogFormVisble = true
      },
      getPerson (val) {
        if (this.personFlag === '0') {
          this.applicanter = val
        }
        if (this.personFlag === '1') {
          this.people = val
        }
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
      },
      veryfy () {
        this.dialogFormVisble = false
        if (this.towhere == '创建并分配') {
          this.$router.push({
            path: './dataAssociationassign?operate=' + '-2' // 组员-1，组长-2
          })
        }
        if (this.towhere == '创建并拟稿') {
          this.$router.push({
            path: './dataAssociationdraft?operate=' + '-2' // 组员-1，组长-2
          })
        }
      },
    }
  }
</script>
<style>
</style>
