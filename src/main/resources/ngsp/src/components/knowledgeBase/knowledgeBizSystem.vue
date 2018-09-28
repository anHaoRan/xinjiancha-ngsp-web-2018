<!-- 法律法规及文档模板列表 -->
<template>
  <div class="knowledgeBase">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>法律法规及文档模板列表</span>
        <el-button @click="clear" type="text" size="small">清空</el-button>
        <el-button @click="submit" type="primary" size="small">
          <span> 查询</span>
        </el-button>
      </div>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">关键字：</el-col>
          <el-col :span="18">
            <el-input v-model="submitData.keyWorld" size="small"></el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">文件类型：</el-col>
          <el-col :span="18">
            <el-select style="width: 100%;" v-model="submitData.fileType" placeholder="全部" size="small">
              <el-option
                v-for="item in gridData"
                :key="item.category"
                :label="item.category"
                :value="item.category"
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">创建用户：</el-col>
          <el-col :span="18">
            <el-input v-model="submitData.user" size="small"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">上传日期：</el-col>
          <el-col :span="18">
            <el-date-picker
              :clearable="false"
              v-model="uploadDatePicker"
              style="width:100%"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              @change="changeAlarmDate">
            </el-date-picker>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <repository-upload :uploadParams="uploadParams" type="primary" size="small"
                           style="float:right"></repository-upload>
        <span style="float: left; line-height: 32px">{{allDataLength}}</span>
        <el-button @click="tableDown()" type="primary" size="small" style="float:right">下载</el-button>
        <el-button @click="tableDele()" type="primary" size="small" style="float:right">删除</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="tableData3"
            border
            tooltip-effect="dark"
            style="width: 100%; overflow:visible"
            @row-click="getRow"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              min-width="5%">
            </el-table-column>
            <el-table-column align="center" prop="file_name" label="文件名" min-width="20%"></el-table-column>
            <el-table-column align="center" prop="type_name" label="类别" min-width="20%"></el-table-column>
            <el-table-column align="center" prop="user" label="上传人" min-width="20%"></el-table-column>
            <el-table-column align="center" prop="create_time" label="上传日期" min-width="20%"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <pageination style="float: left" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>

  // 面包屑组件引入
  import breadcrumb from '../../components/common/Breadcrumb'
  import {
    tableDeleList,           // 删除接口
    getKnowledgeData,        //知识库附件查询列表数据
  } from '../../service/knowledgeBizSystem';
  // 上传组件引入
  import RepositoryUpload from '../knowledgeBase/repositoryUpload';
  // 分页组件引入
  import Pageination from "../common/pageination";
  // 日期插件引入
  import moment from "moment"

  export default {
    components: {
      breadcrumb,       // 面包屑组件注册
      RepositoryUpload, //   // 上传组件注册
      Pageination,      // 分页组件注册
    },
    data() {
      return {
        pageTotal: 0,      // 分页
        uploadDatePicker: ["", ""],   //开始日期 至 结束日期
        msg: "增加文件类型",
        userMessageValid: "",
        addCategory: "",
        categoryNameArray: [],
        gridData: [],          // 文件类型
        // 面包屑
        breadcrumbItems: [{
          router: '/knowledgeBizSystem',
          label: '监管知识库'
        }, {
          router: '/knowledgeBizSystem',
          label: '知识库'
        }],
        // 创建用户
        submitData: {
          user: "",
          key: "",
          fileType: "",
          uploadDateStart: "",
          uploadDateEnd: "",
          currentPage: 1,
          size: 10
        },
        // 上传文件弹框
        uploadParams: {
          loading: false,
          label: '文件上传',
          type: 'primary',
          params: [
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ["gdAccounts", "zqCode", "startDate", "endDate"] // 读取文件数据并以此格式返回数据
            },
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ["gdAccounts", "startDate", "endDate", "jyRate"] // 读取文件数据并以此格式返回数据
            }
          ]
        },

        // 上传文件里面的选择器 select
        allDataLength: '',

        options: [
          {
            value: '1',
            label: '全部',
          }, {
            value: '1',
            label: '法律法规/交易规则',
          }, {
            value: '1',
            label: '监察业务(技术)文档',
          }, {
            value: '1',
            label: '文档模板',
          }, {
            value: '1',
            label: '会议纪要',
          }, {
            value: '1',
            label: '新员工指引',
          }],
        region: '',

        alarmDateStart: "",
        alarmDateEnd: "",
        aDateStartOptions: {
          disabledDate: (time) => {
            if (this.alarmDateEnd != "") {
              return time.getTime() > Date.now() || time.getTime() > this.alarmDateEnd;
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        aDateEndOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.alarmDateStart || time.getTime() > Date.now();
          }
        },
        tableData3: [],
        multipleSelection: [],
        currentPage: 1,
        fileList: [],

      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      submit() {
        this.getTableData();
      },
      // 清除默认值
      clear() {
        this.submitData = {
          user: "",
          key: "",
          fileType: "",
          uploadDateStart: "",
          uploadDateEnd: "",
          currentPage: 1,
          size: 10
        };
      },
      // 分页
      getPageination(pageinationVal) {
        this.submitData.size = pageinationVal.pageSizeNumber;
        this.submitData.currentPage = pageinationVal.currentPage;
        this.getRealTimeData();
      },

      // 上传时间
      changeAlarmDate() {
        // 未选或空
        if (this.uploadDatePicker == 0 || this.uploadDatePicker == null) {
          return;
        } else {
          this.submitData.uploadDateStart = moment(this.uploadDatePicker[0]).format('YYYY-MM-DD HH:mm:ss');
          this.submitData.uploadDateEnd = moment(this.uploadDatePicker[1]).format('YYYY-MM-DD HH:mm:ss');
        }
      },

      // 单机突出整行数据
      getRow(row) {
        //找到row实现在线预览
      },
      getTableData() {

        //知识库附件查询列表数据
        getKnowledgeData(this.submitData).then((res) => {
          console.log(res);
          this.pageTotal = res.bizData.totalRows;
          this.tableData3 = JSON.parse(res.bizData.metaData);
        });
      },
      submit() {
        this.getTableData()
      },

      // 复选框选中列表
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 删除
      tableDele() {
        //请选择删除查询结果
        if ((this.multipleSelection.length == 1 && this.multipleSelection[0].alarmID == "") || (this.multipleSelection.length == 0)) {
          this.$message({
            message: "请选择删除查询结果",
            type: "warning",
            showClose: true
          })
          return false;
        }

        let DeleList = this.multipleSelection;
        let deleID = "";
        for (var i = 0; i < DeleList.length; i++) {
          deleID += DeleList[i].id + ",";
        }
        deleID = deleID.substring(0, deleID.length - 1);

        this.$confirm("此操作将永久删除文件，是否继续?", "提示", {
          confirmButtonText: '确定',
          cencelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除
          tableDeleList(deleID).then((resp) => {
            this.getTableData();
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //下载
      tableDown() {
        //请选择下载的列表
        if ((this.multipleSelection.length == 1 && this.multipleSelection[0].alarmID == "") || (this.multipleSelection.length == 0)) {
          this.$message({
            message: "请选择下载的列表",
            type: "warning",
            showClose: true
          })
          return false;
        }
        ;

        // 选中下载列表
        if (this.multipleSelection.length == 1) {
          let listId = this.multipleSelection[0].id;
          window.open('/ngsp/lores/v1/down-file?id=' + listId);
        } else {
          this.$message({
            message: "只能选中一条",
            type: "warning",
            showClose: true
          });
          return false;
        }
        ;
      },

      // //上传
      veryfy() {
      },
      //

      submitUpload() {
        // this.$
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {
      },
    },
  };
</script>
<style scoped lang="less">
  .knowledgeBase {
    .el-row {
      margin-top: 20px;
    }
    .name {
      line-height: 32px;
    }
    .uploaderContaner {
      display: inline;
      float: right;
    }
    .el-range-input {
      background-color: transparent;
    }
    .el-range-separator {
      color: #b4bccc;
    }
  }

  .upload-Pop-up {
    display: none;
    z-index: 2003;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
  }

</style>
