
<!--区域活跃度定位方式 activeZone-->
<template>
    <div class="active-zone">
      <el-card class="el-card-table">
        <el-row>
          <el-col :span="24">
            <el-radio-group v-model="checkedValue">
              <el-radio v-for="(item,index) in radioGroupList" :label="item.paramValue" :key="index">{{item.paramName}}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="24" class="butSta">
            <el-button type="primary" size="small" @click="ajaxUpdateParamData">确定</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
import {updateParamData} from '@/service/systemManage' // 根据一个或多个条件查询系统参数 和 更新
export default {
  name: 'active-zone',
  props: {
    propsData: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      checkedValue: '1',
      radioGroupList: []
    }
  },
  methods: {
    // 批量更新系统参数
    ajaxUpdateParamData() {
      let params = this.radioGroupList.map(v => {
        return {
          id: v.id,
          paramValue: v.paramValue === this.checkedValue ? '1' : '0'
        }
      })
      updateParamData(JSON.stringify(params)).then((res) => {
        if (res) {
          this.$message.success('保存成功')
        }
      })
    },
    transferData(origin) {
      origin.forEach(v => {
        this.radioGroupList.push({
          paramName: v.paramName,
          paramValue: v.paramValue,
          id: v.id
        })
      })
    }
  },
  watch: {
    propsData(newValue) {
      this.transferData(newValue)
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
  .active-zone {
    margin: 0 20px 20px;
    .butSta{
      text-align: right;
    }
  }
</style>
