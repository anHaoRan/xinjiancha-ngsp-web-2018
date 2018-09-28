
<!-- 图表默认时间长度 lconDefaultTime-->
<template>
    <div class="lcon-default-time">
      <el-card class="el-card-table">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="securityPlateModel">
              <el-col :span="10">
                <el-form-item prop="securityNname" label="默认间隔(天)">
                  <el-col :span="13">
                    <el-input
                      v-model="securityPlateModel.paramValue"
                      auto-complete="off"
                      placeholder="请输入默认间隔(天)"
                      size="small">
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-form>
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
  name: 'lcon-default-time',
  props: {
    propsData: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      securityPlateModel: {
        paramValue: '',
        id: null
      }
    }
  },
  methods: {
    // 批量更新系统参数
    ajaxUpdateParamData() {
      updateParamData(JSON.stringify([this.securityPlateModel])).then((res) => {
        if (res) {
          this.$message.success('参数保存成功')
        }
      })
    }
  },
  watch: {
    propsData(newValue) {
      this.securityPlateModel = newValue[0] || {}
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
  .lcon-default-time {
    margin: 0 20px 20px;
    .butSta{
      text-align: right;
    }
  }
</style>
