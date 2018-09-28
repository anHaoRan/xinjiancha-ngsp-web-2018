<!-- 查看统计口径 -->
<template>
  <div class="statistic-caliber">
    <span class="text" @click="check">查看统计口径</span>
    <el-dialog
      title="算法描述"
      :visible.sync="visible">
      <div class="detail">
        <template v-for="(item, index) in statisticCaliber">
          <h2>{{item.title}}</h2>
         <template v-if="!item.rewrite">
           <p v-if="item.content" v-for="con in item.content">{{con}}</p>
         </template>
          <template v-else>
            <slot :name="`is${index}`"></slot>
          </template>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      statisticCaliber: {
        type: Array,
        default () {
          return [
            {
              title: 'XXXXXXXXX',
              content: ['1、xxxxxxxxxxxxx','2、xxxxxxxxxxxxx', '3、xxxxxxxxxxxxx']
            }
          ]
        }
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      check () {
       this.visible = true
      }
    }
  }
</script>
<style lang="less" scoped>
  .statistic-caliber {
    display: inline-block;
    /deep/ .text {
      font-size: 14px;
      /*text-decoration: #3a8ce9;*/
      cursor: pointer;
      padding-left: 10px;
    }
    /deep/ .el-dialog__body {
      padding-top: 10px;
    }
    .detail {
      overflow-y: scroll;
      max-height: 620px;
      margin-bottom: 10px;
    }
    h2 {
      margin: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
    p {
      font-size: 16px;
      margin: 0;
      padding-left: 20px;
    }
  }
</style>
