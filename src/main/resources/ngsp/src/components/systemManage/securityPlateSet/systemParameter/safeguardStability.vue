
<!-- 维稳 safeguardStability-->
<template>
    <div class="safeguard-stability">
      <self-form-item-component
        :nameProps="`maintain_stability`"
        :originDataProps="originDataProps"
        :formProps="form"></self-form-item-component>
    </div>
</template>

<script>
import selfFormItemComponent from './component/SelfFormItemComponent'
import {getKindData} from '@/service/systemManage'
export default {
  name: 'safeguard-stability',
  props: [],
  components: {
    selfFormItemComponent
  },
  data() {
    return {
      originDataProps: [],
      form: {
        'price_up_down': '',
        'value_index': '',
        'buy_time': '',
        'deep_value_index': '',
        'active_buy_amount': '',
        'active_buy_time': '',
        'buy_amount_bigger': '',
        'HK_big_amount': '',
        'three_tradeDay_price': '',
        'three_tradeDay_exchange_rate': '',
        'three_tradeDay_exchange_rate_total': '',
        'alarm_stock_three_trade_day': '',
        'seconds_apply': '',
        'day_sum': '',
        'day_total': '',
        'minute_sell_amonut_wan': '',
        'stock_sum': '',
        'sh50_up_down_percent': '',
        'no_sh50_up_down_percent': '',
        'net_sell_rank': '',
        'total_net_sell': '',
        'active_sell_amount_bigger': '',
        'active_sell_time': '',
        'sell_amount_bigger': '',
        'sell_time': '',
        'scroll_time_window': ''
      },
      rules: {}
    }
  },
  methods: {
    // 根据一个或多个条件查询系统参数
    ajaxGetKindData() {
      let param = {
        appCode: 'fluct',
        moduleCode: 'maintain_stability'
      }
      getKindData(JSON.stringify(param)).then((res) => {
        if (res) {
          this.originDataProps = res.filter(v => {
            /* 不展示流动性指数计算、期权、沪股通、异股通模块 */
            return (v.itemCode !== 'mobility_index' && v.itemCode !== 'option' && v.itemCode !== 'hu_gu_connect' && v.itemCode !== 'abnormal_stock')
          })
        }
      })
    }
  },
  watch: {
  },
  mounted() {
    this.ajaxGetKindData()
  }
}
</script>

<style lang="less" scoped>
    .safeguard-stability {
      .form-box {
        h5 {
          font-weight: 400;
          padding-left: 20px;
          font-size: 16px;
          margin: 30px 0 15px 0;
          color: #fff;
        }
        &:first-child {
          h5 {
            margin-top: 0
          }
        }
      }

      .saveBtn {
        text-align: right;
        padding: 20px;
      }
    }
</style>
