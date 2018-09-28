<template>
  <div class="accountPic"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        账户头像
      </div>
      <div style="text-align: center">
        <img class="userPic" v-if="flag == 'A'?true:false" src="../../../assets/images/user.png"/>
        <img class="userPic" v-if="flag == 'G'?true:false" src="../../../assets/images/company.png"/>
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
        flag: '',
        loading: true,
        result: {}
      }
    },
    props: ['accountId', 'resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   console.log(this.$store.state.investorPicture.ccrcAcct);
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
          this.flag = this.resultData.ccrcAcct.singleFlag
        } else {
          this.flag = ''
        }
      }
    }
  }
</script>

<style lang="less">
  .accountPic {
    .userPic {
      width: 150px;
    }
  }
</style>
