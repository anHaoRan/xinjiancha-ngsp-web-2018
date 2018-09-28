<template>
  <div class='monitorWarnTable'>
    <el-card>
      <div slot='header' class='alarmLists'>
        <span>查询条件</span>
      </div>
      <el-row>
        <el-col :span='6'>
          <el-col :span='6' class='name'>证券代码：</el-col>
          <el-col :span='18' class='name'>
            <stock-code-query :commonData='submitData' @getStockCode='getStockCode'></stock-code-query>
          </el-col>
        </el-col>
        <el-col :span='6' :offset='2'>
          <el-col :span='6' class='name'>关键字：</el-col>
          <el-col :span='18' class='name'>
            <el-input size='small' placeholder='请输入关键字' v-model='submitData.keyWorld'></el-input>
          </el-col>
        </el-col>
        <el-col :span='6' :offset='2'>
          <el-col :span='6' class='name'>预警类型：</el-col>
          <el-col :span='18' class='name'>
            <el-select style='width: 100%;' placeholder='请选预警类型' size='small' v-model='submitData.alarmType'>
              <el-option
                v-for='item in alarmCategoryOptions'
                :key='item.value'
                :label='item.type'
                :value='item.value'
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='6'>
          <el-col :span='6' class='name'>处理人员：</el-col>
          <el-col :span='18' class='name'>
            <el-select style='width: 100%;' placeholder='请选择处理人员' size='small' v-model='submitData.operatorID'>
              <el-option
                v-for='item in dealerOptions'
                :key='item.value'
                :label='item.category'
                :value='item.value'
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span='6' :offset='2'>
          <el-col :span='6' class='name'>处理状态：</el-col>
          <el-col :span='18' class='name'>
            <el-select style='width: 100%;' placeholder='请选择处理状态' size='small' v-model='submitData.alarmStatus'>
              <el-option
                v-for='item in statusOptions'
                :key='item.value'
                :label='item.category'
                :value='item.value'
              ></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row style='margin-bottom: 10px'>
        <el-col :span='7'>
          <el-col :span='5' class='name'>预警时间：</el-col>
          <el-col :span='18'>
            <el-col :span='24'>
              <el-time-picker
                style='width:100%;'
                size='small'
                is-range
                :clearable='true'
                start-placeholder='开始时间'
                end-placeholder='结束时间'
                placeholder='请选择时间范围'
                @change='getAlarmTime'
                :editable='false'
                value-format='HH:mm:ss'
                v-model='value1'>
              </el-time-picker>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span='7' :offset='1'>
          <el-col :span='5' class='name'>处理时间：</el-col>
          <el-col :span='18'>
            <el-col :span='24'>
              <el-time-picker
                style='width:100%;'
                size='small'
                is-range
                :clearable='true'
                start-placeholder='开始时间'
                end-placeholder='结束时间'
                placeholder='请选择时间范围'
                value-format='HH:mm:ss'
                :editable='false'
                @change='getOperatorTime'
                v-model='value2'>
              </el-time-picker>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span='7' :offset='1'>
          <el-button
            @click='submit'
            type='primary'
            size='small'
          >查询
          </el-button>
          <el-button
            class='refreshShop'
            @click='clear'
            type='info'
            size='small'
          >清空
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        <span>查询结果</span>
        <el-button @click='Tdatestopreload' type='text' size='mini' class='refreshShop' style='float:right'>
          {{refreshText}}
        </el-button>
        <div class='reloadContainer' style='float:right;font-size: 14px;'>
          隔
          <el-input size='small' style='width:40%' v-model='refreshTime' @blur='changeRefreshTime'></el-input>
          秒刷新
        </div>
      </div>
      <el-row>
        <el-col style="padding: 0px 10px">
          <span>预警数/未处理数</span>
          <span>{{total}}/{{undetalTotal}}</span>;
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tableStyle'>
            <!--复选框-->
            <el-table
              :data='tdateData'
              border
              style='width: 100%; overflow:visible'
              @select='selectedRow'
              @select-all='selectedAllRow'>
              <el-table-column
                :check='check'
                header-align='center'
                align='center'
                type='selection'
                min-width='5%'>
              </el-table-column>
              <el-table-column
                v-for='item in ALARM_LIST_COLUMNS'
                :align='item.align'
                header-align='center'
                :key='item.field'
                :show-overflow-tooltip='true'
                :prop='item.field'
                :label='item.label'
                :min-width='item.width'
                :formatter='item.formatter'>
              </el-table-column>
              <el-table-column
                min-width='6%'
                align='center'
                label='操作'>
                <template slot-scope='scope'>
                  <el-button @click='checkDetails(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class='block' style='margin-top: 5px'>
        <el-pagination
          @size-change='pageSizeChange'
          @current-change='pageCurrentChange'
          :current-page='currentPage'
          :page-sizes='[10,20,50,100,200,400]'
          :page-size='10'
          layout='total,sizes,prev,pager,next,jumper'
          :total='pageTotal'
        >
        </el-pagination>
      </div>
      <el-row>
        <div style='text-align: center;padding-bottom: 10px'>
          <el-button type='primary' size='small' style='margin:0 10px;' @click='dealAlarmControl'>批处理
          </el-button>
          <el-button @click='exportTable' type='primary' size='small' style='margin:0 10px;'>导出预警</el-button>
        </div>
        <el-dialog title='预警批处理' :visible.sync='dialogFormVisble'>
          <div v-if='isShow'>
            处理方案：
            <el-radio-group v-model='radio' text-color='#5a5e66'>
              <el-radio :label='3'>继续观察</el-radio>
              <el-radio :label='6'>关闭预警</el-radio>
              <el-radio :label='9'>虚警</el-radio>
            </el-radio-group>
          </div>
          <div style='text-align: center;' slot='footer' class='dialog-footer' v-if='isShow'>
            <el-button style='width:100px' type='primary' size='small' @click='dealAlarm'>处理预警
            </el-button>
            <el-button style='width:100px; background-color:transparent;border:1px solid #1b5eed' size='small'
                       @click='close'>关闭
            </el-button>
          </div>
          <div style='text-align: center;' v-if='!isShow'>
            <i class='el-icon-success' style='font-size: 40px;color:#339933'></i>
            <p>
              成功批处理预警
              <span style='color: #fff'>{{detailParamsNum}}条</span>
              ！
            </p>
          </div>
        </el-dialog>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import StockCodeQuery from '../../common/StockCodeQuery';
  import {ALARM_LIST_COLUMNS} from './tableDefine';
  import moment from 'moment';

  import {
    getWarnType,
    postTableData,
    postDetail
  } from '../../../service/marketSupervise/operationMonitorWarn/index'

  export default {
    components: {
      StockCodeQuery
    },
    mounted() {
      this.refreshTable()
      this.getAlarmType();
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },

    data() {
      return {
        ALARM_LIST_COLUMNS: ALARM_LIST_COLUMNS,
        check: true,
        operatorTimeRange: {
          selectableRange: ''
        },
        value1: '',
        value2: '',
        // 查询提交参数
        submitData: {
          alarmStatus: '',
          stockCode: '',
          keyWorld: '',
          alarmType: '',
          operatorID: '',
          alarmStartTime: '',
          alarmEndTime: '',
          operatorStartTime: '',
          operatorEndTime: '',
          pageNumber: 1,
          pageSize: 10
        },
        tdateData: [],
        dealerOptions: [
          {category: '所有的', value: 0},
          {category: '本人的', value: 1},
          {category: '所有未处理的', value: 2},
          {category: '本人未处理的', value: 3}
        ],
        detailParams: [],
        detailParamsNum: '',
        statusOptions: [
          {category: '全部', value: 'ALL'},
          {category: '新预警', value: '1'},
          {category: '继续观察', value: '3'},
          {category: '关闭预警', value: '6'},
          {category: '虚警', value: '9'}
        ],
        currentPage: 1,
        pageTotal: 0,
        total: 0,
        undetalTotal: 0,
        isShow: true,
        dialogFormVisble: false,
        radio: 3,
        alarmCategoryOptions: [],
        refreshText: '停止刷新',
        refreshTime: 30,
        timer: null
      }
    },
    methods: {
      pageSizeChange(val) {
        this.submitData.pageSize = val
        this.refreshTable()
      },
      pageCurrentChange(val) {
        this.submitData.pageNumber = val
        this.refreshTable()
      },
      changeRefreshTime() {
        if (isNaN(this.refreshTime) || !this.refreshTime) {
          this.$message.warning('刷新时间为数字不可为空')
          this.refreshTime = 30
        } else if (this.refreshTime <= 0 || !(/^(0|([1-9]\d*))$/.test(this.refreshTime)) || this.refreshTime > 600) {
          this.$message.warning('刷新时间为大于0的整数,最大不能超过600')
          this.refreshTime = 30
        } else {
          if (this.refreshText == '恢复刷新') {
            this.$message({
              showClose: true,
              message: '请恢复刷新',
              type: 'warning'
            })
          } else {
            clearTimeout(this.timer);
            this.refreshTable()
          }
        }
      },
      // 清空条件
      clear() {
        for (let k in this.submitData) {
          if (k == 'pageNumber') {
            this.submitData[k] = 1
          } else if (k == 'pageSize') {
            this.submitData[k] = 10
          } else {
            this.submitData[k] = ''
          }
        }
        this.value1 = ''
        this.value2 = ''
      },
      //  获取预警开始时间
      getAlarmTime(val) {
        if (!val) {
          this.submitData.alarmStartTime = ''
          this.submitData.alarmEndTime = ''
        } else {
          this.submitData.alarmStartTime = moment(val[0], 'HH:mm:ss').format('HHmmss')
          this.submitData.alarmEndTime = moment(val[1], 'HH:mm:ss').format('HHmmss')
        }
      },
      //  获取处理结束时间
      getOperatorTime(val) {
        if (!val) {
          this.submitData.operatorStartTime = ''
          this.submitData.operatorEndTime = ''
        } else {
          this.submitData.operatorStartTime = moment(val[0], 'HH:mm:ss').format('HHmmss')
          this.submitData.operatorEndTime = moment(val[1], 'HH:mm:ss').format('HHmmss')
        }
      },
      // 查询
      submit() {
        clearTimeout(this.timer);
        this.refreshText = '恢复刷新';
        this.getRealTimeData();
      },
      getStockCode(stockCodeData) {
        this.submitData.stockCode = stockCodeData;
      },
      // 预警类型下拉框
      getAlarmType() {
        getWarnType()
          .then((res) => {
            let result = res
            var arr = [{type: '全部', value: 'ALL'}];
            result.forEach((v) => {
              arr.push({type: v, value: v});
            })
            this.alarmCategoryOptions = arr;
          })
      },
      // 表格内容更新
      Tdatestopreload() {
        if (this.refreshText == '停止刷新') {
          clearTimeout(this.timer)
          this.refreshText = '恢复刷新';
        } else if (this.refreshText == '恢复刷新') {
          this.refreshTable()
          this.refreshText = '停止刷新';
        }
      },
      // 表格定时刷新
      refreshTable() {
        postTableData(this.submitData)
          .then((res) => {
            let result = res
            this.total = result.count.total
            this.undetalTotal = result.count.undealTotal
            this.pageTotal = result.count.total
            result.alarmData.forEach((el) => {
              el.alarmStartTime = moment(el.alarmStartTime, 'HHmmss').format('HH:mm:ss')
            })
            this.tdateData = result.alarmData
          });
        let that = this
        this.timer = setTimeout(function () {
          that.refreshTable()
        }, that.refreshTime * 1000)
      },
      // 表格数据查询展示
      getRealTimeData() {
        this.submitData.pageNumber = 1
        postTableData(this.submitData)
          .then((res) => {
            let result = res
            this.total = result.count.total
            this.undetalTotal = result.count.undealTotal
            this.pageTotal = result.count.total
            result.alarmData.forEach((el) => {
              el.alarmStartTime = moment(el.alarmStartTime, 'HHmmss').format('HH:mm:ss')
            })
            this.tdateData = result.alarmData
          });
      },
      // 表格行全选
      selectedRow(row) {
        let arr = []
        row.forEach((el) => {
          arr.push({
            alarmID: el.alarmID,
            alarmStatus: el.alarmStatus
          })
        })
        this.detailParams = arr
      },
      // 表格行选中
      selectedAllRow(row) {
        let arr = []
        row.forEach((el) => {
          arr.push({
            alarmID: el.alarmID,
            alarmStatus: el.alarmStatus
          })
        })
        this.detailParams = arr
      },
      // 模态框关闭
      close() {
        this.$message.success('预警未做处理')
        this.dialogFormVisble = false;
      },
      // 批处理控制
      dealAlarmControl() {
        this.isShow = true
        if (!this.detailParams.length) {
          this.$message.warning('请选择预警信息')
          this.dialogFormVisble = false;
        } else {
          this.dialogFormVisble = true;
        }
      },
      // 处理预警
      dealAlarm() {
        let arr = this.detailParams;
        this.detailParamsNum = this.detailParams.length
        arr.forEach((v) => {
          v.alarmStatus = this.radio;
        });
        let params = JSON.stringify(arr);
        postDetail(params).then((res) => {
          if (res.success) {
            this.radio = 3
            this.isShow = false
            let that = this
            setTimeout(function () {
              that.dialogFormVisble = false
            }, 1000)
            this.detailParams = []
            this.getRealTimeData();
          } else {
            this.$message.warning('预警处理失败')
          }
        })
      },
      // 导出表格
      exportTable() {
        const tableColumns = [
          {field: 'alarmID', label: '序号', width: '3%', align: 'center'},
          {field: 'status', label: '状态', width: '3%', align: 'center'},
          {field: 'alarmStartTime', label: '预警时间', width: '6%', align: 'center'},
          {field: 'securitimesCode', label: '证券代码', width: '6%', align: 'center'},
          {field: 'securitimesName', label: '证券名称', width: '10%', align: 'center'},
          {field: 'alarmRuleName', label: '预警规则名称', width: '10%', align: 'center'},
          {field: 'operatorID', label: '操作者名称', width: '10%', align: 'center'},
          {field: 'alarmType', label: '预警类型', width: '10%', align: 'center'},
          {field: 'strikeOB', label: '监控对象', width: '10%', align: 'center'},
          {field: 'alarmLevel', label: '预警级别', width: '6%', align: 'center'},
          {field: 'alarmStatus', label: '预警状态', width: '6%', align: 'center'}
        ];
        let submitParams = {};
        for (let k in this.submitData) {
          if (k != 'pageNumber' && k != 'pageSize') {
            submitParams[k] = this.submitData[k]
          }
        }
        submitParams.tableColumns = tableColumns;
        this.gfnExportFile('/fluct/monitor-alarm/v1/export-alarm-result', JSON.stringify(submitParams));
      },
      // 查看详情
      checkDetails(row) {
        let params = {
          alarmID: row.alarmID,
          alarmType: row.alarmType,
          alarmRuleCode: row.alarmRuleCode,
          alarmRuleName: row.alarmRuleName,
          stockCode: row.securitimesCode,
          stockCodeName: row.securitimesName,
          alarmStartTime: moment(row.alarmStartTime, 'HHmmss').format('HH:mm'),
          alarmEndTime: moment(row.alarmEndTime, 'HHmmss').format('HH:mm')
        }
        this.$store.commit('saveAlarmWarningParams', params);
        window.open(`#/monitorWarnDetail?params=` + JSON.stringify(params))
      }
    }
  }
</script>

<style lang='less'>
  .monitorWarnTable {
    tr td:first-child > div {
      padding: 0px !important;
    }
    tr th:first-child > div {
      padding: 0px !important;
    }
  }
</style>
