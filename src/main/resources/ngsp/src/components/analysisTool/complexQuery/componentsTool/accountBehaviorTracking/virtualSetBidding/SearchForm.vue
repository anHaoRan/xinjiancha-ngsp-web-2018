<!-- 虚拟集合竞价 -->
<template>
  <div class="tracking-virtual-set-bidding-form">
    <el-form label-width='100px' :model='formData' :rules='rules' :inline="true" :ref='`trackingAccount${num}`'>
      <el-col :xl='5' :lg='6' :md='12' :sm='12'>
        <el-form-item label='选择日期：' prop='date'>
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
      <el-col :xl='6' :lg='7' :md='16' :sm='16'>
        <el-form-item prop='startTime' class="virtual-set-bidding-time">
          <el-time-picker
            size="small"
            placeholder="开始时间"
            value-format="HH:mm:ss"
            v-model="formData.startTime"
            :picker-options="{}"
          ></el-time-picker>
        </el-form-item>
        <span style="margin-top: 2.5%; margin-right: 2.5%; display: inline-block;">至</span>
        <el-form-item prop='endTime' class="virtual-set-bidding-time">
          <el-time-picker
            size="small"
            placeholder="结束时间"
            value-format="HH:mm:ss"
            v-model="formData.endTime"
            :picker-options="{}"
          ></el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :xl='5' :lg='5' :md='12' :sm='12'>
        <el-form-item label='间隔秒数：' prop='timeSpace'>
          <el-input v-model="formData.timeSpace" size="small"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl='5' :lg='6' :md='12' :sm='12'>
        <el-form-item label='证券代码：' prop='secCode'>
          <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery')
    },
    props: ['num', 'defaultRelativeTradeDate'],
    data() {
      let endTimeRule = (rule, value, callback) => { // 时间判断
        let startT = this.handleDate(this.formData.startTime),
            endT = this.handleDate(this.formData.endTime)
        if (!endT) {
          callback(new Error('请输入结束时间'))
          return
        }
        let s = startT.split(':'), e = endT.split(':')
        if (s[0] > e[0]) {
          callback(new Error('结束时间不得小于开始时间'))
          return
        }
        if (s[0] == e[0] && s[1] > e[1]) {
          callback(new Error('结束时间不得小于开始时间'))
          return
        }
        if (s[0] == e[0] && s[1] == e[1] && s[2] > e[2]) {
          callback(new Error('结束时间不得小于开始时间'))
          return
        }
        callback()
      }
      return {
        commonData: { // 证券代码
          disabled: false,
          stockCode: ''
        },
        defaultDate: '',
        formData: {
          date: '',
          secCode: '',
          timeSpace: 1,
          startTime: moment(new Date('2017/09/09 09:15:00')).format('YYYY-MM-DD HH:mm:ss').split(' ')[1],
          endTime: moment(new Date('2017/09/09 09:25:00')).format('YYYY-MM-DD HH:mm:ss').split(' ')[1]
        },
        rules: {
          date: [
            {required: true, message: '请选择日期'}
          ],
          startTime: [
            {required: true, message: '请选择开始时间'}
          ],
          endTime: [
            {validator: endTimeRule}
          ],
          timeSpace: [
            {required: true, message: '请输入间隔秒数'}
          ],
          secCode: [
            {required: true, message: '请输入证券代码'}
          ]
        }
      }
    },
    methods: {
      handleDate(date) {
        if (date.toString().length > 9) {
          return moment(date).format('MMMM-YY-DD,HH:mm:ss').split(',')[1]
        }
        return date
      },
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
          timeSpace: 1,
          startTime: moment(new Date('2017/09/09 09:15:00')).format('YYYY-MM-DD HH:mm:ss').split(' ')[1],
          endTime: moment(new Date('2017/09/09 09:25:00')).format('YYYY-MM-DD HH:mm:ss').split(' ')[1]
        }
        this.commonData.stockCode = ''
      },
      handleSearch() {
        this.$refs['trackingAccount' + this.num].validate(valid => {
          if (valid) {
            let params =  JSON.parse(JSON.stringify(this.formData))
            params.startTime = params.startTime.replace(/:/g, '')
            params.endTime = params.endTime.replace(/:/g, '')
            this.$store.commit(`storeForm${this.num}`, params)
          }
        })
      }
    },
    mounted() {
    }
  }
</script>
<style lang='less' scoped>
  .tracking-virtual-set-bidding-form {
    .el-form {
      .virtual-set-bidding-time {
        .el-date-editor {
          max-width: 160px;
          width: 100%;
        }
      }
    }
  }
</style>
