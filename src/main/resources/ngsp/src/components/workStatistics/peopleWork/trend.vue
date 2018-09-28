<template>
  <div class="peopleWork">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="120px"
               style="padding-top: 20px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="processType" label="流程类型：" class="form-inline">
              <el-select v-model="ruleForm.processType" clearable placeholder="全部" size="small">
                <el-option
                  v-for="item in processTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起止日期：" prop="seDate" class="form-inline">
              <s-date-picker
                v-model="ruleForm.seDate"
                :is-range="true"
                type="date"
                startPlaceholder="请选择开始日期"
                endPlaceholder="请选择结束日期"></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="wmType" label="汇总粒度：" class="form-inline">
              <el-select v-model="ruleForm.wmType" size="small">
                <el-option
                  v-for="item in cycleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="groupType" label="小组类别：" class="form-inline">
              <el-select v-model="ruleForm.groupType" @change="changeGroup" clearable placeholder="全部" size="small">
                <el-option
                  v-for="item in groupTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="people" label="人员：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                :disabled="disabledPeople"
                style="width: 240px!important;"
                v-model="ruleForm.people"
                placeholder="全部">
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="form-inline">
              <el-button type="primary" @click="submitForm">生成图表</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-show="showCard">
      <div id='lineChart' style="height: 530px"
           v-loading="loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
  </div>
</template>

<script>
  import SDatePicker from '../../base/SDatePicker'
  import echarts from 'echarts'
  import moment from 'moment'
  import { getAllRoleOrg, peopleWorkTrendAll, peopleWorkTrend } from '../../../service/workStatistics/index'

  export default {
    name: 'trend',
    props: [],
    components: {
      SDatePicker
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
      eDate = moment().format('YYYY-MM-DD')
      return {
        ruleForm: {
          processType: '',
          seDate: [sDate, eDate],
          groupType: '',
          people: [],
          wmType: 'm'
        },
        rules: {},
        groupTypeOptions: [],
        peopleOptions: [],
        processTypeOptions: [
          {value: 'ngsp_sls_flow', label: '自律监管'},
          {value: 'ngsp_obd_flow', label: '调取资料'},
          {value: 'ngsp_uns_send_flow', label: '联合监管发函'},
          {value: 'ngsp_uns_check_flow', label: '联合监管复函'},
          {value: 'ngsp_dig_flow', label: '数据协查'},
          {value: 'ngsp_poa_flow', label: '舆情分析'},
          {value: 'ngsp_spw_flow', label: '专项工作'},
          {value: 'ngsp_tc_flow', label: '临时计算'},
          {value: 'ngsp_rfp_flow', label: '权限申请'},
          {value: 'ngsp_dmg_flow', label: '需求管理'},
          {value: 'ngsp_ltb_flow', label: '函件借阅'},
          {value: 'ngsp_ltl_flow', label: '函件传阅'},
          {value: 'ngsp_msc_flow', label: '重点监控证券'},
          {value: 'ngsp_crp_flow', label: '线索报告'},
          {value: 'ngsp_mka_flow', label: '市场分析'},
          {value: 'ngsp_lad_flow', label: '日志审计'},
          {value: 'ngsp_man_analy_flow', label: '操纵分析'}
        ],
        cycleOptions: [
          {value: 'w', label: '按周汇总'},
          {value: 'm', label: '按月汇总'}
        ],
        roleOrgData: [],
        disabledPeople: true,
        showCard: false,
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.showCard = true
            this.loading = true
            let params = {
              process_name: this.ruleForm.processType,
              sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
              eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD'),
              type: this.ruleForm.wmType,
              belongGroup: this.ruleForm.groupType,
              proce_person: this.ruleForm.people
            }
            // 小组是否全选
            if (!this.ruleForm.groupType) { // 全选
              var chartData = {time: [], data: []}
              params.usercode = ['REAL_MONITOR_GROUP_1', 'REAL_MONITOR_GROUP_2', 'REAL_MONITOR_GROUP_3', 'CLUE_ANALYSIS_GROUP_1', 'CLUE_ANALYSIS_GROUP_2', 'MARKET_ANALYSIS_GROUP', 'TECH_SUPPORT_GROUP', 'INTEGRATED_BUSINESS_GROUP']
              peopleWorkTrendAll(JSON.stringify(params)).then((resp) => {
                for (let item in resp) {
                  var tempObj = {name: '', type: 'line', data: [], smooth: true}
                  tempObj.name = this.changeWord(item)
                  // 取 chartData.time
                  if (chartData.time.length === 0) {
                    resp[item].forEach((obj) => {
                      chartData.time.push(obj.today)
                    })
                  }
                  // 取 chartData.data
                  resp[item].forEach((obj) => {
                    tempObj.data.push(obj.amount)
                  })
                  chartData.data.push(tempObj)
                }
                this.loading = false
                this.drawLineChart('lineChart', chartData)
              })
            } else {
              var chartData = {time: [], data: []}
              peopleWorkTrend(JSON.stringify(params)).then((resp) => {
                let nameArr = []
                for (let i = 0, len = resp.length; i < len; i++) {
                  chartData.time.push(resp[i].today)
                  if (i === 0) {
                    for (let item in resp[0]) {
                      if (item !== 'today') {
                        nameArr.push(item)
                      }
                    }
                  }
                }
                for (let j = 0, len = nameArr.length; j < len; j++) {
                  var oneLineArr = []
                  resp.forEach((obj) => {
                    oneLineArr.push(obj[nameArr[j]])
                  })
                  var tempObj = {name: nameArr[j], type: 'line', data: oneLineArr, smooth: true}
                  chartData.data.push(tempObj)
                }
                this.loading = false
                this.drawLineChart('lineChart', chartData)
              })
            }
          }
        })
      },
      changeWord (val) {
        let newVal = ''
        this.groupTypeOptions.forEach((obj) => {
          if (val === obj.value) {
            newVal = obj.label
          }
        })
        return newVal
      },
      changeData (obj) { // 过滤掉 today
        let newData = []
        for (let item in obj) {
          if (item !== 'today') {
            newData.push({name: item, value: obj[item]})
          }
        }
        return newData
      },
      drawLineChart (id, chartData) {
        let measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
        measureline.clear()
        window.onresize = measureline.resize
        measureline.setOption({
          title: {
            text: '工作量走势图'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {
            right: '12%',
            containLabel: true
          },
          legend: {
            inactiveColor: '#455579',
            orient: 'vertical',
            top: 'middle',
            right: '4%',
            textStyle: {
              color: '#506798'
            }
          },
          toolbox: {
            x: '90%',
            y: 'top',
            itemSize: 20,
            feature: {
              saveAsImage: {
                show: true
              }
            }
          },
          xAxis: {
            type: 'category',
            data: chartData.time,
            axisLabel: {
              rotate: 50
            }
          },
          yAxis: {
            type: 'value'
          },
          series: chartData.data
        })
      },
      changeGroup (val) {
        this.ruleForm.people = []
        this.peopleOptions = []
        if (!val) {
          this.disabledPeople = true
        } else {
          this.disabledPeople = false
          this.roleOrgData.forEach((obj) => {
            if (val === obj.usercode) {
              let people = obj.children
              people.forEach((item) => {
                this.peopleOptions.push({value: item.username, label: item.username})
              })
            }
          })
        }
      }
    },
    created () {
    },
    mounted () {
      getAllRoleOrg().then((resp) => {
        let data = resp.children[0].children[0].children
        this.roleOrgData = data
        data.forEach((obj) => {
          if (obj.usercode !== 'GROUP_TEST_1' && obj.usercode !== 'DEPARTMENT_LEADER') { // 过滤掉 部门负责人 和 测试组
            this.groupTypeOptions.push({value: obj.usercode, label: obj.username})
          }
        })
      })
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .peopleWork {
    .form-inline {
      display: inline-block;
    }
    .el-select {
      width: 240px;
    }
  }
</style>