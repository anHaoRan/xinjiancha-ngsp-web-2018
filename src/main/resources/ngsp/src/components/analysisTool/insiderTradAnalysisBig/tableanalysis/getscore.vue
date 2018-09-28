<template>
  <div>
    <el-card class="line">
      <el-table
        max-height="400"
        :data="scoreList"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          v-for="item in columns"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  import { getcolmlist, getallinfo } from '@/service/analysisTool/insiderTradAccountAnalysisBig/accountlist/index'

  export default {
    props: ['analysisName'],
    data () {
      return {
        columns: [
          {field: 'index', label: '指标'},
          {field: 'description', label: '指标描述'},
          {field: 'score', label: '得分'},
          {field: 'reason', label: '指标分析结论'}],
        scoreList: [],
        dynamicTableHead: [],
        data: [],
        socrelist: []
      }
    },
    mounted () {
      this.taskID = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      this.getinfo()
    },
    methods: {
      getinfo () {
        let params = {
          'taskID': this.taskID
        }
        getallinfo(params).then((resp) => {
          if (resp.bizData.metaData[0].anal_type_name == 'lh') {
            this.groupCode = 'ZHLH'
          } else {
            this.groupCode = 'ZHLK'
          }
          this.ajaxQuotaClms()
        })
      },
      callParent () {
        this.socrelist = this.$parent.getscore
      },
      getCurrentRow () {
        this.callParent()
        this.scoreList = []
        for (let key of this.dynamicTableHead) {
          if (key.index_name.indexOf('score') != -1) {
            this.scoreList.push({
              index: key.index_desc,
              description: '',
              score: this.socrelist[key.index_id]
            })
          }
        }
      },
      ajaxQuotaClms () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        this.dynamicTableHead = []
        let params = {
          'groupCode': this.groupCode
        }
        getcolmlist(params).then((resp) => {
          let res = resp.quotaClms
          res.sort((x, y) => {
            return x.index_sort - y.index_sort
          })
          for (let key of res) {
            this.dynamicTableHead.push(key)
          }
          this.getCurrentRow()
          loading.close()
        })
      }
    }
  }
</script>
