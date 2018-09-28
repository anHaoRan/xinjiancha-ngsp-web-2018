
<template>
  <el-row>
    <el-form class="dimen-measure-component">
      <el-col :xl="16" :lg="19" :md="16" :sm="16">
        <el-form-item label="查询结果展示维度：">
          <el-checkbox-group v-model="dimensionQuery">
            <el-checkbox v-for="item in dimensionAll"
                         :key="item.id"
                         :label="item.id"
                         :disabled="item.disable"> {{item.name}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="查询结果展示度量：">
          <el-checkbox-group v-model="measureQuery">
            <el-checkbox v-for="item in measureAll"
                         :key="item.id" :label="item.id"> {{item.name}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="4" :lg="2" :md="4" :sm="4">
        <el-button size="small" type="primary" class="refurbish-table" @click="refurbishTable()">刷新</el-button>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      dimensionQuery: [],
      dimensionAll: [],
      measureQuery: [],
      measureAll: []
    }
  },
  props: {
    conConfig: {}
  },
  watch: {
    dimensionQuery() {
      this.$emit('changeDimen', this.dimensionQuery, this.measureQuery, 'no')
    },
    measureQuery() {
      this.$emit('changeDimen', this.dimensionQuery, this.measureQuery, 'no')
    }
  },
  methods: {
    refurbishTable() { // 维度与度量刷新按钮
      this.$emit('changeDimen', this.dimensionQuery, this.measureQuery, 'yes')
    }
  },
  mounted() {
    this.dimensionAll = this.conConfig.dimensionAll
    this.dimensionQuery = this.conConfig.dimensionQuery
    this.measureAll = this.conConfig.measureAll
    this.measureQuery = this.conConfig.measureQuery
  }
}
</script>

<style lang="less" scoped>
  .dimen-measure-component {
    .el-form-item {
      margin-bottom: 0;
    }
    .refurbish-table {
      margin-top: 10px;
    }
  }
</style>
