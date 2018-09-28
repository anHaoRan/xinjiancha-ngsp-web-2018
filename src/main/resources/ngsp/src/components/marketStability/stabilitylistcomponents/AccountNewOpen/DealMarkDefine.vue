<!--自定义处理标记-->
<template>
    <div>
        <el-card>
            <div slot="header" class="clearfix">
                <span>自定义处理标记</span>
            </div>
            <el-table
                    border
                    ref=""
                    :data="dealDefineList"
                    max-height="400"
                    tooltip-effect="dark"
                    @cell-click="defineName"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        label="序号"
                        min-width="6%">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.orderid" maxlength="10" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        label="处理标记"
                        min-width="30%">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dealmark" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        header-align="center"
                        label="操作"
                        min-width="15%">
                    <template slot-scope="scope">
                        <el-button type="info" size="small" icon="el-icon-edit" @click="update(scope,0)"></el-button>
                        <el-button type="info" size="small" icon="el-icon-delete" @click="update(scope)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="insert()">增加</el-button>
        </el-card>
    </div>
</template>
<script>
  import { dealMarkDefine, insertDealMarkDef, updateDealMarkDef, deleteDealMarkDef } from '@/service/marketStability'

  window.document.title = '自定义处理标记'
  export default {
    components: {},
    props: {},
    data () {
      return {
        dealDefineList: []
      }
    },
    mounted () {
      this.getDealMarkDefine()
    },
    methods: {
      getDealMarkDefine () {
        dealMarkDefine().then((res) => {
          this.dealDefineList = res
        })
      },
      insert () {
        this.dealDefineList.push({cid: 0, orderid: '', dealmark: ''})
      },
      update (scope, type = 1) {
        if (type == 0) {
          let patt = /^[1-9]\d*$/
          if (!patt.test(scope.row.orderid)) {
            this.$message.warning(`序号只能是整数`)
            return
          }
          if (scope.row.cid > 0) {
            updateDealMarkDef({
              dealmark: scope.row.dealmark,
              orderid: scope.row.orderid,
              cid: scope.row.cid
            }).then((res) => {
              this.$message({type: 'success', message: '修改成功'})
              this.getDealMarkDefine()
            })
          } else {
            insertDealMarkDef({dealmark: scope.row.dealmark, orderid: scope.row.orderid}).then((res) => {
              this.$message({type: 'success', message: '增加成功'})
              this.getDealMarkDefine()
            })
          }
        } else {
          this.$confirm(`是否删除{${scope.row.dealmark}}标记？`, '提示', {
            type: 'warning'
          }).then(() => {
            if (scope.row.cid > 0) {
              deleteDealMarkDef(scope.row.cid).then((res) => {
                this.$message({type: 'success', message: '删除成功'})
                this.$delete(this.dealDefineList, scope.$index)
              })
            } else {
              this.$delete(this.dealDefineList, scope.$index)
            }
          })
        }
      },
      defineName: function (row, colum, cell, event) {
        console.log(row, colum, cell)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
