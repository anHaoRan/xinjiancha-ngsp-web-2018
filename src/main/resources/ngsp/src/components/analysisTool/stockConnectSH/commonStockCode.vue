<template>
  <div>
    <el-select size="small"
               v-model="selectStockCodeVal"
               placeholder="请选择"
               filterable
               multiple
               remote
               reserve-keyword
               default-first-option
               collapse-tags
               @change="setDataForCheckbox"
               :remote-method="remoteMethod"
               :loading="loading"
               style="width: 70%">
      <el-option label="全选" value="ALL">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange"
                     style="display: block;">
          全选
        </el-checkbox>
      </el-option>
      <el-option
        v-for="item in selectStockCodeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        <el-checkbox :label="item.value" v-model="selectCheckboxValue" @change="getSelectList">
          {{item.label}}
        </el-checkbox>
      </el-option>
    </el-select>
    <el-upload
      ref="upload"
      :action="gfnGetUploadFlatReturnBasicUrl()"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :data="uploadParams"
      :show-file-list="false"
      name="uploadFile"
      style="display: inline-block;margin-left: 10px;">
      <el-button slot="trigger"
                 type="primary"
                 size="small">上传
      </el-button>
    </el-upload>
  </div>
</template>

<script>
  import {getStockcodeFromConnet, getFuzzyStockcodeFromConnet} from '../../../service/analysisTool/stockConnectSH'
  import {requestPrefix} from '../../../utils/constants';

  export default {
    name: 'common-stock-code',
    data() {
      return {
        selectStockCodeVal: [],
        selectCheckboxValue: [],
        selectStockCodeOptions: [],
        loading: false,
        // 从中获取需要数据
        stockCodeList: [],
        // 当前选中股票代码
        currentSelectList: [],

        checkAll: false,
        isIndeterminate: false,
        prefix: requestPrefix,
        uploadParams: {
          'parseRule': JSON.stringify(
            {
              'delimiter': ','
            }
          )
        }
      }
    },
    methods: {
      handleUploadSuccess(resp, file) {
        // 获取上传文件内容，并将获取到的文件内容与下拉列表相比较，取出下拉列表中有的项
        if (resp.success) {
          this.beforeUpload(file);
          let resArr = [];
          for (let i = 0; i < resp.value.length; i++) {
            for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
              if (this.selectStockCodeOptions[j].value === resp.value[i]) {
                resArr.push(resp.value[i])
              }
            }
          }
          // 将文件内容与下拉列表共有的项与已选项做对比，如果共有项已选，则不重复赋值，否则将其push到下拉列表选中值绑定的数组中
          if (!$.isEmptyObject(this.selectStockCodeVal)) {
            for (let i = 0; i < resArr.length; i++) {
              for (let j = 0; j < this.selectStockCodeVal.length; j++) {
                if (this.selectStockCodeVal[j] === resArr[i]) {
                  resArr.splice(i, 1)
                }
              }
            }
            this.selectCheckboxValue = this.selectStockCodeVal = this.selectStockCodeVal.concat(resArr);
          } else {
            this.selectCheckboxValue = this.selectStockCodeVal = resArr;
          }
          this.$message.success('上传成功');
        } else {
          this.$message.error('上传失败');
        }
      },
      /* eslint-disable */
      beforeUpload(file) {
        // 上传之前判断文件类型是否符合要求
        let nameArr = file.name.split('.')
        let fileType = nameArr[nameArr.length - 1];
        if (fileType != 'txt') {
          this.$message.error('只支持TXT文件的上传');
          return false;
        }
      },

      checkAllChange(val) {
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
        this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue);
      },

      setDataForCheckbox(val) {
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
          //  let val = this.selectCheckboxValue;
          let selectVal = [];
          for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
              if (this.selectStockCodeOptions[j].value === val[i]) {
                selectVal.push(this.selectStockCodeOptions[j])
              }
            }
          }
          this.currentSelectList = selectVal;
          this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue);
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

      getSelectList() {
        this.selectStockCodeVal = this.selectCheckboxValue;
        let val = this.selectCheckboxValue;
        let selectVal = [];
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.selectStockCodeOptions.length; j++) {
            if (this.selectStockCodeOptions[j].value === val[i]) {
              selectVal.push(this.selectStockCodeOptions[j])
            }
          }
        }
        this.currentSelectList = selectVal;
        this.$emit('getSelectRes', this.selectStockCodeVal, this.selectCheckboxValue);
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

      remoteMethod(query) {
        getFuzzyStockcodeFromConnet({fuzzyChars: query}).then(resp => {
          this.selectStockCodeOptions = [];
          this.stockCodeList = resp.map(function (item) {
            return {value: item.security_id, label: item.security_id + ' ' + item.security_chn_short_name}
          })
          let curArr = this.currentSelectList;
          if (!$.isEmptyObject(curArr)) {
            for (let i = 0; i < curArr.length; i++) {
              for (let j = 0; j < this.stockCodeList.length; j++) {
                if (this.stockCodeList[j].value === curArr[i].value) {
                  this.stockCodeList.splice(j, 1);
                }
              }
            }
            this.stockCodeList = curArr.concat(this.stockCodeList)
          }
          this.selectStockCodeOptions = this.stockCodeList;
          this.stockCodeList = [];
        })
      }
    },
    mounted() {
      getStockcodeFromConnet().then(resp => {
        this.selectStockCodeOptions = resp.map(function (item) {
          return {value: item.security_id, label: item.security_id + ' ' + item.security_chn_short_name}
        })
      })
    }
  }
</script>

<style scoped>

</style>
