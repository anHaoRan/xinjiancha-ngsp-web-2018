/* eslint-disable */
<template>
  <div class="cmmcBox">
    <!--未保存数据-->
    <div class="marginBot10">
        <el-row>
            <span class="saveTag">未保存数据</span>
            <span class="floatRight">
                <!--<el-button size="mini" type="text">设置</el-button>-->
                <el-button size="mini" type="primary" @click="handleQueryTable" :disabled="isSelectRow">确认</el-button>
                <el-dropdown @command="downloadNoSave">
                  <el-button type="primary" size="mini" :disabled=" tableData.length === 0 ">
                    导出<i class="el-icon-arrow-down el-icon-right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="xlsx">
                      导出为EXCEL
                    </el-dropdown-item>
                    <el-dropdown-item command="csv">
                      导出为CSV
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </span>
        </el-row>
        <el-table
            v-loading="loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            :data="tableData"
            style="width: 100%"
            max-height="300"
            @selection-change="handleSelectionChange">
            <el-table-column
            prop="sec_name"
            label="证券简称"
            sortable
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="sec_code"
            label="证券代码"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="stop_date"
            label="停牌时间"
            sortable
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            label="公司部来函"
            align="left">
            <template slot-scope="scope">
                <el-input v-model="scope.row.com_letter" size="mini" clearable></el-input>
            </template>
            </el-table-column>
            <el-table-column
            prop="cur_letter_date"
            width="180"
            label="最近一次来函时间"
            align="left">
            </el-table-column>
            <el-table-column
            prop="cur_letter_no"
            label="最近一次来函编号"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="notice_name"
            label="公告名称"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            type="selection"
            width="70"
            align="center">
            </el-table-column>
        </el-table>
    </div>
    <!--已保存数据-->
    <div>
        <el-row>
            <span class="saveTag">已保存数据</span>
            <span class="floatRight">
                <el-dropdown @command="downloadSave">
                  <el-button type="primary" size="mini" :disabled=" tableData2.length === 0 ">
                    导出<i class="el-icon-arrow-down el-icon-right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="xlsx">
                      导出为EXCEL
                    </el-dropdown-item>
                    <el-dropdown-item command="csv">
                      导出为CSV
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </span>
        </el-row>
        <el-table
            v-loading="loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            :data="tableData2"
            style="width: 100%"
            max-height="300">
            <el-table-column
            prop="sec_name"
            label="证券简称"
            sortable
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="sec_code"
            label="证券代码"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="stop_date"
            label="停牌时间"
            sortable
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            label="公司部来函"
            prop="com_letter"
            align="left">
            </el-table-column>
            <el-table-column
            prop="cur_letter_date"
            label="最近一次来函时间"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="cur_letter_no"
            label="最近一次来函编号"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            prop="notice_name"
            label="公告名称"
            width="180"
            align="left">
            </el-table-column>
            <el-table-column
            label="操作"
            width="70"
            align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleRecall(scope.row)">撤回</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>

  </div>
</template>
/* eslint-disable */

<script>
import {getAlarmMajorEvents, editAlarmMajorEvents, backAlarmMajorEvents} from '../../../service/alarmMonitor/clueRadar' // 查询、修改、撤回三个接口

export default {
  name: 'cmmCheck-regularDrive',
  components: {

  },
  data() {
    return {
      isSelectRow: true,
      tableData: [],
      tableData2: [],
      tableColumns: [
        { 'field': 'sec_name', 'label': '证券简称', 'align': 'left', 'sortable': true },
        {'field': 'sec_code', 'label': '证券代码', 'align': 'left'},
        { 'field': 'stop_date', 'label': '停牌时间', 'align': 'left', 'sortable': true },
        { 'field': 'com_letter', 'label': '公司部来函', 'align': 'left' },
        { 'field': 'cur_letter_date', 'label': '最近一次来函时间', 'align': 'left' },
        { 'field': 'cur_letter_no', 'label': '最近一次来函编号', 'align': 'left' },
        { 'field': 'notice_name', 'label': '公告名称', 'align': 'left' }
      ],
      loading:true, // 加载中
    }
  },
  computed: {},
  watch: {},
  methods: {
    getTableData() { // 获取表格数据
      getAlarmMajorEvents().then(resp => {
        this.tableData = resp.resNotSave; // 未保存数据
        this.tableData2 = resp.resSave; // 已保存数据
        this.loading = false; // 取消加载中
      });
    },
    handleSelectionChange(val) { // 多选事件处理
      let selectData = [];
      for (let i in this.tableData) { // 处理全部未选择状态
        this.tableData[i]['isSelected'] = false; // eslint-disable-line
      }
      for (let i in val) { // 处理选择状态
        val[i]['isSelected'] = true; // eslint-disable-line
      }
      selectData = val;
      selectData.length === 0 ? this.isSelectRow = true : this.isSelectRow = false; // 控制确认按钮能否点击
    },
    handleQueryTable() { // 修改公司来函
      let temp = [];
      /* eslint-disable */
      for (let row in this.tableData) {
        if (this.tableData[row].isSelected) {
          if (this.tableData[row].com_letter === '') {
            this.$message.error('勾选的公司部来函不能为空，请填写！');
            return;
          }else {
            let data = {
              id: this.tableData[row].id,
              comLetter: this.tableData[row].com_letter
            };
            temp.push(data)
          }
        }
      }
      /* eslint-disable */
      editAlarmMajorEvents({arr: JSON.stringify(temp)}).then(resp => {
        if (resp.state == 1) { // eslint-disable-line
          this.getTableData(); // 重新刷新表格数据
        }
      });
    },
    downloadSave(command) { // 导出已保存数据
      this.$message.info('正在导出已保存数据，请稍等~');
      let downloadParams = {
        'tableColumns': [
          {
            'sheetName': '公司重大事项-已保存数据',
            'fileColumns': this.tableColumns
          }
        ],
        'fileType': command,
        'resSave': 1,
        'resNotSave': 0
      };
      this.gfnExportFileWithForm('/alarm/majorevnt/v1/major-events-export', downloadParams);
    },
    downloadNoSave(command) { // 导出未保存数据
      this.$message.info('正在导出未保存数据，请稍等~');
      let downloadParams = {
        'tableColumns': [
          {
            'sheetName': '公司重大事项-未保存数据',
            'fileColumns': this.tableColumns
          }
        ],
        'fileType': command,
        'resSave': 0,
        'resNotSave': 1
      };
      this.gfnExportFileWithForm('/alarm/majorevnt/v1/major-events-export', downloadParams);
    },
    handleRecall(row) { // 撤回
      let params = {'id': row.id};
      backAlarmMajorEvents(params).then(resp => {
        if (resp.state == 1) { // eslint-disable-line
          this.getTableData(); // 重新刷新表格数据
        }
      });
    }
  },
  created() {
  },
  mounted() {
    // 请求初始数据：未保存数据和已保存数据
    this.getTableData();
  }
}
</script>

<style lang='less' scoped>
.cmmcBox{
    padding: 10px 20px;
    .saveTag{
        background-color: #162547;
        color: #aec0e6;
        border-bottom: 1px solid #1b2b4e;
        padding: 0 30px;
        height: 34px;
        line-height: 34px;
        display: inline-block;
    }
    .el-button--text{
        border:none;
    }
    .el-dropdown{
      margin-left:10px;
    }

}
.floatRight{
    float: right;
}
.marginBot10{
    margin-bottom:10px;
}
</style>
