<template>
  <div class="downMoreSelect">
    <div @click="moreSelect">
      <el-input type="text" :placeholder="placeholder" :value="inputValue" :size="size"
                suffix-icon="el-icon-arrow-down" :class="isActive" :disabled="disabled" readonly="true">
      </el-input>
    </div>
    <div v-show="selectHide" class="wrap">
      <div class="scroll">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedChange">
          <el-checkbox v-for="city in optionData" :label="city" :key="city.value">{{city.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="check-btn">
        <el-button size="mini" type="primary" @click="submit">确定</el-button>
        <el-button size="mini" type="info" @click="cancel">清空</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'account-group',
    props: {
      placeholder: {
        type: String,
        default() {
          return '默认全选'
        }
      },
      size: {
        type: String,
        default() {
          return 'mini'
        }
      },
      optionData: {
        type: Array,
        default: function () {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      clearFlag: {
        type: Number,
        default: function () {
          return 1
        }
      }
      // checkAll: {
      //   type: Boolean,
      //   default: function () {
      //     return false
      //   }
      // }
    }, // 父组件传递的下拉选项
    data() {
      return {
        selectHide: false,
        inputValue: '',
        isIndeterminate: true,
        checkedCities: [],
        checkAll: false,
        changeValue: '', // 选中是临时数据存储
        isActive: 'down'
      }
    },
    watch: {
      clearFlag: {
        handler: function (param1, param2) {
          this.cancel()
        },
        deep: true
      }
    },
    methods: {
      moreSelect() {
        this.selectHide = !this.selectHide
        if (this.isActive == 'up') {
          this.isActive = 'down'
        } else {
          this.isActive = 'up'
        }
      },
      // 全选
      handleCheckAllChange(val) {
        if (val) {
          let arr = []
          for (let key of this.optionData) {
            arr.push(key.label)
          }
          this.changeValue = arr.join(',')
        } else {
          this.changeValue = ''
        }
        this.checkedCities = val ? this.optionData : []
        this.isIndeterminate = false
      },
      // 单选
      handleCheckedChange(val) {
        let arr = []
        for (let key of val) {
          arr.push(key.label)
        }
        this.changeValue = arr.join(',')
        let checkedCount = val.length
        this.checkAll = checkedCount === this.optionData.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionData.length
      },
      // 确定
      submit() {
        let arr = []
        for (let key of this.checkedCities) {
          arr.push(key.value)
        }
        // 返回父组件参数值
        this.$emit('input', arr)
        this.inputValue = this.changeValue
        this.selectHide = false
        this.isActive = 'down'
      },
      // 取消
      cancel() {
        this.checkAll = false
        this.checkedCities = []
        this.selectHide = false
        this.isActive = 'down'
        this.inputValue = ''
        this.changeValue = ''
        this.$emit('input', [])
      }
    }
  }
</script>

<style lang="less">
  .downMoreSelect {
    .down {
      .el-input__suffix {
        .el-input__icon {
          transform: rotateZ(0);
        }
      }
    }
    .up {
      .el-input__suffix {
        .el-input__icon {
          transform: rotateZ(-180deg);
        }
      }
    }
    .el-input__inner {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .wrap {
      width: 100%;
      position: absolute;
      z-index: 5;
      background-color: #1a284b;
      border-radius: 5px;
      .scroll {
        overflow: auto;
        max-height: 300px;
      }
      label {
        margin-left: 5px;
        display: block;
      }
      .check-btn {
        text-align: center;
      }
    }
  }
</style>
