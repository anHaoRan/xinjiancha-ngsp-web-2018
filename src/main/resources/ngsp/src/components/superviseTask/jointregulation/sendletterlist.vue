<template>
  <div class="sendLetterList">
    <el-card style="margin-top:0;">
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
          @click="getTablelist"
        >查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-form ref="sendLetterListRef" :model="selectParams" label-width="120px" label-position="left">
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码">
              <stock-code-query :commonData="commonData" @getStockCode="getStockCode" class="customize-width"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input v-model="selectParams.keyword" placeholder="" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建类型">
              <el-select class="customize-width" collapse-tags :clearable="true" v-model="selectParams.iscreattype" placeholder="全部" size="small">
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
            <el-form-item label="状态">
              <el-select class="customize-width" collapse-tags v-bind:multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small">
                <el-option
                        v-for="item in isstatus"
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
          <el-col :xl="24" :md="24" :sm="24">
            <el-form-item label="申请日期">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <letter-borrow-lend-batch-button-group @handleLetterBorrowLendBatchDialogShow="handleLetterBorrowLendBatchDialogShow"></letter-borrow-lend-batch-button-group>
        <!--<el-button size="small" type="primary" @click="handleLetterBorrowLendBatchDialogShow(1)">批量传阅操作</el-button>
        <el-button size="small" type="primary" @click="handleLetterBorrowLendBatchDialogShow(0)">批量借阅操作</el-button>-->
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
  import StockCodeQuery from '../../common/StockCodeQuery'
  import { postsendletterlist, postdeletesendletter } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery
    },
    props: ['activeName'],
    mixins: [MinxinVue],
    data () {
      return {
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '预警转入'
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
          label: '创建中'
        }, {
          value: '1',
          label: '审核中'
        },
          {
            value: '2',
            label: '审批中'
          },
          {
            value: '3',
            label: '确认中'
          },
          {
            value: '4',
            label: '待发函'
          },
          {
            value: '5',
            label: '办结'
          }],
        selectParams: {
          iscreattype: '',
          localStatus: [],
          applicanter: '',
          people: '',
          keyword: '',
          selectDateRange: []
        },
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
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
        commonData: {
          disabled: false,
          stockCode: ''
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyWord, createdType, localStatus, applicanter, people, selectDateRange} = this.$store.state.superviseTask.jointregulation.sendForm
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyWord
        this.selectParams.iscreattype = createdType
        this.selectParams.localStatus = localStatus
        this.selectParams.applicanter = applicanter
        this.selectParams.people = people
        this.selectParams.selectDateRange = selectDateRange
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyWord: this.selectParams.keyword, // 关键字
          createdType: this.selectParams.iscreattype, // 创建类型
          localStatus: this.selectParams.localStatus, // 状态
          applicanter: this.selectParams.applicanter, // 申请人
          people: this.selectParams.people, // 在办人
          selectDateRange: this.selectParams.selectDateRange
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveSentLetterQueryParams', params)
        this.$store.commit('saveUser', user)
        this.$store.commit('saveJointSupervisionTabs', 'one')
      },
      getTablelist () {
        this.commitQueryParams()
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.getAllData()
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
            postdeletesendletter(params).then((resp) => {
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
          name: 'sendLetterFormPage',
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
          'createType': this.selectParams.iscreattype,
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.applicanter,
          'procePerson': this.selectParams.people,
          'applyTimeStart': this.selectParams.selectDateRange[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        let isparams = JSON.stringify(data)
        postsendletterlist(isparams).then((resp) => {
          this.loading = false
          for (let i = 0; i < resp.buzidata.length; i++) {
            let isstockCode = []
            let name = resp.buzidata[i].stockName.split(',')
            let code = resp.buzidata[i].stockCode.split(',')
            for (let j = 0; j < name.length; j++) {
              let result = code[j] + ' ' + name[j]
              isstockCode.push(result)
            }
            resp.buzidata[i].stockCode = isstockCode.join(';')
          }
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
          iscreattype: '',
          localStatus: [],
          applicanter: '',
          people: '',
          keyword: '',
          selectDateRange: []
        }
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
  .sendLetterList {
    .customize-width {
      width: 350px;
    }
  }
</style>
