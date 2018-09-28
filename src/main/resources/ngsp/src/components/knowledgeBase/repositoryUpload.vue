<!--知识库 > 法律法规及文档模板列表上传组件-->
<template>
  <div>
    <el-button
      :type="uploadParams.type"
       :loading="uploadParams.loading"
       @click="dialogFormVisble = true"
       size="small">
      {{uploadParams.label}}
    </el-button>
    <el-dialog  title="文件上传" :visible.sync="dialogFormVisble">
      <el-form>
        <el-form-item prop="name" style="margin-bottom: 0">
          <el-select
            v-model="region"
             clearable
             placeholder="请选择活动区域">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-upload
            ref="upload"
            :action="this.gfnGetUploadFlatReturnBasicUrl"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :data="params"
            name="uploadFile">
            <el-button
              slot="trigger"
              type="primary"
              size="small">选择文件
            </el-button>
            <el-button
              style="margin-left: 20px"
              type="success"
              size="small"
              @click="submitUpload">
              上传服务器
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy = false" >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "txt-upload",
    props: ['uploadParams'],
    data() {
      return {
        uploadData: null,
        dialogFormVisble: false,
        params: {
          "parseRule": JSON.stringify(
            {
              "delimiter": this.uploadParams.delimiter
            }
          )
        },
        // 上传文件里面的选择器
        options:[{
          value:'1',
          label:'全部',
        },{
          value:'1',
          label:'法律法规/交易规则',
        },{
          value:'1',
          label:'监察业务(技术)文档',
        },{
          value:'1',
          label:'文档模板',
        },{
          value:'1',
          label:'会议纪要',
        },{
          value:'1',
          label:'新员工指引',
        }],
        region:'',
      }
    },
    methods: {
      beforeUpload(file) {
        this.uploadParams.loading = false;
        return file
      },
      handleUploadSuccess(res, file, fileList) {
        if (res.success) {
          this.uploadParams.result=res.value.join(',')
          // this.$emit('fileData', res.value);
          this.dialogFormVisble = false;
          this.$refs.upload.clearFiles()
          this.$emit("getTxtCon", this.uploadParams.result);
        } else {
          this.$message.error(res.message)
        }
      },
      submitUpload() {
        this.$refs.upload.submit();
        },
    },
    mounted() {},
  };
</script>

<style  scoped lang="less">
.dialog-footer{
  display: flex;
  justify-content: flex-end;
}
</style>
