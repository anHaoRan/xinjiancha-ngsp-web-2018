<template>
  <div class="custom-plate">
    <el-row>
      <el-col>
      </el-col>
    </el-row>
    <el-card>
      <div slot="header" class="clearfix">
        <span>自定义股票板块</span>
      </div>
      <el-table
        border
        :data="boardInfo"
        tooltip-effect="dark"
        max-height="600"
        style="width: 100%; overflow:visible"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          min-width="5%"
          align="center">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="证券代码"
          prop="instrument_id"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="证券名称"
          prop="instrument_chn_short_name"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="板块名称"
          prop="board_name"
          min-width="10%">
        </el-table-column>
      </el-table>
    </el-card>
    <el-row>
      <el-col :span="24">
        <div style="text-align: right;">
          <el-button type="primary" size="small" @click="showDialog(1)">新增</el-button>
          <el-button type="primary" size="small" @click="showDialog(2)">修改</el-button>
          <el-button type="primary" size="small" @click="deleteBoardDialog">删除</el-button>
        </div>
      </el-col>
    </el-row>
    <!--dialog-->
    <el-dialog :title="dialogType>1?'编辑记录':'添加记录'" :visible.sync="dialogFormVisble">
      <el-form :model="boardData" :rules="rules" label-width="80px">
        <el-form-item label="证券代码" prop="instrument_id">
          <el-input v-model="boardData.instrument_id" size="small" :disabled="dialogType>1?true:false"></el-input>
        </el-form-item>
        <el-form-item label="证券名称">
          <el-input v-model="boardData.instrument_chn_short_name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="板块名称" prop="board_name">
          <el-input v-model="boardData.board_name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
        <el-button type="info" size="small" @click="dialogFormVisble=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // 请求接口引入
  import { getBoardInfo, addBoard, deleteBoard, updateBoard } from '@/service/marketStability'

  window.document.title = '自定义板块'

  export default {
    components: {},
    data () {
      return {
        dialogType: 0,
        dialogFormVisble: false,
        rules: {
          instrument_id: [
            {required: true, message: '请输入证券代码', trigger: 'blur'}
          ],
          board_name: [
            {required: true, message: '请输入板块名称', trigger: 'blur'}
          ]
        },
        boardInfo: [],
        multipleSelection: [],
        boardData: {
          instrument_id: '',
          instrument_chn_short_name: '',
          board_name: '',
          oldBoard_name: ''
        }
      }
    },
    watch: {
      dialogFormVisble: function (val) {
        if (!val) {
          this.boardData.instrument_id = ''
          this.boardData.instrument_chn_short_name = ''
          this.boardData.board_name = ''
          this.boardData.oldBoard_name = ''
        }
      }
    },
    methods: {
      selectBoardInfo () {
        getBoardInfo().then((res) => {
          this.boardInfo = res.bizData.metaData
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      deleteBoardDialog () {
        if (this.multipleSelection.length < 1) {
          this.$message.error('请选中一条记录进行删除！')
          return
        }
        let param = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let list = {
            instrumentID: this.multipleSelection[i].instrument_id,
            boardName: this.multipleSelection[i].board_name
          }
          param.push(list)
        }
        deleteBoard(JSON.stringify(param)).then((res) => {
          this.selectBoardInfo()
        })
      },
      showDialog (type) {
        this.dialogType = type
        if (type > 1) {
          //  修改时判断是不是多选
          if (this.multipleSelection.length > 1) {
            this.$message.error('只能选中一条记录进行编辑！')
            return false
          } else if (this.multipleSelection.length < 1) {
            this.$message.error('请选中一条记录进行编辑！')
            return false
          } else {
            this.boardData.instrument_id = this.multipleSelection[0].instrument_id
            this.boardData.instrument_chn_short_name = this.multipleSelection[0].instrument_chn_short_name
            this.boardData.board_name = this.multipleSelection[0].board_name
            this.boardData.oldBoard_name = this.multipleSelection[0].board_name
          }
        }
        this.dialogFormVisble = true
      },
      submit () {
        if (this.dialogType > 1) {
          let param = {
            instrumentID: this.boardData.instrument_id,
            instrumentName: this.boardData.instrument_chn_short_name,
            boardName: this.boardData.board_name,
            oldBoardName: this.boardData.oldBoard_name
          }
          updateBoard(param).then((res) => {
            this.selectBoardInfo()
          })
        } else {
          let param = {
            instrumentID: this.boardData.instrument_id,
            instrumentName: this.boardData.instrument_chn_short_name,
            boardName: this.boardData.board_name
          }
          addBoard(param).then((res) => {
            this.selectBoardInfo()
          })
        }
        this.dialogFormVisble = false
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.selectBoardInfo()
    }
  }
</script>
<style lang="less" scoped>
</style>
