<!-- 成交回放 -->
<template>
  <el-form label-width='130px' :model='formData' :rules='rules' :inline='true' :ref='`trackingAccount${num}`'>
    <el-col :xl='8' :lg='8' :md='12' :sm='12'>
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
    <el-col :xl='8' :lg='8' :md='12' :sm='12'>
      <el-form-item label='证券代码：' prop='secCode'>
        <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
      </el-form-item>
    </el-col>
    <el-col :xl='8' :lg='8' :md='12' :sm='12'>
      <el-form-item label='前N名营业部：' prop='topN' >
        <el-input v-model='formData.topN' size='small'></el-input>
      </el-form-item>
    </el-col>
    <el-col :xl='8' :lg='8' :md='12' :sm='12'>
      <el-form-item label='交易占比警戒值：' prop='warning' >
        <el-input v-model='formData.warning' size='small'></el-input>
      </el-form-item>
    </el-col>
  </el-form>
</template>
<script>
export default {
  components: {
    StockCodeQuery: () => import('@/components/common/StockCodeQuery')
  },
  props: ['num', 'defaultRelativeTradeDate'],
  data() {
    let checkTopN = (rule, value, callback) => {
      let patt = /^[0-9]*$/g
      if(value.length > 10) return callback('长度不能超过10')
      if (!patt.test(value)) return callback('请输入整数数值')
      callback()
    }
    return {
      defaultDate: [],
      commonData: { // 证券代码
        disabled: false,
        stockCode: ''
      },
      formData: {
        dateRange: [],
        secCode: '',
        topN: '',
        warning: ''
      },
      rules: {
        dateRange: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        secCode: [
          {required: true, message: '请输入证券代码', trigger: 'blur'}
        ],
        topN: [{validator: checkTopN}]
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
        secCode: '',
        topN: '',
        warning: ''
      }
      this.commonData.stockCode = ''
    },
    handleSearch() {
      this.$refs['trackingAccount' + this.num].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formData))
          if ( params.topN > 0) {
            params.isCalcTopN = 1
          } else {
            params.isCalcTopN = 0
          }
          this.$store.commit(`storeForm${this.num}`, params)
        }
      })
    }
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped></style>
