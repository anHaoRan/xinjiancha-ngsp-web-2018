<template>
  <div class="clearfix credit">
    <el-col>
      <div class="itemList">
        <div class="item">
          <div>
            <h2>{{this.gfnFormatThousands(result.buy)}}  亿元</h2>
            <p>信用账户买入</p>
          </div>
          <div>
            <h2>{{this.gfnFormatThousands(result.sale)}}  亿元</h2>
            <p>信用账户卖出</p>
          </div>
          <div>
            <h2 :class="this.gfnFormatSecurityClass(result.margin)">{{this.gfnFormatThousands(result.margin)}}  亿元</h2>
            <p>净额</p>
          </div>
        </div>
        <div class="item">
          <div>
            <h2>{{this.gfnFormatThousands(result.total)}}  亿元</h2>
            <p>成交金额</p>
          </div>
          <div>
            <h2>{{result.market_proportion}}%</h2>
            <p>市场占比%</p>
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

<style scoped lang="less">
  .clearfix:after {
    content: "";
    display: block;
    height: 0px;
    clear: both;
  }

  .credit {
    padding-top: 20px;
    line-height: 1;
    .itemList {
      margin: 10px 0px;
      .net-amount {
        float: right;
        h2 {
          color: #aed581 !important;
        }
      }
      display: flex;
      justify-content: space-between;
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
