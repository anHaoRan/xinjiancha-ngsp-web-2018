<template>
  <div>
    <el-card class="el-card-table">
      <el-row>
        <el-form :inline="true" :model="selectParams" style="padding-left: 20px">
          <el-form-item label="分类投资者">
            <down-more-select @input="selectInvestor" :optionData='investorOptions' size='small' :clearFlag='clearFlag'></down-more-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="selectParams.tradeDate"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              size="mini"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=""></el-form-item>
          <el-form-item>
            <el-button @click="fnGetHodingData" :loading="selectParams.isLoading" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-row :gutter="30" style="margin-top: -25px">
      <el-col :span="12">
        <HodingIndustries :data="hodingStockClasses" :params="selectParams"></HodingIndustries>
      </el-col>
      <el-col :span="12">
        <HodingMarketValue :data="hoding3Market" :params="selectParams"></HodingMarketValue>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import HodingIndustries from './inverstorHoldStockType/hodingIndustries'
  import HodingMarketValue from './inverstorHoldStockType/hodingMarketValue'
  import DownMoreSelect from '../../../../common/downMoreSelect'
  import { getRelativeTradeDate } from '../../../../../service/common/commonFunc'
  import { getInvestorTypeData } from '../../../../../service/marketSupervise/investorDealCount/index'
  import { reqHodingStockClasses, reqHoding3Market } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring/index'

  export default {
    components: {
      HodingIndustries,
      HodingMarketValue,
      DownMoreSelect
    },
    data () {
      return {
        tDate: '',
        stockShow: false, // 证券选择框
        selectParams: {
          isLoading: false,
          tradeDate: '',
          invstClasses: '' // 分类投资者传递后台参数
        },
        investorOptions: [],
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
          }
        },
        // 后台获取到的分类投资者持有证券分类
        hodingStockClasses: [],
        // 后台获取到的分类投资者持有大中小盘数据
        hoding3Market: [],
        clearFlag: 1
      }
    },
    methods: {
      // 接收子组件返回的分类投资者
      selectInvestor (result) {
        this.selectParams.invstClasses = result.join(',')
      },
      fnGetHodingData () {
        this.selectParams.isLoading = true
        let params = {
          invstClasses: this.selectParams.invstClasses,
          tradeDate: this.selectParams.tradeDate
        }
        this.fnGetHodingStockClasses(params)
        this.fnGetHoding3Market(params)
      },
      fnGetHodingStockClasses (params) {
        reqHodingStockClasses(params).then(resp => {
          if (resp && resp.bizData) {
            this.hodingStockClasses = resp.bizData.metaData
          } else {
            this.hodingStockClasses = null
          }
          this.selectParams.isLoading = false
        })
      },
      fnGetHoding3Market (params) {
        reqHoding3Market(params).then(resp => {
          if (resp && resp.bizData) {
            this.hoding3Market = resp.bizData.metaData
          } else {
            this.hoding3Market = null
          }
          this.selectParams.isLoading = false
        })
      }
    },
    mounted () {
      getRelativeTradeDate(-1).then(val => {
        this.tDate = val
        this.selectParams.tradeDate = moment(val, 'YYYYMMDD').format('YYYY-MM-DD')
      })
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.investorOptions.push({value: el.value, label: el.text})
        })
      })
      this.fnGetHodingData()
    }
  }
</script>

<style scoped lang="less">
  .el-card-table {
    /deep/ .el-checkbox-group {
      line-height: 30px;
    }
  }
</style>
