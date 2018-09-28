<!--账户组设置-->
<template>
  <div class='accountGroup'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <el-button size='small' type='info' @click='handleClear'>清空</el-button>
        <el-button size='small' type='primary' @click='handleQuery'>搜索</el-button>
      </div>
      <el-row>
        <el-form ref='form' :model='searchForm' :inline='true'>
          <el-form-item prop='searchAccountName' label='账户组名称'>
            <el-input
              v-model='searchForm.searchAccountName'
              auto-complete='off'
              placeholder='请输入账户组名称'
              :maxLength='16'
              size='small'>
            </el-input>
          </el-form-item>
          <el-form-item prop='searchAccountName' label='账户组类型'>
            <el-select multiple collapse-tags
                       v-model='searchForm.searchAccountType'
                       placeholder='请选择账户组类型'
                       size='small'>
              <el-option
                v-for='item in accountTypeOptions'
                :key='item.type_id'
                :label='item.type_name'
                :value='item.type_id'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <create-and-edit-account-group-dialog
      ref='dialogRef'
      :accountTypeOptionsProps='accountTypeOptions'
      :ruleFormProps='ruleForm'
      :currentModeProps='currentMode'
      @getAllAccountGroupList='getAllAccountGroupList'
    ></create-and-edit-account-group-dialog>
    <batch-operation-dialog ref="batchOperationDialog" @updateData="handleQuery"></batch-operation-dialog>
    <el-dialog class="uploadDialog"
               :title="`上传附件`"
               :visible.sync="showUploadDialog" width="50%" left>
      <file-upload
        ref="fileUploadRef"
        :actionUrl="getUploadAcctgrpFileUrl()"
        :uploadParams="{acctgrpId: currentSelectedItem.accountGroupId}"
      ></file-upload>
    </el-dialog>
    <file-list-dialog ref="fileListDialog" :accountGroupId="currentSelectedItem.accountGroupId"></file-list-dialog>
    <s-table
      ref="accountRef"
      :headerTitle="`账户组设置`"
      :loading='loading'
      :data="{
        data: tableData,
        total: totalNum,
        pageIndex: pagination.currentPage,
        pageRows: pagination.pageSizeNumber
      }"
      :columns="columns"
      @getPageination="getPageination"
      @handlerChange="handleSlotComponentEvent">
      <el-button slot='elCardHeader' type='info' size='small' @click='goBack' v-if='$route.query && $route.query.from'>
        返回
      </el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleDownloadFile'>下载附件</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleUploadFile'>上传附件</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='batchOperation'>批量操作</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='updateAccountGroupState(1)'>再生效</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='updateAccountGroupState(0)'>终止</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleDelete'>删除</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleEdit'>修改</el-button>
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleCreate'>新增</el-button>
    </s-table>

    <!--<el-card class='el-card-table'>
      <div slot='header'>
        <span>账户组设置</span>
        <el-button type='info' size='small' @click='goBack' v-if='$route.query && $route.query.from'>返回</el-button>
        <el-button type='primary' size='small' @click='handleDelete'>删除</el-button>
        <el-button type='primary' size='small' @click='handleEdit'>修改</el-button>
        <el-button type='primary' size='small' @click='handleCreate'>新建</el-button>
      </div>
      <el-row>
        <el-col :span='24'>
          <el-table
            border
            ref='accountRerf'
            :data='tableData'
            show-overflow-tooltip
            v-loading='loading'
            element-loading-spinner='el-icon-loading'
            element-loading-text='数据加载中，请耐心等待...'
            element-loading-background='rgba(0,0,0,0.3)'
            style='width:100%;'>
            <el-table-column width='55' align='center'>
              <template slot-scope='scope'>
                <el-radio
                  class='radio'
                  v-model='checked'
                  :label='scope.row.group_id'
                  @change='handleCheckedChange'>
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop='group_name'
              label='账户组名称'
              sortable
              :sort-method='accountGroupNameSortMethod'
              align='center'>
              <template slot-scope='scope'>
                <a class='slotScope'
                   type='text'
                   @click='gotoDetailPage(scope.row.group_id)'>
                  {{scope.row.group_name}}
                </a>
              </template>
            </el-table-column>
            <el-table-column
              v-for='column in columns'
              :key='column.field'
              :align='column.align'
              :label='column.label'
              :prop='column.field'
              :sortable=column.sortable
              :sort-method='column.sortMethod'
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-row style='margin-bottom: 0;'>
            <pageination
              @getPageination='getPageination'
              :pageTotal='totalNum'></pageination>
          </el-row>
        </el-col>
      </el-row>
    </el-card>-->

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { tabletimeformat } from '@/utils/dateTimeFormat'
  import Breadcrumb from '@/components/common/Breadcrumb'
  import CreateAndEditAccountGroupDialog from './accountGroup/CreateAndEditAccountGroupDialog'
  import TableColumnRadioComponent from '../common/TableColumnRadioComponent'
  import TableColumnCanClickComponent from '../common/TableColumnCanClickComponent'
  import STable from '@/components/base/STable'
  import BatchOperationDialog from './accountGroup/BatchOperationDialog'
  import FileUpload from '@/components/common/UploadFileToServer'
  import FileListDialog from './accountGroup/FileListDialog'
  import {
    postSearchAccountTyepList, // 从账户组类型设置跳转到账户组设置 - 列表数据
    postUserGroupType, // 账户组设置 - 账户组类型下拉框
    postCreateAccountGroupDelete, // 删除
    updateAccountGroupState, // 终止，再生效
    getUploadAcctgrpFileUrl // 上传附件
  } from '@/service/systemManage/securityPlateSet'

  export default {
    components: {
      Breadcrumb,
      STable,
      CreateAndEditAccountGroupDialog,
      TableColumnRadioComponent,
      TableColumnCanClickComponent,
      BatchOperationDialog,
      FileUpload,
      FileListDialog
    },
    computed: {
      ...mapGetters(['getJumpToAccountGroupSettingCode'])
    },
    data () {
      return {
        getUploadAcctgrpFileUrl,
        loading: false,
        showUploadDialog: false,
        breadcrumbItems: [
          {
            router: '/accountGroup',
            label: '系统管理'
          }, {
            router: '/accountGroup',
            label: '设置'
          }, {
            router: '/accountGroup',
            label: '账户组设置'
          }
        ],
        searchForm: {
          searchAccountTypeName: [],
          searchAccountName: ''
        },
        accountTypeOptions: [],
        checked: '',
        currentSelectedItem: {},
        currentMode: 'create',
        ruleForm: {},
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        totalNum: 0,
        tableData: [],
        accountGroupNameSortMethod: this.gfnSortByChineseCharacters.bind(this, 'group_name'),
        columns: [
          {label: '', field: 'group_id', width: '45px', align: 'center', template: TableColumnRadioComponent},
          {
            label: '账户组名称',
            field: 'group_name',
            minWidth: '80px',
            align: 'center',
            template: TableColumnCanClickComponent
          },
          {label: '账户组类型', field: 'type_name', minWidth: '40px', align: 'center'},
          {
            label: '包含账户数目',
            field: 'groupnum',
            minWidth: '50px',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'groupnum')
          },
          {label: '是否自动维护', field: 'maintainence', minWidth: '50px', align: 'center'},
          {label: '证券代码', field: 'sec_code', minWidth: '100px', align: 'center'},
          {label: '账户组描述', field: 'group_desc', minWidth: '100px', align: 'center'},
          {label: '账户组创建时间', field: 'create_time', minWidth: '150px', align: 'center'},
          {label: '账户组修改时间', field: 'modify_time', minWidth: '150px', align: 'center'},
          {label: '账户组生效时间', field: 'inval_time', minWidth: '150px', align: 'center'},
          {label: '账户组终止时间', field: 'end_time', minWidth: '150px', align: 'center'},
          {label: '实际操作人', field: 'control_psn', minWidth: '80px', align: 'center'},
          {label: '基金类型', field: 'fund_type', minWidth: '80px', align: 'center'}
        ]
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      // 下载附件
      handleDownloadFile () {
        if (!this.currentSelectedItem.accountGroupId) {
          this.$message.error('请先选择一个账户组')
          return
        }
        this.$nextTick(() => {
          this.$refs['fileListDialog'].showDialog = true
          setTimeout(() => {
            this.$refs['fileListDialog'].getFileList()
          })
        })
      },
      // 上传附件
      handleUploadFile () {
        if (!this.currentSelectedItem.accountGroupId) {
          this.$message.error('请先选择一个账户组')
          return
        }
        if (this.currentSelectedItem.maintainence === '是') {
          this.$message.error('系统自动维护的账户组不能该操作')
          return
        }
        this.showUploadDialog = true
        this.$nextTick(() => {
          this.$refs['fileUploadRef'].$refs['upload'].clearFiles()
        })
      },
      // 批量操作
      batchOperation () {
        this.$nextTick(() => {
          this.$refs['batchOperationDialog'].showDialog = true
          setTimeout(() => {
            this.$refs['batchOperationDialog'].getAccountTypeOptionsByN()
            this.$refs['batchOperationDialog'].ruleForm.accountTypeId = ''
          })
        })
      },
      // 终止，再生效
      updateAccountGroupState (type) {
        if (!this.currentSelectedItem.accountGroupId) {
          this.$message.error('请先选择一个账户组')
          return
        }
        if (this.currentSelectedItem.maintainence === '是') {
          this.$message.error('系统自动维护的账户组不能该操作')
          return
        }
        let params = {
          group_id: this.currentSelectedItem.accountGroupId, // 账户组id
          group_name: this.currentSelectedItem.accountGroupName, // 账户组名称
          mark: type // 0：终止 1：再生效
        }
        let text = String(type) === '1' ? '再生效' : '终止'
        if (String(type) === '0') {
          this.$confirm(`确定终止账户组${this.currentSelectedItem.accountGroupName}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            updateAccountGroupState(JSON.stringify(params)).then(res => {
              const {success, message} = res
              if (success) {
                this.$message.success(`${text}账户组操作成功`)
                // 刷新列表
                this.getAllAccountGroupList()
              } else {
                this.$message.error(message)
              }
            })
          }).catch(() => {})
        } else {
          updateAccountGroupState(JSON.stringify(params)).then(res => {
            const {success, message} = res
            if (success) {
              this.$message.success(`${text}账户组操作成功`)
              // 刷新列表
              this.getAllAccountGroupList()
            } else {
              this.$message.error(message)
            }
          })
        }
      },
      // 账户组设置 - 账户组类型下拉框
      getAccountTypeOptions () {
        postUserGroupType().then((resp) => {
          if (resp) {
            const {buzidata} = resp
            this.accountTypeOptions = buzidata
          } else {
            this.accountTypeOptions = []
          }
        })
      },
      // 账户组设置 -- 列表数据
      getAllAccountGroupList () {
        this.$store.commit('setSecuritiesFilingRadio', '')
        this.currentSelectedItem = {}
        this.loading = true
        let params = {
          'pageRows': this.pagination.pageSizeNumber,
          'pageIndex': this.pagination.currentPage,
          'typeID': this.searchForm.searchAccountType, // 账户组类型数组
          'accountName': this.searchForm.searchAccountName
        }
        postSearchAccountTyepList(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.tableData = buzidata
            this.totalNum = totalNum
          }
        })
      },
      handleCheckedChange (val) {
        // this.checked = val
        let filterItem = this.tableData.filter(v => {
          return v.group_id === val
        })
        const {type_id, group_id, group_name, group_desc, fund_code, type_name, create_time, modify_time, inval_time, mem_code, maintainence, groupnum} = filterItem[0]
        this.currentSelectedItem = {
          accountTypeId: type_id,
          accountTypeName: type_name,
          accountGroupId: group_id,
          accountGroupName: group_name,
          accountGroupDesc: group_desc,
          fundCode: fund_code,
          createTime: create_time,
          modifyTime: modify_time,
          invalTime: inval_time,
          memCode: mem_code,
          maintainence: maintainence,
          groupNum: groupnum
        }
      },
      handleCreate () {
        this.currentMode = 'create'
        this.ruleForm = {
          createTime: tabletimeformat(new Date()),
          modifyTime: tabletimeformat(new Date()),
          invalTime: tabletimeformat(new Date()),
          accountGroupName: '',
          accountGroupDesc: '',
          accountTypeId: '',
          fundCode: '',
          memCode: ''
        }
        this.$nextTick(() => {
          this.$refs['dialogRef'].showDialog = true
          setTimeout(() => {
            this.$refs['dialogRef'].getSelectOptions()
            this.$refs['dialogRef'].$refs['ruleForm'].clearValidate()
          })
        })
      },
      handleEdit () {
        if (!this.currentSelectedItem.accountGroupId) {
          this.$message.error('请先选择一个账户组')
          return
        }
        if (this.currentSelectedItem.maintainence === '是') {
          this.$message.error('系统自动维护的账户组不能修改')
          return
        }
        this.currentMode = 'edit'
        this.ruleForm = JSON.parse(JSON.stringify(this.currentSelectedItem))
        this.$nextTick(() => {
          this.$refs['dialogRef'].showDialog = true
          setTimeout(() => {
            this.$refs['dialogRef'].getSelectOptions()
          })
        })
      },
      handleDelete () {
        if (!this.currentSelectedItem.accountGroupId) {
          this.$message.error('请先选择一个账户组')
          return
        }
        if (this.currentSelectedItem.maintainence === '是') {
          this.$message.error('系统自动维护的账户组不能删除')
          return
        }
        if (this.currentSelectedItem.groupNum > 0) {
          this.$message.error('包含账户组数目大于0的账户组不能删除')
          return
        }
        this.$confirm(`确定删除${this.currentSelectedItem.accountGroupName}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            groupID: this.currentSelectedItem.accountGroupId
          }
          postCreateAccountGroupDelete(params).then((resp) => {
            if (resp.buzidata === 1) {
              this.$message.success('删除成功!')
              this.getAllAccountGroupList()
            }
          })
        }).catch(() => {})
      },
      getPageination (pagination) {
        this.pagination = pagination
        this.getAllAccountGroupList()
      },
      handleClear () {
        this.searchForm = {
          searchAccountType: [],
          searchAccountName: ''
        }
        this.pagination.currentPage = 1
        this.getAllAccountGroupList()
      },
      handleQuery () {
        this.pagination.currentPage = 1
        this.getAllAccountGroupList()
      },
      // 账户组--搜索账户组下的账户
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          let groupID = scope.row.group_id
          let auto = scope.row.maintainence
          this.$router.push({path: '/accountGroupCode', query: {groupID: groupID, auto: auto === '是'}})
        } else if (type === 'tableColumnRadioComponent') {
          this.handleCheckedChange(scope.row[item.field])
        }
      }
    },
    mounted () {
      const {from} = this.$route.query
      if (!from) { // 点击菜单进入该页面，清除该code
        this.$store.commit('updateJumpToAccountGroupSettingCode', null)
      } else { /* 将跳转带入的code放入selected list */
        this.searchForm.searchAccountType.push(this.getJumpToAccountGroupSettingCode)
      }
      this.getAccountTypeOptions()
      this.getAllAccountGroupList()
    }
  }
</script>
<style lang='less' scoped>
  .accountGroup {
    .el-card {
      width: 100%;
      .el-form {
        width: 100%;
      }
    }
    /deep/ .el-radio__label {
      display: none !important;
    }
    .slotScope {
      text-decoration: underline;
      color: #1b5eed;
      cursor: pointer;
    }
  }

</style>
