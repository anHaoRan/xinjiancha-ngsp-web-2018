<!--股票代码模糊查询-->
<template>
  <div class='stockCode'>
    <el-col :span='24'>
      <el-select
        style='width: 100%;'
        v-model='stockCodeData.stockCode'
        filterable
        :clearable='true'
        remote
        reserve-keyword
        default-first-option
        placeholder='股票相关汉字、代码'
        :remote-method='remoteMethod'
        :loading='loading'
        size='mini'
        @change='setStockCode'>
        <el-option
          v-for='item in stockCodeOptions'
          :key='item.value'
          :label='item.label'
          :value='item.value'>
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>

<style scoped>

</style>

<script>
  import {getStock} from '../../../../service/marketSupervise/index'

  export default {
    props: ['stockCodeData'],
    data() {
      return {
        loading: true,
        stockCodeOptions: [],
        stockCodeList: [],
        stockQueryRes: []
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            getStock(query).then((resp) => {
              this.loading = false;
              this.stockCodeList = [];
              resp.forEach((el) => {
                var objVal = {
                  value: el.value,
                  label: el.value
                }
                this.stockCodeList.push(objVal)
              })
              this.stockCodeOptions = this.stockCodeList;
            })
          }, 200)
        } else {
          this.stockCodeOptions = [];
        }
      },
      setStockCode(val) {
        let code = val.split(' ')[0]
        this.$emit('getStockCode', code)
      }
    }
  }
</script>
