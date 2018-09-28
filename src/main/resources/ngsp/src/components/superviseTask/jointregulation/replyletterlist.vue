<template>
  <div class="replyLetterListPage">
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
        <el-form ref="replyLetterListRef" :model="selectParams" label-width="120px" label-position="left">
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
              <el-select collapse-tags :clearable="true" v-model="selectParams.createType" placeholder="全部" size="small" class="customize-width">
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
            <el-form-item label="来函单位">
              <el-cascader
                size="small"
                class="customize-width"
                :options="fromDeptOptions"
                v-model="selectParams.fromDept"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small" class="customize-width">
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
            <el-form-item label="拟稿人">
              <selector-dealer
                class="customize-width" ref="selectorDealers"
                @node-click="getApplyPerson"
                :selectPerson="selectParams.proposer"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="在办人">
              <selector-dealer
                class="customize-width" ref="selectorDealers"
                @node-click="getCurrentPerson"
                :selectPerson="selectParams.procePerson"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="回函日期">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="是否线索上报">
              <el-select collapse-tags v-model="selectParams.isRpc" placeholder="全部" size="small" :clearable="true" class="customize-width">
                <el-option
                  v-for="item in iscuereport"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <!--<el-col :span="2" style="margin-top:8px">来函单位:</el-col>
      &lt;!&ndash;         <el-col :span="3">
                <el-select collapse-tags v-bind:multiple="true" v-model="isclassification" placeholder="全部" size="small">
                  <el-option
                    v-for="item in classification"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col> &ndash;&gt;
      <el-col :span="2">
        <el-select filterable v-model="unit1" placeholder="" size="small" style="width:85%;margin-left:-50%"
                   @change="changesendobject">
          <el-option
            v-for="item in isunit1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3" style="width:13%">
        <el-select filterable v-model="unit2" placeholder="" size="small" style="width:75%;margin-left:-40%">
          <el-option
            v-for="item in isunit2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
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
          data: replytable,
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
  import {fromDeptOptions} from './replyletter/component/constants'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import { postreplyletterlist, postdeletecheckletter } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      selectRoleComponent,
    },
    mixins: [MinxinVue],
    data () {
      return {
        fromDeptOptions,
        iscuereport: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '系统来函'
        }],
        classification: [{
          value: '0',
          label: '公司管理一部'
        }, {
          value: '1',
          label: '会员部'
        }],
        isstatus: [
          {
            value: '0',
            label: '负责人分配中'
          },
          {
            value: '1',
            label: '组长分配中'
          },
          {
            value: '2',
            label: '拟稿中'
          },
          {
            value: '3',
            label: '复核中'
          },
          {
            value: '4',
            label: '审核中'
          },
          {
            value: '5',
            label: '审批中'
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
          createType: '',
          fromDept: [],
          localStatus: [],
          proposer: '',
          procePerson: '',
          keyword: '',
          isRpc: '',
          selectDateRange: []
        },
        columns: [
          {label: '证券代码及简称', field: 'stockCode', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false},
          {label: '来函单位', field: 'fromDept', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '是否线索上报', field: 'isRpc', align: 'left', sortable: false},
          {label: '拟稿人', field: 'draftPerson', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false},
          {label: '回函日期', field: 'reqTime', align: 'left', sortable: false}
        ],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        replytable: [],
        commonData: {
          disabled: false,
          stockCode: ''
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyword, createType, localStatus, proposer, procePerson, isRpc, fromDept, selectDateRange} = this.$store.state.superviseTask.jointregulation.replyForm
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyword
        this.selectParams.createType = createType
        this.selectParams.localStatus = localStatus
        this.selectParams.fromDept = fromDept
        this.selectParams.proposer = proposer
        this.selectParams.procePerson = procePerson
        this.selectParams.selectDateRange = selectDateRange
        this.selectParams.isRpc = isRpc
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyword: this.selectParams.keyword, // 关键字
          createType: this.selectParams.createType, // 创建类型
          localStatus: this.selectParams.localStatus, // 状态
          fromDept: this.selectParams.fromDept, // 来函单位
          proposer: this.selectParams.proposer, // 申请人
          procePerson: this.selectParams.procePerson, // 在办人
          selectDateRange: this.selectParams.selectDateRange, // 日期范围
          isRpc: this.selectParams.isRpc // 是否线索上报
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveReplyLetterQueryParams', params)
        this.$store.commit('saveUser', user)
        this.$store.commit('saveJointSupervisionTabs', 'two')
      },
      getTablelist () {
        this.commitQueryParams()
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
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
            postdeletecheckletter(params).then((resp) => {
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
          name: 'replyLetterFormPage',
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
          'createType': this.selectParams.createType,
          'fromDept': this.selectParams.fromDept[0] ? this.selectParams.fromDept[0] + ' ' + this.selectParams.fromDept[1] : '',
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.proposer,
          'procePerson': this.selectParams.procePerson,
          'applyTimeStart': this.selectParams.selectDateRange[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber,
          'isRpc': this.selectParams.isRpc
        }
        this.loading = true
        let isparams = JSON.stringify(data)
        postreplyletterlist(isparams).then((resp) => {
          this.loading = false
          this.replytable = resp.buzidata
          for (let item of this.replytable) {
            if (item.isRpc == '0') {
              item.isRpc = '否'
            } else if (item.isRpc == '1') {
              item.isRpc = '是'
            } else {
              item.isRpc = ''
            }
          }
          // for(let item of this.replytable){
          //   if(item.createType=='0'){
          //     item.createType='系统来函'
          //   }else{
          //     item.createType='手工创建'
          //   }
          // }
          this.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.selectParams.selectDateRange = []
        this.selectParams.createType = ''
        this.selectParams.fromDept = []
        this.selectParams.localStatus = []
        this.selectParams.proposer = ''
        this.selectParams.procePerson = ''
        this.selectParams.keyword = ''
        this.selectParams.isRpc = ''
      },
      getApplyPerson (code, name) {
        this.selectParams.proposer = name
      },
      getCurrentPerson (code, name) {
        this.selectParams.procePerson = name
      }
    }
  }
</script>
<style lang="less">
  .replyLetterListPage {
    .customize-width {
      width: 350px;
    }
  }
</style>
