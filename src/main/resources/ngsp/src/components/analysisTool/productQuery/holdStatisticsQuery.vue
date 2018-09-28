<template>
  <!--持有统计-->
  <div class="hold-statistics-query">
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button
            type="text"
            size="small"
            style="float:right;"
            @click="resetAll">清空
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="getQueryRes">查询
        </el-button>
      </div>
      <el-form
          :inline="true"
          label-width="150px"
          ref="holdStatisticsForm"
          :model="holdStatisticsForm"
          :rules="holdStatisticsRules">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="证券代码：" required>
            <el-input
                disabled
                style="width:260px"
                size="small"
                v-model="stockCode"
                placeholder="请输入证券代码"
                class="el-form-input">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="参与者层级：" required>
            <participant-level-val ref="participantLeavel" @getParticipantLevelVal="participantLevelChange"/>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24">
          <el-form-item label="前"  prop="topN" :inline-message="true">
            <el-input
                size="small"
                v-model.number="holdStatisticsForm.topN"
                class="top-number"
                @change="checkTopN">
            </el-input>
            名
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="14" :sm="24">
          <el-form-item label="参与者代码：" prop="invacctnos">
            <div
                v-if="holdStatisticsForm.participantLevelVal==='account'||holdStatisticsForm.participantLevelVal==='uniteCode'">
              <el-input
                  v-model="holdStatisticsForm.invacctnos"
                  @change="handleChangeInvacctnos"
                  placeholder="请输入参与者代码"
                  size="small"
                  class="el-form-input"
                  style="width: 260px">
              </el-input>
              <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption"
                           style="display: inline;"/>
              <down-template-file
                  :fileType="holdStatisticsForm.participantLevelVal"
                  style="display: inline-block;"
                  v-if="holdStatisticsForm.participantLevelVal==='account'"/>
            </div>
            <div v-else>
              <select-lazy-multiple
                  :selectParams="selectParams"
                  @getSelectRes="getSelectRes"/>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>

    <el-card v-if="showQueryRes" class="el-card-table">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button size="small" type="info" @click="saveMainTable" v-if="mainTableData.length!==0">导出</el-button>
      </div>
      <!--查询结果-->
      <div v-if="UniteMain" class="queryTitle">一码通母表</div>
      <el-table
          :data="mainTableData"
          border
          v-loading="mainTableLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center" v-if="UniteMain">
          <template slot-scope="scope">
            <el-radio class="radio"
                      v-model="radio"
                      :label="scope.row.invacctno"
                      @change="getRadio"
                      v-if="scope.row.invacctno!=='小计'">
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
            v-for="item in mainTableOptions"
            :key="item.field"
            :prop="item.field"
            :label="item.label"
            :align="item.align"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <el-col :span="24">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNum">
        </el-pagination>
      </el-col>

      <!--一码通子表-->
      <div v-if="SubTable" class="queryTitle">一码通子表
        <el-button size="small" type="info" @click="saveSubTable" style=" margin-right: 20px;float: right;"
                   v-if="subTableData.length!==0">导出
        </el-button>
      </div>
      <el-table
          v-if="SubTable"
          :data="subTableData"
          border
          v-loading="subTableLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            v-for="item in subTableOptions"
            :key="item.field"
            :prop="item.field"
            :label="item.label"
            :align="item.align"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
  import { transactionSelect, getHoldStatistics } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    name: 'hold-statistics-query',
    components: {},
    mixins: [MinxinVue],
    data () {
      // eslint-disable-next-line
      var checkTopN = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          var reg = new RegExp(/^[0-9]+$/)
          if (!(reg.test(value))) {
            if (value == '') {
              return false
            } else {
              callback(new Error('必须为1-1000之间整数'))
            }
          }
        } else if (value - 0 <= 0) {
          callback(new Error('必须为1-1000之间整数'))
        } else if (value - 0 > 1000) {
          callback(new Error('必须为1-1000之间整数'))
        }
      }
      return {
        stockCode: '',
        holdStatisticsForm: {
          participantLevelVal: 'account',
          invacctnos: '',
          selectStockCode: false,
          selectStockCodeVal: [],
          topN: '50'
        },
        holdStatisticsRules: {
          topN: [this.checkTopNNum(1000), {required: true, trigger: 'blur', message: '前N名不能为空'}]
        },
        uploadOption: {
          name: '上传',
          size: 'small'
        },
        selectParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        },
        showQueryRes: false,
        UniteMain: false,
        SubTable: false,
        radio: '',
        mainTableData: [],
        mainTableOptions: [],
        mainTableLoad: false,
        subTableData: [],
        subTableOptions: [],
        subTableLoad: false,
        requestParams: {},
        requestSubParams: {},
        currentPage: 1,
        pageSizes: [1000],
        pageSize: 1000,
        resultNum: 0
      }
    },
    props: ['commonData'],
    watch: {
      'selectParams.particLevelType': function () {
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
      }
    },
    methods: {
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      getTxtData (TxtData) {
        this.holdStatisticsForm.invacctnos = TxtData.join(',')
      },
      participantLevelSelectOptions () {
        transactionSelect('particiLevel', 'statis').then((resp) => {
          this.participantLevelOptions = resp
        })
      },
      // 下拉模糊查询
      getSelectRes (checkBoxValue) {
        this.holdStatisticsForm.selectStockCodeVal = checkBoxValue
      },
      participantLevelChange (val) {
        this.holdStatisticsForm.participantLevelVal = val
        this.selectParams.particLevelType = val
        this.holdStatisticsForm.invacctnos = ''
      },
      handleChangeInvacctnos (val) {
        this.fnValidateAccountCode(this.holdStatisticsForm.participantLevelVal, val, '参代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。')
      },
      checkTopN () {

      },
      resetAll () {
        let resetObj = {
          participantLevelVal: 'account',
          uploadStockCode: true,
          invacctnos: '',
          selectStockCode: false,
          selectStockCodeVal: [],
          loading: false,
          topN: '50'
        }
        this.holdStatisticsForm = {...resetObj}
        this.$refs.participantLeavel.clearAll()
      },
      getQueryRes () {
        this.radio = ''
        this.showQueryRes = true
        this.mainTableLoad = true
        let params = {
          dateStart: this.commonData.dateTimeStart.split(' ')[0],
          dateEnd: this.commonData.dateTimeEnd.split(' ')[0],
          timeStart: this.commonData.dateTimeStart.split(' ')[1],
          timeEnd: this.commonData.dateTimeEnd.split(' ')[1],
          securityId: this.commonData.stockCode.split(' ')[0],
          invacctno: this.holdStatisticsForm.invacctnos,
          topN: this.holdStatisticsForm.topN,
          actorKind: this.holdStatisticsForm.participantLevelVal,
          tableLevel: 'maintable',
          // securityType: this.commonData.stockCodeType
          securityType: this.commonData.stockCodtTypeMoment
        }
        // 初始化数据
        this.requestParams = {}
        this.UniteMain = false
        this.SubTable = false
        this.mainTableData = []
        this.mainTableOptions = []
        this.subTableData = []
        this.subTableOptions = []
        if (this.commonData.stockCodeType == 'equ') {
          if (this.holdStatisticsForm.participantLevelVal == 'account') {
            this.mainTableOptions = this.HOLD_STATISTICS.EQU.account
          } else if (this.holdStatisticsForm.participantLevelVal == 'uniteCode') {
            this.UniteMain = true
            this.mainTableOptions = this.HOLD_STATISTICS.EQU.uniteCodeMain
          } else {
            params.invacctno = this.holdStatisticsForm.selectStockCodeVal.join(',')
            this.mainTableOptions = this.HOLD_STATISTICS.EQU.salePartAndMemberPBU
          }
        } else {
          if (this.holdStatisticsForm.participantLevelVal == 'account') {
            this.mainTableOptions = this.HOLD_STATISTICS.exceptEQU.account
          } else if (this.holdStatisticsForm.participantLevelVal == 'uniteCode') {
            this.UniteMain = true
            this.mainTableOptions = this.HOLD_STATISTICS.exceptEQU.uniteCodeMain
          } else {
            params.invacctno = this.holdStatisticsForm.selectStockCodeVal.join(',')
            this.mainTableOptions = this.HOLD_STATISTICS.exceptEQU.salePartAndMemberPBU
          }
        }
        if (params.invacctno == '' && params.topN == '') {
          this.$message.warning('参与者代码与前N名不能同时为空')
          return
        }
        getHoldStatistics(params).then((resp) => {
          this.mainTableLoad = false
          this.requestParams = params
          this.mainTableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows
        })
      },
      getRadio (val) {
        this.subTableData = []
        this.SubTable = true
        this.requestSubParams = JSON.parse(JSON.stringify(this.requestParams))
        this.requestSubParams.tableLevel = 'subtable'
        this.requestSubParams['maintableId'] = this.radio
        this.subTableLoad = true
        if (this.commonData.stockCodeType == 'equ') {
          this.subTableOptions = this.HOLD_STATISTICS.EQU.uniteCodeSub
        } else {
          this.subTableOptions = this.HOLD_STATISTICS.exceptEQU.uniteCodeSub
        }
        getHoldStatistics(this.requestSubParams).then((resp) => {
          this.subTableLoad = false
          this.subTableData = resp.bizData.metaData
        })
      },
      handleSizeChange () {

      },
      handleCurrentChange () {

      },
      saveMainTable () {
        let params = this.requestParams
        params['type'] = 'positionStatis'
        params['fileType'] = 'excel'
        params['tableColumns'] = [
          {
            sheetName: '产品查询-持有统计',
            fileColumns: this.mainTableOptions
          }
        ]
        console.log(JSON.stringify(this.requestParams))
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      },
      saveSubTable () {
        let params = this.requestSubParams
        params['type'] = 'positionStatis'
        params['fileType'] = 'excel'
        params['tableColumns'] = [
          {
            sheetName: '产品查询-持有统计一码通子表',
            fileColumns: this.subTableOptions
          }
        ]
        console.log(JSON.stringify(this.requestSubParams))
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      }

    },
    mounted () {
      this.participantLevelSelectOptions()
    }
  }
</script>

<style lang='less'>
  .hold-statistics-query {
    .top-number {
      padding: 2px;
      width: 60px;
      padding-top: 0;
      position: relative;
      right: 7px;
    }
    .queryTitle {
      margin-bottom: 20px;
      font-size: 16px;
    }
    .el-radio__label {
      display: none;
    }
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .el-card__body {
      margin-top: 20px;
    }
  }
</style>
