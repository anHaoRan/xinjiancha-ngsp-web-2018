<!--分配选人组件-->
<template>
  <div class="selectRole">
    <!-- <el-select collapse-tags v-bind:multiple="true" v-model="selectRole.applicanter" placeholder="全部" size="small" style="width: 90%;" @focus="displaypopbox">
      <el-option
        v-for="item in isapplicanter"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select> -->
    <el-dialog
      title=""
      :visible.sync="selectRole.dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item :label-width="formLabelWidth">
          <el-tag v-if="rightSelectedTag">{{rightSelectedTag}}</el-tag>
          <div class="tree-container">
            <el-tree
              ref="rightTree"
              accordion
              hightlight-current
              :data="rightColumnData"
              node-key="usercode"
              :default-expanded-keys="['SSE','SMD']"
              :props="defaultPropsRight"
              @node-click="getRightCheckedCode"
            ></el-tree>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
        <el-button type="info" size="small" @click="cancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getAllRoleOrgsNew
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'selectRoleComponent',
    props: {
      selectRole: {type: Object},
    },
    data () {
      return {
        rightSelectedTag: '',
        rightColumnData: [],
        formLabelWidth: '120px',
        dialogFormVisble: false,
        applicanter: [],
        defaultPropsRight: {
          children: 'children',
          label: 'username'
        },
        activeName: 'all',
        person: [],
        userlist: [],
      }
    },
    mounted () {
      this.getAllRoleOrgsData()
    },
    methods: {
      veryfy () {
        this.$emit('getPerson', this.rightSelectedTag.split(','))
        this.selectRole.dialogFormVisble = false
      },
      cancleVeryfy () {
        this.selectRole.dialogFormVisble = false
      },
      getAllRoleOrgsData () {
        getAllRoleOrgsNew().then((resp) => {
          if (resp) {
            this.rightColumnData = resp.children
          }
        })
      },
      getRightCheckedCode (item) {
        if (!item.children) {
          this.rightCheckedCode = item.usercode
          this.rightSelectedTag = item.username
        }
      },
    }
  }
</script>
<style lang="less">
  .selectRole {
    .el-form-item {
      width: 100%;
      .el-form-item__content {
        margin-left: 0px !important;
        width: 100%;
      }
    }
    .tree-container {
      max-height: 350px;
      overflow: auto;
    }
  }
</style>
