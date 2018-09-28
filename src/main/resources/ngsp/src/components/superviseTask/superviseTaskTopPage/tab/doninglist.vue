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
            <!--<el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleform(scope.row,'two')">-->
            <!--{{scope.row.operateProcess}}-->
            <!--</el-button>-->
            <el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleform(scope.row,'two')">
              {{scope.row.operateCheck}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCancel" size="mini" @click="selfRecall(scope.row)">
              {{scope.row.operateCancel}}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </s-table>
  </div>
</template>
<script>
  import MinxinVue from './Mixin'

  export default {
    name: 'doninglist',
    props: {
      height: [Number],
      totalData: {type: Object}
    },
    mixins: [MinxinVue],
    components: {
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        columns: [
          {field: 'createDate', align: 'left', label: '创建日期', sortable: true},
          {
            field: 'localProcessName',
            align: 'left',
            label: '流程类型',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localProcessName')
          },
          {
            field: 'subject',
            align: 'left',
            label: '主题',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'subject')
          },
          {
            field: 'localStatus',
            align: 'left',
            label: '流程状态',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localStatus')
          },
          {
            field: 'currentUserNames',
            align: 'left',
            label: '目前处理人',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'currentUserNames')
          }
        ]
      }
    },
    methods: {
      updateList() {
        this.$emit('doing')
      },
      selfRecall(item) {
        this.recall(item, this.updateList)
      },
      /* recall (row) { // eslint-disable-line
        let processName = ''
        switch (row.localProcessName) {
          case '自律监管':
            processName = 'sls'
            break
          case '调取资料':
            processName = 'obd'
            break
          case '联合监管发函':
            processName = 'uns_send'
            break
          case '联合监管复函':
            processName = 'uns_check'
            break
          case '数据协查':
            processName = 'dig'
            break
          case '舆情分析':
            processName = 'poa'
            break
          case '专项工作':
            processName = 'spw'
            break
          case '临时计算':
            processName = 'tpc'
            break
          case '权限申请':
            processName = 'rfp'
            break
          case '需求管理':
            processName = 'dmg'
            break
          case '线索报告':
            processName = 'crp'
            break
          case '重点监控账户组':
            processName = 'mag'
            break
          case '重点监控证券':
            processName = 'msc'
            break
          case '日志审计':
            processName = 'lad'
            break
          case '市场分析':
            processName = 'mka'
            break
          case '函件借阅':
            processName = 'ltb'
            break
        }
        this.$confirm('确定撤回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'activityName': row.lastOperateActivityName,
            'instanceId': row.instanceId,
            'processName': processName
          }
          let isparams = JSON.stringify(params)
          recalllist(isparams).then((resp) => {
            if (resp) {
              this.$message({
                showClose: true,
                message: '撤回流程成功',
                type: 'success'
              })
            } else {
              this.$message.error('撤回流程失败!')
            }
            this.$emit('doing')
          })
        }).catch(() => {

        })
      }, */
      getPageination (pageinationVal) {
        this.totalData.pageRows = pageinationVal.pageSizeNumber
        this.totalData.pageIndex = pageinationVal.currentPage
        this.$emit('doing')
      }
    }
  }
</script>
