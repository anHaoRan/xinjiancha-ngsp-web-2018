<template>
  <div class='clearfix broker'>
    <el-col>
      <div class='itemList'>
        <div class='item'>
          <div>
            <h2>{{this.gfnFormatThousands(result.rzye)}}  亿元</h2>
            <p>融资余额</p>
          </div>
          <div>
            <h2 :class="this.gfnFormatSecurityClass(result.rzye_margin)">{{this.gfnFormatThousands(result.rzye_margin)}}  亿元</h2>
            <p>增减</p>
          </div>
        </div>
        <div class='item'>
          <div>
            <h2>{{this.gfnFormatThousands(result.rqyl)}}  亿元</h2>
            <p>融券余额</p>
          </div>
          <div>
            <h2 :class="this.gfnFormatSecurityClass(result.rqyl_margin)">{{this.gfnFormatThousands(result.rqyl_margin)}}  亿元</h2>
            <p>增减</p>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
  export default {
    props: ['result']
  }
</script>

<style scoped lang='less'>
  .clearfix:after {
    content: '';
    display: block;
    height: 0px;
    clear: both;
  }

  .broker {
    height: 300px;
    padding-top: 20px;
    line-height: 1;
    .itemList {
      display: flex;
      justify-content: space-between;
      margin: 20px 0px;
      .item {
        align-items: center;
        margin-bottom: 25px;
        div {
          padding: 15px 0;

          h2 {
            color: rgba(255, 255, 255, 1);
            font-weight: 400;
            font-size: 26px;
            line-height: 36px;
            margin: 0;
          }

          p {
            line-height: 1;
            margin: 0;
          }
        }
      }
    }
  }
</style>
