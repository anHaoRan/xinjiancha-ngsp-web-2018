<template>
  <div class="companyAccount"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        上市公司相关账户
      </div>
      <div style="height: 300px">
        <el-steps direction="vertical" :active="1" v-if="isShow">
          <el-step :title="directorinfo.title" :description="directorinfo.description"></el-step>
          <el-step :title="majorHolders.title" :description="majorHolders.description"></el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'

  export default {
    components: {},
    data() {
      return {
        directorinfo: {},
        majorHolders: {},
        isShow: false,
        loading: true
      }
    },
    props: ['accountId', 'resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   this.getChartData()
      // },
      resultData: {
        handler: function (param1, param2) {
          this.initData()
        },
        deep: true
      },
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          this.loading = false
          let res = this.resultData.majorHolder
          this.isShow = true
          if (res.director_info[0]) {
            this.directorinfo.title = res.director_info[0].effTime + ' ' + res.director_info[0].subTitle
            this.directorinfo.description = res.director_info[0].code + ' ' + res.director_info[0].name + ' ' + res.director_info[0].desc
          } else {
            this.directorinfo.title = ''
            this.directorinfo.description = ''
          }
          if (res.majorHolders[0]) {
            this.majorHolders.title = res.majorHolders[0].effTime + ' ' + res.majorHolders[0].subTitle
            this.majorHolders.description = res.majorHolders[0].code + ' ' + res.majorHolders[0].name + ' ' + res.majorHolders[0].desc
          } else {
            this.majorHolders.title = ''
            this.majorHolders.description = ''
          }
        } else {
          this.directorinfo.title = ''
          this.directorinfo.description = ''
          this.majorHolders.title = ''
          this.majorHolders.description = ''
        }
      },
      getChartData() {
        this.loading = true
        let params = {
          key: JSON.stringify({accountId: this.accountId}),
          method: 'majorHolder'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp
          this.isShow = true
          if (res.directorinfo[0]) {
            this.directorinfo.title = res.directorinfo[0].effTime + ' ' + res.directorinfo[0].subTitle
            this.directorinfo.description = res.directorinfo[0].code + ' ' + res.directorinfo[0].name + ' ' + res.directorinfo[0].desc
          } else {
            this.directorinfo.title = ''
            this.directorinfo.description = ''
          }
          if (res.majorHolders[0]) {
            this.majorHolders.title = res.majorHolders[0].effTime + ' ' + res.majorHolders[0].subTitle
            this.majorHolders.description = res.majorHolders[0].code + ' ' + res.majorHolders[0].name + ' ' + res.majorHolders[0].desc
          } else {
            this.majorHolders.title = ''
            this.majorHolders.description = ''
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .companyAccount {
    .el-step__title {
      font-size: 14px;
    }
    .el-step__description {
      font-size: 16px;
    }
    .el-step__title.is-process {
      font-weight: 400;
      color: #fff
    }
    .el-step__description.is-process {
      color: #fff
    }
  }

</style>
