<!--用戶管理 userManagement -->
<template>
  <div class="userManagement">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--双人双密功能-->
    <el-card v-show="userShow">
      <el-row>
        <el-col :span="6" :offset="8" class="userMA">
          <el-form :model="doubleDoubleColse" @keyup.enter.native="veryfy">
            <el-form-item
              label="本机用户密码："
              :label-width="formLabelPS">
              <el-input
                type="password"
                v-model="doubleDoubleColse.password1"
                auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item
              label="第二用户名称："
              :label-width="formLabelPS">
              <el-input
                v-model="doubleDoubleColse.username2"
                auto-complere="off"></el-input>
            </el-form-item>
            <el-form-item
              label="第二用户密码：" :label-width="formLabelPS">
              <el-input
                type="password"
                v-model="doubleDoubleColse.password2"
                auto-complete="off">
              </el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button type="primary" size="small" @click="veryfy">确认</el-button>
            <el-button type="text" size="small" @click="cancleVeryfy">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-if="userManagement">
      <el-row>
        <el-col :span="24">
          <el-col :span="6" class="userPoput">
            <el-tree
              highight-content
              class="filter-tree"
              :data="systemParameterData"
              :props="systemParameterProps"
              :default-expanded-keys="['SSE', 'SMD']"
              node-key="usercode"
              :filter-node-method="filterDate"
              @node-click="nodClick"
              ref="tree2">
            </el-tree>
          </el-col>
          <el-col :span="18">
            <user-management3gss
              :currentClickNodeObjProps="currentClickNodeObj"
              :dataViewListProps="dataViewList"></user-management3gss>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import breadcrumb from '@/components/common/Breadcrumb'
  import UserManagement3gss from './userManag/userManagement3GSS' // 3GSS
  import { encryptByDES } from '@/utils/api'
  import {
    twoPersonTwoPsw, // 双人双密接口
    // getAllRoleOrgs,
    getAllRoleOrgsNew
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'userManagement',
    components: {
      breadcrumb,
      UserManagement3gss
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/userManagement',
            label: '系统管理'
          }, {
            router: '/userManagement',
            label: '用戶管理'
          }, {
            router: '/userManagement',
            label: '用戶权限管理'
          }
        ],
        dataViewList: [],
        userShow: true,
        userManagement: false,
        // 双人双密参数
        doubleDoubleColse: {
          password1: '', // '111111'
          username2: '', // 'ghe'
          password2: '' // '111111'
        },
        // 双人双密弹框宽度
        formLabelPS: '120px',
        CustomPlate: false,
        classified: false,
        marketRadar: false,
        warnong: true,
        systemParameterName: '',
        systemParameterProps: {
          children: 'children',
          label: 'username'
        },
        systemParameterData: [],
        currentClickNodeObj: {}
      }
    },
    methods: {
      // 过滤
      filterDate (val, data) {
        if (!val) return true
        return data.label.indexOf(val) !== -1
      },

      // 菜单
      nodClick (item) {
        if (item.children) {
          return
        }
        this.currentClickNodeObj = item
      },
      // 双人双密验证确认
      veryfy () {
        let userPsw = encryptByDES(this.doubleDoubleColse.password1)
        let selfPsw = encryptByDES(this.doubleDoubleColse.password2)
        // 验证请求参数
        const doublePsw = {
          password1: userPsw,
          password2: selfPsw,
          username2: this.doubleDoubleColse.username2
        }
        // 去除输入内容前后空格并验证是否为空
        if (this.doubleDoubleColse.password1.trim() === '' || this.doubleDoubleColse.username2.trim() === '' || this.doubleDoubleColse.password2.trim() === '') {
          this.$message({
            showClose: true,
            message: '密码或用户名不能为空',
            duration: 1000,
            type: 'error'
          })
        } else {
          // 发送验证请求
          twoPersonTwoPsw(doublePsw).then((resp) => {
            // 请求通过
            if (resp) {
              this.userShow = false
              this.userManagement = true
              this.doubleDoubleColse.password1 = ''
              this.doubleDoubleColse.username2 = ''
              this.doubleDoubleColse.password2 = ''
            } else { // 请求失败
              this.$message({
                showClose: true,
                message: '用户/密码输入错误或用户被停用',
                duration: 1000,
                type: 'error'
              })
              this.userShow = true
              this.userManagement = false
            }
          })
        }
      },
      // 取消双人双密后弹出框内容清空
      cancleVeryfy () {
        this.doubleDoubleColse.password1 = ''
        this.doubleDoubleColse.username2 = ''
        this.doubleDoubleColse.password2 = ''
        this.userShow = true
        this.userManagement = false
      },
      // 角色权限
      getAllRoleOrgsData () {
        getAllRoleOrgsNew().then((resp) => {
          if (resp) {
            this.systemParameterData = resp.children
          }
        })
      }
    },
    watch: {
      systemParameterName (val) {
        this.$refs.tree2.filter(val)
      }
    },
    created () {

    },
    mounted () {
      this.getAllRoleOrgsData()
    }
  }
</script>
<style lang="less">
  .userManagement {
    .dialog-footer {
      text-align: right;
    }
    .el-tree {
      max-height: 360px;
      overflow: auto;
      background-color: #1b2b4e;
      color: #7b8fb9;

    }
    .el-tree-node__content:hover {
      background-color: #1b2b4e;
    }
    .userMA {
      margin-top: 20px;
    }
    .userPoput {
      margin-top: 20px;
    }
  }

</style>
