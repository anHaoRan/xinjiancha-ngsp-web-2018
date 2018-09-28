<template>
  <div class='reportQuery'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <div>
      <el-card>
        <el-form :inline='true' :model='selectParams' ref='selectParams'>
          <el-form-item label='报告名称'>
            <el-input v-model='selectParams.name' size='small'></el-input>
          </el-form-item>
          <el-form-item label='开始日期'>
            <el-date-picker
              v-model='selectParams.startDate'
              type='date'
              size='small'
              value-format='yyyy-MM-dd'
              placeholder='开始日期'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束日期'>
            <el-date-picker
              v-model='selectParams.endDate'
              type='date'
              size='small'
              value-format='yyyy-MM-dd'
              placeholder='结束日期'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='生成状态'>
            <el-select v-model='selectParams.statusValue' placeholder='请选择' size='small'>
              <el-option
                v-for='item in statusOptions'
                :key='item.value'
                :label='item.label'
                :value='item.value'
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' size='small' @click='query'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card class='el-card-table'>
      <el-tabs v-model='activeName' type='card'>
        <el-tab-pane label='自动报告' name='first'>
          <s-table :columns="selfReportColumns" :data="selfReportData" :isHeader="false"
                   @getPageination="selfSelectedRow">
            <el-table-column
              width="50px"
              slot="tableColumnsUnshift"
              align="center">
              <template slot-scope="scope">
                <el-radio v-model="radio" @change="selectCode(scope.row)" :label="scope.row.index"></el-radio>
              </template>
            </el-table-column>
          </s-table>
        </el-tab-pane>
        <el-tab-pane label='手动报告' name='second'>
          <s-table :columns="handReportColumns" :data="handReportData" :isHeader="false"
                   @getPageination="handSelectedRow">
            <el-table-column
              width="50px"
              slot="tableColumnsUnshift"
              align="center">
              <template slot-scope="scope">
                <el-radio v-model="radio" @change="handSelectCode(scope.row)" :label="scope.row.index"></el-radio>
              </template>
            </el-table-column>
          </s-table>
        </el-tab-pane>
      </el-tabs>
      <div style='float: right;padding: 0px 10px 10px 0px'>
        <el-button type='primary' size='small' @click="creatReport" v-show="activeName == 'first'?false:true">报告生成
        </el-button>
        <el-button type='primary' size='small' @click="download">报告下载</el-button>
        <el-button type='primary' size='small'>邮件发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import {postReportListQuery, getHandleReport} from '../../service/analysisTool/reportQuery/index'
  import moment from 'moment'

  export default {
    components: {
      Breadcrumb,
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          },
          {
            router: '',
            label: '报告生成工具'
          },
          {
            router: '',
            label: '报告查询'
          }
        ],
        selectParams: {
          name: '',
          startDate: '',
          endDate: '',
          statusValue: ''
        },
        check: true,
        radio: '',
        statusOptions: [
          {value: 'All', label: '全部'},
          {value: '1', label: '待生成'},
          {value: '2', label: '处理中'},
          {value: '3', label: '成功'},
          {value: '4', label: '失败'}
        ],
        activeName: 'first',
        selfReportData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        selfReportColumns: [
          {label: '报告名称', field: 'name', align: 'center', minWidth: '6%'},
          {label: '生成状态', field: 'status', align: 'center', minWidth: '6%'},
          {label: '开始时间', field: 'startTime', align: 'center', minWidth: '6%'},
          {label: '结束时间', field: 'endTime', align: 'center', minWidth: '6%'},
          {label: '文件名称', field: 'fileName', align: 'center', minWidth: '6%'}
        ],
        handReportData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        handReportColumns: [
          {label: '报告名称', field: 'name', align: 'center', minWidth: '6%'},
          {label: '生成状态', field: 'status', align: 'center', minWidth: '6%'},
          {label: '开始时间', field: 'startTime', align: 'center', minWidth: '6%'},
          {label: '结束时间', field: 'endTime', align: 'center', minWidth: '6%'},
          {label: '文件名称', field: 'fileName', align: 'center', minWidth: '6%'}
        ],
        handCurrentPage: 1,
        handPageTotal: 0,
        reportCode: '',
        reportId: '',
        fileId: '',
        fileName: ''
      }
    },
    mounted() {
      this.query()
    },
    methods: {
      query() {
        this.query1()
        this.query2()
      },
      selectCode(row) {
        this.fileId = row.fileId
        this.fileName = row.fileName
      },
      handSelectCode(row) {
        this.reportCode = row.code
        this.fileId = row.fileId
        if (row.id) {
          this.reportId = row.id
        } else {
          this.reportId = ''
        }
        this.fileName = row.fileName
      },
      // 下载
      download() {
        if (!this.fileId || !this.fileName) {
          this.$message.warning('文件未生成！')
        } else {
          this.gfnDownloadFile(this.fileId, this.fileName);
          this.fileId = ''
          this.fileName = ''
        }
        this.radio = ''
      },
      // 生成报告
      creatReport() {
        if (!this.reportCode) {
          this.$message.warning('请先选择要生成的报告')
        } else {
          getHandleReport(this.reportCode, this.reportId).then(resp => {
            if (resp.success) {
              this.query2()
              this.$message.warning('执行成功！')
              this.radio = ''
            } else {
              this.$message.warning('执行失败！')
            }
            this.reportCode = ''
            this.reportId = ''
          })
        }
      },
      query1() {
        let params = {
          auto: '1',
          name: this.selectParams.name,
          startDate: this.selectParams.startDate,
          endDate: this.selectParams.endDate,
          pageIndex: this.selfReportData.pageIndex,
          pageSize: this.selfReportData.pageRows
        }
        postReportListQuery(params).then(resp => {
          console.log(resp);
          resp.data.forEach((el, index) => {
            el.startTime = moment(el.startTime).format('YYYY-MM-DD HH:mm:ss')
            el.endTime = moment(el.endTime).format('YYYY-MM-DD HH:mm:ss')
            el.index = Math.random() * 100000
          })
          this.selfReportData.data = resp.data
          this.selfReportData.total = resp.total
        })
      },
      query2() {
        let params = {
          auto: '0',
          name: this.selectParams.name,
          startDate: this.selectParams.startDate,
          endDate: this.selectParams.endDate,
          pageIndex: this.handReportData.pageIndex,
          pageSize: this.handReportData.pageRows
        }
        postReportListQuery(params).then(resp => {
          console.log(resp);
          resp.data.forEach((el, index) => {
            el.startTime = moment(el.startTime).format('YYYY-MM-DD HH:mm:ss')
            el.endTime = moment(el.endTime).format('YYYY-MM-DD HH:mm:ss')
            el.index = Math.random() * 100000
          })
          this.handReportData.data = resp.data
          this.handReportData.total = resp.total
        })
      },
      // 自动报告
      selfSelectedRow(row) {
        this.selfReportData.pageIndex = row.currentPage
        this.selfReportData.pageRows = row.pageSizeNumber
        this.radio = ''
        this.query1()
      },
      selfAccountSizeChange(val) {
      },
      selfAccountCurrentChange(val) {
      },
      // 手动报告
      handSelectedRow(row) {
        this.handReportData.pageIndex = row.currentPage
        this.handReportData.pageRows = row.pageSizeNumber
        this.radio = ''
        this.query2()
      }
    }
  }
</script>

<style lang='less'>
  .reportQuery {
    .el-card {
      .el-card__body {
        padding: 10px 0px;
      }
    }
    .el-radio__label {
      display: none;
    }
    .el-form {
      padding-left: 20px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .el-tabs--card > .el-tabs__header {
      .el-tabs__nav-wrap {
        padding: 0px 0px 10px 0px;
      }
    }
  }
</style>
