
<!-- 阈值管理 thresholdMangement-->
<template>
  <div class="threshold-mangement">
    <el-card class="el-card-table">
      <el-row>
        <el-col :span="24">
          <el-table
            border
            ref="thresholdManageRef"
            :data="tableData"
            show-overflow-tooltip
            v-loading="queryResLoadMain"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            style="width:100%;">
            <el-table-column
              v-for="item in columns.slice(0,3)"
              :key="item.field"
              :align="item.align"
              :label="item.label"
              :prop="item.field"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="right"
              minWidth="80px"
              label="level-1"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="level1ModelList[scope.$index]"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="level-2"
              minWidth="80px"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="level2ModelList[scope.$index]"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="level-3"
              minWidth="80px"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="level3ModelList[scope.$index]"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="单位"
              minWidth="80px"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paramDesc}}
                <!--{{
                (scope.row.paramCode === 'member_buy'
                || scope.row.paramCode === 'menber_sale'
                || scope.row.paramCode === 'pbu_sale'
                || scope.row.paramCode === 'pbu_buy') ? '亿元' :
                (scope.row.paramCode === 'index') ? '%' :
                (scope.row.paramCode === 'province_trade') ? '股/份' :
                (scope.row.paramCode === 'province_account'
                || scope.row.paramCode === 'province_alarm') ? '个' : ''
                }}-->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="状态"
              minWidth="80px"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{String(scope.row.status) === '1' ? '激活' : '未激活'}}
              </template>
            </el-table-column>
            <el-table-column
              minWidth="150px"
              align="center"
              prop="updateTime"
              label="更新时间"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row['updateTime'] | dateFormat}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24" class="saveBtn">
          <el-button type="primary" size="small" @click="ajaxUpdateParamData">确定</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { updateParamData } from '@/service/systemManage'
export default {
  name: 'threshold-mangement',
  props: {
    propsData: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      queryResLoadMain: false,
      level1ModelList: [],
      level2ModelList: [],
      level3ModelList: [],
      tableData: [],
      columns: [
        {
          label: '类型',
          field: 'paramName',
          minWidth: '100px',
          align: 'center'
        }, {
          label: '代号',
          field: 'paramCode',
          minWidth: '100px',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    setInputList() {
      this.level1ModelList = this.tableData.map(m => {
        return m.paramValue.split(',')[0]
      })
      this.level2ModelList = this.tableData.map(m => {
        return m.paramValue.split(',')[1]
      })
      this.level3ModelList = this.tableData.map(m => {
        return m.paramValue.split(',')[2]
      })
    },
    // 批量更新系统参数
    ajaxUpdateParamData() {
      this.tableData.forEach((v, i) => {
        v.paramValue = `${this.level1ModelList[i]},${this.level2ModelList[i]},${this.level3ModelList[i]}`
      })
      let params = this.tableData.map(v => {
        return {
          id: v.id,
          paramValue: v.paramValue
        }
      })
      updateParamData(JSON.stringify(params)).then((res) => {
        if (res) {
          this.$message.success('参数保存成功')
        }
      })
    }
  },
  watch: {
    propsData(newValue) {
      this.tableData = newValue.filter(v => {
        return v.paramCode !== 'province_alarm'
      })
      this.setInputList()
    }
  },
  mounted() {
    this.setInputList()
  }
}
</script>

<style lang="less" scoped>
  .threshold-mangement {
    .saveBtn{
      text-align: right;
    }
    /deep/ input {
      text-align: right;
    }
  }
</style>
