<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="clearAllData">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="inquiry">查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="8">
          <el-col :span="6" style="margin-top:8px">访问时间</el-col>
          <el-col :span="10">
            <el-date-picker
              v-model="dimensionQueryForm.beginDate"
              type="date"
              style="width:99%"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="startpickerOption"
              size="small">
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-time-picker
              v-model="dimensionQueryForm.beginTime"
              style="width:130%"
              placeholder="开始时间"
              value-format="HH-mm-ss"
              @change="lessstarttime"
              size="small">
            </el-time-picker>
          </el-col>
        </el-col>
        <el-col :span="10">
          <el-col :span="1" style="margin:1% 2% 0 10%;">至</el-col>
          <el-col :span="9">
            <el-date-picker
              v-model="dimensionQueryForm.endDate"
              type="date"
              style="width:99%"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="endpickerOption"
              disabledDte="dimensionQueryForm.beginDate"
              @change="endtimepickerOption"
              size="small">
            </el-date-picker>
          </el-col>
          <el-col :span="8" style="margin-left: 3px;">
            <el-time-picker
              v-model="dimensionQueryForm.endTime"
              style="width:110%"
              placeholder="结束时间"
              value-format="HH-mm-ss"
              @change="lessendtime"
              size="small">
            </el-time-picker>
          </el-col>
        </el-col>

        <el-col :span="6">
          <el-col :span="8" style="margin-top:8px">日志类别</el-col>
          <el-col :span="16">
            <el-select v-bind:multiple="true" v-model="logdata" placeholder="全选" size="small" @change="selectlogoption">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="8">
          <el-col :span="6" style="margin-top:8px">模块名称</el-col>
          <el-col :span="18">
            <el-select v-model="businessdata" placeholder="全选" size="small"
                       @change="selectbusinessdataoption">
              <el-option
                v-for="item in isname"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="10">
          <el-col :span="5" style="margin-top:8px;margin-left:40px">业务名称</el-col>
          <el-col :span="12">
            <el-select v-model="moduledata" placeholder="全选" size="small">
              <el-option
                v-for="item in ismodule"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="8" style="margin-top:8px">用户名称</el-col>
          <el-col :span="12">
            <el-input v-model="userdata" placeholder="输入用户名称" size="small" style="width:97%"></el-input>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <div style="position:relative;top:-40px;">
      <el-button @click="exporttxt" size="small" type="primary">导出</el-button>
      </div>
    </div>
      <el-table
        style="margin-top:10px;width:100%"
        :data="inquiredata"
        fit
        border>
        <el-table-column
          prop="id"
          label="日志标示"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="operateTime"
          label="访问时间"
          align="center"
          width="170"
          fit=true
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serverIp"
          label="服务器"
          align="center"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clientIp"
          label="IP地址"
          align="center"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="type"
          label="日志类别"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="personAccount"
          label="用户名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="业务名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="moduleName"
          label="模块名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="小组名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="stockCode"
          label="股票代码"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="accountId"
          label="账户(组)代码"
          align="center"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="message"
          label="日志内容"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="margin-top:10px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pagenum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalpage"
          @current-change="currentpagination"
          @size-change="sizepagination">
        </el-pagination>
      </el-col>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../common/Breadcrumb';
  import {getLogData,postModuleData} from '../../service/businessAudit/index.js'
  import {add0, dateformat, timeformat, tabletimeformat} from '../../utils/dateTimeFormat.js'

  export default {
    components: {
      Breadcrumb,
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '',
          label: '业务审计'
        }, {
          router: '',
          label: '操作日志审计'
        }],
        options: [{
          value: "ALL",
          label: "全选"
        }, {
          value: "登录",
          label: "登录",
        }, {
          value: "进入系统",
          label: "进入系统",
        }, {
          value: "退出",
          label: "退出",
        }],
        isname: [{
                value: "ALL",
                label: "全选"
              }],
        ismodule: [{
                value: "ALL",
                label: "全选"
              }],
        logdata: [],
        businessdata: '',
        moduledata: '',
        userdata: '',
        currentPage: 1,
        tableOptions:[],
        pagenum: 10,
        totalpage: 0,
        inquiredata: [],
        dimensionQueryForm: {
          beginTime: '',
          endTime: '',
          beginDate: '',
          endDate: '',
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= Date.now()-8.46e6;
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            // return time.getTime() >= Date.now()-8.46e6;
            return time.getTime() <= new Date(this.dimensionQueryForm.beginDate).getTime() - 3600 * 1000 * 24;
          }
        },
      }
    },
    mounted() {
      this.getModuleData();
      this.getAllData()
    },
    methods: {
      inquiry(){
        this.currentPage=1
        this.pagenum=10
        this.getAllData()
      },
      getModuleData(){
        let flag="false"
        let data = {
          "appCode": "audit",
          "moduleCode": "audit_operate",
          "itemCode":'module_name',
          "paramCode": "business_name",
        }
        let isparams = JSON.stringify(data)
        postModuleData(isparams).then((resp) => {
          this.isname=[{value: "ALL",label: "全选"}]
          this.ismodule=[{value: "ALL",label: "全选"}]
          for(let i=0;i<resp.length;i++){
              for(let j=0;j<this.isname.length;j++){
                if(this.isname[j].label==resp[i].paramName){
                  flag="true"
                  break
                }else{
                  flag="false"
                }
              }
              if(flag==="false"){
                this.isname.push({value:resp[i].paramName,label:resp[i].paramName})
              }
            if(this.businessdata===resp[i].paramName){
              console.log(this.ismodule)
              this.ismodule.push({value:resp[i].paramValue,label:resp[i].paramValue})
            }
            if(this.businessdata==="ALL"||this.businessdata===""){
              for(let j=0;j<this.isname.length;j++){
                if(this.isname[j].label==resp[i].paramName){
                  flag="true"
                  break
                }else{
                  flag="false"
                }
              }
              if(flag==="false"){
                this.isname.push({value:resp[i].paramName,label:resp[i].paramName})
              }
              this.ismodule.push({value:resp[i].paramValue,label:resp[i].paramValue})
            }
          }
        });
      },
      exporttxt() {
        let operateTimeStart=this.dimensionQueryForm.beginDate+" "+this.dimensionQueryForm.beginTime.split("-").join(":")
        let operateTimeEnd=this.dimensionQueryForm.endDate+" "+this.dimensionQueryForm.endTime.split("-").join(":")
        let params = {
            "operateTimeStart": operateTimeStart,
            "operateTimeEnd": operateTimeEnd,
            "type": this.logdata.join(","),
            "business": this.moduledata,
            "module": this.businessdata,
            "userAccount": this.userdata
            // "pageIndex": String(this.currentPage),
            // "pageRows": String(this.pagenum)
          }
        this.tableOptions.push({label: "日志标示", field: "id", width: "120", align: "left",isShow:true},
                    {label: "访问时间", field: "operateTime", width: "120", align: "left",isShow:true},
                    {label: "服务器", field: "serverIp", width: "120", align: "left",isShow:true},
                    {label: "Ip地址", field: "clientIp", width: "120", align: "left",isShow:true},
                    {label: "日志类别", field: "type", width: "120", align: "left",isShow:true},
                    {label: "用户名称", field: "personAccount", width: "120", align: "left",isShow:true},
                    {label: "业务名称", field: "businessName", width: "120", align: "left",isShow:true},
                    {label: "模块名称", field: "moduleName", width: "120", align: "left",isShow:true},
                    {label: "小组名称", field: "groupName", width: "120", align: "left",isShow:true},
                    {label: "股票名称", field: "stockCode", width: "120", align: "left",isShow:true},
                    {label: "账户(组)名称", field: "accountId", width: "120", align: "left",isShow:true},
                    {label: "日志内容", field: "message", width: "120", align: "left",isShow:true}),
        params['tableColumns'] = this.tableOptions;
        // params['fileType'] = 'excel';
        this.gfnExportFileWithForm('/admin/queryalllog/export', params);
      },
      selectbusinessdataoption() {
        this.getModuleData()
      },
      selectlogoption() {
        for (let i = 0; i <= this.logdata.length; i++) {
          if (this.logdata[i] == "ALL") {
            this.logdata = [];
            this.logdata.push("ALL")
          }
        }
      },
      lessendtime(){
        let mytime = new Date()
        let mydate = new Date()
        let hour = ''
        let minute = ''
        let second=''
        if ((mytime.getHours()) < 10) {
          hour = "0" + (mydate.getHours())
        } else {
          hour = (mydate.getHours())
        }
        if ((mytime.getMinutes()) < 10) {
          minute = "0" + (mytime.getMinutes())
        } else {
          minute = (mytime.getMinutes())
        }
        if ((mytime.getSeconds()) < 10) {
          second = "0" + (mytime.getSeconds())
        } else {
          second = (mytime.getSeconds())
        }
        let time=hour+":"+minute+":"+second
        let month = ''
        let day = ''
        if ((mydate.getMonth() + 1) < 10) {
          month = "0" + (mydate.getMonth() + 1)
        } else {
          month = (mydate.getMonth() + 1)
        }
        if ((mydate.getDate()) < 10) {
          day = "0" + (mydate.getDate())
        } else {
          day = (mydate.getDate())
        }
        if(new Date(this.dimensionQueryForm.endDate).getTime() == new Date(mydate.getFullYear() + "-"+month + "-"+day).getTime()){
          let now=Number(hour*3600)+Number(minute*60)+Number(second)
          let picktime=Number(this.dimensionQueryForm.endTime.split("-")[0]*3600)+Number(this.dimensionQueryForm.endTime.split("-")[1]*60)+Number(this.dimensionQueryForm.endTime.split("-")[2])
          let bgtime=Number(this.dimensionQueryForm.beginTime.split("-")[0]*3600)+Number(this.dimensionQueryForm.beginTime.split("-")[1]*60)+Number(this.dimensionQueryForm.beginTime.split("-")[2])
          console.log(picktime)
          console.log(bgtime)
          if(picktime>bgtime){
            // this.dimensionQueryForm.endTime=this.dimensionQueryForm.beginTime
            // if(now<picktime){
            //   this.dimensionQueryForm.endTime=time
            // }
          }else{
            this.dimensionQueryForm.endTime=this.dimensionQueryForm.beginTime
            // if(now<picktime){
            //   this.dimensionQueryForm.endTime=time
            // }
          }
        }
      },
      lessstarttime(){
        let mytime = new Date()
        let mydate = new Date()
        let hour = ''
        let minute = ''
        let second=''
        if ((mytime.getHours()) < 10) {
          hour = "0" + (mydate.getHours())
        } else {
          hour = (mydate.getHours())
        }
        if ((mytime.getMinutes()) < 10) {
          minute = "0" + (mytime.getMinutes())
        } else {
          minute = (mytime.getMinutes())
        }
        if ((mytime.getSeconds()) < 10) {
          second = "0" + (mytime.getSeconds())
        } else {
          second = (mytime.getSeconds())
        }
        let time=hour+":"+minute+":"+second
        let month = ''
        let day = ''
        if ((mydate.getMonth() + 1) < 10) {
          month = "0" + (mydate.getMonth() + 1)
        } else {
          month = (mydate.getMonth() + 1)
        }
        if ((mydate.getDate()) < 10) {
          day = "0" + (mydate.getDate())
        } else {
          day = (mydate.getDate())
        }
        if(new Date(this.dimensionQueryForm.beginDate).getTime() == new Date(mydate.getFullYear() + "-"+month + "-"+day).getTime()){
          let now=Number(hour*3600)+Number(minute*60)+Number(second)
          let picktime=Number(this.dimensionQueryForm.beginTime.split("-")[0]*3600)+Number(this.dimensionQueryForm.beginTime.split("-")[1]*60)+Number(this.dimensionQueryForm.beginTime.split("-")[2])
          if(now<picktime){
            this.dimensionQueryForm.beginTime=time
          }
        }
      },
      endtimepickerOption() {
        if(new Date(this.dimensionQueryForm.endDate).getTime()>Date.now()-8.46e6){
          let mydate = new Date()
          let month = ''
          let day = ''
          if ((mydate.getMonth() + 1) < 10) {
            month = "0" + (mydate.getMonth() + 1)
          } else {
            month = (mydate.getMonth() + 1)
          }
          if ((mydate.getDate()) < 10) {
            day = "0" + (mydate.getDate())
          } else {
            day = (mydate.getDate())
          }
          this.dimensionQueryForm.endDate = mydate.getFullYear() + "-"+month + "-"+day

        }
      },
      currentpagination(val) {
        this.currentPage = val
        this.getAllData();
      },
      sizepagination(val) {
        this.pagenum = val
        this.getAllData();
      },
      getAllData() {
        let url = '';
        let startime = '';
        let endtime = '';
        let startdate = dateformat(this.dimensionQueryForm.beginDate);
        let enddate = dateformat(this.dimensionQueryForm.endDate);
        // 开始时间转换
        if ((this.dimensionQueryForm.beginTime == "") && (this.dimensionQueryForm.beginDate == "" || this.dimensionQueryForm.beginDate == null)) {
          startime = "";
        }
        if ((this.dimensionQueryForm.beginTime == '' || this.dimensionQueryForm.beginTime == null) && (this.dimensionQueryForm.beginDate != '' && this.dimensionQueryForm.beginDate != null)) {
          startime = dateformat(this.dimensionQueryForm.beginDate) + ' ' + "00:00:00";
        }
        if ((this.dimensionQueryForm.beginTime != '' && this.dimensionQueryForm.beginTime != null) && (this.dimensionQueryForm.beginDate != '')) {
          startime = dateformat(this.dimensionQueryForm.beginDate) + ' ' + timeformat(this.dimensionQueryForm.beginTime);
        }
        // 结束时间转换
        if (this.dimensionQueryForm.endTime == '' && (this.dimensionQueryForm.endDate == '' || this.dimensionQueryForm.endDate == null)) {
          endtime = "";
        }
        if ((this.dimensionQueryForm.endTime == '' || this.dimensionQueryForm.endTime == null) && (this.dimensionQueryForm.endDate != '' && this.dimensionQueryForm.endDate != null)) {
          endtime = dateformat(this.dimensionQueryForm.endDate) + ' ' + "23:59:59";
        }
        if ((this.dimensionQueryForm.endTime != '' && this.dimensionQueryForm.endTime != null) && this.dimensionQueryForm.endDate != '') {
          endtime = dateformat(this.dimensionQueryForm.endDate) + ' ' + timeformat(this.dimensionQueryForm.endTime);
        }
        url = "/admin/queryalllog?operateTimeStart=" + startime + "&operateTimeEnd=" + endtime + "&type=" + this.logdata + "&business=" + this.moduledata + "&module=" + this.businessdata + "&userAccount=" + this.userdata + "&pageIndex=" + this.currentPage + "&pageRows=" + this.pagenum;
        getLogData(url).then((resp) => {
          this.inquiredata = resp.result
          this.totalpage = resp.totalNum
          for (let time of this.inquiredata) {
            time.operateTime = tabletimeformat(time.operateTime)
          }
        });
      },
      clearAllData() {
        this.dimensionQueryForm.beginTime = '';
        this.dimensionQueryForm.endTime = '';
        this.dimensionQueryForm.beginDate = '';
        this.dimensionQueryForm.endDate = '';
        this.logdata = [];
        this.businessdata = '';
        this.moduledata = '';
        this.userdata = '';
        this.getModuleData()
        this.currentPage=1
        this.pagenum=10
      },
    },
  }
</script>
<style>

</style>
