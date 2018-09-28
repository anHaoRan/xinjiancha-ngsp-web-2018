<template>
  <div class="clearfix" style="padding-top: 18px;">
    <el-col>
      <div v-for="(item,index) in dataList" :key="index" class="itemList">
        <div>
          <span>{{item.SECNAME}}</span>
          <span class="percent">{{item.AMPLITUDE.replace('%', '')}}</span>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
  import {getThreeIndexData} from '../../../service/marketSupervise/waveMonitor/index'

  export default {
    data() {
      return {
        timer: null,
        refreshTime: 60 * 1000,
        dataList: []
      }
    },
    mounted() {
      this.getData()
    },
    beforeDestroy() {
      if (this.timer != '') {
        clearTimeout(this.timer)
      }
    },
    methods: {
      getData() {
        getThreeIndexData().then(resp => {
          this.dataList = resp
          let that = this
          this.timer = setTimeout(function () {
            that.getData()
          }, that.refreshTime)
        })
      }
    }
  }
</script>
<style lang="less" scoped>

  .clearfix:after {
    content: "";
    display: block;
    height: 0px;
    clear: both;
  }

  .itemList {
    margin: 5px 0px;
    background: rgba(0, 0, 0, 0.15);
    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }

    div {
      padding: 15px 50px;
      line-height: 2.5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 16px;

        &.percent {
          font-size: 22px;
          color: orange;

          &::after {
            content: '%';
            font-size: 14px;
          }
        }
      }
    }
  }

</style>
