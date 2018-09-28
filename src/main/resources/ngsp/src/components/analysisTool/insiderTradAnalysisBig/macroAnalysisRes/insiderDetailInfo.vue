<template>
  <div class="insider-detail-info">
    <el-card style="margin-top: 0;padding-top: 15px;">
      <div class="title">
        知情人交易汇总表
      </div>
      <el-table
        :data="mainTableData"
        border
        show-overflow-tooltip
        style="margin-bottom: 15px;"
        v-loading="queryResLoadMain"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">

        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getRadio"></el-radio>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in mainTable"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resultNum">
      </el-pagination>
      <div v-show="showSubTable">
        <div class="title" style="margin-top: 35px;">
          知情人逐日交易明细表
        </div>
        <el-table
          :data="subTableData"
          border
          show-overflow-tooltip
          style="margin-bottom: 20px;"
          v-loading="queryResLoadSub"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
            v-for="item in subTable"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :align="item.align"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="insider-detail-info-chart" style="width: 1200px;height:300px;margin: 0 auto"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import {
  getInsiderDetailSum,
  getInsiderDetailSingle
} from '@/service/analysisTool/insiderTradAccountAnalysisBig/index'

export default {
  name: 'insider-detail-info',
  data() {
    return {
      msg: '内幕知情人交易情况',
      mainTableData: [],
      radio: '',
      subTableData: [],
      showSubTable: false,
      chartData: {},
      queryResLoadMain: false,
      queryResLoadSub: false,
      mainTable: [
        {prop: 'ccrc_acct_id', label: '一码通', align: 'left'},
        {prop: 'account_code', label: '账户代码', align: 'left'},
        {prop: 'account_name', label: '账户名称', align: 'left'},
        {prop: 'stock_code', label: '股票代码', align: 'left'},
        {prop: 'stock_name', label: '股票名称', align: 'left'},
        {prop: 'full_name', label: '会员营业部', align: 'left'},
        {prop: 'trade_buy_volume', label: '期间买入数量', align: 'right'},
        {prop: 'trade_buy_value', label: '期间买入金额', align: 'right'},
        {prop: 'trade_sale_volume', label: '期间卖出数量', align: 'right'},
        {prop: 'trade_sale_value', label: '期间卖出金额', align: 'right'}
      ],
      subTable: [
        {prop: 'trading_date', label: '日期', align: 'left'},
        {prop: 'ccrc_acct_id', label: '一码通', align: 'left'},
        {prop: 'account_code', label: '账户代码', align: 'left'},
        {prop: 'account_name', label: '账户名称', align: 'left'},
        {prop: 'stock_code', label: '股票代码', align: 'left'},
        {prop: 'stock_name', label: '股票名称', align: 'left'},
        {prop: 'full_name', label: '会员营业部', align: 'left'},
        {prop: 'trade_buy_volume', label: '买成交量', align: 'right'},
        {prop: 'trade_buy_value', label: '买成交额', align: 'right'},
        {prop: 'trade_sale_volume', label: '卖成交量', align: 'right'},
        {prop: 'trade_sale_value', label: '卖成交额', align: 'right'}
      ],
      flag: true,
      // 分页
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      resultNum: 0
    }
  },
  methods: {
    getRadio(val) {
      this.queryResLoadSub = true
      let params = this.mainTableData[val].account_code;
      let that = this;
      this.showSubTable = true;
      getInsiderDetailSingle(this.$store.state.insiderTradAnalysis.currentTaskData.taskId, params).then((resp) => {
        if (!$.isEmptyObject(resp)) {
          this.queryResLoadSub = false
          let stockPriceList = [], buyNumList = [], saleNumList = [], dateList = [];
          for (let i = 0; i < resp.length; i++) {
            stockPriceList.push(resp[i].close_price);
            buyNumList.push(resp[i].trade_buy_volume);
            let oDate = moment(resp[i].trading_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
            let oSale = 0 - (resp[i].trade_sale_volume - 0);
            saleNumList.push(oSale);
            dateList.push(oDate)
          }
          that.chartData = {
            stockPriceList: stockPriceList,
            buyNumList: buyNumList,
            saleNumList: saleNumList,
            dateList: dateList
          };
          this.draw(that.chartData);
          this.subTableData = resp
        }
      })
    },
    draw(data) {
      //  console.log(111);
      let mychart = echarts.init($('.insider-detail-info-chart')[0], this.gfnGetTheme());
      mychart.setOption({
        legend: [
          {
            bottom: 0,
            // 位置靠右
            left: 'center',
            data: ['股票价格', '买入数量', '卖出数量'],
            textStyle: {
              color: '#aec0e6'
            },
            inactiveColor: '#7b8fb9'
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: 'rgba(245,245,245,0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'},
          label: {
            backgroundColor: '#777'
          }
        },
        grid: {
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '##455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6'
            //  interval: 10
          },
          splitLine: {
            show: false
          },
          data: data.dateList
        },
        yAxis: [{
          name: '买卖数量',
          nameTextStyle: {
            color: '#aec0e6'
          },
          type: 'value',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#273757',
              type: 'dashed'
            }
          }
        },
        {
          name: '股票价格',
          nameTextStyle: {
            color: '#aec0e6'
          },
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6'
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#273757',
              type: 'dashed'
            }
          }
        }],
        series: [
          {
            name: '买入数量',
            type: 'bar',
            //  smooth: true,
            yAxis: 1,
            itemStyle: {
              color: '#4a57ff',
              normal: {
                color: '#4a57ff'
              }
            },
            data: data.buyNumList
          },
          {
            name: '卖出数量',
            type: 'bar',
            //  smooth: true,
            // symbol: 'none',
            sampling: 'average',
            yAxis: 1,
            itemStyle: {
              color: '#18b2f2',
              normal: {
                color: '#18b2f2'
              }
            },
            data: data.saleNumList
          },
          {
            name: '股票价格',
            type: 'line',
            // smooth: true,
            // symbol: 'none',
            sampling: 'average',
            yAxisIndex: 1,
            itemStyle: {
              color: '#ff4c4c',
              normal: {
                color: '#ff4c4c'
              }
            },
            data: data.stockPriceList
          }
        ]

      }, true)
    },
    getResultData() {
      if (this.flag) {
        this.flag = false
        this.queryResLoadMain = true
        let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId;
        let pageIndex = this.currentPage;
        let pageSize = this.pageSize;
        getInsiderDetailSum(taskId, pageIndex, pageSize).then((resp) => {
          if (!$.isEmptyObject(resp)) {
            this.queryResLoadMain = false
            this.mainTableData = resp.insiderList;
            this.resultNum = resp.rowsCount - 0;
          } else {
            this.flag = true
          }
        })
      }
      //  getInsiderDetailSum('T20180224155026').then((resp) => {
      //    if (!$.isEmptyObject(resp)) {
      //      this.mainTableData = resp;
      //    }
      //  })
    },
    //   分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  },
  mounted() {
    //  this.getResultData();
  }
}
</script>

<style lang='less'>
  .insider-detail-info {
    .radio {
      .el-radio__label {
        display: none;
      }
    }
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      color: white;
    }
  }
</style>
