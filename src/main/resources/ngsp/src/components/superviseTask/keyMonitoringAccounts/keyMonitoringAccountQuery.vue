<!--重点监控账户查询-->
<template>
  <div class="keyMonitoringAccountQuery">
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
      <el-form :model="selectParams" ref="selectParams" label-width="120px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="查询时间">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="证券代码">
              <stock-code-query class="customize-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="账户代码">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="一码通账户">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="标题">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="会员名称">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="营业部名称">
              <el-input class="customize-width" v-model="selectParams.keyword" placeholder="" size="small" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="监管类型">
              <el-select
                collapse-tags :clearable="true"
                v-model="selectParams.supervisionType"
                placeholder="全部" size="small" class="customize-width"
                @change="handleSupervisionTypeChange"
              >
                <el-option
                  v-for="(item, index) in supervisionTypeOptions"
                  :key="String(index)"
                  :label="item"
                  :value="String(index)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="监管措施">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.superviseScheme" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="(item, index) in currentSuperviseSchemeOptions"
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
        <span>重点监控对象列表</span>
        <el-button size="small" type="primary" @click="handleExport">导出</el-button>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns"
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
        </el-table-column>
      </margin-table>
    </el-card>
  </div>
</template>
<script>
  import Mixin from './component/Mixin'
  import {columns, supervisionTypeOptions, superviseSchemeOptions} from './component/constants'
  export default {
    components: {
    },
    mixins: [Mixin],
    data() {
      return {
        columns,
        supervisionTypeOptions,
        superviseSchemeOptions,
        breadcrumbItems: [{
          router: '',
          label: '重点监控对象'
        }, {
          router: '',
          label: '重点监控对象列表查询'
        }],
        currentSuperviseSchemeOptions: superviseSchemeOptions[0],
        commonData: {
          stockCode: [],
          disabled: false
        },
        selectParams: {
          selectDateRange: [],
          supervisionType: '0',
          superviseScheme: '0',
          localStatus: [],
          applicanter: '',
          sendLetterNumber: '',
          keyword: ''
        }
      }
    },
    methods: {
      handleSupervisionTypeChange(val) {
        this.currentSuperviseSchemeOptions = superviseSchemeOptions[val]
      },
      handleClear() {

      },
      handleQuery() {
        this.tableData.pageIndex = 1
        this.getTableData()
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      getAllData() {
        let params = {}
        // todo get table data
      }
    }
  }
</script>
<style lang="less" scoped>
  .keyMonitoringAccountQuery {
    .customize-width {
      width: 350px;
    }
  }
</style>