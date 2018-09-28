<template>
  <div class='reportManage'>
    <s-table :columns="reportColumns" :data="reportData" :isHeader="false" :isPageination="false"
             @select="handleSelectedRow">
      <el-table-column
        :check='check'
        slot="tableColumnsUnshift"
        header-align='center'
        align='center'
        type='selection'
        min-width='5%'>
      </el-table-column>
      <div slot="tableFooter" style='text-align: right;padding: 10px'>
        <el-button type='primary' size='small' @click='reportDisposed'>配置</el-button>
      </div>
    </s-table>
    <el-dialog title='报告配置' :visible.sync='dialogFormVisible'>
      <el-form :inline='true' :model='dialogParams' ref='dialogParams' class='dialogForm' label-width='100px'
               label-position='left'>
        <el-row :gutter='20'>
          <el-col :span='24'>
            <el-form-item label='报告名称'>
              <el-input v-model='dialogParams.reportName' size='small' :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='名称格式'>
              <el-input v-model='dialogParams.nameFormat' size='small' :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='报告格式'>
              <el-select v-model='dialogParams.reportFormat' placeholder='请选择' size='small' :disabled="true">
                <el-option
                  v-for='item in reportFormatOptions'
                  :key='item.value'
                  :label='item.label'
                  :value='item.value'
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='生成方式'>
              <el-radio v-model='dialogParams.createWay' label='0'>手动</el-radio>
              <el-radio v-model='dialogParams.createWay' label='1'>自动</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='报告生成时间'>
              <el-time-picker v-model='dialogParams.creatTime' value-foramt='HH:mm' foramt='HH:mm'
                              size='small' :disabled="dialogParams.createWay == '0'?true:false"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <div style='text-align: center'>
              <el-button type='primary' size='small' @click="save">保存</el-button>
              <el-button type='info' size='small' @click="cancel">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
  import {postReportDispose, getReportDisposeList} from '../../../service/analysisTool/reportQuery/index'
  import moment from 'moment'

  export default {
    components: {
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        check: true, // 表格选中
        reportData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        reportColumns: [
          {label: '报告名称', field: 'name', align: 'center', minWidth: '6%'},
          {label: '名称格式', field: 'fileName', align: 'center', minWidth: '6%'},
          {label: '报告格式', field: 'fileType', align: 'center', minWidth: '6%'},
          {label: '生成方式', field: 'auto', align: 'center', minWidth: '6%'},
          {label: '最后修改时间', field: 'updateTime', align: 'center', minWidth: '6%'}
        ],
        dialogFormVisible: false,
        dialogParams: {
          reportName: '',
          nameFormat: '',
          reportFormat: '',
          createWay: '',
          creatTime: ''
        },
        reportFormatOptions: [
          {value: '1', label: 'excel'},
          {value: '2', label: 'doc'}
        ],
        rowParams: [],
        disposeCode: '',
        templateCode: ''
      }
    },
    mounted() {
      this.getAllData()
    },
    methods: {
      getAllData() {
        getReportDisposeList().then(resp => {
          this.reportData.data = resp
        })
      },
      handleSelectedRow(row) {
        this.rowParams = row
      },
      reportDisposed() {
        if (!this.rowParams.length) {
          this.$message.warning('请先选择要配置的报告')
        } else {
          this.disposeCode = this.rowParams[0].code
          this.templateCode = this.rowParams[0].templateCode
          this.dialogParams.reportName = this.rowParams[0].name
          this.dialogParams.nameFormat = this.rowParams[0].fileName
          this.dialogParams.reportFormat = this.rowParams[0].fileType
          if (this.rowParams[0].auto == '自动') {
            this.dialogParams.createWay = '1'
            this.dialogParams.creatTime = new Date(moment(this.rowParams[0].timings, 'HH:mm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (this.rowParams[0].auto == '手动') {
            this.dialogParams.createWay = '0'
            this.dialogParams.creatTime = new Date(this.rowParams[0].updateTime)
          } else {
            this.dialogParams.createWay = ''
            this.dialogParams.creatTime = ''
          }
          this.dialogFormVisible = true
        }
      },
      save() {
        let params = {
          code: this.disposeCode,
          name: this.dialogParams.reportName,
          fileName: this.dialogParams.nameFormat,
          fileType: this.dialogParams.reportFormat,
          templateCode: this.templateCode,
          auto: this.dialogParams.createWay,
          timings: moment(this.dialogParams.creatTime).format('HH:mm'),
          scheduleNames: ''
        }
        postReportDispose(JSON.stringify(params)).then(resp => {
          if (resp) {
            this.getAllData()
            this.disposeCode = ''
            this.templateCode = ''
            this.dialogParams.reportName = ''
            this.dialogParams.nameFormat = ''
            this.dialogParams.reportFormat = ''
            this.dialogParams.createWay = ''
            this.dialogParams.creatTime = ''
            this.dialogFormVisible = false
            this.rowParams = []
          }
        })
      },
      cancel() {
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style lang='less'>
  .reportManage {
    .dialogForm {
      .el-col {
        .el-form-item {
          width: 100%;
          .el-form-item__content {
            width: 80%;
          }
        }
      }
    }
  }
</style>
