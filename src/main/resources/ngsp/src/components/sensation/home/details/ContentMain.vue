<template>
    <div class="content-main">
        <el-card>
            <div slot="header" class="clearfix">
                <span>热度趋势图({{relatedCompant.length}})</span>
            </div>
            <related-compant-item v-for="(item,index) in newRelatedCompant" :key="index"
                                  :isinCode="item.isinCode"></related-compant-item>
            <div style="text-align: center">
                <el-button type="info" :icon="isActive?'el-icon-arrow-up':'el-icon-arrow-down'"
                           @click="isActive= !isActive"></el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: 'content-main',
    props: [],
    components: {
      RelatedCompantItem: () => import('./components/RelatedCompantItem')
    },
    mixins: [],
    data () {
      return {
        isActive: false,
        relatedCompant: [
          {
            isinCode: '600004',
          },
          {
            isinCode: '600030',
          },
          {
            isinCode: '600030',
          },
          {
            isinCode: '600030',
          }
        ]
      }
    },
    computed: {
      newRelatedCompant () {
        let arr = []
        if (this.isActive) {
          arr = this.relatedCompant
        } else {
          arr = this.relatedCompant.slice(0, 2)
        }
        return arr
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .content-main {
    }
</style>