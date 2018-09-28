
<!--证券代码 手工输入多个展示在textarea，且用户可修改-->
<template>
  <div class="aggregate-query-stock-code">
    <el-col :span="24">
      <el-select
        style="width: 100%;"
        class="el-select-width"
        :disabled="commonData.disabled"
        :clearable="clearable"
        v-model="commonData.stockCode"
        filterable
        remote
        reserve-keyword
        default-first-option
        :placeholder="commonData.placeholder || '请输入证券代码'"
        :remote-method="remoteMethod"
        :loading="loading"
        size="small"
        @change="setStockCode"
        v-selectLoadMore="handleLoadSelectMore"
        @clear="clearCon">
        <el-option
          v-for="item in stockCodeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.label">
        </el-option>
      </el-select>
      <div class="textarea-container">
        <textarea :rows="commonData.rows || 5" :placeholder="commonData.placeholder || '请输入证券代码'"  v-model="secCodes" @blur="getData"></textarea>
      </div>
    </el-col>
  </div>
</template>

<script>
import { stockQuery } from '../../../../service/analysisTool/productQuery'
export default {
  name: 'StockCodeQuery',
  props: {
    commonData: {type: Object},
    clearable: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data() {
    return {
      secCodes: '',
      loading: true,
      stockCodeOptions: [],
      stockCodeList: [],
      stockQueryRes: [],
      pageIndex: 1, // 当前页
      pageSize: 20, // 每页显示数量
      query: '', // 模糊查询输入值
      loadMore: true // 加载开关
    }
  },
  watch: {
    'commonData.list'() {
      if (this.commonData.list.length > 0) {
        let temp = '', listArr = []
        this.secCodes ? listArr = [...this.secCodes.split('\n'), ...this.commonData.list] : listArr = [...this.commonData.list]
        listArr.map((item) => {
          if (item) {
            temp += `${item}\n`
          }
        })
        this.secCodes = temp
      } else {
        this.secCodes = ''
      }
      this.$emit('getStockCode', [...new Set(this.secCodes.split('\n'))].join(','), this.commonData.stockCode, this.stockCodeOptions[0])
    }
  },
  methods: {
    clearCon() {
      this.commonData.stockCode = ''
    },
    // 懒加载
    handleLoadSelectMore() {
      this.pageIndex += 1
      let pageIndex = this.pageIndex,
        query = this.query,
        pageRows = this.pageSize
      this.getRes(query, pageIndex, pageRows)
    },
    getData() {
      let array = this.secCodes.split('\n')
      array = array.filter(v => {
        return v !== ''
      })
      this.$emit('getStockCode', [...new Set(array)].join(','), this.commonData.stockCode, this.stockCodeOptions[0])
    },
    remoteMethod (query) {
      this.query = query
      if (query !== '') {
        this.loading = true
        if (!this.commonData.secSubTypecode) {
          this.commonData.secSubTypecode = ''
        }

        this.loadMore = true
        this.pageIndex = 1
        this.getRes(query, this.pageIndex, this.pageSize)
      } else {
        this.stockCodeOptions = []
      }
    },
    getRes(query, pageIndex, pageRows) {
      if (!this.commonData.secSubTypecode) {
        this.commonData.secSubTypecode = ''
      }
      if (this.loadMore) {
        setTimeout(() => {
          stockQuery(query, this.commonData.secSubTypecode, pageIndex, pageRows).then((resp) => {
            // 如果返回结果为空，则说明数据已加载完毕，加载开关置为false
            if ($.isEmptyObject(resp)) {
              this.loadMore = false
              return
            }
            this.stockQueryRes = resp;
            this.stockCodeList = [];
            this.loading = false;
            for (let item of this.stockQueryRes) {
              let objVal = {
                value: item.security_id + ' ' + item.security_chn_short_name,
                label: item.security_id + ' ' + item.security_chn_short_name,
                type: item.security_type_code,
                code: item.isin_code,
                stockSubType: item.security_sub_type_code // 区分A股，B股
              }
              this.stockCodeList.push(objVal);
            }
            if (this.pageIndex === 1) {
              this.stockCodeOptions = this.stockCodeList;
            } else {
              this.stockCodeOptions = this.stockCodeOptions.concat(this.stockCodeList)
            }
          })
        }, 200)
      }
    },
    setStockCode () {
      if (this.secCodes !== '' && this.secCodes[this.secCodes.length - 1] !== '\n') {
        this.secCodes = this.secCodes + '\n'
      }
      if (this.commonData.stockCode) {
        this.secCodes += `${this.commonData.stockCode.split(' ')[0]}\n`
      }
      if (this.stockCodeOptions.length !== 0) {
        this.$emit('getStockCode', [...new Set(this.secCodes.split('\n'))].join(','), this.commonData.stockCode, this.stockCodeOptions[0])
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .aggregate-query-stock-code {
    .textarea-container {
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #455579;
      textarea {
        padding: 6px;
        outline: none;
        background: transparent;
        border: none;
        color: #7b8fb9;
        width: 91%;
        resize: none;
      }
    }
  }
</style>
