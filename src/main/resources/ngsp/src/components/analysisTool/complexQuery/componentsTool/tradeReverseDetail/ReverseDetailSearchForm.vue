<!-- 对倒明细 -->
<template>
  <el-card class="reverseDetailSearchForm">
    <div slot="header">
      <span>查询条件</span>
      <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
      <el-button size="small" type="info"  @click="handleClear">清空</el-button>
      <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
    </div>
    <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
      <el-col :xl="9" :lg="12" :md="16" :sm="16" class="date-time-component">
        <date-time-component
          ref="validateDateCom"
          @getDate="getChangeDate"
          @getTime="getChangeTime"
          :dateRequire="false"
          :timeRequire="false"
          :defaultOption="defaultDateOptions"></date-time-component>
      </el-col>
      <el-col :xl="9" :lg="12" :md="12" :sm="12">
        <stock-codes-upload-and-secType-select-component ref="stockCodesListRef" @getStockCode="getStockCode" @handleSecTypeAndChosenTypeListChange="handleSecTypeAndChosenTypeListChange"></stock-codes-upload-and-secType-select-component>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12">
        <el-form-item  prop="accountGroupAIds" label="账户组A" :rules = "[{
          required: true, message:'请输入账户组A代码'
        }]">
          <text-area-codes-and-upload-component
            ref="accountGroupARef" :codeType="`accountA`"
            :uploadParams="{
              parseRule: JSON.stringify(
                {
                  verifies: ['ACCOUNT_CODE']
                }
              )
            }"
            @getTextareaCodeList="getAccountGroupAFunc"></text-area-codes-and-upload-component>
        </el-form-item>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12">
        <el-form-item  prop="accountGroupBIds" label="账户组B" :rules = "[{
          required: true, message:'请输入账户组B代码'
        }]">
          <text-area-codes-and-upload-component
            ref="accountGroupBRef" :codeType="`accountB`"
            :uploadParams="{
              parseRule: JSON.stringify(
                {
                  verifies: ['ACCOUNT_CODE']
                }
              )
            }"
            @getTextareaCodeList="getAccountGroupBFunc"></text-area-codes-and-upload-component>
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
import {selfValidateMethod} from '../common/validate'
import AggregateStockCodeQuery from '../AggregateStockCodeQuery'
import TextAreaCodesAndUploadComponent from '../common/TextAreaCodesAndUploadComponent'
import StockCodesUploadAndSecTypeSelectComponent from '../common/StockCodesUploadAndSecTypeSelectComponent'
import DateTimeComponent from '../common/DateTimeComponent'

export default {
  components: {
    AggregateStockCodeQuery,
    TextAreaCodesAndUploadComponent,
    StockCodesUploadAndSecTypeSelectComponent,
    DateTimeComponent,
    StatisticCaliber: () => import('../common/StatisticCaliber')
  },
  props: ['defaultRelativeTradeDate'],
  data() {
    return {
      defaultDateOptions: {
        startDate: '',
        endDate: '',
        startTime: '09:15:00',
        endTime: '15:30:00',
        showTime: true
      },
      statisticCaliber: [
        {
          title: '对倒明细',
          content: [
            `交易日期、成交时间、成交编号、股东账户、成交数量、成交金额取自每日成交日志（即交易明细记录）。根据交易日期、证券代码、交易时间和证券代码相等，买卖方向相反，取得每一笔交易的对手方信息。`
          ]
        }
      ],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchForm: {
        dateTimeRange: [],
        secCodes: '',
        accountGroupAIds: '',
        accountGroupBIds: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        chosenTypeListString: '',
        secTypeAll: '0'
      }
    }
  },
  watch: {
    defaultRelativeTradeDate(newValue) {
      this.defaultDateOptions.startDate = newValue
      this.defaultDateOptions.endDate = newValue
      if (this.$refs[`validateDateCom`]) {
        this.$refs[`validateDateCom`].setDefaultDate()
      }
    }
  },
  methods: {
    getChangeDate(...rest) {
      this.searchForm.startDate = rest[0]
      this.searchForm.endDate = rest[1]
    },
    getChangeTime(...rest) {
      this.searchForm.startTime = rest[0]
      this.searchForm.endTime = rest[1]
    },
    handleSecTypeAndChosenTypeListChange(secTypeAll, chosenTypeListString) {
      this.searchForm.secTypeAll = secTypeAll
      this.searchForm.chosenTypeListString = chosenTypeListString
      /* 校验证券大类 */
      this.$refs[`searchForm`].validateField('secType')
    },
    getStockCode(data) {
      this.searchForm.secCodes = data
      /* 校验证券代码 */
      this.$refs[`searchForm`].validateField('secType')
    },
    getAccountGroupAFunc(data) {
      this.searchForm.accountGroupAIds = data
    },
    getAccountGroupBFunc(data) {
      this.searchForm.accountGroupBIds = data
    },
    handleClear() {
      this.$refs['stockCodesListRef'].clearStockCodes()
      this.$refs['accountGroupARef'].clearCodeList()
      this.$refs['accountGroupBRef'].clearCodeList()
      this.searchForm.secCodes = ''
      this.searchForm.accountGroupAIds = ''
      this.searchForm.accountGroupBIds = ''
      this.searchForm.chosenTypeListString = ''
      this.searchForm.secTypeAll = '0'
      this.$refs[`validateDateCom`].setDefaultDate()
    },
    handleQuery() {
      /* if ((Number(this.searchForm.secTypeAll) === 0 && !this.searchForm.secCodes) || (Number(this.searchForm.secTypeAll) !== 0 && !this.searchForm.chosenTypeListString)) {
        this.$message.error('请选择证券大类或输入证券代码')
        return
      } */
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          // 如果两个值都不存在则设置默认值
          if (!this.searchForm.startTime && !this.searchForm.endTime){
            this.searchForm.startTime = '09:15:00'
            this.searchForm.endTime = '15:30:00'
          }
          if (!this.searchForm.startDate && !this.searchForm.endDate) {
            this.searchForm.startDate = this.defaultRelativeTradeDate
            this.searchForm.endDate = this.defaultRelativeTradeDate
          }
          if (selfValidateMethod({stocks: this.searchForm.secCodes, accountGroupA: this.searchForm.accountGroupAIds, accountGroupB: this.searchForm.accountGroupBIds})) { /* 批量校验证券代码格式 */
            this.$emit('handleQuery', this.searchForm)
          }
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .reverseDetailSearchForm {
    .date-time-component {
      /deep/ .el-date-editor {
        width: 160px;
      }
    }
  }
</style>
