<template>
  <div class="otherAccount"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card style="max-height: 350px;overflow: auto">
      <div slot="header">
        {{ccrc}}下的其它账户
      </div>
      <el-row :gutter="30" class="btnStyle">
        <el-col :span="12" v-for='(item,index) in options' :key='index'>
          <el-button type="text" size="small" @click="switchAccount(item)">{{item}}</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'

  export default {
    components: {},
    data() {
      return {
        ccrc: '',
        options: [],
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
          this.ccrc = this.resultData.ccrcAcct.ccrc
          this.options = this.resultData.ccrcAcct.otherAcctSeq
        } else {
          this.ccrc = ''
          this.options = []
        }
      },
      switchAccount(val) {
        this.$emit('getAccount', val)
      }
    }
  }
</script>

<style lang="less">
  .otherAccount {
    .btnStyle {
      > div {
        padding: 15px;
        text-align: center;
      }
    }
  }
</style>
