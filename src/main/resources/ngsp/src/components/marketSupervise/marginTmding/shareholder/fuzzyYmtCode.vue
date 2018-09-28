<!--一码通模糊查询-->
<template>
  <div class='stockCode'>
    <el-col :span='24'>
      <el-select
        style='width: 100%;'
        v-model='ymtCodeData.stockCode'
        filterable
        :clearable='true'
        remote
        reserve-keyword
        default-first-option
        placeholder='一码通相关汉字、代码'
        :remote-method='remoteMethod'
        :loading='loading'
        size='mini'
        @change='setYmtCode'>
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
  import {getYmtStock} from '../../../../service/marketSupervise/index'

  export default {
    props: ['ymtCodeData'],
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
            getYmtStock(query).then((resp) => {
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
      setYmtCode(val) {
        let code = val.split(' ')[0]
        this.$emit('getYmtStockCode', code)
      }
    }
  }
</script>
