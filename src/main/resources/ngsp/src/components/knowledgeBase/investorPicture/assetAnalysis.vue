<template>
  <div class="assetAnalysis"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        沪深资产分类
      </div>
      <p class="titleWord">{{assetCategory}}</p>
      <p>{{maxAsset}}</p>
      <p>{{maxAssetSh}}</p>
      <p>{{address}}</p>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'

  export default {
    components: {},
    data() {
      return {
        maxAsset: '',
        maxAssetSh: '',
        assetCategory: '',
        address: '',
        loading: true
      }
    },
    props: ['accountId', 'resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   this.getData()
      // },
      resultData: {
        handler: function (param1, param2) {
          this.getData()
        },
        deep: true
      },
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          this.loading = false
          if (this.resultData.latestMaxAsset.assetCategory) {
            this.assetCategory = this.resultData.latestMaxAsset.assetCategory
          } else {
            this.assetCategory = ''
          }
          if (this.resultData.latestMaxAsset.maxAssetSh) {
            this.maxAssetSh = '沪市最大资产：' + this.resultData.latestMaxAsset.maxAssetSh
          } else {
            this.maxAssetSh = ''
          }
          if (this.resultData.latestMaxAsset.maxAsset) {
            this.maxAsset = '沪深最大资产：' + this.resultData.latestMaxAsset.maxAsset
          } else {
            this.maxAsset = ''
          }
          if (this.resultData.latestTradeBranch.branch) {
            this.address = this.resultData.latestTradeBranch.branch + this.resultData.latestTradeBranch.region
          } else {
            this.address = ''
          }
        } else {
          this.assetCategory = ''
          this.maxAssetSh = ''
          this.maxAsset = ''
          this.address = ''
        }
      }
    }
  }
</script>

<style lang="less">
  .assetAnalysis {
    .titleWord {
      color: #17c4bb;
      font-size: 18px;
    }
  }
</style>
