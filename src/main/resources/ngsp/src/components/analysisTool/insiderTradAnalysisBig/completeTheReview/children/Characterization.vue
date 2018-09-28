<!--特征分析-->
<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>内幕交易特征描述</span>
        <span v-if="!isEdit">
        <el-button @click="isEdit=true" size="small" type="primary">编辑</el-button>
      </span>
        <span v-else>
        <el-button @click="ajaxAccountDescEdit" size="small" type="primary">保存</el-button>
        <el-button @click="dialogVisble = true" size="small" type="info">得分项内容加载</el-button>
      </span>
      </div>
      <div v-if="!isEdit" class="div-boder">
        {{textarea}}
      </div>
      <div v-else>
        <el-input type="textarea" v-model="textarea" resize="none" autosize></el-input>
      </div>
    </el-card>
    <el-dialog
      title="得分项内容加载"
      :visible.sync="dialogVisble">
      <el-table
        max-height="400"
        :data="scoreList"
        v-if="dialogVisble"
        @selection-change="handleSelectChange">
        <el-table-column
          align="center"
          width="55"
          type="selection">
        </el-table-column>
        <el-table-column
          :align="item.align"
          :show-overflow-tooltip="true"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          v-for="item in columns"
        ></el-table-column>
      </el-table>
      <div slot="footer" style="text-align: center">
        <!--<el-button @click="" size="small" type="primary">加载</el-button>-->
        <el-button @click="dialogVisble=false" size="small" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {
    accountDescEdit
  } from '@/service/analysisTool/insiderTradAccountAnalysisBig/completeTheReview/index'

  export default {
    components: {},
    name: 'characterization',
    props: {
      currentRow: {
        type: Object,
        default: function () {
          return {}
        }
      },
      scoreList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    watch: {
      currentRow: function () {
        console.log(this.currentRow)
        // this.textarea = JSON.stringify(this.currentRow)
      }
    },
    data () {
      return {
        isEdit: false,
        dialogVisble: false,
        textarea: '',
        columns: [
          {field: 'index', label: '指标', align: 'left'},
          {field: 'score', label: '得分', align: 'right'},
          {field: 'description', label: '描述'}],
        multipleSelection: []
      }
    },
    mounted () {
    },
    methods: {
      handleSelectChange: function (val) {
        this.multipleSelection = val
      },
      ajaxAccountDescEdit () {
        let param = {
          taskID: this.$route.params.taskId,
          acctAnalID: this.currentRow.acct_anal_id,
          propertyDesc: this.textarea
        }
        accountDescEdit(param).then((res) => {
          if (res.accountEdit) {
            this.isEdit = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .div-boder {
    word-wrap: break-word;
  }
</style>
