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
  import {
    getcolmlist,
    getallinfo
  } from '../../../../service/analysisTool/insiderTradAccountAnalysis/accountlist/index.js'
  import MinxinVue from './Mixin'
  export default {
    props: ['currentClickRowData'],
    created () {
    },
    mixins: [MinxinVue],
    data () {
      return {
        columns: [
          {field: 'index', label: '指标'},
          {field: 'description', label: '指标描述'},
          {field: 'score', label: '得分'},
          {field: 'reason', label: '指标分析结论'}],
        scoreList: [],
        dynamicTableHead: [],
        data: []
      }
    },
    methods: {
      getCurrentRow () {
        this.scoreList = []
        this.dynamicTableHead.forEach(item => {
          if (item.index_name.indexOf('score') !== -1) {
            this.scoreList.push({
              index: item.index_desc,
              description: '',
              score: this.currentClickRowData[item.index_id]
            })
          }
        })
      },
      ajaxQuotaClms () {
        this.dynamicTableHead = []
        this.analTypeName==='lh'?this.groupCode = 'ZHLH':this.groupCode = 'ZHLK'
        let params = {
          'groupCode': this.groupCode,
        }
        getcolmlist(params).then((resp) => {
          let res = resp.quotaClms
          res.sort((x, y) => {
            return x.index_sort - y.index_sort
          })
          this.dynamicTableHead=res
          this.getCurrentRow()
          let requestPassCount = this.$store.state.insiderTradAnalysis.requestPassCount + 1
          this.$store.commit('changeDemensionRequestCount', requestPassCount)
        })
      }
    },
  }
</script>
