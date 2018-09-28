<template>
  <div class="carousel-item">
    <div class="align-items">
      <div style="display: inline-table;">{{data.type}}</div>
      <div class="font-color-main title">{{data.title}}
      </div>
      <el-button type="info" size="small" @click="handlerClick">更多></el-button>
    </div>
    <div>
      <div v-for="(item,index) in splice6Data" :key="index" class="align-items" @click="handlerClick"
           style="padding: 0 30px;cursor: pointer;">
        <tag :type="item.type"></tag>
        <div class="font-color-main carouse-items">
          <nobr>{{item.name}}</nobr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'carousel-item',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    components: {
      Tag: () => import('./Tag')
    },
    mixins: [],
    data() {
      return {}
    },
    computed: {
      splice6Data() {
        let [...arr] = this.data.value
        return arr.length > 5 ? arr.splice(0, 6) : arr
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      handlerClick(url) {
        this.openPDFPreview(this, '/ngsp/fluct/report/v1/displayPDF?type=1')
      }
    }
  }
</script>

<style lang="less" scoped>
  .carousel-item {
    background-color: rgba(0, 0, 0, 0.3);
    height: 100%;
    > div:nth-child(1) {
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: space-between;
      padding: 0 10px;
      font-size: 16px;
      > div:nth-child(1) {
        border-left: 5px solid;
        padding-left: 5px;
      }
    }
    .align-items {
      height: 40px;
      display: flex;
      align-items: center;
      > .title {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 10px;
      }
      .carouse-items {
        margin-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
