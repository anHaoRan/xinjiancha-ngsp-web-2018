<!--个股营业部及账户分析-->
<template>
  <div>
    <el-form label-width='100px' :model='formData' :rules='rules' :inline='true' :ref='`trackingAccount${num}`'>
      <el-col :xl='7' :lg='9' :md='12' :sm='12'>
        <el-form-item label='选择日期：' prop='dateRange' >
          <el-date-picker
            size='small'
            value-format='yyyy-MM-dd'
            format='yyyy-MM-dd'
            v-model='formData.dateRange'
            type='daterange' range-separator='至'
            start-placeholder='开始日期'
            end-placeholder='结束日期'>
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl='5' :lg='6' :md='9' :sm='9'>
        <el-form-item label='证券代码：' prop='secCode'>
          <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {
    StockCodeQuery: () => import('@/components/common/StockCodeQuery')
  },
  props: ['num', 'defaultRelativeTradeDate'],
  data() {
    return {
      commonData: { // 证券代码
        disabled: false,
        stockCode: ''
      },
      defaultDate: [],
      formData: {
        dateRange: [],
        secCode: ''
      },
      rules: {
        dateRange: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        secCode: [
          {required: true, message: '请输入证券代码', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    defaultRelativeTradeDate(newValue) {
      // 重置日期为初始日期
      let defaultDate = newValue
      this.defaultDate = [defaultDate, defaultDate]
      this.formData.dateRange = this.defaultDate
    }
  },
  methods: {
    getStockCode(stockCodeData, type, code, stockSubType) {
      if (stockCodeData) {
        this.formData.secCode = stockCodeData.split(' ')[0]
      } else {
        this.formData.secCode = ''
      }
    },
    handleClear() {
      this.formData = {
        dateRange: this.defaultDate,
        secCode: ''
      }
      this.commonData.stockCode = ''
    },
    handleSearch() {
      this.$refs['trackingAccount' + this.num].validate(valid => {
        if (valid) {
          this.$store.commit(`storeForm${this.num}`, JSON.parse(JSON.stringify(this.formData)))
        }
      })
    }
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped></style>
