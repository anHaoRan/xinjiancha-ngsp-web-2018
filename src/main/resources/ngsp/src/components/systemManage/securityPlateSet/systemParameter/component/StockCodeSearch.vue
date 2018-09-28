
<!--证券代码组件-->
<template>
  <div class="stockCode">
    <el-col :span="6" style="width:150px;font-size:15px;">请输入证券代码</el-col>
    <el-col :span="10">
      <el-select
        ref="selectRef"
        style="display:inline-block"
        class="el-select-width"
        :clearable="true"
        v-model="stockCode"
        filterable
        remote
        reserve-keyword
        default-first-option
        placeholder="请输入证券代码"
        :remote-method="remoteMethod"
        :loading="loading"
        size="small"
        @keyup.enter.native.stop.prevent="addNewStockCode"
        @change="handleSelect">
        <el-option v-for="(item,index) in stockCodeOptions"
                   :key="index"
                   :label="`${item.security_chn_short_name}${item.security_id}`"
                   :value="item.security_id">
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  searchStockCodeListByCharsAndSubTypeCode,
  searchStock,
  updateBoardStockList
} from '@/service/systemManage/securityPlateSet'

export default {
  name: 'StockCodeSearch',
  props: {
    hasEnterEvent: {
      type: Boolean,
      default: false
    },
    currentDialogName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['getcurrentBoardCode'])
  },
  data() {
    return {
      loading: true,
      stockCode: '',
      stockCodeOptions: [],
      searchedTags: []
    }
  },
  methods: {
    getOptions(query) {
      this.loading = true;
      setTimeout(() => {
        let params = {
          fuzzyChars: query,
          secSubTypecode: ''
        }
        searchStockCodeListByCharsAndSubTypeCode(params).then((resp) => {
          this.loading = false;
          this.stockCodeOptions = resp
        })
      }, 200)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.getOptions(query)
      } else {
        this.stockCodeOptions = [];
      }
    },
    handleSelect (item) {
      let boardCode = this.getcurrentBoardCode
      if (!boardCode) {
        this.$message.error('请先选择一个板块')
        return
      }
      if (item === '') {
        return
      }
      let params = {
        boardCode: boardCode,
        instrumentId: item
      }
      let filterItem = this.stockCodeOptions.filter(v => {
        return v.security_id === item
      })
      /* 解决字段不一致的问题 */
      filterItem[0].instrument_id = filterItem[0].security_id
      filterItem[0].instrument_chn_short_name = filterItem[0].security_chn_short_name
      this.$emit('fazzySearchSelectItem', filterItem)
      if (this.hasEnterEvent) {
        this.$emit('showLoading', true)
        searchStock(params).then(resp => {
          this.$emit('showLoading', false)
          if (resp) {
            this.searchedTags = resp
            this.$emit('updateSelectTags', resp)
          } else {
            this.searchedTags = []
            this.$emit('updateSelectTags', [])
          }
        })
      }
    },
    addNewStockCode() {
      if (!this.hasEnterEvent) {
        return
      }
      this.$refs['selectRef'].blur()
      if (this.stockCode && this.searchedTags.length === 0) {
        let params = {
          boardCode: this.getcurrentBoardCode,
          instrumentId: this.stockCode
        }
        updateBoardStockList(params).then(resp => {
          if (resp) {
            this.$message.success('新增证券代码成功')
            this.stockCode = ''
            this.$emit('ajaxTagList')
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
  .stockCode {
    .el-col {
      /deep/ .el-select {
        /deep/ .el-input {
          width: 100%;
        }
      }
    }
  }
</style>
