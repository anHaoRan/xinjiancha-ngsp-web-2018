<template>
  <div class="lyricList">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建舆情分析</el-button>
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
          @click="getTablelist"
        >查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-form ref="selectParams" :model="selectParams" label-width="120px" label-position="left">
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码">
              <stock-code-query class="customize-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建类型">
              <el-select class="customize-width" collapse-tags :clearable="true" v-model="selectParams.createType" placeholder="全部" size="small">
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
            <el-form-item label="舆情来源">
              <el-select class="customize-width" :multiple="true" collapse-tags :clearable="true" v-model="selectParams.sourceFrom" placeholder="全部" size="small">
                <el-option
                  v-for="item in islyricfrom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="拟稿人">
              <selector-dealer class="customize-width" ref="selectorDealers"
                               @node-click="getApplyPerson"
                               :selectPerson="selectParams.people"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="发布时间">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="9" :md="13" :sm="24">
            <el-form-item label="状态">
              <el-select class="customize-width" collapse-tags :multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="7" :md="11" :sm="24">
            <el-form-item label-width="60px">
              <el-checkbox style="width:200px" v-model="selectParams.isImportant">仅看重大事件</el-checkbox>
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
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectRoleComponent from '../superviseTaskComponent/selectRoleComponent'
  import { lyrictablelist, lyricdelete } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      Breadcrumb,
      selectRoleComponent
    },
    mixins: [MinxinVue],
    props: ['activeName'],
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/tablelist',
          label: '舆情分析'
        }],
        creattype: [{
          value: '1',
          label: '手工创建'
        }, {
          value: '0',
          label: '信息化导入'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '判断中'
        },
          {
            value: '2',
            label: '分配中'
          },
          {
            value: '3',
            label: '拟稿中'
          },
          {
            value: '4',
            label: '复核中'
          },
          {
            value: '5',
            label: '审核中'
          }, {
            value: '6',
            label: '审批中'
          }, {
            value: '7',
            label: '确认中'
          }, {
            value: '8',
            label: '办结'
          }],
        columns: [
          {label: '舆情分类', field: 'sourceType', align: 'left', sortable: false},
          {label: '证券代码及简称', field: 'security', align: 'left', sortable: false},
          {label: '舆情标题', field: 'title', align: 'left', sortable: false},
          {label: '发布时间', field: 'sourceTime', align: 'left', sortable: false},
          {label: '舆情登记人', field: 'requesterName', align: 'left', sortable: false},
          {label: '舆情来源', field: 'sourceFrom', align: 'left', sortable: false},
          {label: '是否重点事件', field: 'isImportant', align: 'left', sortable: false},
          {label: '状态', field: 'localStatus', align: 'left', sortable: false},
          {label: '在办人', field: 'currentUserNames', align: 'left', sortable: false},
          {label: '创建类型', field: 'createType', align: 'left', sortable: false}
        ],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        inquiredata: [],
        selectParams: {
          keyword: '',
          createType: '',
          sourceFrom: [],
          isImportant: false,
          people: '',
          selectDateRange: [],
          localStatus: []
        },
        islyricfrom: [{
          value: '证券行业三大报',
          label: '证券行业三大报'
        }, {
          value: '主流财经媒体门户网站',
          label: '主流财经媒体门户网站'
        }, {
          value: '民间论坛股吧',
          label: '民间论坛股吧'
        }, {
          value: 'APP',
          label: 'APP'
        }, {
          value: '香港平面媒体',
          label: '香港平面媒体'
        }, {
          value: '香港网络媒体',
          label: '香港网络媒体'
        }],
        lyricfrom2: '中国证券报',
        islyricfrom2: [{
          value: '中国证券报',
          label: '中国证券报'
        }, {
          value: '证券时报',
          label: '证券时报'
        }, {
          value: '上海证券报',
          label: '上海证券报'
        }],
        commonData: {
          disabled: false,
          stockCode: ''
        }
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, keyword, createType, sourceFrom, isImportant, people, selectDateRange, localStatus} = this.$store.state.superviseTask.lyricAnalisis
        this.commonData.stockCode = stockCode
        this.selectParams.keyword = keyword
        this.selectParams.createType = createType
        this.selectParams.sourceFrom = sourceFrom
        this.selectParams.isImportant = isImportant
        this.selectParams.people = people
        this.selectParams.selectDateRange = selectDateRange
        this.selectParams.localStatus = localStatus
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          stockCode: this.commonData.stockCode, // 证券代码
          keyword: this.selectParams.keyword, // 关键字
          createType: this.selectParams.createType, // 创建类型
          sourceFrom: this.selectParams.sourceFrom, // 舆情来源
          isImportant: this.selectParams.isImportant, // 仅看重大事件
          people: this.selectParams.people, // 拟稿人
          selectDateRange: this.selectParams.selectDateRange, // 发布时间
          localStatus: this.selectParams.localStatus // 状态
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveLyricQueryParams', params)
        this.$store.commit('saveUser', user)
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
            lyricdelete(params).then((resp) => {
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
        this.$router.push({path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
        // switch (row.localStatus) {
        //   case '创建中':
        //     this.$router.push({path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
        //     break
        //   case '判断中':
        //     this.$router.push({path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode}})
        //     break
        //   case '分配中':
        //     this.$router.push({path: './halfform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '拟稿中':
        //     this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '复核中':
        //     this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '审核中':
        //     this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '审批中':
        //     this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '确认中':
        //     this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})
        //     break
        //   case '办结':
        //     if (!row.modifyInfo) {this.$router.push({path: './halfform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})} else {this.$router.push({path: './fullform?operate=' + isoperateCheck + '&taskId=' + row.taskId + '&instanceId=' + row.instanceId})}
        //
        //
        //     break
        // }
      },
      getAllData () {
        let data = {
          'stockCode': this.commonData.stockCode ? this.commonData.stockCode.split(' ')[0] : '',
          'keyword': this.selectParams.keyword,
          'createType': this.selectParams.createType,
          'sourceFrom': this.selectParams.sourceFrom.join(','),
          'isImportant': this.selectParams.isImportant ? '1' : '',
          'status': this.selectParams.localStatus.join(','),
          'proposer': this.selectParams.people,
          'applyTimeStart': this.selectParams.selectDateRange[0] || '',
          'applyTimeEnd': this.selectParams.selectDateRange[1] || '',
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        let isparams = JSON.stringify(data)
        lyrictablelist(isparams).then((resp) => {
          this.loading = false
          this.inquiredata = resp.buzidata
          this.total = resp.totalNum
          for (let i = 0; i < resp.buzidata.length; i++) {
            if (resp.buzidata[i].isImportant == '1') {
              resp.buzidata[i].isImportant = '是'
            } else {
              resp.buzidata[i].isImportant = '否'
            }
            switch (resp.buzidata[i].sourceType) {
              case '0':
                resp.buzidata[i].sourceType = '个股信息'
                break
              case '1':
                resp.buzidata[i].sourceType = '热点报道'
                break
              case '2':
                resp.buzidata[i].sourceType = '宏观信息'
                break
              case '3':
                resp.buzidata[i].sourceType = '市场信息'
                break
              case '4':
                resp.buzidata[i].sourceType = '研究报告'
                break
            }
          }
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.commonData.stockCode = ''
        this.selectParams = {
          stockCode: '', // 证券代码
          keyword: '', // 关键字
          createType: '', // 创建类型
          sourceFrom: [], // 舆情来源
          isImportant: false, // 仅看重大事件
          people: '', // 拟稿人
          selectDateRange: [], // 发布时间
          localStatus: [] // 状态
        }
      },
      getApplyPerson (code, name) {
        this.selectParams.people = name
      },
      routerProcessPage () {
        this.$router.push({
          path: '/halfform'
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .lyricList {
    .customize-width {
      width: 350px;
    }
  }
</style>
