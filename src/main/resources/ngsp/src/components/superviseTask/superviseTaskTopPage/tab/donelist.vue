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
            <el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleform(scope.row,'three')">
              {{scope.row.operateProcess}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleform(scope.row,'three')">
              {{scope.row.operateCheck}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateAlt" size="mini" @click="handleChangeform(scope.row)">
            {{scope.row.operateAlt}}
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
    name: 'donelist',
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
          {field: 'localProcessName', align: 'left', label: '流程类型', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localProcessName')},
          {field: 'subject', align: 'left', label: '主题', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'subject')},
          {field: 'localStatus', align: 'left', label: '流程状态', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'localStatus')},
          {field: 'lastOperatorName', align: 'left', label: '办结人', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'lastOperatorName')}
        ]
      }
    },
    methods: {
      getPageination (pageinationVal) {
        this.totalData.pageRows = pageinationVal.pageSizeNumber
        this.totalData.pageIndex = pageinationVal.currentPage
        this.$emit('donelist')
      },
      handleChangeform(row) {
        switch (row.localProcessName) {
          case '重点监控账户组':
            this.$router.push({name: 'changeBuiltAccountGroup', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
          case '重点监控证券':
            this.$router.push({name: 'changeMonitorSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
        }
      }
    }
  }
</script>
