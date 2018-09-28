<template>
  <div>
    <s-table ref="marginTable" :height="height" :isHeader="false" :columns="columns" :data="totalData"
             :pageSizes="[10, 20, 30]"
             @getPageination="getPageination">
      <template slot="tableColumnsUnshift">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
      </template>
      <template slot="tableColumnsPush">
        <el-table-column
          prop="operateContent"
          label="操作"
          min-width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleform(scope.row,'one')">
              {{scope.row.operateProcess}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateDelete" size="mini" @click="handledeleteform(scope.row)">
              {{scope.row.operateDelete}}
            </el-button>
            <!--<el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleform(scope.row,'one')">-->
              <!--{{scope.row.operateCheck}}-->
            <!--</el-button>-->
            <!--<el-button type="text" v-if="scope.row.operateAlt" size="mini" @click="handleChangeform(scope.row)">-->
              <!--{{scope.row.operateAlt}}-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </template>
    </s-table>
  </div>
</template>
<script>
  import MinxinVue from './Mixin'
  import {
    postdelete,
    postdeleteobd,
    postdeletesendletter,
    postdeletecheckletter,
    dataassociationdelete,
    lyricdelete,
    specialWorkdelete,
    temporaryCalculationdelete,
    AccessRequestdelete,
    demandManagementdelete,
    logAuditdelete,
    marketAnalysisdelete,
    letterLendDelete,
    letterBorrowdelete
  } from '../../../../service/superviseTask/index.js'
  import {deleteMonitorStock} from '../../../../service/superviseTask/focusMonitor/index'
  import {deleteAccountGroupStock} from '../../../../service/superviseTask/focusAccountGroup/index'

  export default {
    name: 'Todolist',
    props: {
      height: [Number],
      totalData: {type: Object}
    },
    mixins: [MinxinVue],
    components: {
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        columns: [
          {field: 'createDate', align: 'left', label: '创建日期', sortable: true},
          {field: 'localProcessName', align: 'left', label: '流程类型', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localProcessName')},
          {field: 'subject', align: 'left', label: '主题', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'subject')},
          {field: 'localStatus', align: 'left', label: '流程状态', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localStatus')},
          {field: 'requesterName', align: 'left', label: '来源', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'requesterName')}
        ]
      }
    },
    methods: {
      handledeleteform(row) {
        if (row.operateDelete == '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => { // eslint-disable-line
            let params = {
              'instanceId': row.instanceId
            }
            params = JSON.stringify(params)
            switch (row.localProcessName) {
              case '自律监管':
                postdelete(row.instanceId).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '调取资料':
                postdeleteobd(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '联合监管发函':
                postdeletesendletter(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '联合监管复函':
                postdeletecheckletter(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '数据协查':
                dataassociationdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '舆情分析':
                lyricdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '专项工作':
                specialWorkdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '临时计算':
                temporaryCalculationdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '权限申请':
                AccessRequestdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
                case '线索报告':
                AccessRequestdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '需求管理':
                demandManagementdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '重点监控账户组':
                let deleteParams = {instanceId: row.instanceId}
                deleteAccountGroupStock(JSON.stringify(deleteParams)).then(resp => {
                  if (resp) {
                    this.$emit('todolist')
                  }
                })
                break;
              case '重点监控证券':
                let stockparams = {instanceId: row.instanceId}
                deleteMonitorStock(JSON.stringify(stockparams)).then(resp => {
                  if (resp) {
                    this.$emit('todolist')
                  }
                })
                break;
              case '市场分析':
                marketAnalysisdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '日志审计':
                logAuditdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '函件传阅':
                letterLendDelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
              case '函件借阅':
                letterBorrowdelete(params).then((resp) => {
                  this.$emit('todolist')
                })
                break
            }
          }).catch(() => {

          })
        }
      },
      // handleChangeform(row) {
      //
      // },
      getPageination(pageinationVal) {
        this.totalData.pageRows = pageinationVal.pageSizeNumber
        this.totalData.pageIndex = pageinationVal.currentPage
        this.$emit('todolist')
      }
    }
  }
</script>
