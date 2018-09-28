
<!--
 添加股东账户插件  上传数据类型 ：
 `
 HT12345678
 HT12345678
 HT12345678
 HT12345678
 `
 传出数据类型 数组 ["HT12345678", "HT12345678"]
-->
<template>
  <div class="input-add-pull-down-tool">
    <div class="show-stock-account">
      <el-input type="textarea" :rows="settings.rows || 5"
                :disabled="settings.isDisabled"
                :placeholder="settings.placeholder || '请上传账户代码'"
                v-model="textInfo" @blur="getData"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textInfo: ''
    }
  },
  props: {
    settings: {}
  },
  watch: {
    'settings.list': {
      handler: 'watchList',
      immediate: true
    }
  },
  methods: {
    watchList() {
      if (this.settings.clearHistoryList) {
        this.textInfo = ''
      }
      if (this.settings.list.length > 0) {
        let temp = '', listArr = []
        this.textInfo ? listArr = [...this.textInfo.split('\n'), ...this.settings.list] : listArr = [...this.settings.list]
        listArr.map((item) => {
          if (item) {
            temp += `${item}\n`
          }
        })
        this.textInfo = temp
        this.$emit('throwData', [...new Set(listArr)])
      } else {
        this.textInfo = ''
      }
    },
    getData() {
      let array = this.textInfo.split('\n')
      array = array.filter(v => {
        return v !== ''
      })
      this.$emit('throwData', [...new Set(array)])
    }
  }
}
</script>

<style lang="less">
  .input-add-pull-down-tool {
    z-index: 9;
    position: relative;
    .show-stock-account{
      /*padding: 6px;*/
      /*border-radius: 4px;*/
      /*border: 1px solid #455579;*/
      textarea {
        font-size: 14px;
        padding: 6px;
        outline: none;
        background: transparent;
        border: none;
        color: #7b8fb9;
        width: 97%;
        resize: none;
      }
    }
  }

</style>
