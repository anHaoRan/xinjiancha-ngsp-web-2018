<!--出差代办-->
<template>
  <div class="travel-agent-wrap">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header">
        <span>新增代办</span>
      </div>
      <el-row class="trees-wrap">
        <el-col :span="10">
          <h5>代办类别
            <!--<el-tag v-for="item in leftSelectedTags" :key="item">{{item}}</el-tag>-->
          </h5>
          <div class="tree-container">
            <el-tree
              ref="leftTree"
              show-checkbox
              hightlight-current
              :data="leftColumnData"
              node-key="id"
              :props="defaultPropsLeft"
              default-expand-all
              @check-change="getLeftCheckedList"
            ></el-tree>
          </div>
        </el-col>
        <el-col :span="4" class="button-box">
          <el-button disbled class="arrow-button-css"><i class="el-icon el-icon-d-arrow-right"></i></el-button>
        </el-col>
        <el-col :span="10">
          <h5>代办人
            <el-tag v-if="rightSelectedTag">{{rightSelectedTag}}</el-tag>
          </h5>
          <div class="tree-container">
            <el-tree
              ref="rightTree"
              hightlight-current
              :data="rightColumnData"
              node-key="code"
              :props="defaultPropsRight"
              default-expand-all
              @node-click="getRightCheckedCode"
            ></el-tree>
          </div>
        </el-col>
      </el-row>
      <el-row class="opearate-btn">
        <el-button type="primary" @click="createAgent">完成</el-button>
      </el-row>
    </el-card>
    <my-agent-list ref="myAgentListRef" :leftColumnDataProps="leftColumnData" @updateTotalCount="updateTotalCount"></my-agent-list>
  </div>
</template>
<script>
  import breadcrumb from '@/components/common/Breadcrumb'
  import myAgentList from './component/myAgentList'
  import {
    getAllRoleOrgsNew
    // getAllRoleOrgs
  } from '@/service/systemManage/securityPlateSet'
  import {
    postCreateAgent
  } from '@/service/systemManage/otherManage'

  export default {
    components: {
      breadcrumb,
      myAgentList
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/travelAgent',
            label: '系统管理'
          }, {
            router: '/travelAgent',
            label: '其他管理'
          }, {
            router: '/travelAgent',
            label: '出差代办'
          }
        ],
        leftColumnData: [{
          id: 'all',
          name: '监察任务',
          children: [{
            id: 'ngsp_sls_flow',
            name: '自律监管'
          }, {
            id: 'ngsp_obd_flow',
            name: '调取资料'
          }, {
            id: 'ngsp_uns_send_flow',
            name: '联合监管发函'
          }, {
            id: 'ngsp_uns_check_flow',
            name: '联合监管复函'
          }, {
            id: 'ngsp_dig_flow',
            name: '数据协查'
          }, {
            id: 'ngsp_poa_flow',
            name: '舆情分析'
          }, {
            id: 'ngsp_spw_flow',
            name: '专项工作'
          }, {
            id: 'ngsp_tc_flow',
            name: '临时计算'
          }, {
            id: 'ngsp_rfp_flow',
            name: '权限申请'
          }, {
            id: 'ngsp_dmg_flow',
            name: '需求管理'
          }, {
            id: 'ngsp_ltb_flow',
            name: '函件借阅'
          }]
        }],
        rightColumnData: [],
        defaultPropsLeft: {
          children: 'children',
          label: 'name'
        },
        defaultPropsRight: {
          children: 'children',
          label: 'username'
        },
        leftCheckedList: [],
        rightCheckedCode: '',
        leftSelectedTags: [], // 已选委托类别tags
        rightSelectedTag: '',
        totalCount: 0
      }
    },
    methods: {
      updateTotalCount(totalCount, surrogateId, surrogateName) {
        this.totalCount = totalCount
        this.rightCheckedCode = surrogateId
        this.rightSelectedTag = surrogateName
      },
      getLeftCheckedList () {
        let keys = this.$refs.leftTree.getCheckedNodes(true)
        this.leftSelectedTags = keys.map(v => {
          return v.name
        })
        keys = keys.map(v => {
          return v.id
        })
        this.leftCheckedList = keys.join(',')
      },
      getRightCheckedCode (item) {
        if (!item.children && !this.totalCount) {
          this.rightCheckedCode = item.usercode
          this.rightSelectedTag = item.username
        }
      },
      // 获取角色权限列表
      getAllRoleOrgsData () {
        getAllRoleOrgsNew().then((resp) => {
          if (resp) {
            this.rightColumnData = resp.children
          }
        })
      },
      createAgent () {
        if (this.rightCheckedCode === '' || this.leftCheckedList.length === 0) {
          this.$message.error('请选择代办类别和代办人')
          return
        }
        let params = {
          comment: '委托代办',
          surrogateId: this.rightCheckedCode,
          processNames: this.leftCheckedList
        }
        postCreateAgent(params).then((resp) => {
          const {message, buzidata} = resp
          if (buzidata) {
            this.$message.success(message)
            this.$refs['myAgentListRef'].reqAllAgentList()
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    created () {
      this.getAllRoleOrgsData()
    }
  }
</script>
<style lang="less" scoped>
  .travel-agent-wrap {
    .opearate-btn {
      text-align: center;
      padding: 10px;
    }
    .trees-wrap {
      height: 350px;
      h5 {
        line-height: 38px;
        margin: 10px 0;
        .el-tag {
          margin-left: 8px;
        }
      }
      .tree-container {
        height: 260px;
        overflow: auto;
      }
      /*.el-tree {
        background: transparent;
        color: #fff;
        /deep/ .el-tree-node__content:hover {
          background: transparent;
          /deep/ .el-tree-node__content:hover {
            background: transparent;
          }
        }
      }*/
      .el-col {
        height: 100%;
        padding: 0 15px;
        &:first-child, &:last-child {
          border: 1px solid #9e9797;
          border-radius: 5px;
          /*background-color: #fff;*/
        }
        &.button-box {
          text-align: center;
          .arrow-button-css {
            width: 60px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            button:first-child {
              margin-bottom: 20px;
            }
          }
        }
      }
    }
  }
</style>
