<!-- 账面盈利计算 -->
<template>
  <div class="account-book-profit">
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <div>
      <el-card>
        <div slot='header'>
          <span>查询条件</span>
          <el-button size='small' type='info' @click='clearForm'>清空</el-button>
          <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
        </div>

        <el-form :inline='true' ref='accountBookProfit' :model='formData' :rules='rules' label-width='220px'>
          <el-col :xl="6" :lg="8" :md="6" :sm="6">
            <el-form-item label='分别计算一码通下其他账户：' prop='ymtFlg'>
              <el-radio-group v-model='formData.ymtFlg'>
                <el-radio :label='`1`'>是</el-radio>
                <el-radio :label='`0`'>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="5" :md="6" :sm="6">
            <file-upload
              :uploadOption="{name: '上传文件', size: 'small'}"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              :limitFileType="['xlsx','xls']"
              :uploadParams='uploadParams'
              :isShowSuccessMessage="true"
              @getTxtCon='getTxtCon'></file-upload>
          </el-col>
          <el-col :xl="2" :lg="2" :md="2" :sm="2">
            <el-form-item class="upload-file">
              <el-button size='small' type="primary" @click='getTemplateFile' style='border: none;'>
                模板下载
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-card>
    </div>
    <el-card>
      <export-btn @handleExportData="handleDownload" style="margin-top: 10px;"></export-btn>
      <el-col>
        <common-table-pagination-component
          :loading='loading'
          :tableData='tableData'
          :columns='columns'
          :pagination='pagination'
          :totalNum='totalNum'
          @handlePaginationChange='handlePaginationChange'
        ></common-table-pagination-component>
      </el-col>
    </el-card>
  </div>
</template>

<script>
  import { accountBookProfit, exportAccountBookProfit } from '@/service/analysisTool/complexQuery/index'
  import { columns } from './componentsTool/accountBookProfit/columns'
  import { selfValidateMethod } from './componentsTool/common/validate'

  export default {
    components: {
      Breadcrumb: () => import('../../common/Breadcrumb'),
      FileUpload: () => import('@/components/common/UploadFileToServer'),
      commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
      ExportBtn: () => import('./componentsTool/common/ExportButtonComponent')
    },
    data () {
      return {
        currentngspUid: '', // 用来记录上一次返回的ngspUid
        loading: false,
        totalNum: 0,
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        queryData: {},
        formData: { // 查询参数
          sheet0: '',
          sheet1: '',
          ymtFlg: ''
        },
        tableData: [],
        columns: columns,
        rules: {
          ymtFlg: [
            {required: true, message: '请选择是否计算一码通'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify(
            [
              {
                // delimiter: ',',
                verifies: ['ACCOUNT_CODE'],
                firstToSkip: 1, // 前置忽略项
                fields: ['acctId1', 'secCode', 'startDate1', 'endDate1']
              }, {
              // delimiter: ',',
              verifies: ['ACCOUNT_CODE'],
              firstToSkip: 1, // 前置忽略项
              fields: ['acctId2', 'startDate2', 'endDate2', 'commRate']
            }]
          )
        },
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '数据综合查询'
          }, {
            router: '/accountBookProfit',
            label: '账面盈利'
          }]
      }
    },
    methods: {
      getTxtCon (value) { // 文件上传
        this.formData.sheet0 = value.Sheet0
        this.formData.sheet1 = value.Sheet1
      },
      getTemplateFile () { // 下载模板文件
        this.gfnDownloadTemplateFile({code: 'accountBookProfit'})
      },
      clearForm () {
        this.formData.sheet0 = ''
        this.formData.sheet1 = ''
        this.formData.ymtFlg = ''
      },
      handleSearch () {
        this.$refs['accountBookProfit'].validate((valid) => {
          if (valid) {
            if(!this.formData.sheet0 || !this.formData.sheet1) {
              this.$message.error('请先上传文件')
              return
            }
            // if (this.formData.acctIds !== 'ALL') {
            //   // 批量校验证券代码格式
            //   if (!selfValidateMethod({accounts: this.formData.acctIds})) {
            //     return
            //   }
            // }
            this.queryData = JSON.parse(JSON.stringify(this.formData))
            this.pagination.currentPage = 1
            this.reqTableData(1)
          }
        })
      },
      reqTableData (type) {
        let params = {
          sheet0: type ? this.formData.sheet0 : this.queryData.sheet0,
          sheet1: type ? this.formData.sheet1 : this.queryData.sheet1,
          ymtFlg: type ? this.formData.ymtFlg : this.queryData.ymtFlg,
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          pageIndex: this.pagination.currentPage.toString(),
          pageRows: this.pagination.pageSizeNumber.toString(),
          isExport: '0', // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type.toString() // 判断是否是新查询,1是新查询，0是分页或导出
        }
        this.loading = true
        accountBookProfit(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            this.currentngspUid = resp.ngsp_uid
            this.tableData = resp.data
            this.totalNum = Number(resp.totalRowCount)
          } else {
            this.currentngspUid = ''
            this.tableData = []
          }
        })
      },
      handlePaginationChange (pagination) {
        this.pagination = pagination
        this.reqTableData(0)
      },
      handleDownload (type) { // 下载
        if (!this.currentngspUid) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          exportType: type,
          isExport: '1',
          isNewQuery: '0',
          ngspUid: this.currentngspUid,
          tableColumns: this.columns
        }
        exportAccountBookProfit(params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .account-book-profit {
    /deep/ .upload-file {
      /deep/ .el-form-item__content {
        width: 340px;
      }
    }
  }
</style>
