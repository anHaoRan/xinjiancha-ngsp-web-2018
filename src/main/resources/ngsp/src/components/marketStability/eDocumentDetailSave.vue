<template>
  <div class="e-document-detail-save">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class="el-card-table">
        <el-form :inline="true" :model="selectParams" ref="selectParams">
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="模块名称：">
                <down-more-select v-model="selectParams.moduleName" ref="downMoreSelect"
                                  :optionData="orderTypeOption"></down-more-select>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :md="12" :sm="24">
              <el-form-item label="开始日期：">
                <el-date-picker
                  v-model="selectParams.startDate"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  :picker-options='startpickerOption'
                  @blur="changeStartDate"
                  placeholder="开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :md="12" :sm="24">
              <el-form-item label="结束日期：">
                <el-date-picker
                  v-model="selectParams.endDate"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  :picker-options='endpickerOption'
                  @blur="changeEndDate"
                  placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :md="12" :sm="24">
              <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="info" size="small" @click="exportTable">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
          max-height="600"
          size="mini">
          <el-table-column
            v-for="item in tableColumns"
            :align="item.align"
            header-align="center"
            :key="item.field"
            :show-overflow-tooltip="true"
            :sortable=item.sortable
            :prop="item.field"
            :label="item.label"
            :min-width="item.minWidth">
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            @size-change="tableSizeChange"
            @current-change="tableCurrentChange"
            :current-page="CurrentPage"
            :page-sizes="[10,50,100,150,200]"
            :page-size="10"
            layout="total,sizes,prev,pager,next,jumper"
            :total="PageTotal"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import DownMoreSelect from '../common/downMoreSelect'
  import {
    getDocumentModules,
    getDocumentTable,
    postUpdateDocument,
    gfnDownloadDocument
  } from '../../service/marketStability/index'
  import moment from 'moment'

  export default {
    name: 'e-document-save',
    components: {
      Breadcrumb,
      DownMoreSelect
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '电子文档存储'
          },
          {
            router: '',
            label: '电子文档明细查询'
          }
        ],
        selectParams: {
          moduleName: '',
          startDate: '',
          endDate: ''
        },
        check: true,
        orderTypeOption: [], // 传递给子组件的订单类型数据
        tableData: [],
        tableColumns: [
          {
            label: '模块名称',
            field: 'module_name',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'module_name')
          },
          {
            label: '执行日期',
            field: 'oper_data',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'oper_data')
          },
          {
            label: '执行时间',
            field: 'oper_time',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'oper_time')
          },
          {
            label: '权限控制类型',
            field: 'control_type',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'control_type')
          },
          {
            label: '买卖方向权限',
            field: 'b_s_type',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_s_type')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '一码通代码',
            field: 'ymt_account_id',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ymt_account_id')
          },
          {
            label: '账户代码',
            field: 'account_id',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_id')
          },
          {
            label: '账户名称',
            field: 'account_name',
            align: 'center',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_name')
          },
          {
            label: 'PBU代码',
            field: 'pbu_id',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            label: 'PBU名称',
            field: 'pbu_name',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_name')
          },
          {
            label: '参与者代码',
            field: 'brnid',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            label: '开始限制日期',
            field: 'start_date',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'start_date')
          },
          {
            label: '结束限制日期',
            field: 'end_date',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'end_date')
          },
          {
            label: '录入人',
            field: 'add_user',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'add_user')
          },
          {
            label: '审核人',
            field: 'check_user',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'check_user')
          }
        ],
        pageIndex: 1,
        pageSize: 10,
        PageTotal: 0,
        CurrentPage: 1,
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.selectParams.endDate).getTime();
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.selectParams.startDate).getTime() - 3600 * 1000 * 24;
          }
        }
      }
    },
    mounted() {
      this.getDocumentModulesData()
      this.query()
    },
    methods: {
      //  获取文档模块下拉选项
      getDocumentModulesData() {
        getDocumentModules().then(resp => {
          resp.forEach((el) => {
            this.orderTypeOption.push({value: el.s_key, label: el.s_value})
          })
        })
      },
      tableSizeChange(params) {
        this.pageSize = params
        this.query()
      },
      tableCurrentChange(params) {
        this.pageIndex = params
        this.query()
      },
      changeStartDate(params) {
        if (params.userInput) {
          this.$message.warning('开始时间不能大于结束时间')
        }
      },
      changeEndDate(params) {
        if (params.userInput) {
          this.$message.warning('结束时间不能小于开始时间')
        }
      },
      query() {
        let modelName = !this.selectParams.moduleName ? '' : this.selectParams.moduleName.join(',')
        let startDate = !this.selectParams.startDate ? '' : this.selectParams.startDate
        let endDate = !this.selectParams.endDate ? '' : this.selectParams.endDate
        getDocumentTable('detail', modelName, startDate, endDate, this.pageIndex, this.pageSize).then(resp => {
          let result = resp.data
          result.forEach((el) => {
            el.oper_data = !el.oper_data ? '' : moment(el.oper_data, 'YYYYMMDD').format('YYYY-MM-DD')
            el.oper_time = !el.oper_time ? '' : moment(el.oper_time, 'HHmmss').format('HH:mm:ss')
            el.start_date = !el.start_date ? '' : moment(el.start_date, 'YYYYMMDD').format('YYYY-MM-DD')
            el.end_date = !el.end_date ? '' : moment(el.end_date, 'YYYYMMDD').format('YYYY-MM-DD')
          })
          this.tableData = result
          this.PageTotal = resp.total
        })
      },
      exportTable() {
        let params = {
          modelName: !this.selectParams.moduleName ? '' : this.selectParams.moduleName.join(','),
          startDate: !this.selectParams.startDate ? '' : this.selectParams.startDate,
          endDate: !this.selectParams.endDate ? '' : this.selectParams.endDate,
          fileName: '电子归档明细数据',
          type: 'detail',
          tableColumns: [{
            sheetName: '电子归档明细数据',
            fileColumns: this.tableColumns
          }]
        }
        this.gfnExportFileWithForm('/fluct/word-show/v1/export', params)
      }
    }
  }
</script>

<style lang="less">
  .e-document-detail-save {
    .el-form {
      padding: 10px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }

</style>
