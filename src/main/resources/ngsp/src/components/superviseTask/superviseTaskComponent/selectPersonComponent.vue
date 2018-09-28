<!--分配选人dialog组件-->
<template>
  <div class="selectPersonComponent">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="请选择您要发送的节点"
      :visible.sync="selectData.dialogFormVisble"
      left
      width="700px">
      <el-row>
        <el-col :span="12">
          <div class="tree-container">
            <el-input placeholder="请输入姓名进行搜索" v-model="filterText" style="margin-bottom:5px;"></el-input>
            <el-tree
              v-loading="loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              ref="personTreeRef"
              hightlight-current
              :data="personTreeData"
              node-key="userName"
              default-expand-all
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="getCheckedCode"
            ></el-tree>
          </div>
        </el-col>
        <el-col :span="12">
          <s-table
            :isHeader="false"
            :height="200"
            :columns="columns"
            :data="{
              data: selectPerson,
              total: total
            }"
          ></s-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
        <el-button type="primary" size="small" @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
  import { reqPersonTreeData } from '../../../service/superviseTask/index.js'
  import { getCheckPerson } from '../../../service/analysisTool/insiderTradAccountAnalysis/accountlist'

  import STable from '@/components/base/STable'

  export default {
    name: 'selectPersonComponent',
    components: {
      STable
    },
    props: {
      selectData: {
        type: Object,
        default () {
          return {
            /* dialogFormVisble: false,
             activityName: '部门负责人审批',
             instanceId: '',
             processName: 'ngsp_crp_flow',
             businessData: {SEND_UP: '1', DISTIBUTION: '0', LEADER: '1', SENDWAY: '1'} */
          }
        }
      },
      isInsideTradeAnalysis: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        loading: false,
        defaultProps: {
          children: 'userList',
          label: 'fullName'
        },
        personTreeData: [],
        selectPerson: [],
        total: 0,
        filterText: '',
        columns: [{label: '办理部门', field: 'roleName', align: 'center'}, {
          label: '办理人员',
          field: 'fullName',
          align: 'center'
        }]
      }
    },
    watch: {
      filterText (val) {
        this.$refs.personTreeRef.filter(val)
      }
    },
    mounted () {
      this.getPersonTreeData()
    },
    methods: {
      filterNode (value, data) {
        if (!value) {
          return true
        }
        return data.fullName.indexOf(value) > -1
      },
      getCheckedCode (item) {
        if (!item.userList) {
          this.selectPerson = [item]
          this.total = 1
        }
      },
      handleConfirm () {
        if (this.selectPerson.length) {
          this.selectData.dialogFormVisble = false
          this.$emit('obdSelectPerson', this.selectPerson[0]['userName'], this.selectPerson[0]['fullName'])
        } else {
          this.$message.error('请先选择您要发送的节点')
        }
      },
      handleCancel () {
        this.selectData.dialogFormVisble = false
      },
      getPersonTreeData () {
        this.loading = true
        if (this.isInsideTradeAnalysis) {
          getCheckPerson().then(resp => {
            if (resp) {
              this.loading = false
              this.personTreeData = resp
            }
          })
        } else {
          reqPersonTreeData(JSON.stringify(this.selectData)).then((resp) => {
            if (resp) {
              this.loading = false
              this.personTreeData = resp
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .selectPersonComponent {
    .tree-container {
      /deep/ .el-tree {
        height: 206px;
        overflow-y: auto;
        padding-right: 5px;
        background-color: #1b2b4e;
        color: #aec0e6;
        /* 树形组件 */
        /deep/.el-tree-node__content:hover {
          background-color: #263861;
        }
        /deep/.el-tree-node:focus>.el-tree-node__content {
          background-color: #263861;
        }
      }
    }
    /deep/ .el-card-table {
      margin-top: 0;
    }
  }
</style>
