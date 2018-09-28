<template>
  <div class="systemLetterSendSetting">
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="145px" label-position="left">
      <el-form-item :label="item['itemName']" v-for="(item, index) in paramsList" :key="index">
        <div class="switchComponent">
          <div class="overlayDiv" @click="updateParams(item)"></div>
          <el-switch v-model="item.paramValue" :active-value="'1'" :inactive-value="'0'"></el-switch>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {updateParamData} from '@/service/systemManage'
  export default {
    props: {
      propsParamsList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      propsParamsList(val) {
        this.paramsList = JSON.parse(JSON.stringify(val))
      }
    },
    data() {
      return {
        ruleForm: {},
        paramsList: []
      }
    },
    methods: {
      updateParams(item) {
        let params = JSON.parse(JSON.stringify(item))
        if (item.paramValue === '1') {
          params.paramValue = '0'
        } else {
          params.paramValue = '1'
        }
        updateParamData(JSON.stringify([params])).then(resp => {
          const {Message} = resp
          if (Message) {
            this.$message.success(Message)
          } else {
            this.$message.error('更新失败')
          }
          this.$emit('updateParams')
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .systemLetterSendSetting {
    position: relative;
    .overlayDiv {
      position: absolute;
      cursor: pointer;
      top: 0;
      width: 100px;
      height: 50px;
      z-index: 11;
    }
  }
</style>