
<!--
 适用场景
 维度：用户选择高维度自动将当前选中的维度以下的默认选中，度量：则根据用户选择来展示
 注：如证券简称依赖于证券代码展示的，需要将证券简称排在证券代码前面
  [  // id:维度选择的升降序， index表示在表头中的索引，用来展示列
   {name: '交易日期', id: 1,index: 0, show: true},
   {name: '证券简称', id: 2,index: 2, show: false},
   {name: '证券代码', id: 3,index: 1, show: true},
  ]
-->
<template>
  <el-row>
    <el-form class="dimen-measure-component">
      <el-col :xl="16" :lg="19" :md="16" :sm="16">
        <el-form-item label="查询结果展示维度：">
          <el-checkbox-group v-model="dimensionQuery">
            <el-checkbox v-for="item in dimensionAll"
                         @change="choiceDimen"
                         v-if="item.show"
                         :key="item.index"
                         :label="item.id"> {{item.name}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="查询结果展示度量：">
          <el-checkbox-group v-model="measureQuery">
            <el-checkbox v-for="item in measureAll" v-if="item.show"
                         :key="item.index" :label="item.index"> {{item.name}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="4" :lg="2" :md="4" :sm="4">
        <el-button size="small" type="primary" class="refurbish-table" @click="refurbishTable('btn')">刷新</el-button>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      markDimenChange: this.conConfig.dimensionQuery.toString(), // 标记维度是否变化，变化后需要重新查询数据
      dimensionQuery: [],
      dimensionAll: [],
      measureQuery: [],
      measureAll: []
    }
  },
  props: {
    conConfig: {},
    columns: {}
  },
  computed: {
    column() {
      return JSON.parse(JSON.stringify(this.columns))
    }
  },
  methods: {
    handleChoice() {
      // 处理维度与度量
      this.column.map((v, i, arr) => {
        this.column[i].show = false
      })
      this.dimensionQuery.map((v) => {
        this.dimensionAll.map((val, i, arr) => {
          if (val.id == v) {
            this.column[val.index].show = true
          }
        })
      })
      this.measureQuery.map((v, i) => {
        this.column[v].show = true
      })
    },
    refurbishTable(mark) { // 维度与度量刷新按钮
      this.handleChoice()
      if (this.markDimenChange !== this.dimensionQuery.toString()) { // 维度发生变化
        this.markDimenChange = this.dimensionQuery.toString()
        this.$emit('changeDimen', this.column, this.dimensionQuery, this.measureQuery, mark) // mark: 用户是否点击刷新按钮
      } else {
        this.$emit('changeDimen', this.column, null, this.measureQuery)
      }
    },
    setDimenArr(dNum) { // 设置维度 根据维度最大值填充数组
      let arr = new Array(dNum);
      for (let i = 0; i < arr.length; i++) { arr[i] = i + 1 }
      this.dimensionQuery = arr
    },
    choiceDimen(op, e) { // 获得选择的维度最大值
      this.dimensionQuery.sort()
      let dNum = this.dimensionQuery.length - 1
      if (e && e.target._value < this.dimensionQuery[dNum]) {
        // 降序
        this.setDimenArr(e.target._value)
      } else {
        // 升序
        this.setDimenArr(this.dimensionQuery[dNum])
      }
      this.handleChoice()
      this.$emit('changeDimen', this.column, this.dimensionQuery, this.measureQuery) // 维度的修改直接触发事件
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
