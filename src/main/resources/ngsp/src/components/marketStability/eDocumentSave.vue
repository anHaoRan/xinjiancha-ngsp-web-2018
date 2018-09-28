<template>
  <div class="e-document-save">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class="el-card-table" style="overflow: visible">
        <el-form :inline="true" :model="selectParams" ref="selectParams">
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="模块名称：">
                <down-more-select v-model="selectParams.moduleName" ref="downMoreSelect"
                                  :optionData="orderTypeOption" style="width: 240px;"></down-more-select>
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
          max-height="500"
          size="mini">
          <el-table-column width="55" align="center">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index" @change="selectedRow(scope.row)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in tableColumns"
            :align="item.align"
            header-align="center"
            :key="item.field"
            :show-overflow-tooltip="true"
            :prop="item.field"
            :label="item.label"
            :min-width="item.minWidth">
          </el-table-column>
          <el-table-column
            min-width="5%"
            align="center"
            label="电子文件">
            <template slot-scope="scope">
              <el-button @click="downLoadDoc(scope.row)" type="text" size="small" style="border: none;color:#1b5eed
">下载
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            min-width="5%"
            align="center"
            label="通知单">
            <template slot-scope="scope">
              <el-button @click="downLoadNote(scope.row)" type="text" size="small" style="border: none;color:#1b5eed
">下载
              </el-button>
            </template>
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
      <div style="text-align: right;padding: 10px" v-show="!tableData.length?false:true">
        <el-button type="primary" size="small" @click="editRecord">编辑</el-button>
      </div>
      <el-dialog title="编辑记录" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="dialogParams" ref="dialogParams" class="dialogForm" label-width="120px"
                 label-position="left">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="模块名称">
                <el-input v-model="dialogParams.module_name" size="small" readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文件名称">
                <el-input v-model="dialogParams.file_name" size="small" readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行日期">
                <el-input v-model="dialogParams.oper_data" size="small" readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行时间">
                <el-input v-model="dialogParams.oper_time" size="small" readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行人">
                <el-input v-model="dialogParams.oper_user" size="small" readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="实际反馈时间">
                <el-date-picker
                  v-model="dialogParams.actual_feedback_time"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择时间日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl="24">
              <div style="text-align: center">
                <el-button type="primary" size="small" @click="submit">提交</el-button>
                <el-button type="info" size="small" @click="cancel">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
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
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '电子文档存储'
          },
          {
            router: '',
            label: '电子文档查询'
          }
        ],
        selectParams: {
          moduleName: '',
          startDate: '',
          endDate: ''
        },
        radio: '',
        orderTypeOption: [], // 传递给子组件的订单类型数据
        tableData: [],
        tableColumns: [
          {label: '模块名称', field: 'module_name', align: 'center', minWidth: '5%'},
          {label: '文件名称', field: 'file_name', align: 'center', minWidth: '5%'},
          {label: '执行日期', field: 'oper_data', align: 'center', minWidth: '5%'},
          {label: '执行时间', field: 'oper_time', align: 'center', minWidth: '5%'},
          {label: '执行人', field: 'oper_user', align: 'center', minWidth: '5%'},
          {label: '状态', field: 'oper_status', align: 'center', minWidth: '5%'},
          {label: '实际反馈时间', field: 'actual_feedback_time', align: 'center', minWidth: '6%'}
        ],
        dialogFormVisible: false,
        dialogParams: {
          module_name: '',
          file_name: '',
          oper_data: '',
          oper_time: '',
          oper_user: '',
          actual_feedback_time: ''
        },
        editRow: {},
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
    mounted () {
      this.getDocumentModulesData()
      this.query()
    },
    methods: {
      //  获取文档模块下拉选项
      getDocumentModulesData () {
        getDocumentModules().then(resp => {
          resp.forEach((el) => {
            this.orderTypeOption.push({value: el.s_key, label: el.s_value})
          })
        })
      },
      selectedRow (row) {
        this.editRow = row
      },
      downLoadDoc (row) {
        gfnDownloadDocument('FILE_OPER_INFO_F', row.reserved)
      },
      downLoadNote (row) {
        gfnDownloadDocument('FILE_OPER_INFO_T', row.reserved)
      },
      tableSizeChange (params) {
        this.pageSize = params
        this.query()
      },
      tableCurrentChange (params) {
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
      query () {
        let modelName = !this.selectParams.moduleName ? '' : this.selectParams.moduleName.join(',')
        let startDate = !this.selectParams.startDate ? '' : this.selectParams.startDate
        let endDate = !this.selectParams.endDate ? '' : this.selectParams.endDate
        getDocumentTable('', modelName, startDate, endDate, this.pageIndex, this.pageSize).then(resp => {
          let result = resp.data
          result.forEach((el) => {
            if (el.oper_status == '0') {
              el.oper_status = '成功'
            } else {
              el.oper_status = '失败'
            }
            el.oper_data = !el.oper_data ? '' : moment(el.oper_data, 'YYYYMMDD').format('YYYY-MM-DD')
            el.oper_time = !el.oper_time ? '' : moment(el.oper_time, 'HHmmss').format('HH:mm:ss')
            el.actual_feedback_time = !el.actual_feedback_time ? '' : moment(el.actual_feedback_time, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss')
          })
          this.tableData = result
          this.PageTotal = resp.total
        })
      },
      exportTable () {
        let params = {
          modelName: !this.selectParams.moduleName ? '' : this.selectParams.moduleName.join(','),
          startDate: !this.selectParams.startDate ? '' : this.selectParams.startDate,
          endDate: !this.selectParams.endDate ? '' : this.selectParams.endDate,
          fileName: '电子归档数据',
          type: '',
          tableColumns: [{
            sheetName: '电子归档数据',
            fileColumns: this.tableColumns
          }]
        }
        this.gfnExportFileWithForm('/fluct/word-show/v1/export', params)
      },
      editRecord () {
        this.dialogFormVisible = true
        for (let k in this.dialogParams) {
          this.dialogParams[k] = this.editRow[k]
        }
        this.dialogParams.oper_data = !this.dialogParams.oper_data ? '' : moment(this.dialogParams.oper_data, 'YYYYMMDD').format('YYYY-MM-DD')
        this.dialogParams.oper_time = !this.dialogParams.oper_time ? '' : moment(this.dialogParams.oper_time, 'HHmmss').format('HH:mm:ss')
      },
      submit () {
        let params = {
          reserved: this.editRow.reserved,
          backTime: moment(this.dialogParams.actual_feedback_time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD HHmmss')
        }
        postUpdateDocument(JSON.stringify(params)).then(resp => {
          if (resp.success) {
            this.query()
            this.radio = ''
          }
        })
        this.dialogFormVisible = false
      },
      cancel () {
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style lang="less">
  .e-document-save {
    .el-form {
      padding: 10px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .el-dialog {
      width: 35%;
      .el-form {
        text-align: center;
        .el-form-item {
          margin-bottom: 20px;
        }
      }
    }
    .el-radio {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
