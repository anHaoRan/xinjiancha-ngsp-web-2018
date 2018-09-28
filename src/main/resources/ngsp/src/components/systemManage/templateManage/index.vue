<template>
  <div>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='el-card-table'>
      <div slot='header'>
        <span>查询条件</span>
        <el-button
          @click='handleClearFilterForm'
          type='text'
          size='small'
          style='float:right;'>清空
        </el-button>
        <el-button
          @click='handleSearchTemplates'
          type='primary'
          size='small'
          style='float:right; '
        >查询
        </el-button>
      </div>
      <div style='margin: 10px 0;'>
        <el-form :inline='true' :model='filterParams' style='padding-left: 20px'>
          <el-row :gutter='20'>
            <el-col :xl='8' :md='12' :sm='24'>
              <el-form-item label='模板类型'>
                <el-select v-model='filterParams.type' placeholder='请选择模板类型' size='small'>
                  <el-option v-for='(item, index) in templateTypes'
                             :key='index'
                             :label='item.name'
                             :value='item.value'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl='8' :md='12' :sm='24'>
              <el-form-item label='关键词'>
                <el-input v-model='filterParams.fuzzyStr' size='small'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        <span>模板</span>
        <el-button
          @click='handleAddTemplate'
          type='primary'
          size='small'
          style='float:right; '
        >新增
        </el-button>
      </div>
      <el-table
        :data='templateData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        height='650'
        style='width: 100%;'>
        <el-table-column
          v-for='column in templateColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :sortable='column.sortable'
          :sort-method='column.sortMethod'
          :formatter='column.formatter'
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          label='操作'
          min-width='110'>
          <template slot-scope='scope'>
            <el-button type='text' size='small' @click='handleDownload(scope.row)'>下载</el-button>
            <el-button type='text' size='small' @click='handleRowEdit(scope.row)'>编辑</el-button>
            <el-button type='text' size='small' @click='handleRowDelete(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync='editFormVisible' width='600px'>
      <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>
        <el-form-item label='模板类型' prop='type'>
          <el-select v-model='editForm.type' placeholder='请选择模板类型' size='small'>
            <el-option v-for='(item, index) in templateTypes'
                       :key='index'
                       :label='item.name'
                       :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='模板代码' prop='code'>
          <el-input v-model='editForm.code' size='small' style='width: 300px'></el-input>
        </el-form-item>
        <el-form-item label='模板描述' prop='description'>
          <el-input v-model='editForm.description' size='small' style='width: 300px'></el-input>
        </el-form-item>
        <el-form-item label='所属功能' prop='belongModule'>
          <el-input v-model='editForm.belongModule' size='small' style='width: 300px'></el-input>
        </el-form-item>
        <el-form-item label='备注' prop='remark1'>
          <el-input v-model='editForm.remark1' size='small' style='width: 300px'></el-input>
        </el-form-item>
        <el-form-item label='模板文件'>
          <el-upload style='width: 300px'
                     :action='uploadActionUrl'
                     name='uploadFile'
                     :on-success='handleFileUploadSuccess'
                     :on-remove='handleFileRemove'
                     :limit='1'
                     :file-list='editForm.fileList'>
            <el-button type='primary' size='small'>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot='title' class='dialog-title'>
        {{editTitle}}
      </div>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='handleEditCancel()'>取 消</el-button>
        <el-button type='primary' @click="handleEditCofirm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment/moment'
  import Breadcrumb from '../../common/Breadcrumb'
  import {
    getTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate
  } from './../../../service/systemManage/templateManage'

  export default {
    components: {
      Breadcrumb
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '系统管理'
        }, {
          router: '',
          label: '模板管理'
        }, {
          router: '/templateManage',
          label: '模板管理'
        }],
        filterParams: {
          type: '',
          fuzzyStr: ''
        },
        editFormVisible: false,
        editTitle: '更新模板', // '新增模板'
        uploadActionUrl: this.gfnGetUploadTemplateFileUrl(),
        editForm: {
          type: '',
          code: '',
          description: '',
          belongModule: '',
          remark1: '',
          fileId: '',
          fileName: '',
          fileList: []
        },
        editFormRules: {
          type: [
            {required: true, message: '请选择模板类型', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入模板代码', trigger: 'blur'}
          ],
          belongModule: [
            {required: true, message: '请输入所属功能模块', trigger: 'blur'}
          ]
        },
        templateTypes: [
          {name: '报告', value: 'report'},
          {name: '参数', value: 'params'},
          {name: '函件', value: 'letter'},
          {name: '全部', value: ''}
        ],
        templateColumns: [
          {
            label: '模板类型',
            field: 'type',
            align: 'center',
            sortable: true,
            minWidth: '50',
            formatter: this.formatterTemplateType
          },
          {label: '模板代码', field: 'code', align: 'left', sortable: true, minWidth: '100'},
          {label: '模板描述', field: 'description', align: 'left', sortable: true, minWidth: '100'},
          {label: '所属模块', field: 'belongModule', align: 'left', sortable: true, minWidth: '80'},
          {label: '文件名', field: 'fileName', align: 'left', sortable: true, minWidth: '100'},
          {label: '备注', field: 'remark1', align: 'left', sortable: true, minWidth: '80'},
          {
            label: '更新时间',
            field: 'updateTime',
            align: 'center',
            sortable: true,
            minWidth: '70',
            formatter: this.formatterDateTime
          },
          {label: '更新人', field: 'updateUser', align: 'center', sortable: true, minWidth: '50'}
        ],
        templateData: []
      }
    },
    methods: {
      formatterTemplateType (row, column, cellValue) {
        if (cellValue === 'report') {
          return '报告'
        } else if (cellValue === 'params') {
          return '参数'
        } else if (cellValue === 'letter') {
          return '函件'
        }
        return '其他[' + cellValue + ']'
      },
      formatterDateTime (row, column, cellValue) {
        return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
      },
      clearEditForm () {
        this.editForm = {
          type: '',
          code: '',
          description: '',
          belongModule: '',
          remark1: '',
          fileId: '',
          fileName: '',
          fileList: []
        }
      },
      handleClearFilterForm () {
        this.filterParams.type = ''
        this.filterParams.fuzzyStr = ''
      },
      handleSearchTemplates () {
        getTemplates({
          type: this.filterParams.type,
          fuzzyStr: this.filterParams.fuzzyStr
        }).then(resp => {
          this.templateData = resp
        })
      },
      handleRowDelete (row) {
        let _this = this
        this.$confirm('确认删除？').then(() => {
          deleteTemplate({id: row.id}).then(resp => {
            _this.handleSearchTemplates()
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {})
      },
      handleDownload (row) {
        this.gfnDownloadFile(row.fileId, row.fileName)
      },
      handleRowEdit (row) {
        this.editTitle = '更新模板'
        this.editFormVisible = true

        this.editForm = row
        this.editForm.fileList = [{
          fileId: row.fileId,
          name: row.fileName,
          url: this.gfnGetDownloadFileUrl(row.fileId, row.fileName)
        }]
      },
      handleAddTemplate () {
        this.editTitle = '新增模板'
        this.clearEditForm()
        this.editFormVisible = true
      },
      handleFileRemove (file, fileList) {
        console.log('removeFile', file)
      },
      handleEditCancel () {
        this.clearEditForm()
        this.editFormVisible = false
      },
      handleFileUploadSuccess (response, file, fileList) {
        this.editForm.fileId = response.value
        this.editForm.fileName = file.name
      },
      handleEditCofirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.editTitle === '新增模板') {
              addTemplate(JSON.stringify(this.editForm)).then(resp => {
                this.editFormVisible = false
                this.handleSearchTemplates()
              })
            } else if (this.editTitle === '更新模板') {
              updateTemplate(JSON.stringify(this.editForm)).then(resp => {
                this.editFormVisible = false
                this.handleSearchTemplates()
              })
            }
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.handleSearchTemplates()
    }
  }
</script>

<style scoped lang='less'>

</style>
