<template>
  <div class='order-or-credit-type'>
    <el-select
        v-model="value"
        :disabled="isDisabled"
        style="width:260px"
        multiple
        clearable
        collapse-tags
        placeholder="请选择订单类型(可选多项)"
        size="small"
        @change="orderChange">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.text"
          :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { linkNo } from '../../../../service/analysisTool/productQuery'

  export default {
    name: 'order-or-credit-type',
    props: {
      stationVal:{
        type:String,
        default(){
          return '1'
        }
      },
      type:{
        type:String,
        default(){
          return 'order'
        }
      }
    },

    components: {},
    mixins: [],
    data () {
      return {
        value: ['ALL'],
        options: [
          {
            value: 'ALL',
            text: '全选'
          }
        ]
      }
    },
    computed: {
      isDisabled () {
        return this.stationVal !== '1'
      }
    },
    watch: {
      isDisabled (newVal) {
        if (newVal) {
          this.value = ['ALL']
          this.$emit('getOrderOrCreditTypeVal', this.value)
        }
      }
    },
    methods: {
      orderChange (val) {
        if (val.includes('ALL')) {
          if (val[0] === 'ALL' && val.length === 2) {
            this.$message.info('请先取消全选')
          }
          this.value = ['ALL']
        } else {
          this.value = [...val]
        }
        this.$emit('getOrderOrCreditTypeVal', this.value)
      },
      clear(){
        this.value = ['ALL']
        this.$emit('getOrderOrCreditTypeVal', this.value)
      }
    },
    created () {
      this.options=this.options.concat(this.$store.state.productQuery[`${this.type}Options`])
    },
    mounted () {
      this.$emit('getOrderOrCreditTypeVal', this.value)
    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
  .order-or-credit-type {

  }
</style>