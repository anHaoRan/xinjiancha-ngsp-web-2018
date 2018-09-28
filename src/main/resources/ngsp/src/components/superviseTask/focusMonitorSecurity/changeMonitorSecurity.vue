<template>
  <div class='changeMonitorSecurity'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='el-card-table'>
      <el-steps :active='activeName' style='padding:15px'>
        <el-step title='创建中' :description='processinfo[0]'></el-step>
        <el-step title='审核中' :description='processinfo[1]'></el-step>
        <el-step title='确认中' :description='processinfo[2]'></el-step>
        <el-step title='办结' :description='processinfo[3]'></el-step>
      </el-steps>
    </el-card>
    <div>
      <el-card class='el-card-table'>
        <div slot='header'>
          监控证券信息
        </div>
        <el-form :inline='true' :model='selectParams' ref='selectParams'>
          <el-row :gutter='20'>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控编号：'>
                <el-input size='small' v-model='selectParams.monitorNumber' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控原因：'>
                <el-select v-model='selectParams.monitorReason' placeholder='请选择' size='small'
                           @change='getReasonChange'>
                  <el-option
                    v-for='item in monitorReasonOptions'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='证券代码及简称：'>
                <stock-code-query :commonData='submitData' :clearable='false'
                                  @getStockCode='getStockCode'></stock-code-query>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='创建者：'>
                <el-input size='small' v-model='selectParams.creator' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='线索单号：'>
                <el-button type='text' size='middle' style='border: none' @click='jumpClueReport'>
                  {{selectParams.clewReport}}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控级别：'>
                <el-select v-model='selectParams.monitorLevel' placeholder='请选择' size='small' @change='getLevelChange'>
                  <el-option
                    v-for='item in monitorLevelOptions'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控起始日期：'>
                <el-date-picker
                  v-model='selectParams.startDate'
                  type='date'
                  size='small'
                  value-format='yyyy-MM-dd'
                  @change='startDateChange'
                  placeholder='开始日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控结束日期：'>
                <el-date-picker
                  v-model='selectParams.endDate'
                  type='date'
                  size='small'
                  :picker-options='endpickerOption'
                  @change='endDateChange'
                  value-format='yyyy-MM-dd'
                  placeholder='结束日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='重点监控描述：' class='describe'>
                <el-input v-model='selectParams.monitorDescribe' type='textarea' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class='el-card-table'>
      <div slot='header'>
        涉及监控账户组
      </div>
      <el-table
        :data='monitorGroupsData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        max-height='400'
        :reserve-selection='true'
        style='width: 100%'>
        <el-table-column
          header-align='center'
          align='center'
          type='index'
          label='序号'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in monitorGroupsColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        历史变更记录
      </div>
      <el-form :inline='true' :model='historyParams' ref='selectParams'>
        <el-form-item label='变更原因：' class='describe'>
          <el-input v-model='historyParams.changeReason' type='textarea' :maxlength=200
                    placeholder='最多输入200个字符'></el-input>
        </el-form-item>
        <el-form-item label='变更内容：' class='describe'>
          <el-input
            readonly
            :rows="5"
            v-model='historyChangeContent'
            type='textarea' class='changeInfo'></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data='historyChangeData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        max-height='400'
        :reserve-selection='true'
        style='width: 100%'>
        <el-table-column
          header-align='center'
          align='center'
          type='index'
          label='序号'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in historyChangeColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
    </el-card>
    <div style='text-align: right;padding: 15px'>
      <el-button type='primary' size='middle' @click='submit'>变更</el-button>
      <el-button type='info' size='middle' @click='goBack'>返回</el-button>
    </div>
  </div>

</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery';
  import MinxinVue from '../MixIn'
  import {
    getFormInfo,
    getHistorySuggest,
    changeMonitorStock,
    getInfoIdData,
    getStockGroupInfo
  } from '../../../service/superviseTask/focusMonitor/index'
  import moment from 'moment'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery
    },
    mixins: [MinxinVue],
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '/focusMonitorSecurity',
            label: '重点监控证券'
          },
          {
            router: '',
            label: '重点监控证券表单'
          }
        ],
        submitData: {disabled: true, stockCode: ''},
        activeName: 4,
        processinfo: ['', '', '', ''],
        selectParams: {
          monitorNumber: '',
          monitorReason: '',
          monitorLevel: '',
          startDate: '',
          endDate: '',
          clewReport: '',
          creator: '',
          monitorDescribe: '',
          stockCode: '',
          stockName: ''
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.selectParams.startDate).getTime() - 3600 * 1000 * 24
          }
        },
        historyParams: {
          changeReason: '',
          reasonTxt: '',
          levelTxt: '',
          beginDateTxt: '',
          endDateTxt: ''
        },
        historyChangeContent:'',
        monitorReasonOptions: [
          {value: '1', label: '涉嫌跨期操纵'},
          {value: '2', label: '涉嫌短线操纵'},
          {value: '3', label: '异动股'},
          {value: '4', label: '其他'}
        ],
        monitorLevelOptions: [
          {value: '0', label: '0级'},
          {value: '1', label: '1级'},
          {value: '2', label: '2级'},
          {value: '3', label: '3级'}
        ],
        monitorGroupsData: [], // 账户组表格
        monitorGroupsColumns: [
          {label: '监控账户组编号', field: 'monitorNo', align: 'center', minWidth: '6%'},
          {label: '监控原因', field: 'reason', align: 'center', minWidth: '6%'},
          {label: '监控级别', field: 'level', align: 'center', minWidth: '6%'},
          {label: '创建者', field: 'createPerson', align: 'center', minWidth: '6%'},
          {label: '涉及股票', field: 'relatedSecIds', align: 'center', minWidth: '6%'},
          {label: '监控开始时间', field: 'startDate', align: 'center', minWidth: '6%'},
          {label: '监控结束时间', field: 'endDate', align: 'center', minWidth: '6%'}
        ],
        historyChangeData: [], // 历史变更表格
        historyChangeColumns: [
          {label: '变更日期', field: 'altTime', align: 'center', minWidth: '6%'},
          {label: '变更原因', field: 'altReason', align: 'center', minWidth: '6%'},
          {label: '变更内容', field: 'altDetail', align: 'center', minWidth: '6%'},
          {label: '处理人', field: 'altPerson', align: 'center', minWidth: '6%'},
          {label: '审核人', field: 'exmPerson', align: 'center', minWidth: '6%'}
        ],
        CurrentPage: 1,
        PageTotal: 0,
        MscMainParams: {},
        infoId: '',
        oldDate: [], // 变更前的日期
        oldReason: '', // 变更前的原因
        oldLevel: '', // 变更前的级别
        clueInfoParams: '' // 请求线索报告信息参数
      }
    },
    created() {
      this.getHistorySuggestion()
    },
    mounted() {
      this.getFormInfo()
      this.getInfoNum()
    },
    methods: {
      // 获取infoid
      getInfoNum() {
        getInfoIdData().then(resp => {
          this.infoId = resp
        })
      },
      // 获取历史审核意见
      getHistorySuggestion() {
        getHistorySuggest(this.$route.query.instanceId).then(resp => {
          let res = resp.value
          res.forEach((el, index) => {
            this.processinfo[el.proceStatus] = el.procePerson + ' ' + moment(el.createTime).format('YYYY/MM/DD HH:mm:ss')
          })
        })
      },
      // 获取表单信息
      getFormInfo() {
        getFormInfo(this.$route.query.instanceId).then(resp => {
          let res = resp.MscMain
          this.MscMainParams = resp.MscMain
          this.selectParams.monitorNumber = res.monitorNo.toString()
          this.selectParams.monitorReason = res.reason.toString()
          this.oldReason = res.reason.toString()
          this.selectParams.monitorLevel = res.level.toString()
          this.oldLevel = res.level.toString()
          this.selectParams.startDate = res.startTime
          this.selectParams.endDate = res.endTime
          this.oldDate = [res.startTime, res.endTime]
          this.selectParams.creator = res.createPerson
          this.selectParams.monitorDescribe = res.description
          this.selectParams.stockCode = res.securityId
          this.selectParams.stockName = res.securityName
          this.submitData.stockCode = res.securityId + ' ' + res.securityName
          this.clueInfoParams = res.clueId
          this.selectParams.clewReport = res.extend2
          this.historyChangeData = resp.MscAlthistory
          getStockGroupInfo(res.securityId).then(resp => {
            resp.RelatedMagRec.forEach((el) => {
              if (el.level == '1') {
                el.level = '1级'
              } else if (el.level == '2') {
                el.level = '2级'
              } else if (el.level == '3') {
                el.level = '3级'
              } else {
                el.level = '0级'
              }
              if (el.reason == '1') {
                el.reason = '涉嫌跨期操纵'
              } else if (el.reason == '2') {
                el.reason = '涉嫌短线操纵'
              } else if (el.reason == '3') {
                el.reason = '异动股'
              } else {
                el.reason = '其他'
              }
            })
            this.monitorGroupsData = resp.RelatedMagRec
          })
        })
      },
      getStockCode(stockCodeData) {
        console.log(stockCodeData);
      },
      getReasonChange(val) {
        this.selectParams.startDate = new Date()
        let oldLabel = ''
        let newLabel = ''
        this.historyParams.reasonTxt = ''
        this.monitorReasonOptions.forEach((el, index) => {
          if (this.oldReason == el.value) {
            oldLabel = this.monitorReasonOptions[index].label
          }
          if (val == el.value) {
            newLabel = this.monitorReasonOptions[index].label
          }
        })
        if (val == '1' || val == '2') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 30)
        } else if (val == '3') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        } else {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        }
        if (this.oldReason != val) {
          this.historyParams.reasonTxt = '监控原因：' + oldLabel + ' 改为 ' + newLabel + '\n'
          if (this.oldDate[0] != moment(this.selectParams.startDate).format('YYYY-MM-DD')) {
            this.historyParams.beginDateTxt = '开始日期：' + (this.oldDate[0] || '') + ' 改为 ' + (this.selectParams.startDate ? moment(this.selectParams.startDate).format('YYYY-MM-DD') : '空') + '\n'
          } else {
            this.historyParams.beginDateTxt = ''
          }
          if (this.oldDate[1] != moment(this.selectParams.endDate).format('YYYY-MM-DD')) {
            this.historyParams.endDateTxt = '结束日期：' + (this.oldDate[1] || '') + ' 改为 ' + (this.selectParams.endDate ? moment(this.selectParams.endDate).format('YYYY-MM-DD') : '空') + '\n'
          } else {
            this.historyParams.endDateTxt = ''
          }
        } else {
          this.historyParams.beginDateTxt = ''
          this.historyParams.endDateTxt = ''
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt
        this.historyChangeContent = altDetail || this.historyChangeContent
      },
      getLevelChange(val) {
        let oldLabel = ''
        let newLabel = ''
        this.historyParams.levelTxt = ''
        this.monitorLevelOptions.forEach((el, index) => {
          if (this.oldLevel == el.value) {
            oldLabel = this.monitorLevelOptions[index].label
          }
          if (val == el.value) {
            newLabel = this.monitorLevelOptions[index].label
          }
        })
        if (this.oldLevel != val) {
          this.historyParams.levelTxt = '监控级别：' + oldLabel + ' 改为 ' + newLabel + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt
        this.historyChangeContent = altDetail || this.historyChangeContent
      },
      startDateChange(val) {
        this.historyParams.beginDateTxt = ''
        if (this.oldDate[0] != val) {
          this.historyParams.beginDateTxt = '开始日期：' + (this.oldDate[0] || '') + ' 改为 ' + (val || '空') + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt
        this.historyChangeContent = altDetail || this.historyChangeContent
        // let reason = this.selectParams.monitorReason
        // if(!val){
        //   this.selectParams.endDate = ''
        // }else{
        //   if (reason == '1' || reason == '2') {
        //     this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 30)
        //   } else {
        //     this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 7)
        //   }
        // }
      },
      endDateChange(val) {
        this.historyParams.endDateTxt = ''
        if (this.oldDate[1] != val) {
          this.historyParams.endDateTxt = '结束日期：' + (this.oldDate[1] || '') + ' 改为 ' + (val || '空') + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt
        this.historyChangeContent = altDetail || this.historyChangeContent
      },
      submit() {
        this.MscMainParams.infoId = this.infoId
        this.MscMainParams.level = this.selectParams.monitorLevel
        this.MscMainParams.reason = this.selectParams.monitorReason
        this.MscMainParams.startTime = this.selectParams.startDate ? moment(this.selectParams.startDate).format('YYYY-MM-DD') : ''
        this.MscMainParams.endTime = this.selectParams.endDate ? moment(this.selectParams.endDate).format('YYYY-MM-DD') : ''
        let params = {
          'MscMain': this.MscMainParams,
          'taskId': '0',
          'toWhom': '',
          'isApprove': '1',
          'altDetail': this.historyChangeContent,
          'altReason': this.historyParams.changeReason
        }
        changeMonitorStock(JSON.stringify(params)).then(resp => {
          this.$message.success(resp.message)

          this.goBack()
        })
      },
      // 跳线索上报流程
      jumpClueReport() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.clueInfoParams}&isNewTab=true`)
        // this.$router.push({name: 'clueReportForm', query: {operate: '1', taskId: '', instanceId: this.clueInfoParams}});
      }
    }
  }
</script>

<style lang='less'>
  .changeMonitorSecurity {
    .el-step__title.is-process {
      color: #fff
    }
    .el-form {
      padding: 0px 20px;
      .el-form-item {
        /*height: 63px;*/
        margin-bottom: 0px;
        padding: 10px 0px;
      }
    }
    .describe {
      width: 100%;
      .el-form-item__content {
        width: 88%;
      }
    }
  }
</style>
