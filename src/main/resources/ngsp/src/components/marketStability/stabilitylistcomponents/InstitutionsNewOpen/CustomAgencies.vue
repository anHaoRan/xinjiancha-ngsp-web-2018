<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>自定义机构</span>
            <el-button
              type="primary"
              size="small"
              style="float: right"
              @click="organizationInfo">查询
            </el-button>
            <el-input size="small" style="width: 150px; float: right" v-model="orgName"></el-input>
            <span style="float: right">机构名称：</span>
          </div>
          <el-table border
                    ref="organizationList"
                    :data="organizationList"
                    height="305"
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    style="width: 100%; overflow:visible">
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              align="left"
              header-align="center"
              show-overflow-tooltip
              label="机构"
              prop="org_name"
              min-width="10%">
            </el-table-column>
            <el-table-column
              align="left"
              header-align="center"
              show-overflow-tooltip
              label="是否生效"
              prop="ischeck"
              min-width="10%"
              :formatter="formatterAlarmStatus">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>导入方式</span>
            <el-radio label="0" v-model="importMethod">文本</el-radio>
            <el-radio label="1" v-model="importMethod">查询</el-radio>
            <span v-if="importMethod==1">
              <el-button
                type="primary"
                size="small"
                style="float: right"
                @click="selectAccount">查询
            </el-button>
            <el-input size="small" style="width: 150px; float: right" v-model="companyName"></el-input>
            <span style="float: right">公司名称：</span>
            </span>
          </div>
          <div v-if="importMethod==0">
            <el-input type="textarea" resize="none" placeholder="多个账户以换行分隔" :rows="14"
                      v-model="accountArray"></el-input>
          </div>
          <div v-else>
            <el-table border
                      ref="accountList"
                      :data="accountList"
                      height="305"
                      tooltip-effect="dark"
                      highlight-current-row
                      @selection-change="accountListSelectionChange"
                      style="width: 100%; overflow:visible">
              <el-table-column
                type="index"
                min-width="5%">
              </el-table-column>
              <el-table-column
                align="center"
                type="selection">
              </el-table-column>
              <el-table-column
                align="left"
                header-align="center"
                show-overflow-tooltip
                label="账户ID"
                prop="accid"
                min-width="10%">
              </el-table-column>
              <el-table-column
                align="left"
                header-align="center"
                show-overflow-tooltip
                label="账户名称"
                prop="accname"
                min-width="10%">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>机构信息</span>
          </div>
          <el-form style="height: 305px" :model="organization" ref="organization" :rules="rules">
            <el-form-item label="机构名称：" prop="org_name">
              <el-input v-model="organization.org_name" style="width: 200px;" size="small"></el-input>
            </el-form-item>
            <el-form-item label="是否生效：">
              <el-radio label="1" v-model="organization.ischeck">是</el-radio>
              <el-radio label="0" v-model="organization.ischeck">否</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="updateAgencies('add')">增加
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="organization.org_code!=''?false:true"
                @click="updateAgencies('delete')">删除
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="organization.org_code!=''?false:true"
                @click="updateAgencies('update')">保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>已关联机构</span>
            <el-button
              type="primary"
              size="small"
              style="float: right"
              :disabled="currentRow?false:true"
              @click="relateAccount('1')">取消关联
            </el-button>
            <el-button
              type="primary"
              size="small"
              style="float: right"
              :disabled="currentRow?false:true"
              @click="relateAccount('0')">关联
            </el-button>
          </div>
          <el-table border
                    ref="organizationAccountList"
                    :data="organizationAccountList"
                    height="305"
                    tooltip-effect="dark"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                    style="width: 100%; overflow:visible">
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              align="center"
              type="selection">
            </el-table-column>
            <el-table-column
              align="left"
              header-align="center"
              show-overflow-tooltip
              label="机构"
              prop="orgname"
              min-width="10%">
            </el-table-column>
            <el-table-column
              align="left"
              header-align="center"
              show-overflow-tooltip
              label="账户ID"
              prop="accid"
              min-width="10%">
            </el-table-column>
            <el-table-column
              align="left"
              header-align="center"
              show-overflow-tooltip
              label="账户名称"
              prop="accname"
              min-width="10%">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // 请求接口引入
  import {
    getOrganizationInfo,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationAccount,
    addOrganizationAccount,
    deleteRelateAccount,
    getAccount
  } from '@/service/marketStability'
  import ElInput from 'element-ui/packages/input/src/input'

  window.document.title = '自定义机构'
  let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
  export default {
    name: 'custom-agencies',
    components: {ElInput},
    data () {
      return {
        importMethod: '0',
        orgName: '',
        companyName: '',
        currentRow: null,
        organizationList: [],
        organizationAccountList: [],
        multipleSelection: [],
        accountListMultipleSelection: [],
        accountList: [],
        accountArray: '',
        organization: {
          org_code: '',
          org_name: '',
          ischeck: '1'
        },
        rules: {
          org_name: [
            {
              type: 'string',
              required: true,
              pattern: reg,
              message: '请输入正确机构名称',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      currentRow: function () {
        this.organization.org_code = this.currentRow ? this.currentRow.org_code : ''
        this.organization.org_name = this.currentRow ? this.currentRow.org_name : ''
        this.organization.ischeck = this.currentRow ? this.currentRow.ischeck : ''
        if (this.currentRow) {
          this.organizationAccount(this.currentRow.org_code)
        }
      }
    },
    methods: {
      organizationInfo () {
        if (this.orgName && !reg.test(this.orgName)) {
          this.$message.warning('只允许输入字母，数字，汉字')
          return
        }
        getOrganizationInfo(this.orgName).then((res) => {
          this.organizationList = res.bizData.metaData
          if (this.currentRow) {
            let index = this.organizationList.findIndex((item) => {
              return item.org_code == this.currentRow.org_code
            })
            console.log(index)
            this.$refs.organizationList.setCurrentRow(this.organizationList[index])
          }
        })
      },
      organizationAccount (orgCode) {
        getOrganizationAccount(orgCode).then((res) => {
          this.organizationAccountList = res.bizData.metaData
        })
      },
      selectAccount () {
        if (!reg.test(this.companyName)) {
          this.$message.warning('只允许输入字母，数字，汉字')
          return
        }
        getAccount({
          companyName: this.companyName,
          orgCode: this.currentRow ? this.currentRow.org_code : ''
        }).then((res) => {
          this.accountList = res.bizData.metaData
        })
      },
      formatterAlarmStatus (row, column) {
        if (row.ischeck == '1') {
          return '是'
        } else {
          return '否'
        }
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      updateAgencies (type) {
        if (type == 'delete') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            deleteOrganization(this.organization.org_code).then((res) => {
              this.$message({type: 'success', message: '删除成功'})
              this.organizationInfo()
            })
          }).catch(() => {

          })
        } else {
          this.$refs['organization'].validate(valid => {
            if (valid) {
              if (type == 'add') {
                addOrganization({orgName: this.organization.org_name, isCheck: this.organization.ischeck}).then(() => {
                  this.$message({type: 'success', message: '增加成功'})
                  this.organizationInfo()
                })
              } else {
                updateOrganization({
                  orgCode: this.organization.org_code,
                  orgName: this.organization.org_name,
                  isCheck: this.organization.ischeck
                }).then(() => {
                  this.$message({type: 'success', message: '修改成功'})
                  this.organizationInfo()
                })
              }
            }
          })
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      accountListSelectionChange (val) {
        this.accountListMultipleSelection = val
      },
      relateAccount (type) {
        let param = []
        let patt = /^[A-Z]\d{9}$/
        let arr = this.importMethod == 0 && type == 0 ? this.accountArray.split('\n') : (type > 0 ? this.multipleSelection : this.accountListMultipleSelection)
        for (let i = 0; i < arr.length; i++) {
          if (this.importMethod == 0 && !patt.exec(arr[i]) && type == 0) {
            this.$alert('账户代码：必须以一个大写字母开头，后加9个数字', `[第${i + 1}行][${arr[i]}]`)
            return
          }
          let select = {
            orgCode: this.currentRow.org_code,
            accountId: this.importMethod == 0 && type == 0 ? arr[i] : arr[i].accid
          }
          param.push(select)
        }
        if (type > 0) {
          deleteRelateAccount(param).then((res) => {
            this.organizationAccount(this.currentRow.org_code)
          })
        } else {
          addOrganizationAccount(param).then((res) => {
            this.organizationAccount(this.currentRow.org_code)
          })
        }
      }
    },
    mounted () {
      this.organizationInfo()
    }
  }
</script>

<style lang="less" scoped>
  .el-radio + .el-radio {
    margin-left: 0;
  }
</style>
