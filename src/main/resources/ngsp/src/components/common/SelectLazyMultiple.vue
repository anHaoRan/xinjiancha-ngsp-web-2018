<template>
  <div :style="'width:'+(selectParams.particLevelType==='pbu'?'260px':(selectParams.particLevelType==='salePart'?'450px':(selectParams.particLevelType==='stockCode'?'auto':'400px')))"
       class="selectLazyMultiple">
    <el-select
      ref="selectLazyMultipleCon"
      v-model="selectParams.selectStockCodeVal"
      placeholder="请选择"
      filterable
      multiple
      remote
      :reserve-keyword="false"
      default-first-option
      collapse-tags
      :disabled="disabled"
      :remote-method="remoteMethod"
      :loading="selectParams.loading"
      @visible-change="getCurrentList"
      @change="handleSelectChange"
      v-selectLoadMore="handleLoadSelectMore"
      size="small"
      style="width: 100%">
      <el-option v-for="item in selectStockCodeOptions" :key="item.value" :label="item.label" :value="item.value">
        <el-checkbox :label="item.value" style="display: block;" v-model="selectParams.selectCheckboxValue" @change="getSelectList">
          {{item.label}}
        </el-checkbox>
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {
    commonSelect, getStockSelectOption, stockQuery
  } from '@/service/analysisTool/productQuery'

  export default {
    name: 'select-lazy-multiple',
    data () {
      return {
        // 下拉项
        selectStockCodeOptions: [],
        // 复选项val组成的数组
        selectCheckboxValue: [],
        // 当前选中项的label组成的数组
        selectNameArr: [],
        // 当前选中项
        currentSelectList: [],
        // 返回模糊查询结果
        stockQueryRes: [],
        // 将模糊查询结果处理成所需要的数据格式
        stockCodeList: [],
        // 上传的文件内容
        uploadCon: '',
        // 当前页
        pageIndex: 1,
        // 每页显示数量
        pageSize: 20,
        // 模糊查询输入值
        query: ''
      }
    },
    props: {
      selectParams: {
        type: Object,
        deep: true
      },
      disabled: {
        type: Boolean,
        default () {
          return false
        }
      },
      // 需要清空重置选择时传值，每次清空时clearFlag自增改变触发watch
      clearFlag: {
        type: Number,
        default: function () {
          return 1
        }
      }
    },
    watch: {
      // 监听传入的类型变化，初始化数据
      'selectParams.particLevelType': function () {
        this.resetAll()
      },
      // 监听清空重置事件，清空选择项
      clearFlag: {
        handler: function (param1, param2) {
          this.selectParams.selectStockCodeVal = []
          this.selectParams.selectStockCodeOptions = []
          this.selectParams.selectCheckboxValue = []
        },
        deep: true
      }
    },
    mounted () {
    },
    methods: {
      resetAll () {
        this.query = ''
        this.selectStockCodeOptions = []
        this.selectNameArr = []
        this.stockQueryRes = []
        this.stockCodeList = []
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
        this.currentSelectList = []
      },
      // 下拉初始选项
      getCurrentList (val) {
        if (val) {
          this.query = ''
          this.remoteMethod(this.query)
          if (!$.isEmptyObject(this.currentSelectList)) {
            for (let i = 0; i < this.currentSelectList.length; i++) {
              for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
                if (this.selectStockCodeOptions[j].value === this.currentSelectList[i].value) {
                  this.selectStockCodeOptions.splice(j, 1)
                }
              }
            }
            this.selectStockCodeOptions = this.currentSelectList.concat(this.selectStockCodeOptions)
          }
        }
      },
      // 模糊查询方法
      remoteMethod (query) {
        this.query = query
        this.selectParams.loading = true
        let that = this
        // 类型为营业部、券商、pbu时从后台取数据方法
        let getData = (level, query) => {
          let pageIndex = 1, pageSize = 20
          that.pageIndex = 1
          that.getSelectOptionCon(level, query, pageIndex, pageSize)
        }
        // 类型为证券代码时从后台取数据方法
        let getStockCodeData = (query) => {
          that.pageIndex = 1
          that.getStockCodeOptionCon(query)
        }
        switch (this.selectParams.particLevelType) {
          case 'salePart':
            getData('salePart', query)
            break
          case 'pbu':
            getData('pbu', query)
            break
          case 'member':
            getData('member', query)
            break
          case 'stockCode':
            getStockCodeData(query)
        }
      },
      // 封装的当类型为营业部、券商、pbu时从后台取数据的方法
      getSelectOptionCon (level, query, pageIndex, pageSize) {
        let that = this
        // 公共接口
        commonSelect(level, query, pageIndex, pageSize).then((resp) => {
          that.stockQueryRes = resp
          that.selectParams.loading = false
          // 将当前已选项与返回结果做对比，如果返回结果中包含已选项，将返回结果中的该项删除
          let curArr = that.currentSelectList
          if (!$.isEmptyObject(curArr)) {
            curArr.forEach((item) => {
              that.stockQueryRes.forEach((nape, index) => {
                if (item.value === nape.partici_id) {
                  that.stockQueryRes.splice(index, 1)
                }
              })
            })
          }
          // 将返回结果处理成[{value:'',label:''},...]格式
          that.stockCodeList = that.stockQueryRes.map(item => {
            return {
              value: item.partici_id,
              label: item.partici_name
            }
          })
          // 如果当前页是第一页，则进行以下逻辑判断
          if (pageIndex === 1) {
            that.stockCodeList = curArr.concat(that.stockCodeList)
            that.selectStockCodeOptions = []
            // 将处理结果赋给控件下拉列表绑定值
            that.selectStockCodeOptions = that.stockCodeList
          } else {
            //  如果当前页不是第一页，将返回结果进行格式化处理后拼接到当前下拉列表数组后
            that.selectStockCodeOptions = that.selectStockCodeOptions.concat(that.stockCodeList)
          }
          //  将返回值暂存变量置空
          that.stockCodeList = []
        })
      },
      // 证券代码上传txt文件后，将txt文件内容作为查询条件发往后台并获取返回结果
      getUploadSelectOptionCon (securityCodes) {
        this.uploadCon = securityCodes
        let pageIndex = this.pageIndex, pageSize = this.pageSize, that = this
        getStockSelectOption(securityCodes, pageIndex, pageSize).then(resp => {
          this.stockCodeList = resp.map(function (item) {
            return {
              label: item.security_id + ' ' + item.security_chn_short_name,
              value: item.security_id,
              flag: item.sel_status
            }
          })
          // 如果当前页为首页，通过每一项的flag判定其是否被选中
          if (pageIndex === 1) {
            this.selectStockCodeOptions = this.stockCodeList
            this.selectStockCodeOptions.forEach(function (item) {
              if (item.flag === '1') {
                that.selectParams.selectCheckboxValue.push(item.value)
              }
            })
            let newArr = []
            this.selectParams.selectCheckboxValue.forEach(item => {
              if (!newArr.includes(item)) {
                newArr.push(item)
              }
            })
            this.selectParams.selectCheckboxValue = newArr
            this.selectParams.selectStockCodeVal = newArr
            this.getSelectList(this.selectParams.selectCheckboxValue)
          } else {
            // 如果当前页不是首页，将暂存的列表项拼接到当前列表项数组后面
            this.selectStockCodeOptions = this.selectStockCodeOptions.concat(this.stockCodeList)
          }
          this.stockCodeList = []
        })
      },
      // 证券代码模糊查询方法
      getStockCodeOptionCon (query) {
        let pageIndex = this.pageIndex, pageRows = this.pageSize, that = this
        stockQuery(query, '', pageIndex, pageRows).then(resp => {
          this.selectParams.loading = false
          that.stockQueryRes = resp
          this.stockCodeList = that.stockQueryRes.map(function (item) {
            return {value: item.security_id, label: item.security_id + ' ' + item.security_chn_short_name}
          })
          // 将当前已选项与返回结果做对比，如果返回结果中包含已选项，将返回结果中的该项删除
          let curArr = that.currentSelectList
          if (!$.isEmptyObject(curArr)) {
            curArr.forEach((item) => {
              that.stockQueryRes.forEach((nape, index) => {
                if (item.value === nape.security_id) {
                  that.stockQueryRes.splice(index, 1)
                }
              })
            })
          }
          // 将返回结果处理成[{value:'',label:''},...]格式
          that.stockCodeList = that.stockQueryRes.map(item => {
            return {
              value: item.security_id,
              label: `${item.security_id} ${item.security_chn_short_name}`
            }
          })
          if (pageIndex === 1) {
            that.stockCodeList = curArr.concat(that.stockCodeList)
            that.selectStockCodeOptions = []
            // 将处理结果赋给控件下拉列表绑定值
            that.selectStockCodeOptions = that.stockCodeList
          } else {
            //  如果当前页不是第一页，将返回结果进行格式化处理后拼接到当前下拉列表数组后
            that.selectStockCodeOptions = that.selectStockCodeOptions.concat(that.stockCodeList)
          }
          that.stockCodeList = []
        })
      },
      // 勾选项change事件
      getSelectList () {
        // 将checkbox勾选项val与select控件绑定val同步
        this.selectParams.selectStockCodeVal = this.selectParams.selectCheckboxValue
        this.updateCurrentList()
        let selectCheckLabel = []
        this.currentSelectList.forEach((item) => {
          this.selectParams.selectCheckboxValue.forEach(nape => {
            if (item.value === nape) {
              selectCheckLabel.push(item.label)
            }
          })
        })
        this.$emit('getSelectRes', this.selectParams.selectCheckboxValue, selectCheckLabel)
        this.$emit('getSelectName', this.selectNameArr)
        this.$emit('getCurrentSelectList', this.currentSelectList)
      },
      // select控件change事件
      handleSelectChange () {
        // 将select控件绑定val与checkbox勾选项val同步
        this.selectParams.selectCheckboxValue = this.selectParams.selectStockCodeVal
        this.updateCurrentList()
        let selectCheckLabel = []
        this.currentSelectList.forEach((item) => {
          this.selectParams.selectCheckboxValue.forEach(nape => {
            if (item.value === nape) {
              selectCheckLabel.push(item.label)
            }
          })
        })
        this.$emit('getSelectRes', this.selectParams.selectCheckboxValue, selectCheckLabel)
        this.$emit('getSelectName', this.selectNameArr)
        this.$emit('getCurrentSelectList', this.currentSelectList)
      },
      // 更新选中项
      updateCurrentList () {
        let val = this.selectParams.selectCheckboxValue
        let selectVal = [], selectName = []
        // 双重for循环将已选项存入当前选中列表数组currentSelectList中
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
            if (this.selectStockCodeOptions[j].value === val[i]) {
              selectVal.push(this.selectStockCodeOptions[j])
              let arr = this.selectStockCodeOptions[j].label.split(' ')
              arr.splice(0, 1)
              selectName.push(arr.join(' '))
            }
          }
        }
        this.selectNameArr = selectName
        this.currentSelectList = selectVal
      },
      // select控件懒加载事件
      handleLoadSelectMore () {
        this.pageIndex += 1
        if (this.selectParams.particLevelType === 'stockCode') {
          if (this.selectParams.query === '') {
            this.getStockCodeOptionCon(this.query)
          } else {
            this.getUploadSelectOptionCon(this.uploadCon)
          }
        } else {
          // 否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
          let pageIndex = this.pageIndex,
            query = this.query,
            level = this.selectParams.particLevelType,
            pageSize = this.pageSize
          this.getSelectOptionCon(level, query, pageIndex, pageSize)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .selectLazyMultiple {
    /deep/ .el-select-dropdown__item {
      padding: 0;
    }
    /*/deep/.el-select__tags {*/
    /*width: 100% !important;*/
    /*}*/
    /*/deep/.el-select__input {*/
    /*cursor: pointer;*/
    /*width: 100% !important;*/
    /*}*/
    /deep/ .el-select {
      /deep/ .el-input__icon:before {
        content: "\E605";
      }
    }
  }
</style>
