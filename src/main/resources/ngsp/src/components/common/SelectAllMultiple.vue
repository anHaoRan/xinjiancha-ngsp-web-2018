<template>
    <div class="select-all-multiple">
        <el-select size="small"
                   v-model="selectStockCodeVal"
                   placeholder="请选择"
                   filterable
                   multiple
                   remote
                   reserve-keyword
                   default-first-option
                   collapse-tags
                   @remove-tag="handleRemoveTag"
                   @change="setDataForCheckbox"
                   style="width: 100%">
            <el-option label="全选" value="ALL">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange"
                             style="display: block">
                    全选
                </el-checkbox>
            </el-option>

            <el-option
                    v-for="item in selectStockCodeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                <el-checkbox :label="item.value" v-model="selectCheckboxValue" @change="getSelectList"
                             style="display: block">
                    {{item.label}}
                </el-checkbox>
            </el-option>
        </el-select>
    </div>
</template>

<script>
  export default {
    name: 'select-all-multiple',
    data () {
      return {
        selectStockCodeVal: [],
        selectCheckboxValue: [],
        // 当前选中股票代码
        currentSelectList: [],
        isIndeterminate: false,
        checkAll: false
      }
    },
    props: {
      selectStockCodeOptions: {
        type: Array,
        default: function () {
          return []
        }
      },
      selectAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    mounted () {},
    methods: {
      setSelectAll(){
        if (this.selectAll) {
          this.checkAll = true
          this.checkAllChange(true)
          this.selectCheckboxValue = this.selectStockCodeOptions.map(item => {
            return item.value
          })
          this.selectStockCodeVal = this.selectCheckboxValue
        }
      },
      checkAllChange (val) {
        // 全选change事件
        this.isIndeterminate = false
        if (val) {
          let selectAll = this.selectStockCodeOptions.map(function (item) {
            return item.value
          })
          this.selectCheckboxValue = selectAll
          this.selectStockCodeVal = selectAll
        } else {
          this.selectCheckboxValue = []
          this.selectStockCodeVal = []
        }
        this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue)
      },
      setDataForCheckbox (val) {
        if (val.includes('ALL')) {
          val = this.selectStockCodeOptions.map((item) => {
            return item.value
          })
        } else {
          if (!this.isIndeterminate) {
            this.selectCheckboxValue = []
            this.selectStockCodeVal = []
          }
          // 选择复选框触发chenge事件
          this.selectCheckboxValue = this.selectStockCodeVal
          // let val = this.selectCheckboxValue;
          let selectVal = []
          for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
              if (this.selectStockCodeOptions[j].value === val[i]) {
                selectVal.push(this.selectStockCodeOptions[j])
              }
            }
          }
          this.currentSelectList = selectVal
          this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue)
          if ($.isEmptyObject(this.selectStockCodeVal)) {
            this.isIndeterminate = false
            this.checkAll = false
          } else {
            this.isIndeterminate = true
            let selectAll = this.selectStockCodeOptions.map(function (item) {
              return item.value
            })
            if (this.selectStockCodeVal.length == selectAll.length) {
              this.isIndeterminate = false
              this.checkAll = true
            }
          }
        }
      },
      getSelectList () {
        this.selectStockCodeVal = this.selectCheckboxValue
        let val = this.selectCheckboxValue
        let selectVal = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
            if (this.selectStockCodeOptions[j].value === val[i]) {
              selectVal.push(this.selectStockCodeOptions[j])
            }
          }
        }
        this.currentSelectList = selectVal
        this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue)
        if ($.isEmptyObject(this.selectCheckboxValue)) {
          this.isIndeterminate = false
          this.checkAll = false
        } else {
          this.isIndeterminate = true
          let selectAll = this.selectStockCodeOptions.map(function (item) {
            return item.value
          })
          if (this.selectStockCodeVal.length == selectAll.length) {
            this.isIndeterminate = false
            this.checkAll = true
          }
        }
      },
      handleRemoveTag(val){
        // this.checkAll=false
        // this.selectStockCodeVal.forEach((item,index)=>{
        //   if(item===val){
        //     this.this.selectStockCodeVal.splice(index,1)
        //   }
        // })
        // console.log(val)
        // console.log(this.selectStockCodeVal)
      }
    }
  }
</script>

<style lang="less" scoped>
    .select-all-multiple {
        .el-select-dropdown__item.selected::after {
            display: none;
        }
    }
</style>
