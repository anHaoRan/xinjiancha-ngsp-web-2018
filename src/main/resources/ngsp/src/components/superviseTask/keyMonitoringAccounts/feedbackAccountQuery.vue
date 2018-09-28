<!--中登反馈账户查询-->
<template>
  <div class="feedbackAccountQuery">
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
            <el-form-item label="开户日期">
              <s-date-picker
                :value="selectParams.selectDateRange"
                :isRange="true"
                :propsUpDisabledTime="defaultPropsDisabledTime"
                @change="handleSdatePickerDateRangeChange"
              ></s-date-picker>
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
            <el-form-item label="重点账户类型">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.localStatus" placeholder="全部" size="small" class="customize-width">
                <el-option
                  v-for="(item, index) in keyMonitoringAccountType"
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
        <span>中登反馈账户列表</span>
        <el-button size="small" type="primary" @click="handleExport">导出</el-button>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns1"
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
  import {columns1, keyMonitoringAccountType} from './component/constants'
  export default {
    components: {
    },
    mixins: [Mixin],
    data() {
      return {
        columns1,
        keyMonitoringAccountType,
        breadcrumbItems: [{
          router: '',
          label: '重点监控对象'
        }, {
          router: '',
          label: '中登反馈账户列表查询'
        }],
        selectParams: {
          selectDateRange: [],
          iscreattype: '',
          localStatus: [],
          applicanter: '',
          sendLetterNumber: '',
          keyword: ''
        }
      }
    },
    methods: {
      handleClear() {

      },
      handleQuery() {
        this.tableData.pageIndex = 1
        this.getTableData()
      },
      getAllData() {
        let params = {}
        // todo get table data
      }
    }
  }
</script>
<style lang="less" scoped>
  .feedbackAccountQuery {
    .customize-width {
      width: 350px;
    }
  }
</style>