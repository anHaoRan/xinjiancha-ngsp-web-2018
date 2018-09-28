<template>
  <el-card class='overlayChart el-card-table'>
    <el-row>
      <el-col :span='2'>
        <el-radio-group v-model='chartTabsName' size='small' @change='tabsChange'>
          <el-radio-button label='sharingTime'>分时</el-radio-button>
          <el-radio-button label='dayK'>日K</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span='6' v-if='chartTabsName === "sharingTime"'>
        <div style='display: flex;'>
          <el-col :span='3' style='text-align: center'>
            <span style='line-height: 28px;'>时间</span>
          </el-col>
          <el-col :span='18'>
            <el-time-picker
              v-model='timeValue'
              is-range
              range-separator='至'
              start-placeholder='开始时间'
              end-placeholder='结束时间'
              value-format='HH:mm'
              @change='getTime'
              size='mini'>
            </el-time-picker>
          </el-col>
        </div>
      </el-col>
      <el-col :span='5' v-if='chartTabsName === "sharingTime"'>
        <div style='display: flex;'>
          <el-col :span='3' style='text-align: center'>
            <span style='line-height: 28px;'>日期</span>
          </el-col>
          <el-col :span='18'>
            <el-date-picker
              v-model='dateValue'
              range-separator='至'
              placeholder='请输入日期'
              value-format='yyyy-MM-dd'
              @change='getDate'
              :picker-options='pickerOptions'
              size='mini'>
            </el-date-picker>
          </el-col>
        </div>
      </el-col>
      <el-col :span='6' v-if='chartTabsName === "dayK"'>
        <div style='display: flex;'>
          <el-col :span='3' style='text-align: center'>
            <span style='line-height: 28px;'>日期</span>
          </el-col>
          <el-col :span='18'>
            <el-date-picker
              v-model='dateValue1'
              range-separator='至'
              :disabled='true'
              type='daterange'
              start-placeholder='开始日期'
              end-placeholder='结束日期'
              value-format='yyyy-MM-dd'
              size='mini'>
            </el-date-picker>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <el-row class='addLineBtn' v-show='chartTabsName === "sharingTime"'>
      叠加对象：
      <el-tag class='marginRight10' :key='tag' v-for='(tag,index) in addList' size='small' closable
              @close='handleClose(tag)'>
        <i :class="'tag' + index"></i>{{tag}}
      </el-tag>
      <el-button @click='addMore' type='primary' icon='el-icon-plus' size='mini'>叠加</el-button>
      <el-button @click="clearMore" type="info" size="mini">清除叠加</el-button>
    </el-row>
    <sharing-time-chart v-show='chartTabsName === "sharingTime"' :queryParams='queryParams'
                        :changeSelectTime='changeSelectTime' @getTimeData='getTimeData'></sharing-time-chart>
    <add-item-box @refreshIsShow='refreshIsShowBox' @refreshAddItems='refreshAddItemList' :addTags="addList"
                  :codeNameData="addCodeName" class='addItemBox' v-if='isMore'></add-item-box>
    <dayk-chart v-if='chartTabsName === "dayK"' :queryParams='queryParams' @getDayTime='getDayTime'></dayk-chart>
  </el-card>
</template>

<script>
  import moment from 'moment'
  import AddItemBox from '../../common/addItemBox'
  import SharingTimeChart from './overlayChart/sharingTimeChart'
  import DaykChart from './overlayChart/daykChart'
  import {getCurTradeDate} from '../../../service/common/commonFunc'

  moment.locale('zh-cn')
  export default {
    components: {
      AddItemBox,
      SharingTimeChart,
      DaykChart
    },
    data() {
      return {
        dateValue: '',
        dateValue1: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        timeValue: ['09:30:00', '15:00:00'],
        chartTabsName: 'sharingTime',
        isMore: false,
        addList: [],
        queryParams: {
          indexParams: {tradeDate: '', startTime: '09:30', endTime: '15:00', indexCode: ''},
          overlayParams: {
            tradeDate: '',
            startTime: '09:30',
            endTime: '15:00',
            codes: '',
            swVocs: '',
            wdVocs: '',
            cusVocs: ''
          }
        },
        addCodeName: [],
        changeSelectTime: []
      }
    },

    methods: {
      // 获取当前交易日
      getCurrentDate() {
        getCurTradeDate().then(resp => {
          this.dateValue = resp
          this.queryParams.indexParams.tradeDate = resp
          // this.queryParams.overlayParams.tradeDate = resp
        })
      },
      tabsChange(val) {
        // if (val != 'sharingTime') {
        //   this.addList = []
        // } else {
        //   this.dateValue1 = []
        // }
        if (val == 'sharingTime') {
          this.dateValue1 = []
        }
        this.$store.commit('saveTabsNameParams', val)
        // tabs切换时清空钻取表格
        this.$store.commit('savetableOneParams', {status: false, tabName: ''})
        this.$store.commit('savetableTwoParams', {status: false, tabName: ''})
        this.$store.commit('savetableThreeParams', {status: false, tabName: ''})
        this.$store.commit('savetableFourParams', {status: false, tabName: ''})
        this.$store.commit('savetableFiveParams', {status: false, tabName: ''})
      },
      // 分时框选时间
      getTimeData(val) {
        this.timeValue = val
      },
      // 日K框选日期
      getDayTime(val) {
        this.dateValue1 = val
      },
      getDate(val) {
        let params = ''
        if (!val) {
          this.queryParams.indexParams.tradeDate = ''
          params = ''
        } else {
          this.queryParams.indexParams.tradeDate = val
          params = moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
        }
        this.$store.commit('saveDateParams', params)
      },
      getTime(val) {
        if (!val) {
          this.timeValue = ['09:30:00', '15:00:00'],
            this.queryParams.indexParams.startTime = ''
          this.queryParams.indexParams.endTime = ''
          this.changeSelectTime = []
        } else {
          this.queryParams.indexParams.startTime = val[0]
          this.queryParams.indexParams.endTime = val[1]
          if (val[0] < '09:30') {
            val[0] = '09:30'
          }
          if (val[1] > '15:00') {
            val[1] = '15:00'
          }
          if (val[0] > '11:30' && val[0] < '13:01') {
            val[0] = '13:01'
          }
          if (val[1] > '11:30' && val[1] < '13:01') {
            val[1] = '13:01'
          }
          this.changeSelectTime = val
        }
      },
      addMore() {
        this.isMore = !this.isMore
      },
      clearMore() {
        this.$confirm('是否清除全部叠加？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          this.addList = []
          this.addCodeName = []
          this.refreshAddItemList()
        }).catch(() => {
        })
      },
      refreshIsShowBox(state) {
        this.isMore = state
      },
      refreshAddItemList(list, obj) {
        if (list !== undefined && obj !== undefined) {
          this.isMore = false
          this.addList = list
          this.addCodeName = obj
        }
        let codes = ''
        let swVocs = ''
        let wdVocs = ''
        let cusVocs = ''
        let sort = []
        this.addCodeName.forEach(addCode => {
          sort.push(addCode.code)
          if (addCode.type === 'index' || addCode.type === 'stock') {
            codes += addCode.code + ','
          } else if (addCode.type === 'block') {
            if (addCode.code.indexOf('SW') > -1) {
              swVocs += addCode.code + ','
            } else if (addCode.code.indexOf('WD') > -1) {
              wdVocs += addCode.code + ','
            } else {
              cusVocs += addCode.code + ','
            }
          }
        })
        this.queryParams.overlayParams.codes = codes
        this.queryParams.overlayParams.swVocs = swVocs
        this.queryParams.overlayParams.wdVocs = wdVocs
        this.queryParams.overlayParams.cusVocs = cusVocs
        this.queryParams.overlayParams.sort = sort.join(',')
      },
      handleClose(tag) {
        console.log(tag);
        let tagIndex = this.addList.indexOf(tag)
        this.addList.splice(tagIndex, 1)
        this.addCodeName.splice(tagIndex, 1)
        this.refreshAddItemList()
      }
    },
    mounted() {
      if (this.$route.query.params) {
        let params = JSON.parse(this.$route.query.params)
        if (params.stockCode != '000001') {
          this.addList.push(params.stockCodeName)
          this.addCodeName.push({code: params.stockCode, name: params.stockCodeName, type: 'index'})
          this.queryParams.overlayParams.codes = params.stockCode
        }
      }
      this.getCurrentDate()
    }
  }
</script>

<style scoped lang='less'>
  .overlayChart {
    position: relative;
    overflow: initial;
    padding: 10px 10px 0px;
    .el-card__body {
      position: relative;
      padding: 0 !important;
    }
    .addLineBtn {
      padding: 20px 0px;
      z-index: 2;
      .marginRight10 {
        margin-right: 10px;
      }
    }
    .addItemBox {
      position: absolute;
      top: 100px;
      left: 0;
      z-index: 4;
    }
    i {
      width: 10px;
      height: 10px;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
    .tag0 {
      background-color: #339933;
    }

    .tag1 {
      background-color: #1b5eed;
    }

    .tag2 {
      background-color: #288783;
    }

    .tag3 {
      background-color: #1de3c0;
    }

    .tag4 {
      background-color: #6766cc;
    }

    .tag5 {
      background-color: #ea6e0d;
    }

    .tag6 {
      background-color: #ca6796;
    }
  }

</style>
