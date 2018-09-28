<template>
  <div class="column-editing-export">
    <el-dialog
      title="可选列导出"
      :visible.sync="dialogFormVisble"
      width="700px">
      <el-form label-width="120px">
        <el-form-item label="导出字段：">
          <el-row>
            <el-checkbox-group v-model="checkedList">
              <el-col :span="8" v-for="(item,index) in columns" :key="index">
                <el-checkbox :label="item.field">{{item.label}}</el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-form-item>
        <el-form-item label="导出格式：">
          <el-radio v-model="exportRadio" label="excel">EXCEL</el-radio>
          <el-radio v-model="exportRadio" label="csv">CSV</el-radio>
        </el-form-item>
        <el-form-item label="导出范围：">
          <el-radio v-model="rangeRadio" label="0">全部</el-radio>
          <el-radio v-model="rangeRadio" label="1">当前页</el-radio>
          <span style="margin-left:30px">前</span>
          <el-input v-model="number" size="small" style="width:15%"></el-input>
          <span>条</span><span style="margin-left:50px">共{{pageinationVal.pageTotal}}条</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" size="small" @click="handleExport">导 出</el-button>
        <el-button type="info" size="small" @click="dialogFormVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'column-editing-export',
    props: {
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      pageinationVal: {
        type: Object,
        default () {
          return {pageIndex: 1, pageRows: 10, pageTotal: 0}
        }
      }
    },
    components: {},
    mixins: [],
    data () {
      return {
        dialogFormVisble: false,
        checkedList: [],
        exportRadio: 'excel',
        rangeRadio: '0',
        number: ''
      }
    },
    computed: {},
    watch: {
      columns: {
        handler () {
          let arr = []
          for (let key of this.columns) {
            if (key.isActive) {
              arr.push(key.field)
            }
          }
          this.checkedList = arr
        },
        immediate: true,
        deep: true
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      showDialog () {
        this.dialogFormVisble = true
      },
      handleExport () {
        if (!this.checkedList.length) {
          this.$message.error('请至少选择一个导出字段')
          return
        }
        let tableColumns = []
        for (let key of this.columns) {
          if (this.checkedList.indexOf(key.field) != -1) {
            tableColumns.push(key)
          }
        }
        let params = {
          tableColumns: tableColumns,
          fileType: this.exportRadio
        }
        if (this.rangeRadio == 1) {
          params.pageIndex = this.pageinationVal.pageIndex
          params.pageRows = this.pageinationVal.pageRows
        }
        if (this.number != '') {
          params.number = this.number
        }
        this.$emit('getExport', params)
      }
    }
  }
</script>

<style lang="less">
  .column-editing-export {
    .el-dialog__body {
      padding: 0;
    }
  }
</style>
