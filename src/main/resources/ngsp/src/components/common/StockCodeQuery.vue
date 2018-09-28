<!--证券代码组件-->
<template>
  <div class="stockCode">
    <el-col>
      <el-select
        style="width: 100%;"
        class="el-select-width"
        :disabled="commonData.disabled || disabled"
        :clearable="clearable"
        v-model="stockCode"
        filterable
        remote
        collapse-tags
        :multiple="commonData.multiple"
        reserve-keyword
        default-first-option
        placeholder="请输入证券代码"
        v-selectLoadMore="handleLoadSelectMore"
        :remote-method="remoteMethod"
        :loading="loading"
        size="small"
        clearable
        @change="setStockCode"
        @clear="clearCon">
        <!--@visible-change="getCurrentList"-->
        <el-option
          v-for="item in stockCodeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>

<style scoped>

</style>

<script>
  import { stockQuery } from '../../service/analysisTool/productQuery'

  export default {
    name: 'StockCodeQuery',
    props: {
      commonData: {
        type: Object,
        default () {
          return {stockCode: '', disabled: false, multiple: false}
        }
      },
      clearable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        loading: true,
        // stockCode: '',
        stockCodeType: '',
        stockSubType: '',
        shortCode: '',
        stockCodeOptions: [],
        stockCodeList: [],
        stockQueryRes: [],
        pageIndex: 1, // 当前页
        pageSize: 20, // 每页显示数量
        query: '', // 模糊查询输入值
        loadMore: true, // 加载开关
        currentSelectList: [],
        selectStockCodeOptions: []
      }
    },
    computed: {
      stockCode: {
        get: function () {
          return this.commonData.stockCode
        },
        set: function (newVal) {
          this.commonData.stockCode = newVal
        }
      }
    },
    mounted () {
      this.query = ''
      this.remoteMethod(this.query)
    },
    methods: {
      handleUniqe () {
        if (this.commonData.stockCode) {
          this.currentSelectList = [{value: this.commonData.stockCode, label: this.commonData.stockCode}]
          if (!$.isEmptyObject(this.currentSelectList)) {
            for (let j = 0; j < this.stockCodeOptions.length; j++) {
              if (this.stockCodeOptions[j].value === this.currentSelectList[0].value) {
                this.stockCodeOptions.splice(j, 1)
              }
            }
            this.stockCodeOptions = this.currentSelectList.concat(this.stockCodeOptions)
          }
        }
      },
      remoteMethod (query) {
        this.query = query
        this.loading = true
        this.loadMore = true
        this.stockCodeOptions = []
        this.pageIndex = 1
        this.getRes(query, this.pageIndex, this.pageSize)
      },
      getRes (query, pageIndex, pageRows) {
        if (!this.commonData.secSubTypecode) {
          this.commonData.secSubTypecode = ''
        }
        if (this.loadMore) {
          stockQuery(query, this.commonData.secSubTypecode, pageIndex, pageRows).then((resp) => {
            // 如果返回结果为空，则说明数据已加载完毕，加载开关置为false
            if ($.isEmptyObject(resp)) {
              this.loadMore = false
              if (pageIndex == 1) {
                this.loading = false
                this.stockCodeOptions = []
              }
            } else {
              this.stockQueryRes = resp
              this.loading = false
              for (var item of this.stockQueryRes) {
                var objVal = {
                  value: item.security_id + ' ' + item.security_chn_short_name,
                  label: item.security_id + ' ' + item.security_chn_short_name,
                  type: item.security_type_code,
                  code: item.isin_code,
                  stockSubType: item.security_sub_type_code // 区分A股，B股
                }
                this.stockCodeList.push(objVal)
              }
              if (pageIndex === 1) {
                this.stockCodeOptions = this.stockCodeList
                if (this.commonData.flag) {
                  this.stockCodeOptions.unshift({'value': '全部', 'label': '全部'})
                }
              } else {
                this.stockCodeOptions = this.stockCodeOptions.concat(this.stockCodeList)
              }
              this.stockCodeList = []
            }
          })
        }
      },
      // 懒加载
      handleLoadSelectMore () {
        this.pageIndex += 1
        let pageIndex = this.pageIndex,
          query = this.query,
          pageRows = this.pageSize
        this.getRes(query, pageIndex, pageRows)
      },
      setStockCode (val) {
        this.stockCodeOptions.forEach(item => {
          if (item.value === val) {
            this.stockCodeType = item.type
            this.shortCode = item.code
            this.stockSubType = item.stockSubType

          }
        })
        if (this.stockCodeOptions.length !== 0) {
          this.$emit('getStockCode', this.stockCode, this.stockCodeType, this.shortCode, this.stockSubType)
        } else {
          this.$emit('getStockCode', null, null, null)
        }
      },
      clearCon () {
        this.stockCode = ''
        this.$emit('getStockCode', null)
      }
    }
  }
</script>
<style lang="less" scoped>
  .stockCode {
    /deep/.el-select__tags {
      display: flex;
      >span {
        flex: 2;
        min-width: 170px;
      }
      >input.el-select__input {
        display: inline-block;
        flex: 1;
      }
    }
    /*/deep/.el-select{*/
      /*/deep/.el-input__icon:before{*/
        /*content: "\E605";*/
      /*}*/
    /*}*/
  }
</style>
