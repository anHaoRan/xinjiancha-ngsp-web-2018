
<!-- 分时净值-投资者选择 netValueTimeSharing-->
<template>
    <div class="net-value-time-sharing">
      <el-card class="el-card-table">
        <el-row>
          <el-col :span="24">
            <el-checkbox-group v-model="checkedList">
              <el-checkbox v-for="(item,index) in checkboxData" :label="item.paramCode" :key="index">{{item.paramName}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="24" class="butSta">
            <el-button type="primary" size="small" @click="ajaxUpdateParamData">确定</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>
<script>
import {updateParamData} from '@/service/systemManage'
export default {
  name: 'net-value-time-sharing',
  props: {
    propsData: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      checkedList: [],
      checkboxData: []
    }
  },
  methods: {
    // 批量更新系统参数
    ajaxUpdateParamData() {
      let params = this.checkboxData.map(v => {
        return {
          id: v.id,
          paramValue: this.checkedList.indexOf(v.paramCode) > -1 ? '1' : '0'
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
      newValue.forEach(v => {
        this.checkboxData.push({
          paramCode: v.paramCode,
          paramValue: v.paramValue,
          paramName: v.paramName,
          id: v.id
        })
        if (String(v.paramValue) === '1') {
          this.checkedList.push(v.paramCode)
        }
      })
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
  .net-value-time-sharing {
    margin: 0 20px 20px;
    .butSta{
      text-align: right;
    }
  }
</style>
