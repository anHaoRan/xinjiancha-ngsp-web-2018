<!--参与者查询-->
<!-- 证券代码带上传 uploadCode -->

<template>
  <div class="uploadCode">
    <div v-if="uploadShow">
      <el-col :span="10">
        <el-select
          clearable
          multiple
          collapse-tags
          v-model="commonData.uploadCode"
          placeholder="请输入代码"
          size="mini"
          :disabled="stockCodeDisabled">
          <el-option
            v-for="codeFor in uploadCodeOptions"
            :key="codeFor.value"
            :label="codeFor.label"
            :value="codeFor.value">
          </el-option>
        </el-select>
      </el-col>
      <!--上传-->
      <el-col :span="3" :offset="1">
        <text-upload @getTxtCon="getTxtDataZj" :uploadOption="uploadOption" style="display: inline;"></text-upload>
      </el-col>
    </div>
    <!--// 营业部证券代码-->
    <div v-else>
      <el-col :span="10">
      <el-select
      v-model="commonData.yuploadCode"
      placeholder="请输入证券代码"
      clearable
      :disabled="stockCodeDisabled"
      @change="codeTypeSelectChange"
      size="small"
      style="width: 100%;">
      <el-option
      v-for="codesFor in codeTypeSelectOptions"
      :key="codesFor.value"
      :label="codesFor.label"
      :value="codesFor.value">
      </el-option>
      </el-select>
      </el-col>
    </div>
  </div>
</template>
<script>


  // 参与者查询类型接口
  import {
    getQueryType,         // 参与者查询 -- 账户类型（账户、一码通、营业部） 公共接口

  } from '../../service/analysisTool/participatorType'


  // 上传组件
  import TextUpload from "../common/textUpload";



  export default {
    // 注册组件
    components: {
      TextUpload,            // 上传账号组件

    },
    // 初始数据
    data() {
      return {

        // 上传账号
        uploadShow: true,     // 上传代码
        uploadOption:{
          name:'上传',
          size:'small'
        },
      }
    },
    // watch: {
    //   commonData: {
    //     handler: function () {
    //       let index = this.informationOptions.findIndex((item) => {
    //         return item.value == this.commonData.participateType
    //       })
    //       if (index != -1)
    //         this.commonData.participateText = this.informationOptions[index].text;
    //     },
    //     deep: true
    //   }
    // },

    // 渲染页面
    methods: {

      // 参与者查询类型数据
      // convergenceType() {
      //   getQueryType(this.dataType, this.tag1).then(resp => {
      //     this.informationOptions = resp;
      //     // 默认选择账户类型
      //     this.accountType = this.informationOptions[0].value;
      //     this.commonData.participateType = this.informationOptions[0].value;
      //   });
      // },



      //点击确定按钮触发事件
      typeConfirm() {
        //判别类型
        switch (this.accountType) {
          case 'account' :
            this.informationCodeType = '账户';
            this.position = true;
            break;
          case 'uniteCode':
            this.informationCodeType = '一码通';
            this.position = true;
            break;
          case 'salePart':
            this.informationCodeType = '营业部';
            this.position = false;
            break;
          case 'member':
            this.informationCodeType = '券商';
            this.position = true;
            break;
          case 'pbu':
            this.informationCodeType = 'PBU';
            this.position = true;
            break;
        };
      },
    },


    // 渲染到页面
    mounted: function () {


    },

  };


</script>
<style lang="less">
  .participatorType {

  .el-row {
    margin-top: 20px !important;
  }

  .el-tabs--card > .el-tabs__header {
    margin-bottom: 0;
    border: none;

  .el-tabs__nav-wrap {
    padding: 20px 20px 0;

  .el-tabs__nav {
    border: none;

  .el-tabs__item.is-active {
    background-color: #12bba5;
    border: 1px solid #12bba5;
  }

  > div {
    height: 30px;
    line-height: 30px;
    border: 1px solid #7b8fb9;
    box-sizing: border-box;
    margin-right: 20px;
    border-radius: 4px;
    font-size: 14px;
  }

  }
  }
  }
  .el-card .el-card__header .el-button {
    margin-top: 5px;

  &
  :hover {
  }

  }
  .el-card__header {
    margin: 10px 20px;
    border-radius: 4px;
  }

  .el-button--primary {
    background-color: #1b5eed;
  }

  .el-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .mustInput {
    font-size: 14px;
    color: #ff402b;
    position: relative;
    right: 3px;
    top: 3px;
  }

  span.el-range-separator {
    color: #7b8fb9;
  }

  .el-tag, .el-tag__close {
    background-color: #2c3f68 !important;
  }

  .el-select__tags-text {
    color: #fff;
  }

  .product-query-tabs {

  .el-card__body {
    padding-bottom: 0;
  }

  }
  .name {
    line-height: 40px;
  }

  .commonFilter {
    padding-top: 20px;
  }

  .el-dialog {
    width: 700px;
    top: 10px;

  /*background-color: #1b2b4e;*/
  .el-dialog__body {
    text-align: center;
    padding-bottom: 0;

  .el-form {
    width: 466px;
    margin: 10px auto 20px;
    padding-top: 0;
  }

  .el-form-item__label {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
  }

  .el-input {
    text-align: left;

  .el-input__inner {
    width: 300px;
    height: 30px;
    border-radius: 4px;
  }

  }
  }
  .el-dialog__header {
    padding-top: 20px;
    padding-bottom: 20px;
    /*background-color: #203052;*/
    text-align: left;
    padding-left: 20px;

  .el-dialog__title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 16px;
    letter-spacing: 0px;
    /*color: #ffffff;*/
  }

  }
  .el-dialog__footer {
    padding-top: 0;

  .el-button {
    border-radius: 4px;
    text-align: center;
    margin: 20px;

  span {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 16px;
    letter-spacing: 0px;
    /*color: #fff;*/
  }

  }
  }
  }
  .dialog-footer {
    text-align: center;
  }

  }

</style>
