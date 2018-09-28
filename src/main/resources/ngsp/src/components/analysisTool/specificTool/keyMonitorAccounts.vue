<!--重点监控账户-->
<template>
  <div class="keyMonitorAccounts">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="handleClear">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleQuery">查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" label-width="150px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="查询时间">
              <s-date-picker
                class="customize-width"
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="账户组名称">
              <el-input v-model="selectParams.accountName" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="账户组代码">
              <el-input v-model="selectParams.accountCode" size="small" class="customize-width"></el-input>
            </el-form-item>
          </el-col>

         <!-- <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="时间调整">
              &lt;!&ndash;<el-select
                collapse-tags :clearable="true"
                v-model="selectParams.supervisionType"
                placeholder="全部" size="small" class="customize-width"
              >
                <el-option
                  v-for="(item, index) in supervisionTypeOptions"
                  :key="String(index)"
                  :label="item"
                  :value="String(index)"
                ></el-option>
              </el-select>&ndash;&gt;
            </el-form-item>
          </el-col>-->
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="监控原因">
              <el-select v-model="selectParams.monitorReason" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="(item, index) in monitorReasonOptions"
                  :key="String(index)"
                  :label="item"
                  :value="String(index)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="监控级别">
              <el-select v-model="selectParams.monitorLeavel" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="(item, index) in monitorLeavelOptions"
                  :key="String(index)"
                  :label="item"
                  :value="String(index)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="创建者">
              <selector-dealer
                class="customize-width" ref="selectorDealers"
                @node-click="updateCreatePerson"
                :selectPerson="selectParams.createPerson"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="24" :md="24" :sm="24">
            <el-form-item label="转出线索">
              <el-select v-model="selectParams.clueMark" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="(item, index) in clueMarkOptions"
                  :key="String(index)"
                  :label="item"
                  :value="String(index)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>查询结果</span>
        <el-button size="small" type="primary" @click="handleExport()">导出</el-button>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        @handlerChange="handleSlotComponentEvent"
        :columns="columns2"
        :data="tableData">
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="80px"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :width="300"
          slot="tableColumnsPush"
          prop="operateContent"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="getInfoIdByMonitorId(scope)">查看</el-button>
            <el-button type="primary" size="small" @click="getInfoIdByMonitorId(scope)" v-if="scope.row.status === '办结'">变更</el-button>
          </template>
        </el-table-column>
      </margin-table>
    </el-card>
    <div>
      <charts-card ref="chartsCardRef" :propsParams="selectParams"></charts-card>
    </div>
  </div>
</template>
<script>
  import {columns2, monitorReasonOptions, monitorLeavelOptions, clueMarkOptions } from './component/constants'
  import {activityNameMapRouteName} from '@/components/superviseTask/constants'
  import {searchKeyMonitorAccounts} from '@/service/analysisTool/specificTool'
  import Mixin from './component/Mixin'
  export default {
    components: {
    },
    mixins: [Mixin],
    data() {
      return {
        activityNameMapRouteName,
        columns2,
        monitorReasonOptions,
        monitorLeavelOptions,
        clueMarkOptions,
        breadcrumbItems: [{
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '特定工具分析'
        }, {
          router: '',
          label: '重点监控账户组'
        }],
        commonData: {
          stockCode: [],
          disabled: false
        },
        selectParams: {
          accountName: '',
          accountCode: '',
          monitorReason: '',
          monitorLeavel: '',
          createPerson: '',
          clueMark: '',
          selectDateRange: []
        }
      }
    },
    methods: {
      updateCreatePerson(code, name) {
        this.selectParams.createPerson = name
      },
      handleClear() {
        this.selectParams = {
          accountName: '',
          accountCode: '',
          monitorReason: '',
          monitorLeavel: '',
          createPerson: '',
          clueMark: '',
          selectDateRange: []
        }
      },
      handleQuery() {
        this.tableData.pageIndex = 1
        this.getTableData()
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      getTableData() {
        let params = {
          pageIndex: this.tableData.pageIndex,
          pageRows: this.tableData.pageRows,
          accountName: this.selectParams.accountName,
          accountCode: this.selectParams.accountCode,
          monitorReason: this.selectParams.monitorReason,
          monitorLeavel: this.selectParams.monitorLeavel,
          createPerson: this.selectParams.createPerson,
          clueMark: this.selectParams.clueMark,
          startDate: this.selectParams.selectDateRange[0] ? this.selectParams.selectDateRange[0].replace(/-/g, '') : '',
          endDate: this.selectParams.selectDateRange[1] ? this.selectParams.selectDateRange[1].replace(/-/g, '') : ''
        }
        searchKeyMonitorAccounts(params).then(resp => {
          let {buzidata, totalNum} = resp
          buzidata.forEach(v => {
            v.status = this.localStatusNameList[v.status]
            v['clue_id'] = v['clue_id'] === '0' ? '' : v['clue_id']
          })
          this.tableData.data = buzidata
          this.tableData.total = totalNum
        })
        this.updateCharts()
      },
      updateCharts() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs['chartsCardRef'] && this.$refs['chartsCardRef'].getChartData()
          }, 1000)
        })
      }
    },
    mounted() {
      this.getProcessStatusNameList(activityNameMapRouteName['newBuiltAccountGroup'], this.getTableData)
    }
  }
</script>
<style lang="less" scoped>
  .keyMonitorAccounts {
    .customize-width {
      width: 350px;
    }
  }
</style>