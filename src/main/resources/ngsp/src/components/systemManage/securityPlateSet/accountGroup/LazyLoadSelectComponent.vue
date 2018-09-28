<!--证券代码select懒加载公共组件-->
<template>
  <div class="lazyLoadSelect">
    <el-select
      ref="lazyLoadSelectRef"
      style="display:inline-block;"
      :clearable="true"
      v-model="selectModel"
      :loading="loading"
      size="small"
      @change="handleSelect"
      placeholder="请选择证券代码"
      v-selectLoadMore="handleLoadSelectMore">
      <el-option
        v-for="(item,index) in lazyLoadSelectOptions"
        :key="index"
        :label="item[labelProps]"
        :value="item[valueProps]">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {
    postSecurityCodeAddInAmend
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'lazyLoadSelectComponent',
    props: {
      labelProps: {
        type: String,
        default: ''
      },
      valueProps: {
        type: String,
        default: ''
      },
      selectModelProps: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        pageIndex: 1, // 当前页
        pageRows: 10, // 每页显示数量
        loading: false,
        selectModel: '',
        lazyLoadSelectOptions: []
      }
    },
    watch: {
      selectModelProps (newValue) {
        this.selectModel = newValue
      }
    },
    computed: {},
    methods: {
      // select控件懒加载事件
      handleLoadSelectMore () {
        // 否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
        this.pageIndex += 1
        this.getOptions()
      },
      getOptions () {
        this.loading = true
        let params = {
          pageRows: this.pageRows || 10,
          pageIndex: this.pageIndex || 1
        }
        setTimeout(() => {
          postSecurityCodeAddInAmend(JSON.stringify(params)).then((resp) => {
            this.loading = false
            if (resp) {
              const {buzidata} = resp
              if (params.pageIndex === 1) {
                this.lazyLoadSelectOptions = buzidata
              } else {
                this.lazyLoadSelectOptions = this.lazyLoadSelectOptions.concat(buzidata)
              }
            } else {
              this.lazyLoadSelectOptions = []
            }
          })
        }, 200)
      },
      handleSelect (item) {
        this.$emit('updateSelectModel', item)
      }
    },
    mounted () {
      this.selectModel = this.selectModelProps
    }
  }
</script>
<style lang="less" scoped>
  .lazyLoadSelect {
    .el-col {
      /deep/ .el-select {
        /deep/ .el-input {
          width: 100%;
        }
      }
    }

  }
</style>
