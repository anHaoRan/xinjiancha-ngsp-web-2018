<!-- 集合竞价 -->
<template>
  <div>
    <el-form label-width='100px' :model='formData' :rules='rules' :inline='true' :ref='`trackingAccount${num}`'>
      <el-col :xl='6' :lg='6' :md='12' :sm='12'>
        <el-form-item label='选择日期：' prop='date' >
          <el-date-picker
            prop="date"
            v-model="formData.date"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="small">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl='6' :lg='6' :md='12' :sm='12'>
        <el-col :xl='19' :lg='19' :md='24' :sm='24'>
          <el-form-item label='申报编号：' prop='orderNo'>
            <el-input v-model="formData.orderNo" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-col>
      <el-col :xl='6' :lg='6' :md='12' :sm='12'>
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
        defaultDate: '',
        formData: {
          date: '',
          secCode: '',
          orderNo: ''
        },
        rules: {
          date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          secCode: [
            {required: true, message: '请输入证券代码', trigger: 'blur'}
          ],
          orderNo: [
            {required: true, message: '请输入申报编号', trigger: 'blur'}
          ]
        }
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
          date: '',
          secCode: '',
          orderNo: ''
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
    mounted() {}
  }
</script>
<style lang='less' scoped></style>
