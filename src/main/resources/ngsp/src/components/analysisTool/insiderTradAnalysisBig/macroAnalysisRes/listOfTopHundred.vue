<template>
  <div class="list-of-top-hundred">
    <el-card style="padding-top: 10px;margin-top: 0;padding-bottom:30px;position: relative;" class="el-card-table">
      <el-table :data="tableData"
                tooltip-effect="dark"
                ref="mulitipleTable"
                style="width: 100%"
                border
                @selection-change="handleSelectionChange"
                @select="selectCurrentRow"
                @select-all="selectAllCurrentTableData"
                v-loading="queryResLoad"
                element-loading-spinner="el-icon-loading"
                element-loading-text="数据加载中，请耐心等待..."
                element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column type="selection"
                         width="55"
                         align="center">
        </el-table-column>
        <el-table-column prop="account_code"
                         label="账户代码">
        </el-table-column>
        <el-table-column prop="account_name"
                         label="账户名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ccrc_acct_id"
                         label="一码通"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="member_name"
                         label="会员名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="full_name"
                         label="营业部名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hold_volume_total"
                         label="持股数量"
                         align="right">
        </el-table-column>
        <el-table-column prop="h_ratio"
                         label="持股占比(%)"
                         align="right">
        </el-table-column>
        <el-table-column prop="hold_volume"
                         label="流通股持股量"
                         align="right">
        </el-table-column>
        <el-table-column prop="hold_volume_neg"
                         label="非流通股持有量"
                         align="right">
        </el-table-column>
        <el-table-column prop="net_buy_volume"
                         label="分析期间净买入量"
                         align="right">
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultNum">
        </el-pagination>
      </div>
      <el-row style="text-align: right;margin:0 20px 0;">
        <el-button size="small" type="primary" @click="futherAnalysisAccount">进一步分析选中账户</el-button>
        <el-button size="small" type="primary" @click="getPieCharts">持股统计占比</el-button>
      </el-row>
      <div v-show="chartShow" style="margin-left: 80px;">所选账户合计持股占比：{{totalPersent}}%</div>
      <div v-show="chartShow"
           class="holding-ratio-charts"
           style="width: 1600px;height: 400px;margin: 20px auto"
           v-loading="queryResLoadChart"
           element-loading-spinner="el-icon-loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
      <div v-show="chartShow">
        <div style=" width: 45%; text-align: right;display: inline-block;padding-right:110px;box-sizing: border-box">
          所选账户一码通维度合计持股占比为{{ymtPersent}}%
        </div>
        <div style="width: 45%; text-align: left;display: inline-block;padding-left:110px;box-sizing: border-box">
          所选账户所在交易营业部合计持股占比为{{salePartPersent}}%
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import echarts from 'echarts'
import {
  getListOfTopHundred,
  getStatisticsOfHundred,
  addAccountListOfHundred
} from '@/service/analysisTool/insiderTradAccountAnalysisBig/index'

export default {
  //  name: 'list-of-top-hundred',
  data() {
    return {
      msg: '期末持股前100名账户列表',
      // 饼图数据接口入参
      params: {},
      tableData: [],
      queryResLoad: false,
      queryResLoadChart: false,
      selectRow: {
        uniteCodeCollect: [],
        salePartCollect: [],
        uniteName: [],
        salePartName: []
      },
      selectDataMoment: [],
      // 进一步分析
      selectData: [],
      totalPersent: 0,
      ymtPersent: '',
      salePartPersent: '',
      chartShow: false,
      selectval: [],
      flag: true,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      resultNum: 0
    }
  },
  methods: {
    // 获取当前选中行
    selectCurrentRow(select, row) {
      if ($.isEmptyObject(this.selectDataMoment)) {
        this.selectDataMoment.push(row);
      } else {
        let currentId = row.id
        let that = this
        let selList = new Set();
        select.map(function (item) {
          return selList.add(item.id)
        })
        if (!selList.has(currentId)) {
          this.selectDataMoment.forEach(function (item, index) {
            if (item.id == currentId) {
              that.selectDataMoment.splice(index, 1)
            }
          })
        } else {
          this.selectDataMoment.push(row);
          // 去重处理
          let newArr = []
          for (let i = 0; i < this.selectDataMoment.length; i++) {
            if (newArr.indexOf(this.selectDataMoment[i]) === -1) {
              newArr.push(this.selectDataMoment[i])
            }
          }
          this.selectDataMoment = newArr
        }
      }
      this.selectData = this.selectDataMoment.map(function (item) {
        return {
          full_name: item.full_name,
          account_name: item.account_name,
          account_code: item.account_code,
          member_name: item.member_name,
          ccrc_acct_id: item.ccrc_acct_id,
          id: item.id
        }
      })
      this.params['taskId'] = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      //  this.params['taskId'] = '20180503163730'
      let ccrcAcctIdList = [];
      let fullNameList = [];
      for (let i = 0; i < this.selectDataMoment.length; i++) {
        ccrcAcctIdList.push(this.selectDataMoment[i].ccrc_acct_id);
        fullNameList.push(this.selectDataMoment[i].full_name);
      }
      this.params['ccrcAcctId'] = ccrcAcctIdList.join(',');
      this.params['fullName'] = fullNameList.join(',');
      console.log(this.selectDataMoment.length);
    },
    // 全选行事件
    selectAllCurrentTableData(val) {
      // val值有两种情况，另一种是与当前表格数据相同，即全选，一种为空数组，即取消全选
      // 把当前表格数据存储在一个变量中，另外设置一个变量n,用来记录已选项与 val 两个数组相匹配的数量
      let arr = JSON.parse(JSON.stringify(this.tableData)), n = 0
      // 双层for循环，遍历 val 与 this.selectDataMoment 两数组中相同项，若有相同项，n+=1
      for (let i = 0; i < this.selectDataMoment.length; i++) {
        for (let j = 0; j < val.length; j++) {
          if (this.selectDataMoment[i]['id'] === val[j]['id']) {
            n += 1
          }
        }
      }
      if (n % this.pageSize === 0) {
        /**
         * 如果 n % this.pageSize == 0
         * 说明此时有三种情况
         * 第一种是 this.selectDataMoment 为空，val 不为空，n=0 , 即进入该 tab 页没有单独选任何一项，直接点全选，此时为全选
         * 第二种是 this.selectDataMoment 不为空，val 为空，n=0 , val 为空即取消全选
         * 第三种是 this.selectDataMoment 不为空，val 不为空，n != 0 && n % this.pageSize==0 , 此时为全选
         * 无论哪种情况，遍历当前表格数据，将 val 作为已勾选值，将当前表格数据中的每一行作为即将勾选值，调用表格的单选行方法
         * 表格的单选行方法中，若val有值，则全部勾选，若val无值，则全部取消勾选，并对 this.selectMoment 做相应更新
         **/
        arr.forEach(item => {
          this.selectCurrentRow(val, item)
        })
      } else {
        /**
         * 除以上情况外，还有一种情况，n % this.pageSize != 0：
         * 此时当前页表格中已有部分行被勾选，需要再做遍历，将 arr 中已选行剔除，将处理后的 arr 作为上个if分支中的第三种情况里的 val，
         * 再调用单选行方法，将剩余未勾选行全部选中，并对 this.selectMoment 做相应改变
         **/
        for (let i = 0; i < this.selectDataMoment.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (!$.isEmptyObject(this.selectDataMoment)) {
              if (this.selectDataMoment[i]['id'] === arr[j]['id']) {
                arr.splice(j, 1)
              }
            }
          }
        }
        arr.forEach(item => {
          this.selectCurrentRow(arr, item)
        })
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.mulitipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.mulitipleTable.clearSelection()
      }
    },

    handleSelectionChange(val) {

    },
    draw() {
      let mychart = echarts.init($('.holding-ratio-charts')[0], this.gfnGetTheme());
      let that = this;
      mychart.setOption({
        title: [
          {
            left: '26%',
            top: 10,
            text: '一码通持股占比',
            textStyle: {
              color: '#fff'
            }
            //  subtext:'所选账户一码通维度合计持股占比为'+that.ymtPersent,
            //  subtextStyle:{
            //    x: '40px',
            //    y: '20px',
            //    align:'center',
            //  }
          },
          {
            left: '56%',
            top: 10,
            text: '营业部持股占比',
            textStyle: {
              color: '#fff'
            }
            //  subtext:'所选账户所在交易营业部合计持股占比为'+that.ymtPersent,
            //  subtextStyle:{
            //    align:'center',
            //  }
          }
        ],
        tooltip: {
          trigger: 'item',
          // 格式化提示内容
          formatter: '{a}<br/>{b}:{c}（{d}%）'
        },
        //  visualMap:{
        //    show:false,
        //    min:80,
        //    max:600,
        //    inRange:{
        //      colorLightness:[0,1]
        //    }
        //  },
        legend:
          [
            {
              type: 'scroll',
              orient: 'vertical',
              left: 80,
              top: 'middle',
              bottom: 20,
              width: 500,
              height: 160,
              data: that.selectRow.uniteCodeCollect,
              selected: that.selectRow.uniteName,
              pageIconColor: '#aec0e6',
              pageIconInactiveColor: '#7b8fb9',
              pageIconSize: [10, 20],
              inactiveColor: '#7b8fb9',
              pageTextStyle: {
                color: '#aec0e6'
              },
              textStyle: {
                color: '#aec0e6'
              }
            },
            {
              type: 'scroll',
              orient: 'vertical',
              align: 'right',
              right: 80,
              top: 'middle',
              bottom: 20,
              width: 500,
              height: 160,
              data: that.selectRow.salePartCollect,
              selected: that.selectRow.salePartName,
              pageIconColor: '#aec0e6',
              pageIconInactiveColor: '#7b8fb9',
              pageIconSize: [10, 20],
              pageTextStyle: {
                color: '#aec0e6'
              },
              inactiveColor: '#7b8fb9',
              textStyle: {
                color: '#aec0e6'
              }
            }
          ],
        series: [
          {
            name: '一码通持股占比',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            data: that.selectRow.uniteCodeCollect,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            }
          },
          {
            name: '营业部持股占比',
            type: 'pie',
            radius: '55%',
            center: ['60%', '50%'],
            data: that.selectRow.salePartCollect,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            }
          }

        ]

      }, true)
    },
    //  进一步分析选中账户
    futherAnalysisAccount() {
      let params = {
        taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
        topAcct: this.selectData
      };
      params = JSON.stringify(params);
      console.log(params);
      if (this.selectData.length !== 0) {
      addAccountListOfHundred(params).then(resp => {
        if (resp) {
          this.$message.success('提交成功')
        }
      })
      } else {
        this.$message.warning('请选择账户')
      }
    },
    //  持股统计占比
    getPieCharts() {
      if ($.isEmptyObject(this.selectDataMoment)) {
        this.chartShow = false;
        this.$message.warning('请选择账户')
      } else {
        this.totalPersent = 0
        let that = this
        this.selectDataMoment.forEach(function (item) {
          that.totalPersent += (item.h_ratio - 0)
        })
        this.totalPersent = this.gfnFormatDecimal(this.totalPersent, 2)
        this.chartShow = true;
        this.queryResLoadChart = true
        getStatisticsOfHundred(that.params).then((resp) => {
          this.salePartPersent = resp.bdRatio
          this.ymtPersent = resp.ymtRatio
          that.selectRow = {
            uniteCodeCollect: [],
            salePartCollect: [],
            uniteName: [],
            salePartName: []
          };
          let unitCodeList = resp.ymtList;
          let salePartList = resp.bdList;
          for (let i = 0; i < unitCodeList.length; i++) {
            that.selectRow.uniteCodeCollect.push({
              name: unitCodeList[i].ymt_acct_id,
              value: unitCodeList[i].hold_volume_total
            });
            that.selectRow.uniteName.push(unitCodeList[i].ymt_acct_id);
          }

          for (let i = 0; i < salePartList.length; i++) {
            that.selectRow.salePartCollect.push({
              name: salePartList[i].branch_name,
              value: salePartList[i].hold_volume_total
            });
            that.selectRow.salePartName.push(salePartList[i].branch_name);
          }

          this.draw();
          this.queryResLoadChart = false
        });
      }
    },
    getResultData() {
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId;
      let pageIdx = this.currentPage, pageRw = this.pageSize

      if (this.flag) {
        this.flag = false
        this.queryResLoad = true
        this.getResponse(taskId, pageIdx, pageRw)
      }
    },
    getResponse(taskId, pageIdx, pageRw) {
      let that = this, selectList = []
      getListOfTopHundred(taskId, pageIdx, pageRw).then((resp) => {
        if (!$.isEmptyObject(resp)) {
          this.tableData = resp.holdTopAccountList;
          this.resultNum = (resp.rowsCount - 0)

          if (!$.isEmptyObject(this.selectDataMoment)) {
            this.tableData.forEach(function (item, index) {
              for (let i = 0; i < that.selectDataMoment.length; i++) {
                if (item.id == that.selectDataMoment[i].id) {
                  selectList.push(item)
                }
              }
            })
            that.toggleSelection(selectList)
          } else {
            this.toggleSelection()
          }
          this.$nextTick(function () {
            this.toggleSelection(selectList);
          })
        } else {
          this.flag = true
        }
        this.queryResLoad = false
      })
    },
    handleSizeChange(size) {
      this.queryResLoad = true
      this.currentPage = 1
      this.pageSize = size
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      let pageIdx = this.currentPage, pageRw = this.pageSize
      this.getResponse(taskId, pageIdx, pageRw)
    },
    handleCurrentChange(rowNum) {
      this.queryResLoad = true
      this.currentPage = rowNum;
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      let pageIdx = this.currentPage, pageRw = this.pageSize
      this.getResponse(taskId, pageIdx, pageRw)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
