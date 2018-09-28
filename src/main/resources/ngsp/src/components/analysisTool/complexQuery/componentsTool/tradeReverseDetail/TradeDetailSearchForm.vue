<!--  成交对手方明细 -->
<template>
  <el-card class="tradeDetailSearchForm">
    <div slot="header">
      <span>查询条件</span>
      <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
      <el-button size="small" type="info"  @click="handleClear">清空</el-button>
      <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
    </div>
    <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
      <el-col :xl="9" :lg="12" :md="16" :sm="16" class="date-time-component">
        <date-time-component
          ref="validateDateTradeDetail"
          @getDate="getChangeDate"
          @getTime="getChangeTime"
          :dateRequire="false"
          :timeRequire="false"
          :defaultOption="defaultDateOptions"></date-time-component>
      </el-col>
      <el-col :xl="9" :lg="12" :md="12" :sm="12">
        <stock-codes-upload-and-secType-select-component ref="stockCodesListRef" @getStockCode="getStockCode" @handleSecTypeAndChosenTypeListChange="handleSecTypeAndChosenTypeListChange"></stock-codes-upload-and-secType-select-component>
      </el-col>
      <el-col :xl="6" :lg="10" :md="12" :sm="12">
        <el-form-item  prop="acctIds" label="账户代码" :rules="[{
          required: true, message: '请输入账户代码'
        }]">
          <text-area-codes-and-upload-component
            ref="accountRef" :codeType="`account`"
            :uploadParams="{
              parseRule: JSON.stringify(
                {
                  verifies: ['ACCOUNT_CODE']
                }
              )
            }"
            @getTextareaCodeList="getTextareaCodeList"></text-area-codes-and-upload-component>
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
          title: '成交对手方明细',
          content: [
            `1.	本应用支持查询自2006-01-01至今的竞价系统成交明细数据。`,
            `2.	按照“交易日期”、“成交时间”、“成交编号”相同的规则，将竞价系统中同一笔成交的买、卖成交记录合并为一条。`,
            `3.	债券的成交数量为“手”，B股的成交价格和成交金额为“美元”。`,
            `4.	在统计时，“本方（或对方）会员营业部名称”字段的值基于成交明细数据中的Stat_Seat_Code来确定。如果某一个股东账户在同一交易日内的成交明细数据中出现了不同的Stat_Seat_Code（这种情况比较少见，但存在），那么以该股东账户当天第一笔交易类申报记录对应的Stat_Seat_Code来作为其当天所有交易的Stat_Seat_Code。即对某一个股东账户而言，在同一交易日内所有交易数据的“买入（或卖出）营业部名称”都相同。`,
            `5.	Stat_Seat_Code（统计席位代码/统计PBU代码）是数据仓库为了更准确、更方便地识别某条申报/成交记录来自于哪个营业部而设计的一个代码。其算法是根据该条申报/成交记录中券商填报的Branch_ID（2010-01-22以后）/内部订单编号的前两位（2010-01-21以前）对应的营业部，判断其是否属于这个券商。若是，则按其填报的营业部统计。若否，则按其下单的席位/PBU对应的主营业部统计。`,
            `6.	根据“Stat_Seat_Code”获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。`,
            `7.	本方（或对方）股东名称，取查询日期区间内最新的名称。`,
            `8.	证券简称，取交易日期当天收盘行情文件show2003里该证券的证券简称。`,
            `9.	用户参数界面中证券大类的识别规则如下：`,
            `   股票：证券代码为6*****或者900***`,
            `   债券：证券代码为0*****或者1*****`,
            `   基金：证券代码为50****或者51****。`,
            `   （注：上述代码区间均不含目前分配给指数类品种的证券代码）`
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
        acctIds: '',
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
      if (this.$refs[`validateDateTradeDetail`]) {
        this.$refs[`validateDateTradeDetail`].setDefaultDate()
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
    getTextareaCodeList(data) {
      this.searchForm.acctIds = data
    },
    handleClear() {
      this.$refs['stockCodesListRef'].clearStockCodes()
      this.$refs['accountRef'].clearCodeList()
      this.searchForm.secCodes = ''
      this.searchForm.acctIds = ''
      this.searchForm.chosenTypeListString = ''
      this.searchForm.secTypeAll = '0'
      this.$refs[`validateDateTradeDetail`].setDefaultDate()
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
          if (selfValidateMethod({stocks: this.searchForm.secCodes, accounts: this.searchForm.acctIds})) { /* 批量校验证券代码格式 */
            this.$emit('handleQuery', this.searchForm)
          }
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .tradeDetailSearchForm {
    .date-time-component {
      /deep/ .el-date-editor {
        width: 160px;
      }
    }
  }
</style>
