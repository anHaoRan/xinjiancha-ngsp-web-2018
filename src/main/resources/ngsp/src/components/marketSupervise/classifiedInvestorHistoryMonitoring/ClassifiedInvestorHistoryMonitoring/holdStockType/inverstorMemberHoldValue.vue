<template>
  <div>
    <el-card class="el-card-table">
      <el-row>
        <el-form :inline="true" style="padding-left: 20px">
          <el-form-item label="分类投资者">
            <down-more-select @input="selectInvestor" :optionData='investorOptions' size='small' :clearFlag='clearFlag'></down-more-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="tradeDate"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              size="mini"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="getData" :loading="isLoading" type="primary" size="small">查询</el-button>
          </el-form-item>
          <el-form-item class="icon">
            <i class="fa el-icon-download" @click="holeValueExcel" style="font-size: 24px"></i>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-row :gutter="30" style="margin-top: -25px">
      <el-col :span="12">
        <el-card class="el-card-table">
          <el-table
            :data="memberHoldCount"
            v-loading="isLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            border
            tooltip-effect="dark"
            size="small"
            show-summary
            :summary-method="generalSum"
            highlight-current-row
            height="350"
            style="width: 100%;">
            <el-table-column
              v-for="column in memberHoldColumns"
              :key=column.field
              :align=column.align
              :prop=column.field
              :label=column.label
              :sortable=column.sortable
              :sort-method="column.sortMethod"
              :formatter="column.formatter"
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="el-card-table">
          <div id="pieChart" style="width: 806px;height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import DownMoreSelect from '../../../../common/downMoreSelect'
  import { getRelativeTradeDate } from '../../../../../service/common/commonFunc'
  import { getInvestorTypeData } from '../../../../../service/marketSupervise/investorDealCount/index'
  import { postMemberHoldValueData, postMemberHoldValueMapData } from '../../../../../service/marketSupervise/classifiedInvestorMonitoring/index'

  export default {
    components: {
      DownMoreSelect
    },
    data () {
      return {
        tDate: '',
        isLoading: false,
        stockShow: false, // 证券选择框
        tradeDate: '',
        investorClasses: '', // 分类投资者传递后台参数
        investorOptions: [], // 传递给子组件的账户组数据
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
          }
        },
        memberHoldCount: [], // 表格数据
        memberHoldColumns: [
          {label: '排名', field: 'rownum', align: 'center', minWidth: '100'},
          {label: '会员或公司简称', field: 'name', align: 'center', minWidth: '100'},
          {
            label: '持有市值(亿元)',
            field: 'position_val',
            align: 'center',
            minWidth: '100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_val'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '占比(%)',
            field: 'rate',
            align: 'center',
            minWidth: '100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rate')
          }
        ], // 表头
        totalData: [],
        clearFlag: 1
      }
    },
    mounted () {
      getRelativeTradeDate(-1).then(val => {
        this.tDate = val
        this.tradeDate = moment(val, 'YYYYMMDD').format('YYYY-MM-DD')
      })
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.investorOptions.push({value: el.value, label: el.text})
        })
      })
      this.getData()
    },
    methods: {
      // 接收子组件返回的分类投资者
      selectInvestor (result) {
        this.investorClasses = result.join(',')
      },
      holeValueExcel () {
        let param = {}
        param.tradeDate = this.tradeDate
        param.fileType = 'excel'
        param.gridType = 'Companies'
        param.tableColumns = this.memberHoldColumns
        this.gfnExportFileWithForm('/fluct/investor-classifieds-trade-supervise/v1/export-history-file', param)
      },
      generalSum () {
        const sums = ['']
        sums.push(this.totalData.name)
        sums.push(this.totalData.position_val)
        sums.push(this.totalData.rate)
        return sums
      },
      getData () {
        this.isLoading = true
        let params = {invstClasses: this.investorClasses, tradeDate: this.tradeDate}
        postMemberHoldValueData(params).then((resp) => {
          if (resp.bizData && resp.bizData.metaData) {
            let result = resp.bizData.metaData
            this.totalData = result.pop()
            this.memberHoldCount = []
            result.forEach((el, index) => {
              let num = el.rownum
              if (num === '0') {
                num = ''
              }
              if (el.name.indexOf('其他会员')) {
                this.memberHoldCount.push({name: el.name, position_val: el.position_val, rate: el.rate, rownum: num})
              }
            })
          } else {

          }
        })
        postMemberHoldValueMapData(params).then((resp) => {
          let result = resp.bizData.metaData
          // 饼图数据
          let legend = []
          let chartData = []
          result.forEach((el, index) => {
            legend.push(el.pbu_name)
            chartData.push({value: [Number(el.rate), el.position_val, Number(el.rate)], name: el.pbu_name})
          })
          let data = {legend, chartData}
          this.drawPieChart('pieChart', data)
          this.isLoading = false
        })
      },
      drawPieChart (id, pieList) {
        let businessPie = echarts.init(document.getElementById(id), this.gfnGetTheme())
        businessPie.clear()
        window.onresize = businessPie.resize
        businessPie.setOption({
          title: {
            left: 10,
            top: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
            }
          },
          legend: {
            left: 10,
            top: 10,
            width: '50%',
            data: pieList.legend,
            textStyle: {
              color: '#798fb8'
            }
          },
          toolbox: {
            right: '6%',
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (params) {
              return params.marker + params.name + '<br/>(市值: ' + params.value[1] + '亿元)<br/>' + (params.value[2] ? params.value[2] : 0) + '%'
            }
          },
          series: [{
            type: 'pie',
            radius: '75%',
            center: ['65%', '50%'],
            selectedOffset: 10,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    return (params.value[2] ? params.value[2] : 0) + '%'
                  },
                  position: 'outer'
                }
              }
            },
            data: pieList.chartData
          }]
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .el-card-table {
    /deep/ .el-checkbox-group {
      line-height: 30px;
    }

    .icon {
      margin: 6px;
    }

    /deep/ .el-table__footer-wrapper {
      tbody {
        td:nth-of-type(2),
        td:nth-of-type(3),
        td:nth-of-type(4) {
          text-align: center;
        }
      }
    }
  }
</style>
