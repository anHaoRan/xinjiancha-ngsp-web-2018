<template>
  <div class="query-conditions">
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="resetForm">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="select">查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" :rules="rules" label-width="120px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="预警日期">
              <el-date-picker v-model="selectParams.selectDateRange"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                              size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="预警时间">
              <el-time-picker v-model="selectParams.selectTimePicker"
                              is-range
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="HH:mm:ss" value-format="HH:mm:ss"
                              size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码及简称">
              <stock-code-query :commonData="submitData"
                                clearable
                                class="customize-width"
                                ref="stockCode"
                                @getStockCode="getStockCode"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="预警类型">
              <el-select v-model="selectParams.selectAlarmType" class="customize-width" placeholder="请选择" size="small">
                <el-option
                  v-for="item in alarmTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="一码通账户">
              <el-input v-model="selectParams.ymtAccount" class="customize-width" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="投资者分类">
              <el-select v-model="selectParams.investorClass"
                         collapse-tags
                         multiple
                         class="customize-width"
                         placeholder="请选择" size="small">
                <el-option
                  v-for="item in investorClassOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="账户代码">
              <el-input v-model="selectParams.accountCode" class="customize-width" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="会员名称">
              <select-lazy-multiple :selectParams="selectParams2" class="customize-width" @getSelectRes="getSelectRes2"
                                    ref="selectLazyMultipleMember"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input v-model="selectParams.keyWorld" class="customize-width" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12" :sm="24">
            <el-form-item label="营业部名称">
              <select-lazy-multiple :selectParams="selectParams1" @getSelectRes="getSelectRes"
                                    ref="selectLazyMultipleBranchName"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getNoTag1MetaData } from '@/service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      SelectLazyMultiple: () => import('@/components/common/SelectLazyMultiple')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          selectDateRange: null,
          selectTimePicker: null,
          securitiesCode: '',
          selectAlarmType: '',
          ymtAccount: '',
          investorClass: [],
          accountCode: '',
          memberName: '',
          branchName: '',
          keyWorld: ''
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        //  产品类型代码
        selectParams1: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'salePart'
        },
        //  产品类型代码
        selectParams2: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'member'
        },
        rules: {},
        alarmTypeOptions: [],
        investorClassOptions: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      getStockCode (stockCodeData) {
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.securitiesCode = indexCode
          // this.selectParams.indexName = indexName
        } else {
          this.selectParams.securitiesCode = ''
        }
      },
      getSelectRes (val) {
        this.selectParams.branchName = val.join(',')
      },
      getSelectRes2 (val) {
        this.selectParams.memberName = val.join(',')
      },
      ajaxGetNoTag1MetaData () {
        getNoTag1MetaData('warnningType', 'realWarn').then(res => {
          let arr = res.map(item => {
            return {
              value: item.text,
              label: item.text
            }
          })
          arr.unshift({value: '', label: '全部'})
          this.alarmTypeOptions = arr
        })
        getNoTag1MetaData('investorType', 'all').then(res => {
          let arr = res.map(item => {
            return {
              value: item.value,
              label: item.text
            }
          })
          this.investorClassOptions = arr
        })
      },
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.$emit('select', this.selectParams)
          }
        })
      },
      resetForm () {
        this.$refs['selectParams'].resetFields()
        this.selectParams.selectDateRange = null
        this.selectParams.selectTimePicker = null
        this.$refs.stockCode.clearCon()
        this.selectParams.selectAlarmType = ''
        this.selectParams.ymtAccount = ''
        this.selectParams.investorClass = []
        // this.$refs.downMoreSelect.cancel()
        this.selectParams.accountCode = ''
        this.selectParams.memberName = ''
        this.selectParams.branchName = ''
        this.selectParams1.selectStockCodeVal = []
        this.selectParams1.selectCheckboxValue = []
        this.selectParams2.selectStockCodeVal = []
        this.selectParams2.selectCheckboxValue = []
        this.selectParams.keyWorld = ''
      }
    },
    created () {
      this.ajaxGetNoTag1MetaData()
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .query-conditions {
    .customize-width {
      width: 350px !important;
    }
  }
</style>
