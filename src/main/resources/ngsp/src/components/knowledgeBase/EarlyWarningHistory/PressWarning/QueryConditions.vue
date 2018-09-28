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
            <el-form-item label="预警日期" prop="selectDateRange">
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
            <el-form-item label="板块">
              <el-select v-model="selectParams.selectPlate" class="customize-width" placeholder="请选择" size="small">
                <el-option
                  v-for="item in plateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
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
            <el-form-item label="预警级别">
              <el-select v-model="selectParams.selectAlarmLevel" class="customize-width" placeholder="请选择" size="small">
                <el-option
                  v-for="item in alarmLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="处理人">
              <selector-dealer class="customize-width" ref="selectorDealer" @node-click="handlerClick"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="处理结论">
              <el-select v-model="selectParams.selectConclusion" class="customize-width" placeholder="请选择" size="small">
                <el-option
                  v-for="item in conclusionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input v-model="selectParams.keyWorld" class="customize-width" size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getNoTag1MetaData, getNolinkMetaData } from '@/service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          selectDateRange: [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
          selectTimePicker: null,
          securitiesCode: '',
          selectPlate: '',
          selectAlarmType: '',
          selectAlarmLevel: '',
          selectDealer: '',
          selectConclusion: '',
          keyWorld: ''
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        rules: {
          selectDateRange: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        },
        plateOptions: [
          {value: '', label: '全部', disabled: false},
          {value: '3', label: '国际版', disabled: false},
          {value: '1', label: '债券', disabled: false},
          {value: '2', label: '风险警示', disabled: false},
          {value: '5', label: '个股期权', disabled: false},
          {value: '4', label: '新兴版', disabled: false}
        ],
        alarmTypeOptions: [],
        alarmLevelOptions: [],
        conclusionOptions: []
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
        getNolinkMetaData('warnningDealStatus').then(res => {
          let arr = res.map(item => {
            return {
              value: item.value,
              label: item.text
            }
          })
          arr.unshift({value: '', label: '全部'})
          this.conclusionOptions = arr
        })
        getNolinkMetaData('warnningLevel').then(res => {
          let arr = res.map(item => {
            return {
              value: item.value,
              label: item.text
            }
          })
          arr.unshift({value: '', label: '全部'})
          this.alarmLevelOptions = arr
        })
      },
      handlerClick (val) {
        this.selectParams.selectDealer = val
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
        this.selectParams.selectTimePicker = null
        this.selectParams.selectPlate = ''
        this.selectParams.selectAlarmType = ''
        this.selectParams.selectAlarmLevel = ''
        this.selectParams.selectConclusion = ''
        this.selectParams.selectDealer = ''
        this.selectParams.keyWorld = ''
        this.$refs.stockCode.clearCon()
        this.$refs.selectorDealer.clearValue()
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
      width: 350px;
    }
  }
</style>
