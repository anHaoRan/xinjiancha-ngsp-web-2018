
<!--
     slotList:[  // index是tab标签的索引， name: slot的name， rewrite：true,表示该标签完全重写
          {index: 0, name: 'special1'}, {index: 1, name: 'special2', rewrite: true}, {index: 3, name: 'special4'},
        ]
    tabList:[  // 这里mark表示tab索引
    {name: '0000000',mark: "0"},{name: '1111111',mark: "1"},{name: '2222222',mark: "2"},{name: '3333333',mark: "3"}
    ]
    pageList: [ {  count: 120 }, {}, { count: 180 },  { count: 180 } ]
    columnsList,tableDataList 没有tab对应数据用[]占位
-->

<template>
  <div class="">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabList" :key="item.mark"
                   :label="item.name" :name="item.mark">
        <template v-if="slotHandle[index] && index == slotHandle[index].index">
          <!-- 1、需要全部重写 -->
          <template v-if="slotHandle[index] && slotHandle[index].rewrite">
            <slot :name="slotHandle[index].name"> {{slotHandle[index].name}} </slot>
          </template>
          <!-- 2、不需要全部重写 -->
          <template v-else>
            <slot :name="slotHandle[index].name"> {{slotHandle[index].name}} </slot>
            <el-col :span="24">
              <dimension-drilling-table-detail
                :tableData = 'tableDataList[index]'
                :columns="columnsList[index]"
                :queryResLoading.sync="queryResLoading"></dimension-drilling-table-detail>
              <pageination :pageTotal="pageList[index].count || 0"  @getPageination="getPageination"></pageination>
            </el-col>
          </template>
        </template>
        <!-- 3、默认情况 -->
        <template v-else>
          <el-col :span="24">
            <dimension-drilling-table-detail
              :tableData = 'tableDataList[index]'
              :columns="columnsList[index]"
              :queryResLoading.sync="queryResLoading"></dimension-drilling-table-detail>
            <pageination :pageTotal="pageList[index].count || 0"  @getPageination="getPageination"></pageination>
          </el-col>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DimensionDrillingTableDetail from './dimension/DiNo'
import pageination from '../../../common/pageination'
export default {
  components: {
    DimensionDrillingTableDetail,
    pageination
  },
  props: {
    slotList: {},
    tabList: {},
    columnsList: {},
    pageList: {},
    tableDataList: {}
  },
  computed: {
    slotHandle() {
      let reSlotList = [], slots = JSON.parse(JSON.stringify(this.slotList))
      let arr = new Array(this.tabList.length);
      for (let i = 0; i < arr.length; i++) { arr[i] = i } // 获得tab个数
      arr.map(item => {
        reSlotList[item] = {}
        slots.map(val => {
          if (item == val.index) { // 填充有slot属性的数据
            reSlotList[item] = val
          }
        })
      })
      return reSlotList
    }
  },
  data() {
    return {
      activeName: 0,
      queryResLoading: false
    }
  },
  watch: {
    activeName() {
      this.$emit('getTabTablePage', this.activeName, null)
    }
  },
  methods: {
    getPageination(pageination) {
      this.$emit('getTabTablePage', null, pageination)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
