<!--账户组类型设置-->
<template>
  <div class="accountTypeSet">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
        <el-button size="small" type="primary" @click="handleQuery">搜索</el-button>
      </div>
      <el-row>
        <el-form ref="form" :model="searchForm" :inline="true">
          <el-form-item prop="searchAccountTypeName" label="账户组类型名称">
            <el-input
              v-model="searchForm.searchAccountTypeName"
              auto-complete="off"
              placeholder="请输入账户组类型名称"
              size="small">
            </el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${currentMode === 'create' ? '新增' : '修改'}账户组类型`"
      :visible.sync="showDialog" width="70%" left>
      <el-form ref="ruleForm" :model="ruleForm" label-width="170px">
        <el-form-item prop="accountTypeName" label="账户组类型名称："
                      :rules="[{
          required: true, message: '请输入账户组类型名称'
        }]">
          <el-input v-model="ruleForm.accountTypeName" placeholder="请输入账户组类型名称(不超过16个字符)" :maxLength="16"></el-input>
        </el-form-item>
        <el-form-item prop="" :label="`账户组类型创建时间：`">
          <el-input disabled v-model="ruleForm.createTime"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click="handleSave">确认</el-button>
          <el-button type="text" size="small" @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-card class="el-card-table">
      <div slot="header">
        <span>账户组类型设置</span>
        <el-button size="small" type="info" @click="goBack">返回</el-button>
        <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
        <el-button type="primary" size="small" @click="handleEdit">修改</el-button>
        <el-button type="primary" size="small" @click="handleCreate">新建</el-button>

      </div>
      <el-row>
        <el-col :span="24">
          <el-table
            border
            ref="tableRef"
            :data="tableData"
            v-loading="loading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            show-overflow-tooltip
            style="width:100%;">
            <el-table-column
              width="55" align="center">
              <template slot-scope="scope">
                <el-radio
                  class="radio"
                  v-model="checked"
                  :label="scope.row.type_id"
                  @change="handleCheckedChange">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="ID"
              width="70px"
              align="center">
            </el-table-column>
            <el-table-column
              prop="type_name"
              label="账户组类型名称"
              sortable
              :sort-method="accountGroupTypeNameSortMethod"
              align="left">
              <template slot-scope="scope">
                <a class="slotScope"
                   type="text"
                   @click="gotoDetailPage(scope.row)">
                  {{scope.row.type_name}}
                </a>
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in columns"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
            >
            </el-table-column>
          </el-table>
          <el-row style="margin-bottom: 0;">
            <pageination
              @getPageination="getPageination"
              :pageTotal="totalNum"></pageination>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import breadcrumb from '@/components/common/Breadcrumb'
  import pageination from '@/components/common/pageination'
  import { tabletimeformat } from '@/utils/dateTimeFormat'
  import {
    postSearchAccountTypeList, // 列表数据和查询
    postAccountTypeListAdd, // 新增
    postAccountTypeListAmend, // 修改
    postAccountTypeListDelete // 删除
  } from '../../../service/systemManage/securityPlateSet'

  export default {
    components: {
      breadcrumb,
      pageination
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/accountTypeSet',
            label: '系统管理'
          }, {
            router: '/accountTypeSet',
            label: '设置'
          }, {
            router: '/accountTypeSet',
            label: '账户组类型设置'
          }
        ],
        accountGroupTypeNameSortMethod: this.gfnSortByChineseCharacters.bind(this, 'type_name'),
        columns: [
          {label: '账户组类型创建时间', field: 'create_time', align: 'center', sortable: true},
          {
            label: '包含账户组数目',
            field: 'accountnum',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'accountnum')
          },
          {label: '是否系统自动维护', field: 'maintanance', align: 'center', sortable: true}
        ],
        searchForm: {
          searchAccountTypeName: ''
        },
        ruleForm: {
          accountTypeId: null,
          accountTypeName: '',
          createTime: tabletimeformat(new Date())
        },
        rules: {},
        loading: false,
        tableData: [],
        totalNum: 0,
        currentMode: 'create',
        showDialog: false,
        currentSelectedItem: {},
        checked: '',
        pageination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        accountNumSortMethod: this.gfnSortColByNumber.bind(this, 'accountnum')
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      getPageination (pageination) {
        this.pageination = pageination
        this.getAllAccountTypeData()
      },
      handleClear () {
        this.searchForm = {
          searchAccountTypeName: ''
        }
        this.pageination.currentPage = 1
        this.getAllAccountTypeData()
      },
      handleQuery () {
        this.pageination.currentPage = 1
        this.getAllAccountTypeData()
      },
      getAllAccountTypeData () {
        this.checked = ''
        this.currentSelectedItem = {}
        this.loading = true
        let params = {
          'pageIndex': this.pageination.currentPage,
          'pageRows': this.pageination.pageSizeNumber,
          'typeName': this.searchForm.searchAccountTypeName
        }
        postSearchAccountTypeList(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.tableData = buzidata
            this.totalNum = totalNum
          }
        })
      },
      handleCreate () {
        this.currentMode = 'create'
        this.showDialog = true
        this.ruleForm = {
          accountTypeId: null,
          accountTypeName: '',
          createTime: tabletimeformat(new Date())
        }
      },
      handleEdit () {
        if (!this.currentSelectedItem.accountTypeId) {
          this.$message.error('请先选择一个账户组类型')
          return
        }
        if (this.currentSelectedItem.maintanance === '是') {
          this.$message.error('系统自动维护的账户组类型不能修改')
          return
        }
        this.currentMode = 'edit'
        this.showDialog = true
        this.ruleForm = {
          accountTypeId: this.currentSelectedItem.accountTypeId,
          accountTypeName: this.currentSelectedItem.accountTypeName,
          createTime: this.currentSelectedItem.createTime
        }
      },
      handleDelete () {
        if (!this.currentSelectedItem.accountTypeId) {
          this.$message.error('请先选择一个账户组类型')
          return
        }
        if (this.currentSelectedItem.maintanance === '是') {
          this.$message.error('系统自动维护的账户组类型不能删除')
          return
        }
        if (this.currentSelectedItem.accountNum > 0) {
          this.$message.error('包含账户组数目大于0的账户组类型不能删除')
          return
        }
        this.$confirm(`确定删除${this.currentSelectedItem.accountTypeName}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            typeID: this.currentSelectedItem.accountTypeId,
            accountnum: this.currentSelectedItem.accountNum
          }
          postAccountTypeListDelete(params).then((resp) => {
            if (resp.buzidata === 1) {
              this.$message.success('删除成功!')
              this.getAllAccountTypeData()
            }
          })
        }).catch(() => {})
      },
      handleSave () {
        if (!this.ruleForm.accountTypeName.trim()) {
          this.$message.error('账户组类型名称不能为空!')
          return
        }
        this.$refs['ruleForm'].validate((valid) => {
          let params = {
            typeName: this.ruleForm.accountTypeName
          }
          if (valid) {
            if (this.currentMode === 'create') {
              postAccountTypeListAdd(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  if (resp.buzidata) {
                    this.$message.success('新增成功!')
                    this.showDialog = false
                    this.getAllAccountTypeData()
                  } else {
                    this.$message.error('创建账户组类型已存在!')
                  }
                }
              })
            } else {
              params.typeID = this.ruleForm.accountTypeId
              postAccountTypeListAmend(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  if (resp.buzidata) {
                    this.$message.success('修改成功!')
                    this.showDialog = false
                    this.getAllAccountTypeData()
                  } else {
                    this.$message.error('该账户组类型已存在!')
                  }
                }
              })
            }
          }
        })
      },
      handleCancel () {
        this.showDialog = false
      },
      handleCheckedChange (val) {
        this.checked = val
        let filterItem = this.tableData.filter(v => {
          return v.type_id === val
        })
        const {type_id, accountnum, type_name, create_time, maintanance} = filterItem[0]
        this.currentSelectedItem = {
          accountTypeId: type_id,
          accountNum: accountnum,
          accountTypeName: type_name,
          createTime: create_time,
          maintanance: maintanance
        }
      },
      gotoDetailPage (row) {
        if (row.maintanance === '是') {
          this.$message.error('自动维护的无法操作')
          return
        }
        this.$store.commit('updateJumpToAccountGroupSettingCode', row.type_id)
        this.$router.push({path: '/accountGroup', query: {from: 'accoutTypeSet'}})
      }
    },
    mounted () {
      this.getAllAccountTypeData()
    }
  }
</script>
<style lang="less" scoped>
  .accountTypeSet {
    .el-card {
      width: 100%;
      .el-form {
        width: 100%;
      }
    }
    .dialog-footer {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    /deep/ .el-radio__label {
      display: none !important;
    }
    .slotScope {
      text-decoration: underline;
      color: rgba(107, 107, 224, 0.9);
      cursor: pointer;
    }
  }
</style>
